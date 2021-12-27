import { useEffect, useState } from 'react'
import { Pair, Token, TokenAmount, JSBI } from 'taalswap-sdk'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { getBep20Contract, getCakeContract } from 'utils/contractHelpers'
import { BIG_ZERO } from 'utils/bigNumber'
import useWeb3 from './useWeb3'
import useRefresh from './useRefresh'
import useLastUpdated from './useLastUpdated'
import multicall from '../utils/multicall'
import erc20ABI from '../config/abi/erc20.json'
import lpTokenABI from '../config/abi/lpToken.json'
import getChainId from '../utils/getChainId'
import getKlaytnApiUrl from '../utils/getKlaytnApiUrl'
import multicallEth from '../utils/multicallEth'
import multicallKlaytn from '../utils/multicallKlaytn'

type UseTokenBalanceState = {
  balance: BigNumber
  fetchStatus: FetchStatus
}

export enum FetchStatus {
  NOT_FETCHED = 'not-fetched',
  SUCCESS = 'success',
  FAILED = 'failed',
}

const useTokenBalance = (tokenAddress: string) => {
  const { NOT_FETCHED, SUCCESS, FAILED } = FetchStatus
  const [balanceState, setBalanceState] = useState<UseTokenBalanceState>({
    balance: BIG_ZERO,
    fetchStatus: NOT_FETCHED,
  })
  const web3 = useWeb3()
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
      const contract = getBep20Contract(tokenAddress, web3)
      try {
        const res = await contract.methods.balanceOf(account).call()
        setBalanceState({ balance: new BigNumber(res), fetchStatus: SUCCESS })
      } catch (e) {
        console.error(e)
        setBalanceState((prev) => ({
          ...prev,
          fetchStatus: FAILED,
        }))
      }
    }

    if (account) {
      fetchBalance()
    }
  }, [account, tokenAddress, web3, fastRefresh, SUCCESS, FAILED])

  return balanceState
}

export const useTotalSupply = () => {
  const { slowRefresh } = useRefresh()
  const [totalSupply, setTotalSupply] = useState<BigNumber>()

  useEffect(() => {
    async function fetchTotalSupply() {
      const cakeContract = getCakeContract()
      const supply = await cakeContract.methods.totalSupply().call()
      setTotalSupply(new BigNumber(supply))
    }

    fetchTotalSupply()
  }, [slowRefresh])

  return totalSupply
}

export const useTotalAssets = () => {
  const { account } = useWeb3React()
  const [totalAssets, setTotalAssets] = useState<number>()
  const chainId = getChainId()

  useEffect(() => {
    async function fetchPairs() {
      const data = []
      await fetch('https://taalswap-info-api-black.vercel.app/api/pairs', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((response) => {
          Object.keys(response.data).forEach((key) => {
            data.push(response.data[key])
          })
        })
      return data
    }

    async function fetchKlayPairs() {
      const data = []
      await fetch(`${getKlaytnApiUrl()}/pairs`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((response) => {
          Object.keys(response.data).forEach((key) => {
            data.push(response.data[key])
          })
        })
      return data
    }

    async function fetchEthTotalAssets() {
      try {
        const pairs = await fetchPairs()
        const calls = await pairs.map((vt) => {
          const lpContractAddress = vt.pair_address
          return { address: lpContractAddress, name: 'balanceOf', params: [account] }
        })
        const rawLpBalances = await multicallEth(lpTokenABI, calls)
        rawLpBalances.map((tokenBalance, idx) => {
          pairs[idx].balance = new BigNumber(tokenBalance).toJSON()
          return new BigNumber(tokenBalance).toJSON()
        })
        const filterdPairs = pairs.filter((pair) => pair.balance > 0)
        const calls2 = filterdPairs.map((vt) => {
          const lpContractAddress = vt.pair_address
          return { address: lpContractAddress, name: 'totalSupply' }
        })
        const rawLpSupply = await multicallEth(erc20ABI, calls2)
        rawLpSupply.map((supply, idx) => {
          filterdPairs[idx].total_supply = new BigNumber(supply).toJSON()
          return new BigNumber(supply).toJSON()
        })
        const calls3 = filterdPairs.map((vt) => {
          const lpContractAddress = vt.pair_address
          return { address: lpContractAddress, name: 'getReserves' }
        })
        const rawLpReserves = await multicallEth(lpTokenABI, calls3)
        rawLpReserves.map((reserves, idx) => {
          filterdPairs[idx].reserve0 = reserves._reserve0
          filterdPairs[idx].reserve1 = reserves._reserve1
          return reserves
        })
        let assets = 0
        await filterdPairs.forEach((pair, idx) => {
          const token0 = new Token(parseInt(process.env.REACT_APP_CHAIN_ID, 10), pair.base_address, pair.base_decimals)
          const token1 = new Token(parseInt(process.env.REACT_APP_CHAIN_ID, 10), pair.quote_address, pair.quote_decimals)
          const lpPair: Pair = new Pair(
            new TokenAmount(token0, pair.reserve0.toString()),
            new TokenAmount(token1, pair.reserve1.toString()),
          )

          const lpToken = new Token(parseInt(process.env.REACT_APP_CHAIN_ID, 10), pair.pair_address, 18)
          const totalSupply = new TokenAmount(lpToken, JSBI.BigInt(pair.total_supply))

          const liquidity = new TokenAmount(lpToken, JSBI.BigInt(pair.balance))

          const token0value = lpPair.getLiquidityValue(token0, totalSupply, liquidity, false)
          const token1value = lpPair.getLiquidityValue(token1, totalSupply, liquidity, false)

          const value =
            parseFloat(token0value.toSignificant(6)) * pair.base_price +
            parseFloat(token1value.toSignificant(6)) * pair.quote_price
          assets += value
        })
        return assets
      } catch (e) {
        console.log(e)
      }
      return 0
    }

    async function fetchKlaytnTotalAssets() {
      try {
        const pairs = await fetchKlayPairs()
        const calls = await pairs.map((vt) => {
          const lpContractAddress = vt.pair_address
          return { address: lpContractAddress, name: 'balanceOf', params: [account] }
        })
        const rawLpBalances = await multicallKlaytn(lpTokenABI, calls)
        rawLpBalances.map((tokenBalance, idx) => {
          pairs[idx].balance = new BigNumber(tokenBalance).toJSON()
          return new BigNumber(tokenBalance).toJSON()
        })
        const filterdPairs = pairs.filter((pair) => pair.balance > 0)
        const calls2 = filterdPairs.map((vt) => {
          const lpContractAddress = vt.pair_address
          return { address: lpContractAddress, name: 'totalSupply' }
        })
        const rawLpSupply = await multicallKlaytn(erc20ABI, calls2)
        rawLpSupply.map((supply, idx) => {
          filterdPairs[idx].total_supply = new BigNumber(supply).toJSON()
          return new BigNumber(supply).toJSON()
        })
        const calls3 = filterdPairs.map((vt) => {
          const lpContractAddress = vt.pair_address
          return { address: lpContractAddress, name: 'getReserves' }
        })
        const rawLpReserves = await multicallKlaytn(lpTokenABI, calls3)
        rawLpReserves.map((reserves, idx) => {
          filterdPairs[idx].reserve0 = reserves._reserve0
          filterdPairs[idx].reserve1 = reserves._reserve1
          return reserves
        })
        let assets = 0
        await filterdPairs.forEach((pair, idx) => {
          const token0 = new Token(parseInt(process.env.REACT_APP_KLAYTN_ID, 10), pair.base_address, pair.base_decimals)
          const token1 = new Token(parseInt(process.env.REACT_APP_KLAYTN_ID, 10), pair.quote_address, pair.quote_decimals)
          const lpPair: Pair = new Pair(
            new TokenAmount(token0, pair.reserve0.toString()),
            new TokenAmount(token1, pair.reserve1.toString()),
          )

          const lpToken = new Token(parseInt(process.env.REACT_APP_KLAYTN_ID, 10), pair.pair_address, 18)
          const totalSupply = new TokenAmount(lpToken, JSBI.BigInt(pair.total_supply))
          const liquidity = new TokenAmount(lpToken, JSBI.BigInt(pair.balance))

          const token0value = lpPair.getLiquidityValue(token0, totalSupply, liquidity, false)
          const token1value = lpPair.getLiquidityValue(token1, totalSupply, liquidity, false)

          const value =
            parseFloat(token0value.toSignificant(6)) * pair.base_price +
            parseFloat(token1value.toSignificant(6)) * pair.quote_price
          assets += value
        })
        return assets
      } catch (e) {
        console.log(e)
      }
      return 0
    }

    async function fetchTotalAssets() {
      const ethAssets = await fetchEthTotalAssets()
      const klaytnAssets = await fetchKlaytnTotalAssets()
      setTotalAssets(Number(ethAssets + klaytnAssets))
    }

    if (account !== undefined) fetchTotalAssets()
  }, [account, chainId])

  return totalAssets
}

export const useBurnedBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(BIG_ZERO)
  const { slowRefresh } = useRefresh()
  const web3 = useWeb3()

  useEffect(() => {
    const fetchBalance = async () => {
      const contract = getBep20Contract(tokenAddress, web3)
      const res = await contract.methods.balanceOf('0x000000000000000000000000000000000000dEaD').call()
      setBalance(new BigNumber(res))
    }

    fetchBalance()
  }, [web3, tokenAddress, slowRefresh])

  return balance
}

export const useDeployerBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(BIG_ZERO)
  const { slowRefresh } = useRefresh()
  const web3 = useWeb3()

  useEffect(() => {
    const fetchBalance = async () => {
      const contract = getBep20Contract(tokenAddress, web3)
      const res = await contract.methods.balanceOf('0x1539e0A3Bb88cE47914C06c739862D7dAE6BB164').call()   // Tezor 01
      setBalance(new BigNumber(res))
    }

    fetchBalance()
  }, [web3, tokenAddress, slowRefresh])

  return balance
}

export const useGetBnbBalance = () => {
  const [balance, setBalance] = useState(BIG_ZERO)
  const { account } = useWeb3React()
  const { lastUpdated, setLastUpdated } = useLastUpdated()
  const web3 = useWeb3()

  useEffect(() => {
    const fetchBalance = async () => {
      const walletBalance = await web3.eth.getBalance(account)
      setBalance(new BigNumber(walletBalance))
    }

    if (account) {
      fetchBalance()
    }
  }, [account, web3, lastUpdated, setBalance])

  return { balance, refresh: setLastUpdated }
}

export default useTokenBalance

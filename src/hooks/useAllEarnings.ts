import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import multicall from 'utils/multicall'
import { getMasterChefAddress } from 'utils/addressHelpers'
import masterChefABI from 'config/abi/masterchef.json'
import { farmsConfig, farmsConfigKlaytn } from 'config/constants'
import useRefresh from './useRefresh'

const useAllEarnings = () => {
  const [balances, setBalance] = useState([])
  const { account, chainId } = useWeb3React()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    let calls
    const fetchAllBalances = async () => {
      if (chainId > 1000) {
        calls = farmsConfigKlaytn.map((farm) => ({
          address: getMasterChefAddress(),
          name: 'pendingTaal',
          params: [farm.pid, account],
        }))
      } else {
        calls = farmsConfig.map((farm) => ({
          address: getMasterChefAddress(),
          name: 'pendingTaal',
          params: [farm.pid, account],
        }))
      }

      const res = await multicall(masterChefABI, calls)

      setBalance(res)
    }

    if (account) {
      fetchAllBalances()
    }
  }, [account, fastRefresh, chainId])

  return balances
}

export default useAllEarnings

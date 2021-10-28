import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
// import { ChainId } from 'taalswap-sdk';
import { ethers } from 'ethers';
import { useActiveWeb3React } from '../../hooks';
import useDebounce from '../../hooks/useDebounce';
import useIsWindowVisible from '../../hooks/useIsWindowVisible';
import { updateBlockNumber } from './actions';

export default function Updater(): null {
  const { library, chainId } = useActiveWeb3React()
  // const crossChain = parseInt(window.localStorage.getItem('crossChain') ?? '', 10) as ChainId
  const ethChainId = process.env.REACT_APP_CHAIN_ID ?? '1';
  const klayChainId = process.env.REACT_APP_KLAYTN_ID ?? '8217';
  const xSwapCurrency = window.localStorage.getItem('xSwapCurrency')
  const dispatch = useDispatch()

  const windowVisible = useIsWindowVisible()

  const [state, setState] = useState<{ chainId: number | undefined; blockNumber: number | null }>({
    chainId,
    blockNumber: null,
  })

  const blockNumberCallback = useCallback(
    (blockNumber: number) => {
      setState((s) => {
        if (chainId === s.chainId) {
          if (typeof s.blockNumber !== 'number') return { chainId, blockNumber }
          return { chainId, blockNumber: Math.max(blockNumber, s.blockNumber) }
        }
        return s
      })
    },
    [chainId, setState]
  )

  const blockNumberCallbackOther = useCallback(
    (blockNumber: number) => {
      // let xChainId = ChainId.BAOBAB
      let xChainId = parseInt(klayChainId);
      // if (chainId === ChainId.BAOBAB) {
      if (chainId !== undefined && chainId.toString() === klayChainId) {
        xChainId = parseInt(ethChainId);
      }
      dispatch(updateBlockNumber({ chainId: xChainId, blockNumber }))
    },
    [dispatch, chainId, ethChainId, klayChainId]
  )

  // attach/detach listeners
  useEffect(() => {
    if (!library || !chainId || !windowVisible) return undefined

    setState({ chainId, blockNumber: null })

    library
      .getBlockNumber()
      .then(blockNumberCallback)
      .catch((error) => console.error(`Failed to get block number for chainId: ${chainId}`, error))

    if (chainId > 1000) {
      let crossChainProvider
      if (ethChainId === '1') {
        crossChainProvider = new ethers.providers.InfuraProvider('mainnet', 'adb9c847d7114ee7bf83995e8f22e098')
      }
      if (ethChainId === '3') {
        crossChainProvider = new ethers.providers.InfuraProvider('ropsten', 'adb9c847d7114ee7bf83995e8f22e098')
      }
      crossChainProvider.getBlockNumber()
        .then(blockNumberCallbackOther)
        .catch((error) => console.error(`Failed to get block number for chainId: ${ethChainId}`, error))
    } else {
      let crossChainProvider
      if (klayChainId === '8217') {
        crossChainProvider = new ethers.providers.JsonRpcProvider('https://klaytn.taalswap.info:8651');
      }
      if (klayChainId === '1001') {
        crossChainProvider = new ethers.providers.JsonRpcProvider('https://api.baobab.klaytn.net:8651');
      }
      crossChainProvider.getBlockNumber()
        .then(blockNumberCallbackOther)
        .catch((error) => console.error(`Failed to get block number for chainId: ${klayChainId}`, error))
    }

    library.on('block', blockNumberCallback)
    return () => {
      library.removeListener('block', blockNumberCallback)
    }
  }, [dispatch, chainId, library, blockNumberCallback, blockNumberCallbackOther, windowVisible, ethChainId, klayChainId, xSwapCurrency])

  const debouncedState = useDebounce(state, 100)

  useEffect(() => {
    if (!debouncedState.chainId || !debouncedState.blockNumber || !windowVisible) return
    dispatch(updateBlockNumber({ chainId: debouncedState.chainId, blockNumber: debouncedState.blockNumber }))
  }, [windowVisible, dispatch, debouncedState.blockNumber, debouncedState.chainId])

  return null
}

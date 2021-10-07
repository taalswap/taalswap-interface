import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ChainId } from 'taalswap-sdk';
import { ethers } from 'ethers';
import { useActiveWeb3React } from '../../hooks';
import useDebounce from '../../hooks/useDebounce';
import useIsWindowVisible from '../../hooks/useIsWindowVisible';
import { updateBlockNumber } from './actions';

export default function Updater(): null {
  const { library, chainId } = useActiveWeb3React()
  const crossChain = parseInt(window.localStorage.getItem('crossChain') ?? '', 10) as ChainId
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
      let xChainId = ChainId.BAOBAB
      if (chainId === ChainId.BAOBAB) {
        xChainId = ChainId.ROPSTEN
      }
      dispatch(updateBlockNumber({ chainId: xChainId, blockNumber }))
    },
    [dispatch, chainId]
  )

  // attach/detach listeners
  useEffect(() => {
    if (!library || !chainId || !windowVisible) return undefined

    setState({ chainId, blockNumber: null })

    library
      .getBlockNumber()
      .then(blockNumberCallback)
      .catch((error) => console.error(`Failed to get block number for chainId: ${chainId}`, error))

    if (chainId === ChainId.BAOBAB) {
      const crossChainProvider = new ethers.providers.InfuraProvider('ropsten', 'adb9c847d7114ee7bf83995e8f22e098')
      crossChainProvider.getBlockNumber()
        .then(blockNumberCallbackOther)
        .catch((error) => console.error(`Failed to get block number for chainId: ${chainId}`, error))
    } else {
      const crossChainProvider = new ethers.providers.JsonRpcProvider('https://api.baobab.klaytn.net:8651');
      crossChainProvider.getBlockNumber()
        .then(blockNumberCallbackOther)
        .catch((error) => console.error(`Failed to get block number for chainId: ${chainId}`, error))
    }

    library.on('block', blockNumberCallback)
    return () => {
      library.removeListener('block', blockNumberCallback)
    }
  }, [dispatch, chainId, library, blockNumberCallback, blockNumberCallbackOther, windowVisible, crossChain, xSwapCurrency])

  const debouncedState = useDebounce(state, 100)

  useEffect(() => {
    if (!debouncedState.chainId || !debouncedState.blockNumber || !windowVisible) return
    dispatch(updateBlockNumber({ chainId: debouncedState.chainId, blockNumber: debouncedState.blockNumber }))
  }, [windowVisible, dispatch, debouncedState.blockNumber, debouncedState.chainId])

  return null
}

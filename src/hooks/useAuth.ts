import { useCallback } from 'react'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { NoBscProviderError } from '@binance-chain/bsc-connector'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from '@web3-react/injected-connector'
import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
  WalletConnectConnector
} from '@web3-react/walletconnect-connector'
import { connectorLocalStorageKey, ConnectorNames } from 'taalswap-uikit'
import useToast from 'hooks/useToast'
import { connectorsByName } from 'connectors'
import { setupNetwork } from 'utils/wallet'
import getChainId from '../utils/getChainId'

const getNewURL = () => {
  const url = new URL(window.location.href)
  let newUrl
  console.log(url.port)
  if (window.location.href.includes('/add/')) {             // http://localhost:3000/#/1001/add/KLAY/0x6C27d9F6C4067212797794CD931596C2917F7Bf7
    newUrl = `http://${url.hostname}:${url.port}${url.pathname}#/liquidity`
  } else if (window.location.href.includes('/swap/')) {     // http://localhost:3000/#/3/swap/0xdAC17F958D2ee523a2206206994597C13D831ec7/ETH
    newUrl = `http://${url.hostname}:${url.port}${url.pathname}#/swap`
  } else {
    newUrl = window.location.href
  }
  console.log(newUrl)
  return newUrl
}

const useAuth = () => {
  const { activate, deactivate } = useWeb3React()
  const { toastError } = useToast()

  const login = useCallback(async (connectorID: ConnectorNames) => {
    const chainId = getChainId()
    const refresh = window.localStorage.getItem("refresh")
    const connector = connectorsByName[connectorID]

    if (connector) {
      if (refresh === 'true') {
        await setupNetwork(chainId)
        // await changePage()
      }
      await activate(connector, async (error: Error) => {
        window.localStorage.removeItem(connectorLocalStorageKey)
        if (error instanceof UnsupportedChainIdError) {
          toastError('Unsupported Chain Id', 'Unsupported Chain Id Error. Check your chain Id.')
        } else if (error instanceof NoEthereumProviderError || error instanceof NoBscProviderError) {
          toastError('Provider Error', 'No provider was found')
        } else if (
          error instanceof UserRejectedRequestErrorInjected ||
          error instanceof UserRejectedRequestErrorWalletConnect
        ) {
          if (connector instanceof WalletConnectConnector) {
            const walletConnector = connector as WalletConnectConnector
            walletConnector.walletConnectProvider = null
          }
          toastError('Authorization Error', 'Please authorize to access your account')
        } else {
          toastError(error.name, error.message)
        }
      })

      if (refresh === 'true') {
        window.location.href = getNewURL()
        window.localStorage.setItem("refresh", 'false')
      }
    } else {
      toastError('Can\'t find connector', 'The connector config is wrong')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { login, logout: deactivate }
}

export default useAuth

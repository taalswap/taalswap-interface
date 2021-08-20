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

const useAuth = () => {
  const { activate, deactivate } = useWeb3React()
  const { toastError } = useToast()

  const login = useCallback(async (connectorID: ConnectorNames) => {
    console.log(window.localStorage.getItem("chainId"))
    const chainId = getChainId()
    const refresh = window.localStorage.getItem("refresh")
    const connector = connectorsByName[connectorID]

    if (connector) {
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!', chainId, refresh)
      if (refresh === 'true') await setupNetwork(chainId)
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
        window.location.reload()
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

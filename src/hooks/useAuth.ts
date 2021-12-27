import { useCallback } from 'react';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { NoBscProviderError } from '@binance-chain/bsc-connector';
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector';
import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
  WalletConnectConnector,
} from '@web3-react/walletconnect-connector';
import { connectorLocalStorageKey, ConnectorNames } from 'taalswap-uikit';
import useToast from 'hooks/useToast';
import { connectorsByName } from 'connectors';
import { setupNetwork } from 'utils/wallet';
import { profileClear } from 'state/profile';
import { useAppDispatch } from 'state';
import { useTranslation } from 'contexts/Localization';
import recoverChainId from '../utils/recoverChainId';
import getChainId from '../utils/getChainId';

const getNewURL = () => {
  const url = new URL(window.location.href);
  let newUrl;
  if (window.location.href.includes('/add/')) {
    // http://localhost:3000/#/1001/add/KLAY/0x6C27d9F6C4067212797794CD931596C2917F7Bf7
    newUrl = `http://${url.hostname}:${url.port}${url.pathname}#/liquidity`;
  } else if (window.location.href.includes('/swap/')) {
    // http://localhost:3000/#/3/swap/0xdAC17F958D2ee523a2206206994597C13D831ec7/ETH
    newUrl = `http://${url.hostname}:${url.port}${url.pathname}#/swap`;
  } else {
    newUrl = window.location.href;
  }
  return newUrl;
};

const useAuth = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { activate, deactivate } = useWeb3React();
  const { toastError } = useToast();

  const login = useCallback(async (connectorID: ConnectorNames) => {
    const chainId = getChainId();
    const refresh = window.localStorage.getItem('refresh');
    const connector = connectorsByName[connectorID];
    let changeNet;

    if (connector) {
      if (refresh === 'true') {
        changeNet = await setupNetwork(chainId);
      }
      await activate(connector, async (error: Error) => {
        if (error instanceof UnsupportedChainIdError) {
          changeNet = await setupNetwork(chainId);
          if (changeNet) {
            activate(connector);
          }
        } else {
          window.localStorage.removeItem(connectorLocalStorageKey);
          if (
            error instanceof NoEthereumProviderError ||
            error instanceof NoBscProviderError
          ) {
            toastError(t('Provider Error'), t('No provider was found'));
          } else if (
            error instanceof UserRejectedRequestErrorInjected ||
            error instanceof UserRejectedRequestErrorWalletConnect
          ) {
            if (connector instanceof WalletConnectConnector) {
              const walletConnector = connector as WalletConnectConnector;
              walletConnector.walletConnectProvider = null;
            }
            toastError(
              t('Authorization Error'),
              t('Please authorize to access your account')
            );
          } else {
            toastError(error.name, error.message);
          }
        }
      });

      if (refresh === 'true' && changeNet) {
        window.location.reload();
        window.localStorage.setItem('refresh', 'false');
      }
    } else {
      toastError(
        t('Unable to find connector'),
        t('The connector config is wrong')
      );
    }
    // interface code
    // if (connector) {
    //   if (refresh === 'true') {
    //     changeNet = await setupNetwork(chainId);
    //   }
    //   await activate(connector, async (error: Error) => {
    //     // window.localStorage.removeItem(connectorLocalStorageKey)
    //     if (error instanceof UnsupportedChainIdError) {
    //       // toastError('Unsupported Chain Id', 'Unsupported Chain Id Error. Check your chain Id.')
    //       changeNet = await setupNetwork(chainId);
    //       if (changeNet) {
    //         activate(connector);
    //       }
    //     } else {
    //       window.localStorage.removeItem(connectorLocalStorageKey);
    //       if (
    //         error instanceof NoEthereumProviderError ||
    //         error instanceof NoBscProviderError
    //       ) {
    //         toastError('Provider Error', 'No provider was found');
    //       } else if (
    //         error instanceof UserRejectedRequestErrorInjected ||
    //         error instanceof UserRejectedRequestErrorWalletConnect
    //       ) {
    //         if (connector instanceof WalletConnectConnector) {
    //           const walletConnector = connector as WalletConnectConnector;
    //           walletConnector.walletConnectProvider = null;
    //         }
    //         toastError(
    //           'Authorization Error',
    //           'Please authorize to access your account'
    //         );
    //       } else {
    //         toastError(error.name, error.message);
    //       }
    //     }
    //   });

    //   if (refresh === 'true' && changeNet) {
    //     window.location.href = getNewURL();
    //     // window.location.reload()
    //     window.localStorage.setItem('refresh', 'false');
    //   }
    // } else {
    //   toastError("Can't find connector", 'The connector config is wrong');
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = useCallback(() => {
    dispatch(profileClear());
    deactivate();
    window.localStorage.removeItem('chainId');
    window.localStorage.removeItem('prevChainId');
  }, [deactivate, dispatch]);

  return { login, logout };
};

export default useAuth;

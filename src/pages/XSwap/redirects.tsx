import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import XSwap from './index';
import getChainId from '../../utils/getChainId';
import { setupNetwork } from '../../utils/wallet';
// Redirects to swap but only replace the pathname
export function RedirectPathToSwapOnly({ location }: RouteComponentProps) {
  return <Redirect to={{ ...location, pathname: '/xswap' }} />;
}

export function RedirectSwapTokenIds(
  props: RouteComponentProps<{
    chainId: string;
    currencyIdA: string;
    currencyIdB: string;
  }>
) {
  const {
    match: {
      params: { chainId, currencyIdA, currencyIdB },
    },
  } = props;
  const curChainId = getChainId();
  if (curChainId !== parseInt(chainId)) {
    const hasSetup = setupNetwork(parseInt(chainId));
    if (hasSetup) {
      window.localStorage.setItem('chainId', chainId);
    }
  }
  if (currencyIdA.toLowerCase() === currencyIdB.toLowerCase()) {
    return <Redirect to={`/xswap/${currencyIdA}`} />;
  }
  return <XSwap {...props} />;
}

export default RedirectPathToSwapOnly;

import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import Swap from './index';
// Redirects to swap but only replace the pathname
export function RedirectPathToSwapOnly({ location }: RouteComponentProps) {
  return <Redirect to={{ ...location, pathname: '/swap' }} />;
}

export function RedirectSwapTokenIds(
  props: RouteComponentProps<{ currencyIdA: string; currencyIdB: string }>
) {
  const {
    match: {
      params: { currencyIdA, currencyIdB },
    },
  } = props;
  if (currencyIdA.toLowerCase() === currencyIdB.toLowerCase()) {
    return <Redirect to={`/swap/${currencyIdA}`} />;
  }
  return <Swap {...props} />;
}

export default RedirectPathToSwapOnly;

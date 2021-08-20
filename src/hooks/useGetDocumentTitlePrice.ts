import { useEffect, useRef, useState } from 'react';
import useGetCakeBusdLpPrice from 'utils/useGetCakeBusdLpPrice';
import { useActiveWeb3React } from 'hooks'
import { ChainId } from 'taalswap-sdk';
import useGetPriceData from './useGetPriceData';
import { TAL } from '../constants';
import { NETWORK_CHAIN_ID } from '../connectors';

const useGetDocumentTitlePrice = () => {
  // const cakePriceBusd = useGetCakeBusdLpPrice();
  let cakePriceBusd = parseFloat('0.0');
  const priceData = useGetPriceData();
  let taalAddress
  switch(NETWORK_CHAIN_ID) {
    case ChainId.MAINNET:
      taalAddress = TAL[ChainId.MAINNET];
      break;
    case ChainId.ROPSTEN:
      taalAddress = TAL[ChainId.ROPSTEN];
      break;
    case ChainId.RINKEBY:
      taalAddress = TAL[ChainId.RINKEBY];
      break;
    case ChainId.KLAYTN:
      taalAddress = TAL[ChainId.KLAYTN];
      break;
    case ChainId.BAOBAB:
      taalAddress = TAL[ChainId.BAOBAB];
      break;
    default:
      taalAddress = TAL[ChainId.MAINNET];
      break;
  }

  if (priceData) {
    // eslint-disable-next-line array-callback-return
    Object.entries(priceData.data).find(([token, item]) => {
      switch (token.toLowerCase()) {
        case taalAddress:
          cakePriceBusd = parseFloat(item.price);
          break;
      }
    });
  }

  const cakePriceBusdString =
    Number.isNaN(cakePriceBusd) || cakePriceBusd === 0 || !cakePriceBusd
      ? ''
      : ` - $${cakePriceBusd.toLocaleString(undefined, {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        })}`;

  useEffect(() => {
    document.title = `TaalSwap${cakePriceBusdString}`;
  }, [cakePriceBusdString]);
};
export default useGetDocumentTitlePrice;

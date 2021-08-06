import { useEffect, useRef, useState } from 'react';
import useGetCakeBusdLpPrice from 'utils/useGetCakeBusdLpPrice';
import { useActiveWeb3React } from 'hooks'
import { ChainId } from 'taalswap-sdk';
import useGetPriceData from './useGetPriceData';
import { TAL } from '../constants';

const useGetDocumentTitlePrice = () => {
  const { chainId } = useActiveWeb3React();
  // const cakePriceBusd = useGetCakeBusdLpPrice();
  let cakePriceBusd = parseFloat('0.0');
  const priceData = useGetPriceData();
  let taalAddress
  switch(chainId) {
    case 1:
      taalAddress = TAL[ChainId.MAINNET];
      break;
    case 3:
      taalAddress = TAL[ChainId.ROPSTEN];
      break;
    case 4:
      taalAddress = TAL[ChainId.RINKEBY];
      break;
    case 8217:
      taalAddress = TAL[ChainId.KLAYTN];
      break;
    case 1001:
      taalAddress = TAL[ChainId.BAOBAB];
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

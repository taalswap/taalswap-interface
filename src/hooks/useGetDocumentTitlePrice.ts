import { useEffect, useRef, useState } from 'react';
import useGetCakeBusdLpPrice from 'utils/useGetCakeBusdLpPrice';
import useGetPriceData from './useGetPriceData';

const useGetDocumentTitlePrice = () => {
  // const cakePriceBusd = useGetCakeBusdLpPrice();
  let cakePriceBusd = parseFloat('0.0');
  const priceData = useGetPriceData();

  if (priceData) {
    // eslint-disable-next-line array-callback-return
    Object.entries(priceData.data).find(([token, item]) => {
      switch (token.toLowerCase()) {
        case '0x2ccdf53b17cce1c1c37bdd0ff0f8320e8cea34ed':
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

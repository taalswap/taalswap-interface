import { useEffect } from 'react';
import useGetPriceData from './useGetPriceData';
import { TAL } from '../constants';

const useGetDocumentTitlePrice = () => {
  const priceData = useGetPriceData();

  let cakePriceUsd = 0;
  if (priceData !== null && priceData.data[TAL.address] !== undefined) {
    cakePriceUsd = parseFloat(priceData.data[TAL.address].price);
  }

  const cakePriceUsdString =
    Number.isNaN(cakePriceUsd) || cakePriceUsd === 0
      ? ''
      : ` - $${cakePriceUsd.toLocaleString(undefined, {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3
      })}`;

  useEffect(() => {
    document.title = `TaalSwap${cakePriceUsdString}`;
  }, [cakePriceUsdString]);
};
export default useGetDocumentTitlePrice;

import React from 'react';
import { Currency, Percent, Price } from 'taalswap-sdk';
import { Text } from 'taalswap-uikit';
import { useTranslation } from 'contexts/Localization';
import styled from 'styled-components'
import { AutoColumn } from '../../components/Column';
import { AutoRow } from '../../components/Row';
import { ONE_BIPS } from '../../constants';
import { Field } from '../../state/mint/actions';



const AutoTextColumn = styled(AutoColumn)`

  @media screen and (max-width:720px){
    width: 100%;
  }
`;

export function PoolPriceBar({
  currencies,
  noLiquidity,
  poolTokenPercentage,
  price,
}: {
  currencies: { [field in Field]?: Currency };
  noLiquidity?: boolean;
  poolTokenPercentage?: Percent;
  price?: Price;
}) {
  const { t } = useTranslation();
  const chainId = parseInt(window.localStorage.getItem('chainId') ?? '1');
  const getSymbol = (str: string | undefined) => {
    let symbol = '';
    if (str !== undefined) {
      if (str === 'ETH' && chainId > 1000) {
        symbol = 'KALY';
      } else if (str === 'ETH' && chainId === 3) {
        symbol = 'ETH';
      } else symbol = str;
    }
    return symbol;
  };

  return (
    <AutoColumn gap="md" style={{ paddingTop: '15px', paddingBottom: '15px' }}>
      <AutoRow justify="center" gap="4px">
        <AutoTextColumn justify="center" style={{ minWidth: '150px' }}>
          <Text fontSize="18px" fontWeight="700">
            {price?.toSignificant(6) ?? '-'}
          </Text>
          <Text fontSize="14px" color="textSubtle" pt={1}>
            {/* {currencies[Field.CURRENCY_B]?.symbol === 'ETH'
              ? chainId > 1000
                ? 'KLAY'
                : currencies[Field.CURRENCY_B]?.symbol
              : currencies[Field.CURRENCY_B]?.symbol}{' '}
            per{' '}
            {currencies[Field.CURRENCY_A]?.symbol === 'ETH'
              ? chainId > 1000
                ? 'KLAY'
                : currencies[Field.CURRENCY_A]?.symbol
              : currencies[Field.CURRENCY_A]?.symbol}
            <br /> */}
            {t('%symbol1% per %symbol2%', {
              symbol1: getSymbol(currencies[Field.CURRENCY_B]?.symbol),
              symbol2: getSymbol(currencies[Field.CURRENCY_A]?.symbol),
            })}
          </Text>
        </AutoTextColumn>
        <AutoTextColumn justify="center" style={{ minWidth: '150px' }}>
          <Text fontSize="18px" fontWeight="700">
            {price?.invert()?.toSignificant(6) ?? '-'}
          </Text>
          <Text fontSize="14px" color="textSubtle" pt={1}>
            {/* {currencies[Field.CURRENCY_A]?.symbol === 'ETH'
              ? chainId > 1000
                ? 'KLAY'
                : currencies[Field.CURRENCY_A]?.symbol
              : currencies[Field.CURRENCY_A]?.symbol}{' '}
            per{' '}
            {currencies[Field.CURRENCY_B]?.symbol === 'ETH'
              ? chainId > 1000
                ? 'KLAY'
                : currencies[Field.CURRENCY_B]?.symbol
              : currencies[Field.CURRENCY_B]?.symbol}
            <br /> */}
            {t('%symbol1% per %symbol2%', {
              symbol1: getSymbol(currencies[Field.CURRENCY_A]?.symbol),
              symbol2: getSymbol(currencies[Field.CURRENCY_B]?.symbol),
            })}
          </Text>
        </AutoTextColumn>
        <AutoTextColumn justify="center" style={{ minWidth: '150px' }}>
          <Text fontSize="18px" fontWeight="700">
            {noLiquidity && price
              ? '100'
              : (poolTokenPercentage?.lessThan(ONE_BIPS)
                  ? '<0.01'
                  : poolTokenPercentage?.toFixed(2)) ?? '0'}
            %
          </Text>
          <Text fontSize="14px" color="textSubtle" pt={1}>
            {t('Share of Pool')}
          </Text>
        </AutoTextColumn>
      </AutoRow>
    </AutoColumn>
  );
}

export default PoolPriceBar;

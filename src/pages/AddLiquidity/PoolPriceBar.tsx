import React from 'react'
import { Currency, Percent, Price } from 'taalswap-sdk'
import { Text } from 'taalswap-uikit'
import { AutoColumn } from '../../components/Column'
import { AutoRow } from '../../components/Row'
import { ONE_BIPS } from '../../constants'
import { Field } from '../../state/mint/actions'

export function PoolPriceBar({
                               currencies,
                               noLiquidity,
                               poolTokenPercentage,
                               price
                             }: {
  currencies: { [field in Field]?: Currency }
  noLiquidity?: boolean
  poolTokenPercentage?: Percent
  price?: Price
}) {
  return (
    <AutoColumn gap='md' style={{ paddingTop: '15px', paddingBottom: '15px' }}>
      <AutoRow justify='center' gap='4px'>
        <AutoColumn justify='center' style={{ minWidth: "150px" }}>
          <Text fontSize='18px' fontWeight='700'>{price?.toSignificant(6) ?? '-'}</Text>
          <Text fontSize='14px' color='textSubtle' pt={1}>
            {currencies[Field.CURRENCY_B]?.symbol} per {currencies[Field.CURRENCY_A]?.symbol}
          </Text>
        </AutoColumn>
        <AutoColumn justify='center' style={{ minWidth: "150px" }}>
          <Text fontSize='18px' fontWeight='700'>{price?.invert()?.toSignificant(6) ?? '-'}</Text>
          <Text fontSize='14px' color='textSubtle' pt={1}>
            {currencies[Field.CURRENCY_A]?.symbol} per {currencies[Field.CURRENCY_B]?.symbol}
          </Text>
        </AutoColumn>
        <AutoColumn justify='center' style={{ minWidth: "150px" }}>
          <Text fontSize='18px' fontWeight='700'>
            {noLiquidity && price
              ? '100'
              : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'}
            %
          </Text>
          <Text fontSize='14px' color='textSubtle' pt={1}>
            Share of Pool
          </Text>
        </AutoColumn>
      </AutoRow>
    </AutoColumn>
  )
}

export default PoolPriceBar

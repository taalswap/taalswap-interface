import React from 'react'
import { Price } from 'taalswap-sdk'
import { SyncAltIcon, Text } from 'taalswap-uikit'
import { StyledBalanceMaxMini } from './styleds'

interface TradePriceProps {
  price?: Price
  showInverted: boolean
  setShowInverted: (showInverted: boolean) => void
}

export default function TradePrice({ price, showInverted, setShowInverted }: TradePriceProps) {
  const formattedPrice = showInverted ? price?.toSignificant(6) : price?.invert()?.toSignificant(6)

  const show = Boolean(price?.baseCurrency && price?.quoteCurrency)
  const chainId = parseInt(window.localStorage.getItem("chainId") ?? "1")
  let QUOTE = 'ETH'
  let BASE = 'ETH'
  if (price?.quoteCurrency?.symbol === 'ETH') {
    if (chainId > 1000) QUOTE = 'KLAY'
  } else {
    QUOTE = price ? price.quoteCurrency ?  price.quoteCurrency.symbol ? price.quoteCurrency.symbol : '' : '' : ''
  }
  if (price?.baseCurrency?.symbol === 'ETH') {
    if (chainId > 1000) BASE = 'KLAY'
  } else {
    BASE = price ? price.baseCurrency ?  price.baseCurrency.symbol ? price.baseCurrency.symbol : '' : '' : ''
  }
  const label = showInverted
    ? `${QUOTE} per ${BASE}`
    : `${BASE} per ${QUOTE}`

  return (
    <Text fontSize='14px' style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
      {show ? (
        <>
          {formattedPrice ?? '-'} {label}
          <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
            <SyncAltIcon width='20px' color='primary' />
          </StyledBalanceMaxMini>
        </>
      ) : (
        '-'
      )}
    </Text>
  )
}

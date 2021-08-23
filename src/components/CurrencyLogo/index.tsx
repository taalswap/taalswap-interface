import { Currency, ETHER, KLAYTN, Token } from 'taalswap-sdk'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import Logo from '../Logo'
import CoinLogo from '../pancake/CoinLogo'

const getTokenLogoURL = (address: string) => {
  if (address.toLowerCase() === '0x7e6bd46f4ddc58370c0435d496ef7fcc5fe1751d' ||
    address.toLowerCase() === '0xebd87e7c13b3aca572665140b6b12349112f0ce0') {
    return (`https://swap.taalswap.finance/images/coins/${address}.png`)
  }
  return (`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`)
}

const StyledBnbLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style,
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const srcs: string[] = useMemo(() => {
    if (currency === ETHER || currency === KLAYTN) return []

    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, `/images/coins/${currency?.address.toLowerCase() ?? 'token'}.png`, getTokenLogoURL(currency.address.toLowerCase())]
      }

      return [`/images/coins/${currency?.address.toLowerCase() ?? 'token'}.png`, getTokenLogoURL(currency.address)]
    }
    return []
  }, [currency, uriLocations])

  if (currency === ETHER) {
    return <StyledBnbLogo src="/images/coins/eth.png" size={size} style={style} />
  }
  if (currency === KLAYTN) {
    return <StyledBnbLogo src="/images/coins/klay.png" size={size} style={style} />
  }

  return (currency as any)?.symbol ? (
    <CoinLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  ) : (
    <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  )
}

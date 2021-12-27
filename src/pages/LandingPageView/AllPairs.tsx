import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { ethers } from 'ethers'
import TAL_ADDRESS from 'config/constants/taal'
import { Text, Link, Button, IconButton, SyncAltIcon, AddIcon, ChevronUpIcon } from 'taalswap-uikit'
import { useTranslation } from 'contexts/Localization'
import CardValue from 'views/Home/components/CardValue'
import { ChainId } from 'taalswap-sdk'

const Txtcolor = styled.p`
  color: ${({ theme }) => theme.colors.logoColor};
  text-align: center;
`
const TableWrap = styled.table`
  filter: ${({ theme }) => theme.card.dropShadow};
  width: 100%;
  background: ${({ theme }) => theme.card.background};
  border-radius: 16px;
`

const TitleStyle = styled.th`
  color: ${({ theme }) => theme.colors.textSubtle};
  background: ${({ theme }) => theme.colors.tertiary};
  border-bottom: 2px solid rgba(133, 133, 133, 0.1);
  padding: 24px 6px 24px 6px;
  text-align: left;
  font-size: 12px;

  &:nth-child(1) {
    width: 30% !important;
    padding-right: 0px;
  }
  &:nth-child(2) {
    width: 20% !important;
    text-align: right;
  }
  &:nth-child(3) {
    width: 20% !important;
    text-align: right;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 24px 8px 24px 20px;
    font-size: 14px;

    &:nth-child(1) {
      width: 20% !important;
    }
    &:nth-child(2) {
      width: 17% !important;
    }
    &:nth-child(3) {
      width: 17% !important;
    }
    &:nth-child(4) {
      width: 10% !important;
    }
    &:nth-child(5) {
      width: 12.5% !important;
    }
  }
`

const TitleIconStyle = styled.th`
  color: ${({ theme }) => theme.colors.textSubtle};
  background: ${({ theme }) => theme.colors.tertiary};
  border-bottom: 2px solid rgba(133, 133, 133, 0.1);
  text-align: center;
  font-size: 12px;
  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 14px;
  }
`

const Image = styled.img`
  min-width: 1.5rem;
  max-width: 1.5rem;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  ${({ theme }) => theme.mediaQueries.sm} {
    display: block;
  }
`

const TextStyle = styled.td`
  color: ${({ theme }) => theme.colors.logoColor};
  padding: 24px 6px 24px 6px;
  text-align: left;
  border-bottom: 2px solid rgba(133, 133, 133, 0.1);
  font-size: 11px;

  &:nth-child(1) {
    padding-right: 0px;
  }
  &:nth-child(2) {
    text-align: right;
  }
  &:nth-child(3) {
    text-align: right;
    > div {
      justify-content: flex-end;
    }
  }
  > a {
    font-size: auto;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 24px 8px 24px 20px;
    font-size: 14px;
  }
  > a {
    font-size: auto;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
  }
`

const TextPairStyle = styled.div`
  margin-left: 10px;
  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 10px;
  }
`

const Inline = styled.div`
  display: flex;
  align-items: center;
  align-self: center;
  margin-right: 10px;
`

const TextIconStyle = styled.td`
  color: ${({ theme }) => theme.colors.logoColor};
  text-align: center;
  border-bottom: 2px solid rgba(133, 133, 133, 0.1);
  font-size: 12px;

  > a {
    font-size: 14px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 14px;
  }
  > a {
    font-size: 12px;
  }
`

const LinkStyle = styled(Link)`
  color: ${({ theme }) => theme.colors.logoColor};
  text-decoration: underline;
  font-size: 14px;
`

const BTextStyle = styled.td`
  font-size: 12px;
  width: 100%;
`

const TokenParentWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  
  @media screen and (max-width:500px){
   
  }
`;

const TokenWrapper = styled.div`
  //position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
  
  ${({ theme }) => theme.mediaQueries.sm} {
    display: flex;
  }
`

const HigherLogo = styled.img`
  width: 19px;
  height: 19px;
  max-width: none;  
  background-color: white;
  border-radius: 50%;
  border: 1px solid #e3e1e1;
  z-index: 2;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 24px;
    height: 24px;
  }
`

const CoveredLogo = styled.img`
  //position: absolute;
  //left: 15px;
  width: 19px;
  height: 19px;
  max-width: none;  
  background-color: white;
  border-radius: 50%;
  border: 1px solid #e3e1e1;
  margin-left: -7px;
  z-index: 1;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 24px;
    height: 24px;
  }
`

const ScrollButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
`

const AllPairs = () => {
  const { t } = useTranslation()
  const [pairs, setPairs] = useState([])
  const [pairsArray, setPairsArray] = useState([])
  const [ethPrice, setEthPrice] = useState(0)

  const linkToURL = (url: string) => {
    window.location.href = url
  }

  const isAddress = (value) => {
    try {
      return ethers.utils.getAddress(value.toLowerCase())
    } catch {
      return false
    }
  }

  const getTokenIconPath = (address) => {
    // 토큰 icon address
    let path
    const tokenIcon = address.toLowerCase()
    if (
      tokenIcon === TAL_ADDRESS[ChainId.MAINNET] ||
      tokenIcon === TAL_ADDRESS[ChainId.ROPSTEN] ||
      tokenIcon === TAL_ADDRESS[ChainId.RINKEBY] ||
      // tokenIcon === '0x7e6bd46f4ddc58370c0435d496ef7fcc5fe1751d' ||
      tokenIcon === '0x086b00cf35e8873636384cd2b424c39ae875a8a9'
    ) {
      path = `https://taalswap.info/images/coins/${address.toLowerCase()}.png`
    } else {
      path = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${isAddress(
        address,
      )}/logo.png`
    }

    return path
  }

  const pairTableRow = () => {
    const resultRow = []

    pairs.forEach((pair) => {
      if (pair.base_symbol !== 'TAL' && pair.quote_symbol !== 'TAL') {
        const base_symbol = pair.base_symbol === 'WETH' ? 'ETH' : pair.base_symbol
        const quote_symbol = pair.quote_symbol === 'WETH' ? 'ETH' : pair.quote_symbol

        const name = `${base_symbol}-${quote_symbol}`

        const price = pair.price
        // if (parseFloat(pair.price) > 1) {
        //   price = parseFloat(pair.price).toFixed(2)
        // } else {
        //   price = parseFloat(pair.price).toFixed(8)
        // }

        const liquidity = parseFloat(pair.liquidity)

        const baseDeposit = pair.base_symbol === 'WETH' ? 'ETH' : pair.base_address
        const quoteDeposit = pair.quote_symbol === 'WETH' ? 'ETH' : pair.quote_address

        const deposit = `${process.env.REACT_APP_INTERFACE}/#/add/${process.env.REACT_APP_CHAIN_ID}/${baseDeposit}/${quoteDeposit}`

        const volumn24h = pair.previous24hVolumeUSD

        const baseSymbolPath = getTokenIconPath(pair.base_address)
        const quoteSymbolPath = getTokenIconPath(pair.quote_address)

        // let prices = ''
        // if (pair.base_symbol === 'TSHP') {
        //   prices = `${process.env.REACT_APP_INTERFACE}/#/swap/${pair.quote_address}/${pair.base_address}`
        // } else {
        //   prices =
        //     baseDeposit === 'ETH'
        //       ? `${process.env.REACT_APP_INTERFACE}/#/swap/${pair.quote_address}/ETH`
        //       : `${process.env.REACT_APP_INTERFACE}/#/swap/ETH/${pair.base_address}`
        // }

        const prices = `${process.env.REACT_APP_INTERFACE}/#/swap/${process.env.REACT_APP_CHAIN_ID}/${quoteDeposit}/${baseDeposit}`

        const temp = {
          name,
          price,
          volumn24h,
          prices,
          base_symbol,
          liquidity,
          deposit,
          baseSymbolPath,
          quoteSymbolPath,
        }

        resultRow.push(temp)
      }
    })
    return resultRow
  }

  useEffect(() => {
    async function fetchETHPrice() {
      await fetch('https://taalswap-info-api-black.vercel.app/api/ethprice', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((response) => {
          setEthPrice(parseFloat(response.data.ethPrice))
        })
    }

    async function fetchData() {
      const data = []

      await fetch('https://taalswap-info-api-black.vercel.app/api/pairs', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((response) => {
          const pairArray = Object.entries(response.data)
          const array = pairArray.map((pair) => JSON.parse(JSON.stringify(pair[1])))
          setPairs(array)

          Object.keys(response.data).forEach((key) => {
            data.push(response.data[key])
          })
          setPairs(data)
        })
    }

    // fetchETHPrice()
    fetchData()
  }, [])

  return (
    <div className="farms_wrap user_section" style={{ maxWidth: '1280px', padding: '50px 20px 0px 10px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          borderBottom: '3px solid #00ab55',
          // border: '1px solid red',
          // marginBottom: '0px',
          // paddingBottom: '0px',
        }}
      >
        <Inline className="section_tit">
          <Image
            alt="eth"
            src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png"
            width="24px"
            height="24px"
            style={{ marginRight: '10px' }}
          />
          <Txtcolor style={{ fontSize: '16px' }}>Ethereum All Pairs</Txtcolor>
        </Inline>
      </div>

      <TableWrap>
        <tbody>
          <tr>
            <TitleStyle>{t('Pair')}</TitleStyle>
            <TitleStyle>{t('Liquidity ($)')}</TitleStyle>
            <TitleStyle>{t('Vol.(24H)')}</TitleStyle>
            <TitleStyle style={{ textAlign: 'center' }}>{t('Swap')}</TitleStyle>
            <TitleStyle style={{ textAlign: 'center' }}>{t('LP')}</TitleStyle>
          </tr>
          {pairTableRow()
            .sort((pairA, pairB) => pairB.volumn24h - pairA.volumn24h)
            .map((pair) => (
              <tr key={pair.name}>
                <TextStyle style={{ verticalAlign: 'middle' }}>
                  <TokenParentWrapper>
                    <TokenWrapper>
                      <HigherLogo src={pair.baseSymbolPath} alt="test" />
                      <CoveredLogo src={pair.quoteSymbolPath} alt="test"/>
                    </TokenWrapper>
                    <TextPairStyle>{pair.name}</TextPairStyle>
                  </TokenParentWrapper>
                </TextStyle>
                <TextStyle style={{ verticalAlign: 'middle' }}>
                  <CardValue value={pair.liquidity} decimals={0} fontSize="inherit" />
                  {/* <div style={{ display: 'flex', alignItems: 'center' }}>
                    {pair.price >= 1 ? (
                      <CardValue value={pair.liquidity} decimals={2} fontSize="14px" />
                    ) : (
                      <CardValue value={pair.price} decimals={8} fontSize="14px" />
                    )}
                  </div> */}
                </TextStyle>
                <TextStyle style={{ verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '5px' }}>$</span>
                    <CardValue value={pair.volumn24h} decimals={0} fontSize="inherit" />
                  </div>
                </TextStyle>
                <TextStyle style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                  <IconButton onClick={() => linkToURL(pair.prices)} variant="text" scale="sm" ml="4px">
                    <SyncAltIcon width="18px" />
                  </IconButton>
                </TextStyle>
                <TextStyle style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                  <IconButton onClick={() => linkToURL(pair.deposit)} variant="text" scale="sm" ml="4px">
                    <AddIcon width="18px" />
                  </IconButton>
                </TextStyle>
              </tr>
            ))}
          <tr>
            <TextStyle colSpan={6} style={{ verticalAlign: 'middle', padding: '0px' }}>
              <ScrollButtonContainer>
                <Button
                  onClick={() => linkToURL('https://taalswap.info/pairs')}
                  variant="text"
                  style={{ justifyContent: 'center' }}
                >
                  {t('View All')}
                  <ChevronUpIcon color="primary" />
                </Button>
              </ScrollButtonContainer>
            </TextStyle>
          </tr>
        </tbody>
      </TableWrap>
    </div>
  )
}

export default AllPairs

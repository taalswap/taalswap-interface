import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { ethers } from 'ethers'
import { Text, Link, Button, IconButton, SyncAltIcon, AddIcon, ChevronUpIcon } from 'taalswap-uikit'
import { useTranslation } from 'contexts/Localization'
import CardValue from 'views/Home/components/CardValue'
import { ChainId } from 'taalswap-sdk'
import TAL_ADDRESS from '../../config/constants/taal'

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
    width: 17% !important;
  }
  &:nth-child(2) {
    width: 17% !important;
    text-align: right;
  }
  &:nth-child(3) {
    width: 25% !important;
    text-align: right;
  }
  &:nth-child(4) {
    width: 18% !important;
    text-align: right;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 24px 8px 24px 20px;
    font-size: 14px;
    &:nth-child(1) {
      width: 15% !important;
    }
    &:nth-child(2) {
      width: 10% !important;
      text-align: right;
    }
    &:nth-child(3) {
      width: 18% !important;
      text-align: right;
    }
    &:nth-child(4) {
      width: 15% !important;
      text-align: right;
    }
    &:nth-child(5) {
      width: 12.5% !important;
    }
    &:nth-child(6) {
      width: 12.5% !important;
    }
  }
`

const TextStyle = styled.td`
  color: ${({ theme }) => theme.colors.logoColor};
  padding: 24px 6px 24px 6px;
  text-align: left;
  border-bottom: 2px solid rgba(133, 133, 133, 0.1);
  font-size: 11px;

  &:nth-child(2) {
    text-align: right;
    > div {
      justify-content: flex-end;
    }
  }
  &:nth-child(3) {
    text-align: right;
    > div {
      justify-content: flex-end;
    }
  }
  &:nth-child(4) {
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
    font-size: 13px;
  }
  > a {
    font-size: 12px;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
  }
`

const TextIconStyle = styled.td`
  color: ${({ theme }) => theme.colors.logoColor};
  text-align: center;
  border-bottom: 2px solid rgba(133, 133, 133, 0.1);
  font-size: 12px;

  > a {
    font-size: 13px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 13px;
  }
  > a {
    font-size: 12px;
  }
`

const Inline = styled.div`
  display: flex;
  align-items: center;
  align-self: center;
  margin-right: 10px;
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

const ScrollButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
`

const AllTokens = () => {
  const { t } = useTranslation()
  const [tokens, setTokens] = useState([])
  const chainId =
    localStorage.getItem('chainId') === undefined ? process.env.EACT_APP_CHAIN_ID : localStorage.getItem('chainId')
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

  const tokenTableRow = () => {
    const resultRow = []

    tokens.forEach((token) => {
      if (token.symbol !== 'TAL') {
        const symbol = token.symbol === 'WETH' ? 'ETH' : token.symbol
        const name = token.name
        const price = token.price

        const liquidity = parseFloat(token.liquidity)

        // 토큰 icon address
        let path
        const tokenIcon = token.address.toLowerCase()
        if (
          tokenIcon === TAL_ADDRESS[ChainId.MAINNET] ||
          tokenIcon === TAL_ADDRESS[ChainId.ROPSTEN] ||
          tokenIcon === TAL_ADDRESS[ChainId.RINKEBY] ||
          // tokenIcon === '0x7e6bd46f4ddc58370c0435d496ef7fcc5fe1751d' ||
          tokenIcon === '0x086b00cf35e8873636384cd2b424c39ae875a8a9'
        ) {
          path = `https://taalswap.info/images/coins/${token.address.toLowerCase()}.png`
        } else {
          path = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${isAddress(
            token.address,
          )}/logo.png`
        }

        const address = token.symbol === 'WETH' ? 'ETH' : token.address

        const prices = `${process.env.REACT_APP_INTERFACE}/#/swap/${process.env.REACT_APP_CHAIN_ID}/0x00/${address}`
        const deposit = `${process.env.REACT_APP_INTERFACE}/#/add/${process.env.REACT_APP_CHAIN_ID}/0x00/${address}`

        const temp = {
          name,
          path,
          symbol,
          price,
          liquidity,
          prices,
          deposit,
        }

        resultRow.push(temp)
      }
    })
    return resultRow
  }

  useEffect(() => {
    async function fetchData() {
      const data = []

      await fetch('https://taalswap-info-api-black.vercel.app/api/tokens', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((response) => {
          const toeknsArray = Object.entries(response.data)
          const array = toeknsArray.map((pair) => JSON.parse(JSON.stringify(pair[1])))
          setTokens(array)

          Object.keys(response.data).forEach((key) => {
            data.push(response.data[key])
          })
          setTokens(data)
        })
    }

    fetchData()
  }, [])

  return (
    <div className="farms_wrap user_section" style={{ maxWidth: '1280px', padding: '50px 10px 0px 20px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          borderBottom: '3px solid #00ab55',
          alignItems: 'center',
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
          <Txtcolor style={{ fontSize: '16px' }}>Ethereum All Tokens</Txtcolor>
        </Inline>
      </div>

      <TableWrap>
        <tbody>
          <tr>
            <TitleStyle>{t('Symbol')} </TitleStyle>
            {/* <TitleStyle>{t('Name')}</TitleStyle> */}
            <TitleStyle>{t('Liquidity ($)')}</TitleStyle>
            <TitleStyle>{t('Price ($)')}</TitleStyle>
            <TitleStyle style={{ textAlign: 'center' }}>{t('Swap')}</TitleStyle>
            <TitleStyle style={{ textAlign: 'center' }}>{t('LP')}</TitleStyle>
          </tr>
          {tokenTableRow()
            .sort((tokenA, tokenB) => tokenB.liquidity - tokenA.liquidity)
            .map((token) => (
              <tr key={token.symbol}>
                <TextStyle style={{ verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <Inline>
                      <Image alt={token.name} src={token.path} width="24px" height="24px" />
                    </Inline>
                    {token.symbol}
                  </div>
                </TextStyle>
                {/* <TextStyle style={{ verticalAlign: 'middle' }}>
                <div style={{ display: 'flex', alignItems: 'left' }}>{token.name}</div>
              </TextStyle> */}
                <TextStyle style={{ verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {/* <span style={{ marginRight: '5px' }}>$</span> */}
                    <CardValue value={token.liquidity} decimals={0} fontSize="inherit" />
                  </div>
                </TextStyle>
                <TextStyle style={{ verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {/* <span style={{ marginRight: '5px' }}>$</span> */}
                    {/* <CardValue value={parseFloat(formattedNum(token.price))} decimals={2} fontSize="14px" /> */}
                    {token.price >= 1 ? (
                      <CardValue value={token.price} decimals={2} fontSize="inherit" />
                    ) : (
                      <CardValue value={token.price} decimals={4} fontSize="inherit" />
                    )}
                  </div>
                </TextStyle>
                <TextStyle style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                  <IconButton onClick={() => linkToURL(token.prices)} variant="text" scale="sm" ml="4px">
                    <SyncAltIcon width="18px" />
                  </IconButton>
                </TextStyle>
                <TextStyle style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                  <IconButton onClick={() => linkToURL(token.deposit)} variant="text" scale="sm" ml="4px">
                    <AddIcon width="18px" />
                  </IconButton>
                </TextStyle>
              </tr>
            ))}
          <tr>
            <TextStyle colSpan={6} style={{ verticalAlign: 'middle', padding: '0px' }}>
              <ScrollButtonContainer>
                <Button
                  onClick={() => linkToURL('https://taalswap.info/tokens')}
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

export default AllTokens

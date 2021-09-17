import { Trade } from 'taalswap-sdk'
import React, { Fragment, memo, useContext } from 'react'
import { ChevronRight } from 'react-feather'
import { Flex, Text } from 'taalswap-uikit'
import styled,{ ThemeContext } from 'styled-components'
import CurrencyLogo from '../CurrencyLogo'

const FlexBox = styled(Flex)`
   
  @media screen and (max-width:720px){   
    display:flex;
    justify-content: center;
    text-align:left;
  }
`;

const FlexBoxChild = styled(Flex)`
   
  @media screen and (max-width:720px){
    display:display;
    justify-content:flex-start;
    text-align:left;
  }
`;

export default memo(function SwapRoute({ trade }: { trade: Trade }) {
  const theme = useContext(ThemeContext)
  return (
    <FlexBox
      px='1rem'
      py='0.5rem'
      my='0.5rem'
      style={{ border: `1px solid ${theme.colors.tertiary}`, borderRadius: '1rem' }}
      flexWrap='wrap'
      justifyContent='center'
      alignItems='center'
    >
      {trade.route.path.map((token, i, path) => {
        const isLastItem: boolean = i === path.length - 1
        let SYMBOL
        if (token.symbol === 'WKLAY') {
          SYMBOL = 'KLAY'
        } else if (token.symbol === 'WETH') {
          SYMBOL = 'ETH'
        } else {
          SYMBOL = token.symbol
        }
        return (
          // eslint-disable-next-line react/no-array-index-key
          <Fragment key={i}>
            <FlexBoxChild my='0.5rem' alignItems='center' justifyContent='center' style={{ flexShrink: 0, }}>
              <CurrencyLogo currency={token} size='1.5rem' />
              <Text fontSize='14px' color='text' ml='0.5rem'>
                {SYMBOL}
              </Text>
            </FlexBoxChild>
            {isLastItem ? null : <ChevronRight color='textSubtle' />}
          </Fragment>
        )
      })}
    </FlexBox>
  )
})

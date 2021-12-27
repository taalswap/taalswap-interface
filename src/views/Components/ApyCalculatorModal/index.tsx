import React from 'react'
import styled from 'styled-components'
import { Modal, Text, LinkExternal, Flex, Box } from 'taalswap-uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import { tokenEarnedPerThousandDollarsCompounding, getRoi } from 'utils/compoundApyHelpers'

interface ApyCalculatorModalProps {
  onDismiss?: () => void
  tokenPrice: number
  apr: number
  linkLabel: string
  linkHref: string
  earningTokenSymbol?: string
  roundingDecimals?: number
  compoundFrequency?: number
  performanceFee?: number
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 33.3%);
  grid-template-rows: repeat(4, auto);
  margin-bottom: 12px;
`

const GridItem = styled.div``

const GridHeaderItem = styled.div`
  max-width: 180px;
`

const ApyCalculatorModal: React.FC<ApyCalculatorModalProps> = ({
  onDismiss,
  tokenPrice,
  apr,
  linkLabel,
  linkHref,
  earningTokenSymbol = 'TAL',
  roundingDecimals = 2,
  compoundFrequency = 1,
  performanceFee = 0,
}) => {
  const { t } = useTranslation()
  const oneThousandDollarsWorthOfToken = 1000 / tokenPrice

  const tokenEarnedPerThousand1D = tokenEarnedPerThousandDollarsCompounding({
    numberOfDays: 1,
    farmApr: apr,
    tokenPrice,
    roundingDecimals,
    compoundFrequency,
    performanceFee,
  })
  const tokenEarnedPerThousand7D = tokenEarnedPerThousandDollarsCompounding({
    numberOfDays: 7,
    farmApr: apr,
    tokenPrice,
    roundingDecimals,
    compoundFrequency,
    performanceFee,
  })
  const tokenEarnedPerThousand30D = tokenEarnedPerThousandDollarsCompounding({
    numberOfDays: 30,
    farmApr: apr,
    tokenPrice,
    roundingDecimals,
    compoundFrequency,
    performanceFee,
  })
  const tokenEarnedPerThousand365D = tokenEarnedPerThousandDollarsCompounding({
    numberOfDays: 365,
    farmApr: apr,
    tokenPrice,
    roundingDecimals,
    compoundFrequency,
    performanceFee,
  })
  const { theme } = useTheme()
  const btnColor = theme.isDark ? "#fff" : "#212b36";

  return (
    <Modal title={t('ROI')} onDismiss={onDismiss} style={{position:'relative'}}>
      <div style={{position:"absolute",right:"20px",top:'20px',cursor:'pointer'}}>
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" onClick={onDismiss}>
  <g id="___Icons_ic_replace" data-name="__🥬Icons/ ic_replace" transform="translate(0 16.971) rotate(-45)">
    <g id="_gr" data-name="#gr">
      <path id="Path" d="M22.5,10.5h-9v-9a1.5,1.5,0,0,0-3,0v9h-9a1.5,1.5,0,0,0,0,3h9v9a1.5,1.5,0,0,0,3,0v-9h9a1.5,1.5,0,0,0,0-3Z" fill={btnColor}/>
    </g>
  </g>
</svg>
      </div>
      <Grid>
        <GridHeaderItem>
          <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase" mb="12px">
            {t('Timeframe')}
          </Text>
        </GridHeaderItem>
        <GridHeaderItem>
          <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase" mr="12px" ml="12px" mb="12px">
            {t('ROI Title')}
          </Text>
        </GridHeaderItem>
        <GridHeaderItem>
          <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase" mb="12px">
            {t('%symbol% per $1,000', { symbol: earningTokenSymbol })}
          </Text>
        </GridHeaderItem>
        {/* 1 day row */}
        <GridItem>
          <Text fontSize="14px">{t('%num%d', { num: 1 })}</Text>
        </GridItem>
        <GridItem>
          <Text mr="12px" ml="12px" fontSize="14px">
            {getRoi({ amountEarned: tokenEarnedPerThousand1D, amountInvested: oneThousandDollarsWorthOfToken }).toFixed(
              roundingDecimals,
            )}
            %
          </Text>
        </GridItem>
        <GridItem>
          <Text fontSize="14px">{tokenEarnedPerThousand1D}</Text>
        </GridItem>
        {/* 7 day row */}
        <GridItem>
          <Text fontSize="14px">{t('%num%d', { num: 7 })}</Text>
        </GridItem>
        <GridItem>
          <Text mr="12px" ml="12px" fontSize="14px">
            {getRoi({ amountEarned: tokenEarnedPerThousand7D, amountInvested: oneThousandDollarsWorthOfToken }).toFixed(
              roundingDecimals,
            )}
            %
          </Text>
        </GridItem>
        <GridItem>
          <Text fontSize="14px">{tokenEarnedPerThousand7D}</Text>
        </GridItem>
        {/* 30 day row */}
        <GridItem>
          <Text fontSize="14px">{t('%num%d', { num: 30 })}</Text>
        </GridItem>
        <GridItem>
          <Text mr="12px" ml="12px" fontSize="14px">
            {getRoi({
              amountEarned: tokenEarnedPerThousand30D,
              amountInvested: oneThousandDollarsWorthOfToken,
            }).toFixed(roundingDecimals)}
            %
          </Text>
        </GridItem>
        <GridItem>
          <Text fontSize="14px">{tokenEarnedPerThousand30D}</Text>
        </GridItem>
        {/* 365 day / APY row */}
        <GridItem style={{ maxWidth: '180px' }}>
          <Text fontSize="14px">{t('365d(APY)')}</Text>
        </GridItem>
        <GridItem>
          <Text mr="12px" ml="12px" fontSize="14px">
            {getRoi({
              amountEarned: tokenEarnedPerThousand365D,
              amountInvested: oneThousandDollarsWorthOfToken,
            }).toFixed(roundingDecimals)}
            %
          </Text>
        </GridItem>
        <GridItem>
          <Text fontSize="14px">{tokenEarnedPerThousand365D}</Text>
        </GridItem>
      </Grid>
      <Flex justifyContent="center">
        <Box mb="28px" maxWidth="280px">
          <Text fontSize="12px" textAlign="center" color="textSubtle">
            {t(
              'Calculated based on current rates. Compounding %freq%x daily. Rates are estimates provided for your convenience only, and by no means represent guaranteed returns.',
              { freq: compoundFrequency.toLocaleString() },
            )}
          </Text>
          {performanceFee > 0 && (
            <Text mt="14px" fontSize="12px" textAlign="center" color="textSubtle">
              {t('All estimated rates take into account this pool’s %fee%% performance fee', { fee: performanceFee })}
            </Text>
          )}
        </Box>
      </Flex>
      <Flex justifyContent="center">
        <LinkExternal href={linkHref}>{linkLabel}</LinkExternal>
      </Flex>
    </Modal>
  )
}

export default ApyCalculatorModal

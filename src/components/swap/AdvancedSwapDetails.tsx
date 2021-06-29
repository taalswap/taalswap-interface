import React from 'react'
import { Trade, TradeType } from 'taalswap-sdk'
import styled from 'styled-components';
import { Card, CardBody, HelpIcon, Text, useTooltip } from 'taalswap-uikit';
import { Field } from '../../state/swap/actions'
import { useUserSlippageTolerance } from '../../state/user/hooks'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from '../../utils/prices'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { RowBetween, RowFixed } from '../Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import { SectionBreak } from './styleds'
import SwapRoute from './SwapRoute'
import { useTranslation } from '../../contexts/Localization';

const ReferenceElement = styled.div`
  display: flex;
  margin-left: 0.3rem;
`

const Tip1 = () => {
  const { t } = useTranslation();
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.'),
    { placement: 'right-end', tooltipOffset: [20, 10] },
  )

  return(
    <div>
      <ReferenceElement ref={targetRef}>
        <HelpIcon color="textSubtle" />
      </ReferenceElement>
      {tooltipVisible && tooltip}
    </div>
  )
}

const Tip2 = () => {
  const { t } = useTranslation();
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('The difference between the market price and estimated price due to trade size.'),
    { placement: 'right-end', tooltipOffset: [20, 10] },
  )

  return(
    <div>
      <ReferenceElement ref={targetRef}>
        <HelpIcon color="textSubtle" />
      </ReferenceElement>
      {tooltipVisible && tooltip}
    </div>
  )
}

const Tip3 = () => {
  const { t } = useTranslation();
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text mb="12px">{t('For each trade a 0.25% fee is paid')}</Text>
      <Text>{t('- 0.17% to LP token holders')}</Text>
      <Text>{t('- 0.03% to the Treasury')}</Text>
      <Text>{t('- 0.05% towards TAL buyback & burn')}</Text>
    </>,
    { placement: 'right-end', tooltipOffset: [20, 10] },
  )

  return(
    <div>
      <ReferenceElement ref={targetRef}>
        <HelpIcon color="textSubtle" />
      </ReferenceElement>
      {tooltipVisible && tooltip}
    </div>
  )
}

function TradeSummary({ trade, allowedSlippage }: { trade: Trade; allowedSlippage: number }) {
  const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(trade)
  const isExactIn = trade.tradeType === TradeType.EXACT_INPUT
  const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(trade, allowedSlippage)
  const { t } = useTranslation();

  return (
    <Card>
      <CardBody>
        <RowBetween>
          <RowFixed>
            <Text fontSize='14px'>
              {isExactIn ? t('Minimum received') : t('Maximum sold')}
            </Text>
            <Tip1 />
          </RowFixed>
          <RowFixed>
            <Text fontSize='14px'>
              {isExactIn
                ? `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4)} ${trade.outputAmount.currency.symbol}` ??
                '-'
                : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4)} ${trade.inputAmount.currency.symbol}` ??
                '-'}
            </Text>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <Text fontSize='14px'>{t('Price Impact')}</Text>
            <Tip2 />
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <Text fontSize='14px'>{t('Liquidity Provider Fee')}</Text>
            <Tip3 />
          </RowFixed>
          <Text fontSize='14px'>
            {realizedLPFee ? `${realizedLPFee.toSignificant(4)} ${trade.inputAmount.currency.symbol}` : '-'}
          </Text>
        </RowBetween>
      </CardBody>
    </Card>
  )
}

export interface AdvancedSwapDetailsProps {
  trade?: Trade
}

export function AdvancedSwapDetails({ trade }: AdvancedSwapDetailsProps) {
  const [allowedSlippage] = useUserSlippageTolerance()
  const { t } = useTranslation();
  const showRoute = Boolean(trade && trade.route.path.length > 2)

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('Routing through these tokens resulted in the best price for your trade.'),
    { placement: 'top-end', tooltipOffset: [20, 10] }
  );

  return (
    <AutoColumn gap='md'>
      {trade && (
        <>
          <TradeSummary trade={trade} allowedSlippage={allowedSlippage} />
          {showRoute && (
            <>
              <SectionBreak />
              <AutoColumn style={{ padding: '0 24px' }}>
                <RowFixed>
                  <Text fontSize='14px'>Route</Text>
                  <ReferenceElement ref={targetRef}>
                    <HelpIcon color="textSubtle" />
                  </ReferenceElement>
                  {tooltipVisible && tooltip}
                </RowFixed>
                <SwapRoute trade={trade} />
              </AutoColumn>
            </>
          )}
        </>
      )}
    </AutoColumn>
  )
}

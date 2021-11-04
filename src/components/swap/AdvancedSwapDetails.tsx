import React from 'react';
import { Trade, TradeType } from 'taalswap-sdk';
import styled from 'styled-components';
import { Card, CardBody, HelpIcon, Text, useTooltip } from 'taalswap-uikit';
import { Field } from '../../state/swap/actions';
import { useUserSlippageTolerance } from '../../state/user/hooks';
import {
  computeSlippageAdjustedAmounts,
  computeTradePriceBreakdown,
} from '../../utils/prices';
import { AutoColumn } from '../Column';
import QuestionHelper from '../QuestionHelper';
import { RowBetween, RowFixed } from '../Row';
import FormattedPriceImpact from './FormattedPriceImpact';
import { SectionBreak } from './styleds';
import SwapRoute from './SwapRoute';
import { useTranslation } from '../../contexts/Localization';

const ReferenceElement = styled.div`
  display: flex;
  margin-left: 0.3rem;
`;

const ReCard = styled(Card)`
  @media screen and (max-width: 720px) {
    width: 100%;
  }
`;

const ReCardBody = styled(CardBody)`
  max-width: 550px;
  padding-left: 0;
  padding-right: 0;
  margin: 0 auto;

  @media screen and (max-width: 610px) {
    padding: 0.812rem 0.625rem;

    ${RowBetween} {
      //display:block;

      ${RowFixed} {
        display: flex;
        flex-direction: row;
        width: 100%;
        text-align: left;
        white-space: pre;

        ${Text} {
          font-size: 12px !important;
        }
        &:nth-child(2) {
          justify-content: flex-end;
          text-align: right;
          font-size: 12px !important;
        }
      }

      &:nth-child(2) {
        ${Text} {
          font-size: 12px !important;
        }
      }

      &:last-child {
        ${Text} {
          font-size: 12px !important;
          text-align: right;
          white-space: pre;
        }
      }
    }
  }
`;

const AutoColumnSub = styled(AutoColumn)`
  padding: 0 24px;

  @media screen and (max-width: 500px) {
    padding: 0;
  }
`;

const Tip1 = () => {
  const { t } = useTranslation();
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t(
      'Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.'
    ),
    { placement: 'right-end', tooltipOffset: [20, 10] }
  );

  return (
    <div>
      <ReferenceElement ref={targetRef}>
        <HelpIcon color="textSubtle" />
      </ReferenceElement>
      {tooltipVisible && tooltip}
    </div>
  );
};

const Tip2 = () => {
  const { t } = useTranslation();
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t(
      'The difference between the market price and estimated price due to trade size.'
    ),
    { placement: 'right-end', tooltipOffset: [20, 10] }
  );

  return (
    <div>
      <ReferenceElement ref={targetRef}>
        <HelpIcon color="textSubtle" />
      </ReferenceElement>
      {tooltipVisible && tooltip}
    </div>
  );
};

const Tip3 = () => {
  const { t } = useTranslation();
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text mb="12px">{t('For each trade a 0.25% fee is paid')}</Text>
      <Text>{t('- 0.17% to LP token holders')}</Text>
      <Text>{t('- 0.03% to the Treasury')}</Text>
      <Text>{t('- 0.05% to SAFU address')}</Text>
    </>,
    { placement: 'right-end', tooltipOffset: [20, 10] }
  );

  return (
    <div>
      <ReferenceElement ref={targetRef}>
        <HelpIcon color="textSubtle" />
      </ReferenceElement>
      {tooltipVisible && tooltip}
    </div>
  );
};

function TradeSummary({
  trade,
  allowedSlippage,
}: {
  trade: Trade;
  allowedSlippage: number;
}) {
  const { priceImpactWithoutFee, realizedLPFee } =
    computeTradePriceBreakdown(trade);
  const isExactIn = trade.tradeType === TradeType.EXACT_INPUT;
  const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(
    trade,
    allowedSlippage
  );
  const { t } = useTranslation();

  const chainId = parseInt(window.localStorage.getItem('chainId') ?? '1');
  let FEE = 'ETH';
  if (trade.inputAmount.currency.symbol === 'ETH') {
    if (chainId > 1000) FEE = 'KLAY';
  } else {
    FEE = trade.inputAmount.currency.symbol ?? '';
  }
  return (
    <ReCard>
      <ReCardBody>
        <RowBetween style={{ padding: '.25rem 0' }}>
          <RowFixed>
            <Text fontSize="14px">
              {isExactIn ? t('Minimum received') : t('Maximum sold')}
            </Text>
            <Tip1 />
          </RowFixed>
          <RowFixed>
            <Text fontSize="14px">
              {isExactIn
                ? `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4)} ${
                    trade.outputAmount.currency.symbol
                  }` ?? '-'
                : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4)} ${
                    trade.inputAmount.currency.symbol
                  }` ?? '-'}
            </Text>
          </RowFixed>
        </RowBetween>
        <RowBetween style={{ padding: '.25rem 0' }}>
          <RowFixed>
            <Text fontSize="14px">{t('Price Impact')}</Text>
            <Tip2 />
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>
        <RowBetween style={{ padding: '.25rem 0' }}>
          <RowFixed>
            <Text fontSize="14px">{t('Liquidity Provider Fee')}</Text>
            <Tip3 />
          </RowFixed>
          <Text fontSize="14px">
            {realizedLPFee ? `${realizedLPFee.toSignificant(4)} ${FEE}` : '-'}
          </Text>
        </RowBetween>
      </ReCardBody>
    </ReCard>
  );
}

export interface AdvancedSwapDetailsProps {
  trade?: Trade;
}

export function AdvancedSwapDetails({ trade }: AdvancedSwapDetailsProps) {
  const [allowedSlippage] = useUserSlippageTolerance();
  const { t } = useTranslation();
  const showRoute = Boolean(trade && trade.route.path.length > 2);

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t(
      'Routing through these tokens resulted in the best price for your trade.'
    ),
    { placement: 'top-end', tooltipOffset: [20, 10] }
  );

  return (
    <>
      <AutoColumn gap="md">
        {trade && (
          <>
            <TradeSummary trade={trade} allowedSlippage={allowedSlippage} />
            {showRoute && (
              <>
                <SectionBreak style={{ backgroundColor: 'transparent' }} />
                <AutoColumnSub>
                  <RowFixed>
                    <Text fontSize="14px">Route</Text>
                    <ReferenceElement ref={targetRef}>
                      <HelpIcon color="textSubtle" />
                    </ReferenceElement>
                    {tooltipVisible && tooltip}
                  </RowFixed>
                  <SwapRoute trade={trade} />
                </AutoColumnSub>
              </>
            )}
          </>
        )}
      </AutoColumn>
    </>
  );
}

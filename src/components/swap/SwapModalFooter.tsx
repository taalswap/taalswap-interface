import { Trade, TradeType } from 'taalswap-sdk';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Button, HelpIcon, Text, useTooltip } from 'taalswap-uikit';
import { Repeat } from 'react-feather';

import { Field } from '../../state/swap/actions';
import {
  computeSlippageAdjustedAmounts,
  computeTradePriceBreakdown,
  formatExecutionPrice,
  warningSeverity,
} from '../../utils/prices';
import { AutoColumn } from '../Column';
import { AutoRow, RowBetween, RowFixed } from '../Row';
import FormattedPriceImpact from './FormattedPriceImpact';
import { StyledBalanceMaxMini, SwapCallbackError } from './styleds';
import { useTranslation } from '../../contexts/Localization';

const ReferenceElement = styled.div`
  display: inline-block;
  margin-left: 0.3rem;
`;

export default function SwapModalFooter({
  trade,
  tradeX,
  onConfirm,
  allowedSlippage,
  swapErrorMessage,
  disabledConfirm,
}: {
  trade: Trade;
  tradeX: Trade | undefined;
  allowedSlippage: number;
  onConfirm: () => void;
  swapErrorMessage: string | undefined;
  disabledConfirm: boolean;
}) {
  const [showInverted, setShowInverted] = useState<boolean>(false);
  const [showOutpuInverted, setShowOutputInverted] = useState<boolean>(false);
  const slippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(trade, allowedSlippage),
    [allowedSlippage, trade]
  );
  const ouputSlippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(tradeX, allowedSlippage),
    [allowedSlippage, tradeX]
  );
  const { priceImpactWithoutFee, realizedLPFee } = useMemo(
    () => computeTradePriceBreakdown(trade),
    [trade]
  );
  const severity = warningSeverity(priceImpactWithoutFee);
  const { t } = useTranslation();

  const TipReceived = () => {
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

  const TipImpact = () => {
    const { targetRef, tooltip, tooltipVisible } = useTooltip(
      t(
        'The difference between the market price and your price due to trade size.'
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

  const TipFee = () => {
    const { targetRef, tooltip, tooltipVisible } = useTooltip(
      <>
        <Text mb="12px">{t('For each trade a 0.25% fee is paid')}</Text>
        <Text>{t('- 0.17% to LP token holders')}</Text>
        <Text>{t('- 0.03% to the Treasury')}</Text>
        <Text>{t('- 0.05% towards TAL buyback & burn')}</Text>
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

  const chainId = parseInt(window.localStorage.getItem('chainId') ?? '1');
  const crossChain = parseInt(window.localStorage.getItem('crossChain') ?? '1');

  const enabledCheck = () => {
    const result =
      chainId !== crossChain && tradeX === undefined ? true : disabledConfirm;

    return result;
  };

  let FEE = 'ETH';
  if (trade.inputAmount.currency.symbol === 'ETH') {
    if (chainId > 1000) FEE = 'KLAY';
  } else {
    FEE = trade.inputAmount.currency.symbol ?? '';
  }
  return (
    <>
      <AutoColumn gap="0px">
        <RowBetween align="center">
          <Text fontSize="14px">{t('SwapPrice')}</Text>
          <div>
            <Text
              fontSize="14px"
              style={{
                justifyContent: 'end',
                alignItems: 'center',
                display: 'flex',
                textAlign: 'right',
                paddingLeft: '8px',
                fontWeight: 500,
              }}
            >
              {formatExecutionPrice(trade, showInverted)}
              <StyledBalanceMaxMini
                onClick={() => setShowInverted(!showInverted)}
              >
                <Repeat size={14} />
              </StyledBalanceMaxMini>
            </Text>
            {tradeX !== undefined && chainId !== crossChain && (
              <Text
                fontSize="14px"
                style={{
                  justifyContent: 'end',
                  alignItems: 'center',
                  display: 'flex',
                  textAlign: 'right',
                  paddingLeft: '8px',
                  fontWeight: 500,
                }}
              >
                {formatExecutionPrice(tradeX, showOutpuInverted)}
                <StyledBalanceMaxMini
                  onClick={() => setShowOutputInverted(!showOutpuInverted)}
                >
                  <Repeat size={14} />
                </StyledBalanceMaxMini>
              </Text>
            )}
          </div>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <Text fontSize="14px">
              {trade.tradeType === TradeType.EXACT_INPUT
                ? t('Minimum received')
                : t('Maximum sold')}
            </Text>
            <TipReceived />
          </RowFixed>
          <div>
            <RowFixed>
              <Text fontSize="14px">
                {trade.tradeType === TradeType.EXACT_INPUT
                  ? slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4) ??
                    '-'
                  : slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4) ??
                    '-'}
              </Text>
              <Text fontSize="14px" marginLeft="4px">
                {trade.tradeType === TradeType.EXACT_INPUT
                  ? trade.outputAmount.currency.symbol
                  : trade.inputAmount.currency.symbol}
              </Text>
            </RowFixed>
            {tradeX !== undefined && chainId !== crossChain && (
              <RowFixed>
                <Text fontSize="14px">
                  {tradeX.tradeType === TradeType.EXACT_INPUT
                    ? ouputSlippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(
                        4
                      ) ?? '-'
                    : ouputSlippageAdjustedAmounts[Field.INPUT]?.toSignificant(
                        4
                      ) ?? '-'}
                </Text>
                <Text fontSize="14px" marginLeft="4px">
                  {tradeX.tradeType === TradeType.EXACT_INPUT
                    ? tradeX.outputAmount.currency.symbol
                    : tradeX.inputAmount.currency.symbol}
                </Text>
              </RowFixed>
            )}
          </div>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <Text fontSize="14px">{t('Price Impact')}</Text>
            <TipImpact />
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <Text fontSize="14px">{t('Liquidity Provider Fee')}</Text>
            <TipFee />
          </RowFixed>
          <Text fontSize="14px">
            {realizedLPFee ? `${realizedLPFee?.toSignificant(6)} ${FEE}` : '-'}
          </Text>
        </RowBetween>
      </AutoColumn>

      <AutoRow>
        <Button
          onClick={onConfirm}
          disabled={enabledCheck()}
          variant={severity > 2 ? 'danger' : 'primary'}
          mt="10px"
          id="confirm-swap-or-send"
          width="100%"
        >
          {severity > 2 ? t('Swap Anyway') : t('Confirm Swap')}
        </Button>

        {swapErrorMessage ? (
          <SwapCallbackError error={swapErrorMessage} />
        ) : null}
      </AutoRow>
    </>
  );
}

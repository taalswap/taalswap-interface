import React, { useContext, useMemo } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { Trade, TradeType } from 'taalswap-sdk';
import { Button, Text } from 'taalswap-uikit';
import { AlertTriangle, ArrowDown, Underline } from 'react-feather';
import { useTranslation } from 'contexts/Localization';
import { Field } from '../../state/swap/actions';
import { isAddress, shortenAddress } from '../../utils';
import {
  computeSlippageAdjustedAmounts,
  computeTradePriceBreakdown,
  warningSeverity,
} from '../../utils/prices';
import { AutoColumn } from '../Column';
import CurrencyLogo from '../CurrencyLogo';
import { RowBetween, RowFixed } from '../Row';
import { SwapShowAcceptChanges } from './styleds';

const CACHE_KEY = 'taalswap_language';

const PriceInfoText = styled(Text)`
  // font-style: italic;
  line-height: 1.5;

  span {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
  }
`;

export default function SwapModalHeader({
  trade,
  tradeX,
  allowedSlippage,
  recipient,
  showAcceptChanges,
  onAcceptChanges,
}: {
  trade: Trade;
  tradeX: Trade | undefined;
  allowedSlippage: number;
  recipient: string | null;
  showAcceptChanges: boolean;
  onAcceptChanges: () => void;
}) {
  const { t } = useTranslation();
  const slippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(trade, allowedSlippage),
    [trade, allowedSlippage]
  );
  const ouputSlippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(tradeX, allowedSlippage),
    [tradeX, allowedSlippage]
  );
  const { priceImpactWithoutFee } = useMemo(
    () => computeTradePriceBreakdown(trade),
    [trade]
  );
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee);

  const theme = useContext(ThemeContext);

  const chainId = window.localStorage.getItem('chainId');
  const crossChain = window.localStorage.getItem('crossChain');

  const storedLangCode = localStorage.getItem(CACHE_KEY);

  return (
    <AutoColumn gap="md" style={{ marginTop: '20px' }}>
      {tradeX !== undefined && chainId !== crossChain ? (
        <>
          <RowBetween align="flex-end">
            <RowFixed gap="0px">
              <CurrencyLogo
                currency={trade.inputAmount.currency}
                size="24px"
                style={{ marginRight: '12px' }}
              />
              <Text
                fontSize="24px"
                color={
                  showAcceptChanges &&
                  trade.tradeType === TradeType.EXACT_OUTPUT
                    ? theme.colors.primary
                    : 'text'
                }
              >
                {trade.inputAmount.toSignificant(6)}
              </Text>
            </RowFixed>
            <RowFixed gap="0px">
              <Text
                fontSize="24px"
                style={{ marginLeft: '10px', fontWeight: 500 }}
              >
                {trade.inputAmount.currency.symbol}
              </Text>
            </RowFixed>
          </RowBetween>
          <RowFixed>
            <ArrowDown
              size="16"
              color={theme.colors.textSubtle}
              style={{ marginLeft: '4px', minWidth: '16px' }}
            />
          </RowFixed>
          <RowBetween align="flex-end">
            <RowFixed gap="0px">
              <CurrencyLogo
                currency={trade.outputAmount.currency}
                size="24px"
                style={{ marginRight: '12px' }}
              />
              <Text
                fontSize="24px"
                style={{ marginLeft: '10px', fontWeight: 500 }}
                color={
                  priceImpactSeverity > 2
                    ? theme.colors.failure
                    : showAcceptChanges &&
                      trade.tradeType === TradeType.EXACT_INPUT
                    ? theme.colors.primary
                    : 'text'
                }
              >
                {trade.outputAmount.toSignificant(6)}
              </Text>
            </RowFixed>
            <RowFixed gap="0px">
              <Text
                fontSize="24px"
                style={{ marginLeft: '10px', fontWeight: 500 }}
              >
                {trade.outputAmount.currency.symbol}
              </Text>
            </RowFixed>
          </RowBetween>
          <RowFixed>
            <ArrowDown
              size="16"
              color={theme.colors.textSubtle}
              style={{ marginLeft: '4px', minWidth: '16px' }}
            />
          </RowFixed>
          <RowBetween align="flex-end">
            <RowFixed gap="0px">
              <CurrencyLogo
                currency={tradeX?.outputAmount.currency}
                size="24px"
                style={{ marginRight: '12px' }}
              />
              <Text
                fontSize="24px"
                style={{ marginLeft: '10px', fontWeight: 500 }}
                color={
                  priceImpactSeverity > 2
                    ? theme.colors.failure
                    : showAcceptChanges &&
                      tradeX?.tradeType === TradeType.EXACT_INPUT
                    ? theme.colors.primary
                    : 'text'
                }
              >
                {tradeX?.outputAmount.toSignificant(6)}
              </Text>
            </RowFixed>
            <RowFixed gap="0px">
              <Text
                fontSize="24px"
                style={{ marginLeft: '10px', fontWeight: 500 }}
              >
                {tradeX?.outputAmount.currency.symbol}
              </Text>
            </RowFixed>
          </RowBetween>
        </>
      ) : (
        <>
          <RowBetween align="flex-end">
            <RowFixed gap="0px">
              <CurrencyLogo
                currency={trade.inputAmount.currency}
                size="24px"
                style={{ marginRight: '12px' }}
              />
              <Text
                fontSize="24px"
                color={
                  showAcceptChanges &&
                  trade.tradeType === TradeType.EXACT_OUTPUT
                    ? theme.colors.primary
                    : 'text'
                }
              >
                {trade.inputAmount.toSignificant(6)}
              </Text>
            </RowFixed>
            <RowFixed gap="0px">
              <Text
                fontSize="24px"
                style={{ marginLeft: '10px', fontWeight: 500 }}
              >
                {trade.inputAmount.currency.symbol}
              </Text>
            </RowFixed>
          </RowBetween>
          <RowFixed>
            <ArrowDown
              size="16"
              color={theme.colors.textSubtle}
              style={{ marginLeft: '4px', minWidth: '16px' }}
            />
          </RowFixed>
          <RowBetween align="flex-end">
            <RowFixed gap="0px">
              <CurrencyLogo
                currency={trade.outputAmount.currency}
                size="24px"
                style={{ marginRight: '12px' }}
              />
              <Text
                fontSize="24px"
                style={{ marginLeft: '10px', fontWeight: 500 }}
                color={
                  priceImpactSeverity > 2
                    ? theme.colors.failure
                    : showAcceptChanges &&
                      trade.tradeType === TradeType.EXACT_INPUT
                    ? theme.colors.primary
                    : 'text'
                }
              >
                {trade.outputAmount.toSignificant(6)}
              </Text>
            </RowFixed>
            <RowFixed gap="0px">
              <Text
                fontSize="24px"
                style={{ marginLeft: '10px', fontWeight: 500 }}
              >
                {trade.outputAmount.currency.symbol}
              </Text>
            </RowFixed>
          </RowBetween>
        </>
      )}
      {/* <RowBetween align="flex-end">
        <RowFixed gap="0px">
          <CurrencyLogo
            currency={trade.inputAmount.currency}
            size="24px"
            style={{ marginRight: '12px' }}
          />
          <Text
            fontSize="24px"
            color={
              showAcceptChanges && trade.tradeType === TradeType.EXACT_OUTPUT
                ? theme.colors.primary
                : 'text'
            }
          >
            {trade.inputAmount.toSignificant(6)}
          </Text>
        </RowFixed>
        <RowFixed gap="0px">
          <Text fontSize="24px" style={{ marginLeft: '10px', fontWeight: 500 }}>
            {trade.inputAmount.currency.symbol}
          </Text>
        </RowFixed>
      </RowBetween>
      <RowFixed>
        <ArrowDown
          size="16"
          color={theme.colors.textSubtle}
          style={{ marginLeft: '4px', minWidth: '16px' }}
        />
      </RowFixed>
      <RowBetween align="flex-end">
        <RowFixed gap="0px">
          <CurrencyLogo
            currency={trade.outputAmount.currency}
            size="24px"
            style={{ marginRight: '12px' }}
          />
          <Text
            fontSize="24px"
            style={{ marginLeft: '10px', fontWeight: 500 }}
            color={
              priceImpactSeverity > 2
                ? theme.colors.failure
                : showAcceptChanges && trade.tradeType === TradeType.EXACT_INPUT
                ? theme.colors.primary
                : 'text'
            }
          >
            {trade.outputAmount.toSignificant(6)}
          </Text>
        </RowFixed>
        <RowFixed gap="0px">
          <Text fontSize="24px" style={{ marginLeft: '10px', fontWeight: 500 }}>
            {trade.outputAmount.currency.symbol}
          </Text>
        </RowFixed>
      </RowBetween> */}
      {showAcceptChanges ? (
        <SwapShowAcceptChanges justify="flex-start" gap="0px">
          <RowBetween>
            <RowFixed>
              <AlertTriangle
                size={20}
                style={{ marginRight: '8px', minWidth: 24 }}
              />
              <Text color="primary"> Price Updated</Text>
            </RowFixed>
            <Button onClick={onAcceptChanges}>Accept</Button>
          </RowBetween>
        </SwapShowAcceptChanges>
      ) : null}
      {tradeX !== undefined && chainId !== crossChain ? (
        <>
          <AutoColumn
            justify="flex-start"
            gap="sm"
            style={{ padding: '16px 0 0' }}
          >
            {tradeX.tradeType === TradeType.EXACT_INPUT ? (
              <PriceInfoText>
                {storedLangCode === 'ko-KR' ? (
                  <>
                    <span>
                      {trade.inputAmount.currency.symbol}-
                      {trade.outputAmount.currency.symbol}-
                      {tradeX.outputAmount.currency.symbol}
                    </span>
                    {' 의 추정 교환값입니다. 수령하게 될 최소량은 '}
                    <span>
                      {tradeX?.outputAmount.toSignificant(6)}{' '}
                      {tradeX.outputAmount.currency.symbol}
                    </span>
                    {
                      ' 이며, 그렇지 않은 경우 거래가 취소됩니다. 수령하게 되는 KDAI 수량은 TaalSwap 브릿지의 타 블록체인 이동 시 발생하는 가격변동으로 인해 '
                    }
                    <span>
                      {tradeX?.outputAmount.toSignificant(6)}{' '}
                      {tradeX.outputAmount.currency.symbol}
                    </span>
                    {' 보다 조금 많거나 적을 수도 있습니다.'}
                  </>
                ) : (
                  <>
                    {'Output is the estimated exchange rate of '}
                    <span>
                      {trade.inputAmount.currency.symbol}-
                      {trade.outputAmount.currency.symbol}-
                      {tradeX.outputAmount.currency.symbol}
                    </span>
                    {'. '}
                    {'You will receive at least '}
                    <span>
                      {tradeX?.outputAmount.toSignificant(6)}{' '}
                      {tradeX.outputAmount.currency.symbol}
                    </span>

                    {
                      ', or the transaction will revert. The amount of KDAI you will get may slightly vary due to the price difference at the time of TaalSwap bridge &sbquo;s migration to other blockchain network.'
                    }
                  </>
                )}
              </PriceInfoText>
            ) : (
              <PriceInfoText>
                {t(`Input is estimated. You will sell at most `)}
                <span>
                  {slippageAdjustedAmounts[Field.INPUT]?.toSignificant(6)}{' '}
                  {trade.inputAmount.currency.symbol}
                </span>
                {t(' or the transaction will revert.')}
              </PriceInfoText>
            )}
          </AutoColumn>
        </>
      ) : (
        <>
          <AutoColumn
            justify="flex-start"
            gap="sm"
            style={{ padding: '16px 0 0' }}
          >
            {trade.tradeType === TradeType.EXACT_INPUT ? (
              <PriceInfoText>
                {tradeX !== undefined && chainId !== crossChain ? <></> : <></>}
                {t(`Output is estimated. You will receive at least `)}
                <span>
                  {slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(6)}{' '}
                  {trade.outputAmount.currency.symbol}
                </span>
                {t(' or the transaction will revert.')}
              </PriceInfoText>
            ) : (
              <PriceInfoText>
                {t(`Input is estimated. You will sell at most `)}
                <span>
                  {slippageAdjustedAmounts[Field.INPUT]?.toSignificant(6)}{' '}
                  {trade.inputAmount.currency.symbol}
                </span>
                {t(' or the transaction will revert.')}
              </PriceInfoText>
            )}
          </AutoColumn>
        </>
      )}
      {/* <AutoColumn justify="flex-start" gap="sm" style={{ padding: '16px 0 0' }}>
        {trade.tradeType === TradeType.EXACT_INPUT ? (
          <PriceInfoText>
            {tradeX !== undefined && chainId !== crossChain ? <></> : <></>}
            {t(`Output is estimated. You will receive at least `)}
            <span>
              {slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(6)}{' '}
              {trade.outputAmount.currency.symbol}
            </span>
            {t(' or the transaction will revert.')}
          </PriceInfoText>
        ) : (
          <PriceInfoText>
            {t(`Input is estimated. You will sell at most `)}
            <span>
              {slippageAdjustedAmounts[Field.INPUT]?.toSignificant(6)}{' '}
              {trade.inputAmount.currency.symbol}
            </span>
            {t(' or the transaction will revert.')}
          </PriceInfoText>
        )}
      </AutoColumn> */}
      {recipient !== null ? (
        <AutoColumn
          justify="flex-start"
          gap="sm"
          style={{ padding: '16px 0 0' }}
        >
          <Text>
            Output will be sent to{' '}
            <b title={recipient}>
              {isAddress(recipient) ? shortenAddress(recipient) : recipient}
            </b>
          </Text>
        </AutoColumn>
      ) : null}
    </AutoColumn>
  );
}

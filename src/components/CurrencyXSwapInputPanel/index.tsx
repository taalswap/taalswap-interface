import React, { useCallback, useEffect, useState } from 'react';
import { Currency, Pair } from 'taalswap-sdk';
import { Button, ChevronDownIcon, Text } from 'taalswap-uikit';
import styled from 'styled-components';
import { darken } from 'polished';
import useI18n from 'hooks/useI18n';
import NetworkSelector from 'components/NetworkSelector';
import CurrencySearchXSwapModal from 'components/SearchModal/CurrencySearchXSwapModal';
import { useCurrencyBalance } from '../../state/wallet/hooks';

import CurrencyLogo from '../CurrencyLogo';
import DoubleCurrencyLogo from '../DoubleLogo';
import { RowBetween } from '../Row';
import { Input as NumericalInput } from '../NumericalInput';
import { useActiveWeb3React } from '../../hooks';

import { useTranslation } from '../../contexts/Localization';

const InputRow = styled.div<{ selected: boolean }>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;

  padding: ${({ selected }) =>
    selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem'};

  // width: 100%;

  @media screen and (max-width: 500px) {
    padding: 0;
    justify-content: space-between;
  }
`;
const CurrencySelect = styled.button<{ selected: boolean }>`
  align-items: center;
  height: 34px;
  font-size: 16px;
  font-weight: 500;
  background-color: transparent;
  color: ${({ selected, theme }) => (selected ? theme.colors.text : '#FFFFFF')};
  border-radius: 12px;
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 0 0.5rem;

  :focus,
  :hover {
    background-color: ${({ theme }) => darken(0.05, theme.colors.input)};
  }

  @media screen and (max-width: 500px) {
    padding: 0;
  }
`;
const LabelRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;

  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.colors.textSubtle)};
  }

  @media screen and (max-width: 500px) {
    padding: 0;
  }
`;
const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const InputPanel = styled.div<{ hideInput?: boolean }>`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  background-color: ${({ theme }) => theme.colors.background};
  z-index: 1;
  width: 100%;
`;
const Container = styled.div<{ hideInput: boolean }>`
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.tertiary};
  // box-shadow: ${({ theme }) => theme.shadows.inset};
  border: 1px solid rgb(74 74 104 / 10%);
  padding: 24px 10px;

  @media screen and (max-width: 500px) {
    padding: 0.625rem;
  }
`;

const NumericalInputLine = styled(NumericalInput)`
  background-color: ${(props) =>
    props.disabled
      ? ({ theme }) => theme.colors.backgroundDisabled
      : ({ theme }) => theme.colors.background};
  @media screen and (max-width: 500px) {
    max-width: 160px;
    background-color: ${({ theme }) => theme.colors.tertiary};
    border-bottom: 1px solid ${({ theme }) => theme.colors.text};
  }
`;

interface CurrencyInputPanelProps {
  value: string;
  onUserInput: (value: string) => void;
  onMax?: () => void;
  showMaxButton: boolean;
  label?: string;
  onCurrencySelect?: (currency: Currency) => void;
  currency?: Currency | null;
  disableCurrencySelect?: boolean;
  hideBalance?: boolean;
  pair?: Pair | null;
  hideInput?: boolean;
  otherCurrency?: Currency | null;
  id: string;
  showCommonBases?: boolean;
  onSetCrossChain?: (crossChain: number) => void;
}

export default function CurrencyXSwapInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  label,
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  otherCurrency,
  onSetCrossChain,
  id,
  showCommonBases,
}: CurrencyInputPanelProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { account } = useActiveWeb3React();
  const selectedCurrencyBalance = useCurrencyBalance(
    account ?? undefined,
    currency ?? undefined
  );
  const { t } = useTranslation();
  const translatedLabel = label || t('Input');
  const handleDismissSearch = useCallback(() => {
    setModalOpen(false);
    window.localStorage.removeItem('xSwapCurrency');
  }, [setModalOpen]);

  const chainId = window.localStorage.getItem('chainId');
  const crossChain = window.localStorage.getItem('crossChain');

  return (
    <InputPanel id={id}>
      <Container hideInput={hideInput}>
        <NetworkSelector onSetCrossChain={onSetCrossChain} id={id} />
        {!hideInput && (
          <LabelRow>
            <RowBetween>
              <Text fontSize="14px">{translatedLabel}</Text>
              {account && (
                <Text
                  onClick={onMax}
                  fontSize="14px"
                  style={{ display: 'inline', cursor: 'pointer' }}
                >
                  {!hideBalance && !!currency && selectedCurrencyBalance
                    ? `${t(
                        'Balance'
                      )}: ${selectedCurrencyBalance?.toSignificant(6)}`
                    : ' -'}
                </Text>
              )}
            </RowBetween>
          </LabelRow>
        )}
        <InputRow
          style={
            hideInput
              ? { padding: '0', borderRadius: '8px' }
              : { marginTop: '10px' }
          }
          selected={disableCurrencySelect}
        >
          {!hideInput && (
            <>
              <NumericalInputLine
                className="token-amount-input"
                value={value}
                onUserInput={(val) => {
                  onUserInput(val);
                }}
                disabled={
                  id === 'swap-currency-output' && chainId !== crossChain
                }
                style={{}}
              />
              {account && currency && showMaxButton && label !== 'To' && (
                <Button
                  onClick={onMax}
                  scale="sm"
                  variant="text"
                  style={{ color: '#1890FF' }}
                >
                  {t('Max')}
                </Button>
              )}
            </>
          )}
          <CurrencySelect
            selected={!!currency}
            className="open-currency-select-button"
            onClick={() => {
              if (!disableCurrencySelect) {
                window.localStorage.setItem(
                  'xSwapCurrency',
                  id === 'swap-currency-input' ? 'input' : 'output'
                );
                setModalOpen(true);
              }
            }}
          >
            <Aligner>
              {pair ? (
                <DoubleCurrencyLogo
                  currency0={pair.token0}
                  currency1={pair.token1}
                  size={16}
                  margin
                />
              ) : currency ? (
                <CurrencyLogo
                  currency={currency}
                  size="24px"
                  style={{ marginRight: '8px' }}
                />
              ) : null}
              {pair ? (
                <Text id="pair">
                  {pair?.token0.symbol}:{pair?.token1.symbol}
                </Text>
              ) : (
                <Text id="pair">
                  {(currency && currency.symbol && currency.symbol.length > 20
                    ? `${currency.symbol.slice(0, 4)}...${currency.symbol.slice(
                        currency.symbol.length - 5,
                        currency.symbol.length
                      )}`
                    : currency?.symbol) || t('Select a token')}
                </Text>
              )}
              {!disableCurrencySelect && <ChevronDownIcon />}
            </Aligner>
          </CurrencySelect>
        </InputRow>
      </Container>
      {!disableCurrencySelect && onCurrencySelect && (
        <CurrencySearchXSwapModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
          otherSelectedCurrency={otherCurrency}
          showCommonBases={showCommonBases}
          id={id}
        />
      )}
    </InputPanel>
  );
}

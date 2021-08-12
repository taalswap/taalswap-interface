import { CurrencyAmount, JSBI, Token, Trade } from 'taalswap-sdk';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';
import { useTranslation } from 'contexts/Localization';
import { ArrowDown } from 'react-feather';
import {
  Card as UICard,
  CardBody,
  ArrowDownIcon,
  ArrowForwardIcon,
  Button,
  IconButton,
  Text,
  useModal,
  Link,
  Flex,
  useMatchBreakpoints,
} from 'taalswap-uikit';
import { RouteComponentProps } from 'react-router-dom';
import styled, { ThemeContext } from 'styled-components';
import AddressInputPanel from 'components/AddressInputPanel';
import Card, { GreyCard } from 'components/Card';
import { AutoColumn } from 'components/Column';
import ConfirmSwapModal from 'components/swap/ConfirmSwapModal';
import CurrencyInputPanel from 'components/CurrencyInputPanel';
import CardNav from 'components/CardNav';
import { AutoRow, RowBetween } from 'components/Row';
import AdvancedSwapDetailsDropdown from 'components/swap/AdvancedSwapDetailsDropdown';
import confirmPriceImpactWithoutFee from 'components/swap/confirmPriceImpactWithoutFee';
import {
  ArrowWrapper,
  BottomGrouping,
  SwapCallbackError,
  Wrapper,
} from 'components/swap/styleds';
import TradePrice from 'components/swap/TradePrice';
import TokenWarningModal from 'components/TokenWarningModal';
import SyrupWarningModal from 'components/SyrupWarningModal';
import SafeMoonWarningModal from 'components/SafeMoonWarningModal';
import ProgressSteps from 'components/ProgressSteps';
import Container from 'components/Container';

import { INITIAL_ALLOWED_SLIPPAGE } from 'constants/index';
import { useActiveWeb3React } from 'hooks';
import { useCurrency } from 'hooks/Tokens';
import {
  ApprovalState,
  useApproveCallbackFromTrade,
} from 'hooks/useApproveCallback';
import { useSwapCallback } from 'hooks/useSwapCallback';
import useWrapCallback, { WrapType } from 'hooks/useWrapCallback';
import { Field } from 'state/swap/actions';
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
} from 'state/swap/hooks';
import {
  useExpertModeManager,
  useUserDeadline,
  useUserSlippageTolerance,
} from 'state/user/hooks';
import { LinkStyledButton } from 'components/Shared';
import { maxAmountSpend } from 'utils/maxAmountSpend';
import { computeTradePriceBreakdown, warningSeverity } from 'utils/prices';
import Loader from 'components/Loader';
import useI18n from 'hooks/useI18n';
import PageHeader from 'components/PageHeader';
import ConnectWalletButton from 'components/ConnectWalletButton';
import V2ExchangeRedirectModal from 'components/V2ExchangeRedirectModal';
import AppBody from '../AppBody';
import Teaser from '../LandingPageView/Teaser_page';

// const CACHE_KEY = 'pancakeswap_language';
const CACHE_KEY = 'taalswap_language';

const StyledLink = styled(Link)`
  display: inline;
  color: ${({ theme }) => theme.colors.failure};
`;

const SwapBody = styled(UICard)`
  position: relative;
  max-width: 900px;
  width: 100%;
  z-index: 5;
`;

const InputPanelBody = styled.div`
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
  // width: 100%;
`;

// const Swap = () => {
function Swap({
  match: {
    params: { currencyIdA, currencyIdB },
  },
  history,
}: RouteComponentProps<{ currencyIdA?: string; currencyIdB?: string }>) {
  const { isSm, isXs, isMd } = useMatchBreakpoints();
  const currencyA = useCurrency(currencyIdA);
  const currencyB = useCurrency(currencyIdB);
  const [currencyAFlag, setCurrencyAFlag] = useState(currencyA !== undefined);
  const [currencyBFlag, setCurrencyBFlag] = useState(currencyB !== undefined);
  const { t } = useTranslation();
  const storedLangCode = localStorage.getItem(CACHE_KEY);
  const loadedUrlParams = useDefaultsFromURLSearch();
  const [modalCountdownSecondsRemaining, setModalCountdownSecondsRemaining] =
    useState(5);
  const [disableSwap, setDisableSwap] = useState(false);
  const [hasPoppedModal, setHasPoppedModal] = useState(false);
  const [interruptRedirectCountdown, setInterruptRedirectCountdown] =
    useState(false);
  const [onPresentV2ExchangeRedirectModal] = useModal(
    <V2ExchangeRedirectModal
      handleCloseModal={() => setInterruptRedirectCountdown(true)}
    />
  );
  const onPresentV2ExchangeRedirectModalRef = useRef(
    onPresentV2ExchangeRedirectModal
  );
  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ];
  const [dismissTokenWarning, setDismissTokenWarning] =
    useState<boolean>(false);
  const [transactionWarning, setTransactionWarning] = useState<{
    selectedToken: string | null;
    purchaseType: string | null;
  }>({
    selectedToken: null,
    purchaseType: null,
  });
  const urlLoadedTokens: Token[] = useMemo(
    () =>
      [loadedInputCurrency, loadedOutputCurrency]?.filter(
        (c): c is Token => c instanceof Token
      ) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  );
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true);
  }, []);

  const handleConfirmWarning = () => {
    setTransactionWarning({
      selectedToken: null,
      purchaseType: null,
    });
  };

  const { account } = useActiveWeb3React();
  const theme = useContext(ThemeContext);

  const [isExpertMode] = useExpertModeManager();

  // get custom setting values for user
  const [deadline] = useUserDeadline();
  const [allowedSlippage] = useUserSlippageTolerance();

  // swap state
  const { independentField, typedValue, recipient } = useSwapState();
  const {
    v2Trade,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError,
  } = useDerivedSwapInfo(currencyA ?? undefined, currencyB ?? undefined);
  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT],
    typedValue
  );
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE;
  const trade = showWrap ? undefined : v2Trade;

  // Manage disabled trading pairs that should redirect users to V2
  useEffect(() => {
    const disabledSwaps = [
      // 'BNB',
      // 'BUSD',
      // 'USDT',
      // 'USDC',
      // 'CAKE',
      // 'BUNNY',
      // 'ETH',
      // 'BTCB',
      // 'AUTO',
      // 'XVS',
      'NULL',
    ];
    const inputCurrencySymbol = currencies[Field.INPUT]?.symbol || '';
    const outputCurrencySymbol = currencies[Field.OUTPUT]?.symbol || '';
    const doesInputMatch = disabledSwaps.includes(inputCurrencySymbol);
    const doesOutputMatch = disabledSwaps.includes(outputCurrencySymbol);

    if (doesInputMatch && doesOutputMatch) {
      // Prevent infinite re-render of modal with this condition
      if (!hasPoppedModal) {
        setHasPoppedModal(true);
        onPresentV2ExchangeRedirectModalRef.current();
      }

      // Controls the swap buttons being disabled & renders a message
      setDisableSwap(true);

      const tick = () => {
        setModalCountdownSecondsRemaining((prevSeconds) => prevSeconds - 1);
      };
      const timerInterval = setInterval(() => tick(), 1000);

      if (interruptRedirectCountdown) {
        // Reset timer if countdown is interrupted
        clearInterval(timerInterval);
        setModalCountdownSecondsRemaining(5);
      }

      if (modalCountdownSecondsRemaining <= 0) {
        window.location.href = 'https://swap.taalswap.finance/#/swap';
      }

      return () => {
        clearInterval(timerInterval);
      };
    }

    // Unset disableSwap state if the swap inputs & outputs dont match disabledSwaps
    setDisableSwap(false);
    return undefined;
  }, [
    currencies,
    hasPoppedModal,
    modalCountdownSecondsRemaining,
    onPresentV2ExchangeRedirectModalRef,
    interruptRedirectCountdown,
  ]);

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        [Field.INPUT]:
          independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]:
          independentField === Field.OUTPUT
            ? parsedAmount
            : trade?.outputAmount,
      };

  const {
    onSwitchTokens,
    onCurrencySelection,
    onUserInput,
    onChangeRecipient,
  } = useSwapActionHandlers();
  const isValid = !swapInputError;
  const dependentField: Field =
    independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value);
    },
    [onUserInput]
  );
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value);
    },
    [onUserInput]
  );

  useEffect(() => {
    if (currencyAFlag && currencyA !== undefined && currencyA !== null) {
      setCurrencyAFlag(false);
      onCurrencySelection(Field.INPUT, currencyA);
    }

    if (currencyBFlag && currencyB !== undefined && currencyB !== null) {
      setCurrencyBFlag(false);
      onCurrencySelection(Field.OUTPUT, currencyB);
    }
  }, [currencyAFlag, currencyBFlag, currencyA, currencyB, onCurrencySelection]);
  // if (currencyA !== null && currencyA !== undefined) {
  //   onCurrencySelection(Field.INPUT, currencyA);
  // }

  // if (currencyB !== null && currencyB !== undefined) {
  //   onCurrencySelection(Field.OUTPUT, currencyA);
  // }

  // modal and loading
  const [
    { showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash },
    setSwapState,
  ] = useState<{
    showConfirm: boolean;
    tradeToConfirm: Trade | undefined;
    attemptingTxn: boolean;
    swapErrorMessage: string | undefined;
    txHash: string | undefined;
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  });

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  };

  const route = trade?.route;
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] &&
      currencies[Field.OUTPUT] &&
      parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  );
  const noRoute = !route;

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(
    trade,
    allowedSlippage
  );

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false);

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true);
    }
  }, [approval, approvalSubmitted]);

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(
    currencyBalances[Field.INPUT]
  );
  const atMaxAmountInput = Boolean(
    maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput)
  );

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    trade,
    allowedSlippage,
    deadline,
    recipient
  );

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade);

  const handleSwap = useCallback(() => {
    if (
      priceImpactWithoutFee &&
      !confirmPriceImpactWithoutFee(priceImpactWithoutFee, storedLangCode)
    ) {
      return;
    }
    if (!swapCallback) {
      return;
    }
    setSwapState((prevState) => ({
      ...prevState,
      attemptingTxn: true,
      swapErrorMessage: undefined,
      txHash: undefined,
    }));
    swapCallback()
      .then((hash) => {
        setSwapState((prevState) => ({
          ...prevState,
          attemptingTxn: false,
          swapErrorMessage: undefined,
          txHash: hash,
        }));
      })
      .catch((error) => {
        setSwapState((prevState) => ({
          ...prevState,
          attemptingTxn: false,
          swapErrorMessage: error.message,
          txHash: undefined,
        }));
      });
  }, [priceImpactWithoutFee, swapCallback, setSwapState, storedLangCode]);

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false);

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee);

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode);

  const handleConfirmDismiss = useCallback(() => {
    setSwapState((prevState) => ({ ...prevState, showConfirm: false }));

    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '');
    }
  }, [onUserInput, txHash, setSwapState]);

  const handleAcceptChanges = useCallback(() => {
    setSwapState((prevState) => ({ ...prevState, tradeToConfirm: trade }));
  }, [trade]);

  // This will check to see if the user has selected Syrup or SafeMoon to either buy or sell.
  // If so, they will be alerted with a warning message.
  const checkForWarning = useCallback(
    (selected: string, purchaseType: string) => {
      if (['SYRUP', 'SAFEMOON'].includes(selected)) {
        setTransactionWarning({
          selectedToken: selected,
          purchaseType,
        });
      }
    },
    [setTransactionWarning]
  );

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      setCurrencyAFlag(false);
      setHasPoppedModal(false);
      setInterruptRedirectCountdown(false);
      setApprovalSubmitted(false); // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency);
      console.log(inputCurrency);
      if (inputCurrency.symbol === 'SYRUP') {
        checkForWarning(inputCurrency.symbol, 'Selling');
      }
      if (inputCurrency.symbol === 'SAFEMOON') {
        checkForWarning(inputCurrency.symbol, 'Selling');
      }
    },
    [onCurrencySelection, setApprovalSubmitted, checkForWarning]
  );

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact());
    }
  }, [maxAmountInput, onUserInput]);

  const handleOutputSelect = useCallback(
    (outputCurrency) => {
      setCurrencyBFlag(false);
      setHasPoppedModal(false);
      setInterruptRedirectCountdown(false);
      onCurrencySelection(Field.OUTPUT, outputCurrency);
      if (outputCurrency.symbol === 'SYRUP') {
        checkForWarning(outputCurrency.symbol, 'Buying');
      }
      if (outputCurrency.symbol === 'SAFEMOON') {
        checkForWarning(outputCurrency.symbol, 'Buying');
      }
    },
    [onCurrencySelection, checkForWarning]
  );

  return (
    <Container>
      {/* <Teaser /> */}
      <TokenWarningModal
        isOpen={urlLoadedTokens.length > 0 && !dismissTokenWarning}
        tokens={urlLoadedTokens}
        onConfirm={handleConfirmTokenWarning}
      />
      <SyrupWarningModal
        isOpen={transactionWarning.selectedToken === 'SYRUP'}
        transactionType={transactionWarning.purchaseType}
        onConfirm={handleConfirmWarning}
      />
      <SafeMoonWarningModal
        isOpen={transactionWarning.selectedToken === 'SAFEMOON'}
        onConfirm={handleConfirmWarning}
      />
      {/* <CardNav /> */}
      <SwapBody>
        <Wrapper id="swap-page">
          <ConfirmSwapModal
            isOpen={showConfirm}
            trade={trade}
            originalTrade={tradeToConfirm}
            onAcceptChanges={handleAcceptChanges}
            attemptingTxn={attemptingTxn}
            txHash={txHash}
            recipient={recipient}
            allowedSlippage={allowedSlippage}
            onConfirm={handleSwap}
            swapErrorMessage={swapErrorMessage}
            onDismiss={handleConfirmDismiss}
          />
          <PageHeader
            title={t('Swap')}
            description={t('Trade your token on the spot')}
          />

          <CardBody>
            <InputPanelBody>
              <CurrencyInputPanel
                label={
                  independentField === Field.OUTPUT && !showWrap && trade
                    ? t('From (estimated)')
                    : t('From')
                }
                value={formattedAmounts[Field.INPUT]}
                showMaxButton={!atMaxAmountInput}
                // currency={currencies[Field.INPUT]}
                currency={currencyAFlag ? currencyA : currencies[Field.INPUT]}
                onUserInput={handleTypeInput}
                onMax={handleMaxInput}
                onCurrencySelect={handleInputSelect}
                otherCurrency={currencies[Field.OUTPUT]}
                id="swap-currency-input"
              />
              <AutoColumn
                justify="space-between"
                style={{ margin: '0px 10px' }}
              >
                <AutoRow
                  justify={isExpertMode ? 'space-between' : 'center'}
                  style={{ padding: '0 1rem' }}
                >
                  <ArrowWrapper clickable>
                    <IconButton
                      variant="tertiary"
                      onClick={() => {
                        setApprovalSubmitted(false); // reset 2 step UI for approvals
                        onSwitchTokens();
                        console.log('-----');
                      }}
                      style={{ borderRadius: '50%' }}
                      scale="sm"
                    >
                      {isXs || isSm || isMd ? (
                        <ArrowDownIcon color="#00ab55" width="24px" />
                      ) : (
                        <ArrowForwardIcon color="#00ab55" width="24px" />
                      )}
                    </IconButton>
                  </ArrowWrapper>
                  {recipient === null && !showWrap && isExpertMode ? (
                    <LinkStyledButton
                      id="add-recipient-button"
                      onClick={() => onChangeRecipient('')}
                    >
                      + Add a send (optional)
                    </LinkStyledButton>
                  ) : null}
                </AutoRow>
              </AutoColumn>
              <CurrencyInputPanel
                value={formattedAmounts[Field.OUTPUT]}
                onUserInput={handleTypeOutput}
                label={
                  independentField === Field.INPUT && !showWrap && trade
                    ? t('To (estimated)')
                    : t('To')
                }
                showMaxButton={false}
                // currency={currencies[Field.OUTPUT]}
                currency={currencyBFlag ? currencyB : currencies[Field.OUTPUT]}
                onCurrencySelect={handleOutputSelect}
                otherCurrency={currencies[Field.INPUT]}
                id="swap-currency-output"
              />
            </InputPanelBody>
            {recipient !== null && !showWrap ? (
              <>
                <AutoRow justify="space-between">
                  <ArrowWrapper clickable={false}>
                    <ArrowDown size="16" color={theme.colors.textSubtle} />
                  </ArrowWrapper>
                  <LinkStyledButton
                    id="remove-recipient-button"
                    onClick={() => onChangeRecipient(null)}
                  >
                    - Remove send
                  </LinkStyledButton>
                </AutoRow>
                <AddressInputPanel
                  id="recipient"
                  value={recipient}
                  onChange={onChangeRecipient}
                />
              </>
            ) : null}

            {showWrap ? null : (
              <Card
                style={{
                  marginTop: '1rem',
                  padding: '.25rem .75rem 0 .75rem',
                  borderRadius: '20px',
                }}
              >
                <AutoColumn gap="4px">
                  {Boolean(trade) && (
                    <RowBetween align="center">
                      <Text fontSize="14px">{t('Price')}</Text>
                      <TradePrice
                        price={trade?.executionPrice}
                        showInverted={showInverted}
                        setShowInverted={setShowInverted}
                      />
                    </RowBetween>
                  )}
                  {allowedSlippage !== INITIAL_ALLOWED_SLIPPAGE && (
                    <RowBetween align="center">
                      <Text fontSize="14px">{t('Slippage Tolerance')}</Text>
                      <Text fontSize="14px">{allowedSlippage / 100}%</Text>
                    </RowBetween>
                  )}
                </AutoColumn>
              </Card>
            )}

            {trade !== undefined ? (
              <AdvancedSwapDetailsDropdown trade={trade} />
            ) : null}

            <BottomGrouping>
              {disableSwap && (
                <Flex alignItems="center" justifyContent="center" mb="1rem">
                  <Text color="failure">
                    Please use{' '}
                    <StyledLink external href="https://swap.taalswap.finance">
                      PancakeSwap V2
                    </StyledLink>{' '}
                    to make this trade
                  </Text>
                </Flex>
              )}
              {!account ? (
                <ConnectWalletButton width="100%" />
              ) : showWrap ? (
                <Button
                  disabled={Boolean(wrapInputError)}
                  onClick={onWrap}
                  width="100%"
                >
                  {wrapInputError ??
                    (wrapType === WrapType.WRAP
                      ? 'Wrap'
                      : wrapType === WrapType.UNWRAP
                      ? 'Unwrap'
                      : null)}
                </Button>
              ) : noRoute && userHasSpecifiedInputOutput ? (
                <GreyCard style={{ textAlign: 'center' }}>
                  <Text mb="4px">
                    {t('Insufficient liquidity for this trade.')}
                  </Text>
                </GreyCard>
              ) : showApproveFlow ? (
                <RowBetween>
                  <Button
                    onClick={approveCallback}
                    disabled={
                      disableSwap ||
                      approval !== ApprovalState.NOT_APPROVED ||
                      approvalSubmitted
                    }
                    style={{ width: '48%' }}
                    variant={
                      approval === ApprovalState.APPROVED
                        ? 'success'
                        : 'primary'
                    }
                  >
                    {approval === ApprovalState.PENDING ? (
                      <AutoRow gap="6px" justify="center">
                        {t('Approving')} <Loader stroke="white" />
                      </AutoRow>
                    ) : approvalSubmitted &&
                      approval === ApprovalState.APPROVED ? (
                      t('Approved')
                    ) : storedLangCode === 'ko-KR' ? (
                      t(`${currencies[Field.INPUT]?.symbol} ${t('Approve')}`)
                    ) : (
                      t(`${t('Approve')} ${currencies[Field.INPUT]?.symbol}`)
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      if (isExpertMode) {
                        handleSwap();
                      } else {
                        setSwapState({
                          tradeToConfirm: trade,
                          attemptingTxn: false,
                          swapErrorMessage: undefined,
                          showConfirm: true,
                          txHash: undefined,
                        });
                      }
                    }}
                    style={{ width: '48%' }}
                    id="swap-button"
                    disabled={
                      disableSwap ||
                      !isValid ||
                      approval !== ApprovalState.APPROVED ||
                      (priceImpactSeverity > 3 && !isExpertMode)
                    }
                    variant={
                      isValid && priceImpactSeverity > 2 ? 'danger' : 'primary'
                    }
                  >
                    {priceImpactSeverity > 3 && !isExpertMode
                      ? t('Price Impact Too High')
                      : // : `Swap${priceImpactSeverity > 2 ? ' Anyway' : ''}`}
                      priceImpactSeverity > 2
                      ? t('Swap Anyway')
                      : t('Swap')}
                  </Button>
                </RowBetween>
              ) : (
                <Button
                  onClick={() => {
                    if (isExpertMode) {
                      handleSwap();
                    } else {
                      setSwapState({
                        tradeToConfirm: trade,
                        attemptingTxn: false,
                        swapErrorMessage: undefined,
                        showConfirm: true,
                        txHash: undefined,
                      });
                    }
                  }}
                  id="swap-button"
                  disabled={
                    disableSwap ||
                    !isValid ||
                    (priceImpactSeverity > 3 && !isExpertMode) ||
                    !!swapCallbackError
                  }
                  variant={
                    isValid && priceImpactSeverity > 2 && !swapCallbackError
                      ? 'danger'
                      : 'primary'
                  }
                  width="100%"
                >
                  {swapInputError ||
                    (priceImpactSeverity > 3 && !isExpertMode
                      ? t(`Price Impact Too High`)
                      : //  : `Swap${priceImpactSeverity > 2 ? ' Anyway' : ''}`)}

                      priceImpactSeverity > 2
                      ? t('Swap Anyway')
                      : t('Swap'))}
                </Button>
              )}
              {showApproveFlow && (
                <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
              )}
              {isExpertMode && swapErrorMessage ? (
                <SwapCallbackError error={swapErrorMessage} />
              ) : null}
            </BottomGrouping>
          </CardBody>
        </Wrapper>
      </SwapBody>
      {/* <AdvancedSwapDetailsDropdown trade={trade} /> */}
    </Container>
  );
}

export default Swap;

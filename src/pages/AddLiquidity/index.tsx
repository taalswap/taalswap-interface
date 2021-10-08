import React, { useCallback, useState } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { TransactionResponse } from '@ethersproject/providers';
import {
  ChainId,
  Currency,
  currencyEquals,
  ETHER,
  KLAYTN,
  TokenAmount,
  WETH,
} from 'taalswap-sdk';
import styled from 'styled-components';
import {
  AddIcon,
  Button,
  CardBody,
  Text as UIKitText,
  Card as UICard,
} from 'taalswap-uikit';
import { RouteComponentProps } from 'react-router-dom';
import { LightCard } from 'components/Card';
import { AutoColumn, ColumnCenter } from 'components/Column';
import TransactionConfirmationModal, {
  ConfirmationModalContent,
} from 'components/TransactionConfirmationModal';
import CurrencyInputPanel from 'components/CurrencyInputPanel';
import DoubleCurrencyLogo from 'components/DoubleLogo';
import { AddRemoveTabs } from 'components/NavigationTabs';
import { MinimalPositionCard } from 'components/PositionCard';
import Row, { RowBetween, RowFlat } from 'components/Row';

import { PairState } from 'data/Reserves';
import { useActiveWeb3React } from 'hooks';
import { useCurrency } from 'hooks/Tokens';
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback';
import { Field } from 'state/mint/actions';
import {
  useDerivedMintInfo,
  useMintActionHandlers,
  useMintState,
} from 'state/mint/hooks';

import { useTransactionAdder } from 'state/transactions/hooks';
import {
  useIsExpertMode,
  useUserDeadline,
  useUserSlippageTolerance,
} from 'state/user/hooks';
import {
  calculateGasMargin,
  calculateSlippageAmount,
  getRouterContract,
} from 'utils';
import PageHeader from 'components/PageHeader';
import { maxAmountSpend } from 'utils/maxAmountSpend';
import { wrappedCurrency } from 'utils/wrappedCurrency';
import { currencyId } from 'utils/currencyId';
import Pane from 'components/Pane';
import Container from 'components/Container';
import ConnectWalletButton from 'components/ConnectWalletButton';
import AppBody from '../AppBody';
import { Dots, Wrapper } from '../Pool/styleds';
import { ConfirmAddModalBottom } from './ConfirmAddModalBottom';
import { PoolPriceBar } from './PoolPriceBar';
import { ROUTER_ADDRESS } from '../../constants';
import { useTranslation } from '../../contexts/Localization';
import getRouterAddress from '../../utils/getRouterAddress';
import resetXswap from '../../utils/resetXswap';

// const CACHE_KEY = 'pancakeswap_language';
const CACHE_KEY = 'taalswap_language';

const AddLiquidetyBody = styled(UICard)`
  position: relative;
  max-width: 1070px;
  width: 100%;
  z-index: 5;

`;

const InputPanelBody = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }

  @media screen and (max-width: 500px) {
    margin-bottom: 1rem;
  }
  
`;

const CardBodyWrap = styled(CardBody)`

  @media screen and (max-width: 500px) {
    display: flex;
    justify-content: center;
    padding: 0.75rem 0.875rem;
   
  }
`;

const AutoColumnPanel = styled(AutoColumn)`
  
  @media screen and (max-width: 500px) {
    width:100%;
    display:block;
  }

`;


const CurrencyIconPanel = styled.div`
  display:inline-block;

  @media screen and (max-width: 500px) {
    display:flex;
    justify-content: center;
    align-items: center;
    position:relative;
    width: 100%;
    z-index:10;
    margin-top:20px;
  }
`;

const AddIconBox = styled(AddIcon)`
  
  border: 1px solid transparent;
  background-color: #F3F5F7;

  @media screen and (max-width: 500px) {
    border: 1px solid #ddd;
    position: absolute;
    top:-40px;
  }
`;

const PaneWrap = styled(Pane)`


  @media screen and (max-width: 500px) {
    padding: 0;
  }
`;

const AutoColumnWrap = styled(AutoColumn)`

    @media screen and (max-width: 500px) {
      margin-top:0 !important;
      min-width:100% !important;

    }
`;

const AutoButtonColumn = styled(AutoColumn)`

  @media screen and (max-width: 500px) {
    padding-top:20px;
    padding-bottom:20px;
  }
`;

const ColumnAlertCenter = styled(ColumnCenter)`

  @media screen and (max-width: 500px) {
    margin-bottom: 1rem;
  }
`;

export default function AddLiquidity({
  match: {
    params: { currencyIdA, currencyIdB },
  },
  history,
}: RouteComponentProps<{ currencyIdA?: string; currencyIdB?: string }>) {
  resetXswap();
  const { account, chainId, library } = useActiveWeb3React();
  const currencyA = useCurrency(currencyIdA);
  const currencyB = useCurrency(currencyIdB);
  const { t } = useTranslation();
  const storedLangCode = localStorage.getItem(CACHE_KEY);
  const curChainId = localStorage.getItem('chainId');

  const oneCurrencyIsWBNB = Boolean(
    chainId &&
      ((currencyA && currencyEquals(currencyA, WETH[chainId])) ||
        (currencyB && currencyEquals(currencyB, WETH[chainId])))
  );
  const expertMode = useIsExpertMode();

  let ethStr;
  switch (chainId) {
    case ChainId.MAINNET:
    case ChainId.ROPSTEN:
    case ChainId.RINKEBY:
      ethStr = 'ETH';
      break;
    case ChainId.KLAYTN:
    case ChainId.BAOBAB:
      ethStr = 'KLAY';
      break;
  }

  // mint state
  const { independentField, typedValue, otherTypedValue } = useMintState();
  const {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error,
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined);
  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity);

  const isValid = !error;

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false); // clicked confirm

  // txn values
  const [deadline] = useUserDeadline(); // custom from users settings
  const [allowedSlippage] = useUserSlippageTolerance(); // custom from users
  const [txHash, setTxHash] = useState<string>('');

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: noLiquidity
      ? otherTypedValue
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  };

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: TokenAmount } = [
    Field.CURRENCY_A,
    Field.CURRENCY_B,
  ].reduce((accumulator, field) => {
    return {
      ...accumulator,
      [field]: maxAmountSpend(currencyBalances[field]),
    };
  }, {});

  const atMaxAmounts: { [field in Field]?: TokenAmount } = [
    Field.CURRENCY_A,
    Field.CURRENCY_B,
  ].reduce((accumulator, field) => {
    return {
      ...accumulator,
      [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? '0'),
    };
  }, {});

  const routerAddress = getRouterAddress(chainId);

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(
    parsedAmounts[Field.CURRENCY_A],
    routerAddress
  );
  const [approvalB, approveBCallback] = useApproveCallback(
    parsedAmounts[Field.CURRENCY_B],
    routerAddress
  );

  const addTransaction = useTransactionAdder();

  async function onAdd() {
    if (!chainId || !library || !account) return;
    const router = getRouterContract(chainId, library, account);

    const {
      [Field.CURRENCY_A]: parsedAmountA,
      [Field.CURRENCY_B]: parsedAmountB,
    } = parsedAmounts;
    if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB) {
      return;
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(
        parsedAmountA,
        noLiquidity ? 0 : allowedSlippage
      )[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(
        parsedAmountB,
        noLiquidity ? 0 : allowedSlippage
      )[0],
    };

    const deadlineFromNow = Math.ceil(Date.now() / 1000) + deadline;

    let estimate;
    let method: (...args: any) => Promise<TransactionResponse>;
    let args: Array<string | string[] | number>;
    let value: BigNumber | null;
    if (
      currencyA === ETHER ||
      currencyA === KLAYTN ||
      currencyB === ETHER ||
      currencyB === KLAYTN
    ) {
      const tokenBIsBNB = currencyB === ETHER || currencyB === KLAYTN;
      estimate = router.estimateGas.addLiquidityETH;
      method = router.addLiquidityETH;
      args = [
        wrappedCurrency(tokenBIsBNB ? currencyA : currencyB, chainId)
          ?.address ?? '', // token
        (tokenBIsBNB ? parsedAmountA : parsedAmountB).raw.toString(), // token desired
        amountsMin[
          tokenBIsBNB ? Field.CURRENCY_A : Field.CURRENCY_B
        ].toString(), // token min
        amountsMin[
          tokenBIsBNB ? Field.CURRENCY_B : Field.CURRENCY_A
        ].toString(), // eth min
        account,
        deadlineFromNow,
      ];
      value = BigNumber.from(
        (tokenBIsBNB ? parsedAmountB : parsedAmountA).raw.toString()
      );
    } else {
      estimate = router.estimateGas.addLiquidity;
      method = router.addLiquidity;
      args = [
        wrappedCurrency(currencyA, chainId)?.address ?? '',
        wrappedCurrency(currencyB, chainId)?.address ?? '',
        parsedAmountA.raw.toString(),
        parsedAmountB.raw.toString(),
        amountsMin[Field.CURRENCY_A].toString(),
        amountsMin[Field.CURRENCY_B].toString(),
        account,
        deadlineFromNow,
      ];
      value = null;
    }

    setAttemptingTxn(true);
    // const aa = await estimate(...args, value ? { value } : {})
    await estimate(...args, value ? { value } : {})
      .then((estimatedGasLimit) =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit),
        }).then((response) => {
          setAttemptingTxn(false);

          addTransaction(response, {
            summary:
              storedLangCode === 'ko-KR'
                ? `${parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)} ${
                    currencies[Field.CURRENCY_A]?.symbol
                  }${t('Aand')} ${parsedAmounts[
                    Field.CURRENCY_B
                  ]?.toSignificant(3)} ${
                    currencies[Field.CURRENCY_B]?.symbol
                  }${t('AddB')}`
                : `Add ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)} ${
                    currencies[Field.CURRENCY_A]?.symbol
                  } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)} ${
                    currencies[Field.CURRENCY_B]?.symbol
                  }`,
          });

          setTxHash(response.hash);
        })
      )
      .catch((e) => {
        setAttemptingTxn(false);
        // we only care if the error is something _other_ than the user rejected the tx
        if (e?.code !== 4001) {
          console.error(e);
        }
      });
  }

  const modalHeader = () => {
    return noLiquidity ? (
      <AutoColumn gap="20px">
        <LightCard mt="20px" borderRadius="20px">
          <RowFlat>
            <UIKitText fontSize="48px" mr="8px">
              {`${currencies[Field.CURRENCY_A]?.symbol}/${
                currencies[Field.CURRENCY_B]?.symbol
              }`}
            </UIKitText>
            <DoubleCurrencyLogo
              currency0={currencies[Field.CURRENCY_A]}
              currency1={currencies[Field.CURRENCY_B]}
              size={30}
            />
          </RowFlat>
        </LightCard>
      </AutoColumn>
    ) : (
      <AutoColumn gap="20px">
        <RowFlat style={{ marginTop: '20px' }}>
          <UIKitText fontSize="48px" mr="8px">
            {liquidityMinted?.toSignificant(6)}
          </UIKitText>
          <DoubleCurrencyLogo
            currency0={currencies[Field.CURRENCY_A]}
            currency1={currencies[Field.CURRENCY_B]}
            size={30}
          />
        </RowFlat>
        <Row>
          <UIKitText fontSize="24px">
            {`${currencies[Field.CURRENCY_A]?.symbol}/${
              currencies[Field.CURRENCY_B]?.symbol
            } Pool Tokens`}
          </UIKitText>
        </Row>
        <UIKitText
          small
          textAlign="left"
          padding="8px 0 0 0 "
          style={{ fontStyle: 'italic' }}
        >
          {`${t('Output is estimated. If the price changes by more than')} ${
            allowedSlippage / 100
          }${t('% your transaction will revert.')}`}
        </UIKitText>
      </AutoColumn>
    );
  };

  const modalBottom = () => {
    return (
      <ConfirmAddModalBottom
        price={price}
        currencies={currencies}
        parsedAmounts={parsedAmounts}
        noLiquidity={noLiquidity}
        onAdd={onAdd}
        poolTokenPercentage={poolTokenPercentage}
      />
    );
  };

  // const pendingText = `Supplying ${parsedAmounts[
  //   Field.CURRENCY_A
  // ]?.toSignificant(6)} ${
  //   currencies[Field.CURRENCY_A]?.symbol
  // } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)} ${
  //   currencies[Field.CURRENCY_B]?.symbol
  // }`;

  const pendingText =
    storedLangCode === 'ko-KR'
      ? `${parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)} ${
          currencies[Field.CURRENCY_A]?.symbol
        }${t('Aand')} ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)} ${
          currencies[Field.CURRENCY_B]?.symbol
        }${t('SupplyB')}`
      : `Supplying ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)} ${
          currencies[Field.CURRENCY_A]?.symbol
        } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)} ${
          currencies[Field.CURRENCY_B]?.symbol
        }`;

  const handleCurrencyASelect = useCallback(
    (currA: Currency) => {
      const newCurrencyIdA = currencyId(currA);
      if (newCurrencyIdA === currencyIdB) {
        history.push(`/add/${curChainId}/${currencyIdB}/${currencyIdA}`);
      } else {
        history.push(`/add/${curChainId}/${newCurrencyIdA}/${currencyIdB}`);
      }
    },
    [currencyIdB, history, currencyIdA, curChainId]
  );
  const handleCurrencyBSelect = useCallback(
    (currB: Currency) => {
      const newCurrencyIdB = currencyId(currB);
      if (currencyIdA === newCurrencyIdB) {
        if (currencyIdB) {
          history.push(`/add/${curChainId}/${currencyIdB}/${newCurrencyIdB}`);
        } else {
          history.push(`/add/${curChainId}/${newCurrencyIdB}`);
        }
      } else {
        history.push(
          `/add/${curChainId}/${currencyIdA || ethStr}/${newCurrencyIdB}`
        );
      }
    },
    [currencyIdA, history, currencyIdB, ethStr, curChainId]
  );

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false);
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('');
    }
    setTxHash('');
  }, [onFieldAInput, txHash]);

  const getSymbol = (str: string | undefined) => {
    return str !== undefined ? str : '';
  };

  return (
    <Container>
      {/* <CardNav activeIndex={1} /> */}
      <PageHeader
        title={t('Liquidity')}
        description={t('Add liquidity to receive LP tokens')}
      />
      <AddLiquidetyBody>
        <AddRemoveTabs adding />
        <Wrapper>
          <TransactionConfirmationModal
            isOpen={showConfirm}
            onDismiss={handleDismissConfirmation}
            attemptingTxn={attemptingTxn}
            hash={txHash}
            content={() => (
              <ConfirmationModalContent
                title={
                  noLiquidity
                    ? t('You are creating a pool')
                    : t('You will receive')
                }
                onDismiss={handleDismissConfirmation}
                topContent={modalHeader}
                bottomContent={modalBottom}
              />
            )}
            pendingText={pendingText}
          />
          <CardBodyWrap>
            <AutoColumnPanel gap="20px">
              {noLiquidity && (
                <ColumnAlertCenter>
                  <Pane>
                    <AutoColumn gap="12px">
                      <UIKitText>
                        {t('You are the first liquidity provider.')}
                      </UIKitText>
                      <UIKitText>
                        {t(
                          'The ratio of tokens you add will set the price of this pool.'
                        )}
                      </UIKitText>
                      <UIKitText>
                        {t(
                          'Once you are happy with the rate click supply to review.'
                        )}
                      </UIKitText>
                    </AutoColumn>
                  </Pane>
                </ColumnAlertCenter>
              )}
              <InputPanelBody>
                <CurrencyInputPanel
                  value={formattedAmounts[Field.CURRENCY_A]}
                  onUserInput={onFieldAInput}
                  onMax={() => {
                    onFieldAInput(
                      maxAmounts[Field.CURRENCY_A]?.toExact() ?? ''
                    );
                  }}
                  onCurrencySelect={handleCurrencyASelect}
                  showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
                  currency={currencies[Field.CURRENCY_A]}
                  id="add-liquidity-input-tokena"
                  showCommonBases={false}
                />
                <CurrencyIconPanel>
                  <AddIconBox
                    margin="10px 10px"
                    color="teriary"
                    style={{
                      width: '2.188rem',
                      padding: '5px',
                      borderRadius: '4px',
                    }}
                  />
                </CurrencyIconPanel>

                <CurrencyInputPanel
                  value={formattedAmounts[Field.CURRENCY_B]}
                  onUserInput={onFieldBInput}
                  onCurrencySelect={handleCurrencyBSelect}
                  onMax={() => {
                    onFieldBInput(
                      maxAmounts[Field.CURRENCY_B]?.toExact() ?? ''
                    );
                  }}
                  showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
                  currency={currencies[Field.CURRENCY_B]}
                  id="add-liquidity-input-tokenb"
                  showCommonBases={false}
                />
              </InputPanelBody>

              {currencies[Field.CURRENCY_A] &&
                currencies[Field.CURRENCY_B] &&
                pairState !== PairState.INVALID && (
                  <div>
                    <UIKitText
                      style={{ textTransform: 'uppercase', fontWeight: 600 }}
                      color="textSubtle"
                      fontSize="16px"
                      mb="10px"
                    >
                      {noLiquidity
                        ? t('Initial prices and pool share')
                        : t('Prices and pool share')}
                    </UIKitText>
                    <PaneWrap>
                      <PoolPriceBar
                        currencies={currencies}
                        poolTokenPercentage={poolTokenPercentage}
                        noLiquidity={noLiquidity}
                        price={price}
                      />
                    </PaneWrap>
                  </div>
                )}

              {!account ? (
                <ConnectWalletButton width="100%" />
              ) : (
                <AutoButtonColumn gap="md" >
                  {(approvalA === ApprovalState.NOT_APPROVED ||
                    approvalA === ApprovalState.PENDING ||
                    approvalB === ApprovalState.NOT_APPROVED ||
                    approvalB === ApprovalState.PENDING) &&
                    isValid && (
                      <RowBetween>
                        {approvalA !== ApprovalState.APPROVED && (
                          <Button
                            onClick={approveACallback}
                            disabled={approvalA === ApprovalState.PENDING}
                            style={{
                              width:
                                approvalB !== ApprovalState.APPROVED
                                  ? '48%'
                                  : '100%',
                            }}
                          >
                            {approvalA === ApprovalState.PENDING ? (
                              <Dots>
                                {/* Approving {currencies[Field.CURRENCY_A]?.symbol} */}
                                {t('Approving %symbol%', {
                                  symbol: getSymbol(
                                    currencies[Field.CURRENCY_A]?.symbol
                                  ),
                                })}
                              </Dots>
                            ) : (
                              // `Approve ${currencies[Field.CURRENCY_A]?.symbol}`
                              t('Approve %symbol%', {
                                symbol: getSymbol(
                                  currencies[Field.CURRENCY_A]?.symbol
                                ),
                              })
                            )}
                          </Button>
                        )}
                        {approvalB !== ApprovalState.APPROVED && (
                          <Button
                            onClick={approveBCallback}
                            disabled={approvalB === ApprovalState.PENDING}
                            style={{
                              width:
                                approvalA !== ApprovalState.APPROVED
                                  ? '48%'
                                  : '100%',
                            }}
                          >
                            {approvalB === ApprovalState.PENDING ? (
                              <Dots>
                                {/* Approving {currencies[Field.CURRENCY_B]?.symbol} */}
                                {t('Approving %symbol%', {
                                  symbol: getSymbol(
                                    currencies[Field.CURRENCY_B]?.symbol
                                  ),
                                })}
                              </Dots>
                            ) : (
                              // `Approve ${currencies[Field.CURRENCY_B]?.symbol}`
                              t('Approve %symbol%', {
                                symbol: getSymbol(
                                  currencies[Field.CURRENCY_B]?.symbol
                                ),
                              })
                            )}
                          </Button>
                        )}
                      </RowBetween>
                    )}
                  <Button
                    onClick={() => {
                      if (expertMode) {
                        onAdd();
                      } else {
                        setShowConfirm(true);
                      }
                    }}
                    disabled={
                      !isValid ||
                      approvalA !== ApprovalState.APPROVED ||
                      approvalB !== ApprovalState.APPROVED
                    }
                    variant={
                      !isValid &&
                      !!parsedAmounts[Field.CURRENCY_A] &&
                      !!parsedAmounts[Field.CURRENCY_B]
                        ? 'danger'
                        : 'primary'
                    }
                    width="100%"
                  >
                    {error ?? t('Supply')}
                  </Button>
                </AutoButtonColumn>
              )}
              {pair && !noLiquidity && pairState !== PairState.INVALID ? (
                <AutoColumnWrap
                  style={{
                    minWidth: '20rem',
                    marginTop: '1rem',
                  }}
                >
                  <MinimalPositionCard
                    showUnwrapped={oneCurrencyIsWBNB}
                    pair={pair}
                  />
                </AutoColumnWrap>
              ) : null}
            </AutoColumnPanel>
          </CardBodyWrap>
        </Wrapper>
      </AddLiquidetyBody>
      {/* {pair && !noLiquidity && pairState !== PairState.INVALID ? (
        <AutoColumn
          style={{
            minWidth: '20rem',
            marginTop: '1rem',
            border: '1px solid red',
          }}
        >
          <MinimalPositionCard showUnwrapped={oneCurrencyIsWBNB} pair={pair} />
        </AutoColumn>
      ) : null} */}
    </Container>
  );
}

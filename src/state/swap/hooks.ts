import { parseUnits } from '@ethersproject/units';
import {
  Currency,
  CurrencyAmount,
  ETHER,
  KLAYTN,
  JSBI,
  Token,
  TokenAmount,
  Trade, ChainId
} from 'taalswap-sdk';
import { ParsedQs } from 'qs';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useENS from '../../hooks/useENS';
import { useActiveWeb3React } from '../../hooks';
import { useCurrency } from '../../hooks/Tokens';
import {
  useTradeExactIn,
  useTradeExactInXswap,
  useTradeExactOut,
  useTradeExactOutXswap
} from '../../hooks/Trades';
import useParsedQueryString from '../../hooks/useParsedQueryString';
import { isAddress } from '../../utils';
import { AppDispatch, AppState } from '../index';
import { useCurrencyBalances } from '../wallet/hooks';
import {
  Field,
  replaceSwapState,
  selectCurrency,
  setRecipient,
  switchCurrencies,
  typeInput,
  setCrossChain,
} from './actions';
import { SwapState } from './reducer';

import { useUserSlippageTolerance } from '../user/hooks';
import { computeSlippageAdjustedAmounts } from '../../utils/prices';
import { useTranslation } from '../../contexts/Localization';
import getChainId from "../../utils/getChainId";
import { useCurrencyXswap } from '../../hooks/TokensXswap';
import { TAL_ADDRESS } from '../../constants';

export function useSwapState(): AppState['swap'] {
  return useSelector<AppState, AppState['swap']>((state) => state.swap);
}

export function useSwapActionHandlers(): {
  onCurrencySelection: (field: Field, currency: Currency) => void;
  onSwitchTokens: () => void;
  onUserInput: (field: Field, typedValue: string) => void;
  onChangeRecipient: (recipient: string | null) => void;
  onSetCrossChain: (crossChain: number) => void;
} {
  const dispatch = useDispatch<AppDispatch>();
  const onCurrencySelection = useCallback(
    (field: Field, currency: Currency) => {
      dispatch(
        selectCurrency({
          field,
          currencyId:
            currency instanceof Token
              ? currency.address
              : currency === ETHER
              ? 'ETH'
              : currency === KLAYTN
              ? 'KLAY'
              : '',
        })
      );
    },
    [dispatch]
  );

  const onSwitchTokens = useCallback(() => {
    dispatch(switchCurrencies());
  }, [dispatch]);

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }));
    },
    [dispatch]
  );

  const onChangeRecipient = useCallback(
    (recipient: string | null) => {
      dispatch(setRecipient({ recipient }));
    },
    [dispatch]
  );

  const onSetCrossChain = useCallback(
    (crossChain: number | 3) => {
      dispatch(setCrossChain({ crossChain }));
    },
    [dispatch]
  );

  return {
    onSwitchTokens,
    onCurrencySelection,
    onUserInput,
    onChangeRecipient,
    onSetCrossChain,
  };
}

// try to parse a user entered amount for a given token
export function tryParseAmount(
  value?: string,
  currency?: Currency
): CurrencyAmount | undefined {
  if (!value || !currency) {
    return undefined;
  }
  try {
    const chainId = getChainId();
    const typedValueParsed = parseUnits(value, currency.decimals).toString();
    if (typedValueParsed !== '0') {
      return currency instanceof Token
        ? new TokenAmount(currency, JSBI.BigInt(typedValueParsed))
        : chainId > 1000
        ? CurrencyAmount.klaytn(JSBI.BigInt(typedValueParsed))
        : CurrencyAmount.ether(JSBI.BigInt(typedValueParsed));
    }
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.info(`Failed to parse input amount: "${value}"`, error);
  }
  // necessary for all paths to return a value
  return undefined;
}

export function tryParseAmountXswap(
  value?: string,
  currency?: Currency
): CurrencyAmount | undefined {
  if (!value || !currency) {
    return undefined;
  }
  try {
    // const chainId = getChainId();
    const chainId = parseInt(window.localStorage.getItem('crossChain') ?? '3') as ChainId
    const typedValueParsed = parseUnits(value, currency.decimals).toString();
    if (typedValueParsed !== '0') {
      return currency instanceof Token
        ? new TokenAmount(currency, JSBI.BigInt(typedValueParsed))
        : chainId > 1000
          ? CurrencyAmount.klaytn(JSBI.BigInt(typedValueParsed))
          : CurrencyAmount.ether(JSBI.BigInt(typedValueParsed));
    }
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.info(`Failed to parse input amount: "${value}"`, error);
  }
  // necessary for all paths to return a value
  return undefined;
}

const BAD_RECIPIENT_ADDRESSES: string[] = [
  '0xBCfCcbde45cE874adCB698cC183deBcF17952812', // v2 factory
  '0xf164fC0Ec4E93095b804a4795bBe1e041497b92a', // v2 router 01
  '0x05fF2B0DB69458A0750badebc4f9e13aDd608C7F', // v2 router 02
];

/**
 * Returns true if any of the pairs or tokens in a trade have the given checksummed address
 * @param trade to check for the given address
 * @param checksummedAddress address to check in the pairs and tokens
 */
function involvesAddress(trade: Trade, checksummedAddress: string): boolean {
  return (
    trade.route.path.some((token) => token.address === checksummedAddress) ||
    trade.route.pairs.some(
      (pair) => pair.liquidityToken.address === checksummedAddress
    )
  );
}

// from the current swap inputs, compute the best trade and return it.
export function useDerivedSwapInfo(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined
): {
  currencies: { [field in Field]?: Currency };
  currencyBalances: { [field in Field]?: CurrencyAmount };
  currencyBalancesOrg: { [field in Field]?: CurrencyAmount };
  parsedAmount: CurrencyAmount | undefined;
  v2Trade: Trade | undefined;
  v2TradeX: Trade | undefined;
  inputError?: string;
} {
  const { account } = useActiveWeb3React();
  const { t } = useTranslation();
  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
    recipient,
  } = useSwapState();

  const inputCurrency = useCurrency(inputCurrencyId);
  const outputCurrency = useCurrency(outputCurrencyId);
  const recipientLookup = useENS(recipient ?? undefined);
  const to: string | null =
    (recipient === null ? account : recipientLookup.address) ?? null;

  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    inputCurrency ?? undefined,
    outputCurrency ?? undefined,
  ]);

  const isExactIn: boolean = independentField === Field.INPUT;
  const parsedAmount = tryParseAmount(
    typedValue,
    (isExactIn ? inputCurrency : outputCurrency) ?? undefined
  );

  const bestTradeExactIn = useTradeExactIn(
    isExactIn ? parsedAmount : undefined,
    outputCurrency ?? undefined
  );
  const bestTradeExactOut = useTradeExactOut(
    inputCurrency ?? undefined,
    !isExactIn ? parsedAmount : undefined
  );

  const v2Trade = isExactIn ? bestTradeExactIn : bestTradeExactOut;
  const v2TradeX = v2Trade;

  const currencyBalances = {
    [Field.INPUT]: relevantTokenBalances[0],
    [Field.OUTPUT]: relevantTokenBalances[1],
  };

  const currencyBalancesOrg = currencyBalances;

  const currencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: inputCurrency ?? undefined,
    [Field.OUTPUT]: outputCurrency ?? undefined,
  };

  let inputError: string | undefined;
  if (!account) {
    inputError = t('Connect Wallet');
  }

  if (!parsedAmount) {
    inputError = inputError ?? t('Enter an amount');
  }

  if (!currencies[Field.INPUT] || !currencies[Field.OUTPUT]) {
    inputError = inputError ?? t('Select a token');
  }

  const formattedTo = isAddress(to);
  if (!to || !formattedTo) {
    inputError = inputError ?? t('Enter a recipient');
  } else if (
    BAD_RECIPIENT_ADDRESSES.indexOf(formattedTo) !== -1 ||
    (bestTradeExactIn && involvesAddress(bestTradeExactIn, formattedTo)) ||
    (bestTradeExactOut && involvesAddress(bestTradeExactOut, formattedTo))
  ) {
    inputError = inputError ?? 'Invalid recipient';
  }

  const [allowedSlippage] = useUserSlippageTolerance();

  const slippageAdjustedAmounts =
    v2Trade &&
    allowedSlippage &&
    computeSlippageAdjustedAmounts(v2Trade, allowedSlippage);

  // compare input balance to max input based on version
  const [balanceIn, amountIn] = [
    currencyBalances[Field.INPUT],
    slippageAdjustedAmounts ? slippageAdjustedAmounts[Field.INPUT] : null,
  ];

  if (balanceIn && amountIn && balanceIn.lessThan(amountIn)) {
    // inputError = `Insufficient ${amountIn.currency.symbol} balance`;
    const chainId = parseInt(window.localStorage.getItem("chainId") ?? "1")
    let SYMBOL = 'ETH'
    if (amountIn.currency.symbol === 'ETH') {
      if (chainId > 1000) SYMBOL = 'KLAY'
    } else {
      SYMBOL = amountIn.currency.symbol ?? ''
    }
    inputError = t(`Insufficient %symbol% balance`, {
      symbol: SYMBOL
    });
  }

  return {
    currencies,
    currencyBalances,
    currencyBalancesOrg,
    parsedAmount,
    v2Trade: v2Trade ?? undefined,
    v2TradeX: v2TradeX ?? undefined,
    inputError,
  };
}

// compute the best cross chain trade and return it. input -> TAL -> TAL -> output
export function useDerivedXswapInfo(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined
): {
  currencies: { [field in Field]?: Currency };
  currencyBalances: { [field in Field]?: CurrencyAmount };
  currencyBalancesOrg: { [field in Field]?: CurrencyAmount };
  parsedAmount: CurrencyAmount | undefined;
  v2Trade: Trade | undefined;
  v2TradeX: Trade | undefined;
  inputError?: string;
} {
  const { account } = useActiveWeb3React();
  const { t } = useTranslation();
  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
    recipient,
  } = useSwapState();

  const inputCurrency = useCurrency(inputCurrencyId);
  const outputCurrency = useCurrencyXswap(outputCurrencyId);

  const chainId = parseInt(window.localStorage.getItem('chainId') ?? '', 10) as ChainId           // TODO: 상수 처리 ? 디폴트값
  let crossChain = parseInt(window.localStorage.getItem('crossChain') ?? '', 10)  as ChainId    // TODO: 상수 처리 ? 디폴트값

  if (Number.isNaN(crossChain)) crossChain = chainId

  const outputCurrencyTAL = useCurrency(TAL_ADDRESS[chainId]);
  const inputCurrencyTAL = useCurrencyXswap(TAL_ADDRESS[crossChain]);

  const recipientLookup = useENS(recipient ?? undefined);
  const to: string | null =
    (recipient === null ? account : recipientLookup.address) ?? null;

  const isExactIn: boolean = independentField === Field.INPUT;
  const parsedAmount = tryParseAmount(
    typedValue,
    (isExactIn ? inputCurrency : outputCurrency) ?? undefined
  );

  const isBridge = inputCurrency?.symbol === 'TAL' || inputCurrency?.symbol === 'KTAL';

  // XSwap Key Parts of Code >>
  // input -> TAL -> TAL -> output
  const bestTALTradeExactIn = useTradeExactIn(
    isExactIn ? parsedAmount : undefined,
    outputCurrencyTAL ?? undefined,
    isBridge
  );  // TAL -> TAL
  const bestTradeExactIn = useTradeExactIn(
    isExactIn ? parsedAmount : undefined,
    outputCurrencyTAL ?? undefined
  );  // Others -> TAL

  const parsedTALAmountInTAL = tryParseAmountXswap(
    parsedAmount?.toSignificant(6),
    (isExactIn ? inputCurrencyTAL : outputCurrencyTAL) ?? undefined
  );  // Keep TAL input amount
  const parsedAmountInTAL = tryParseAmountXswap(
    bestTradeExactIn?.outputAmount.toSignificant(6),
    (isExactIn ? inputCurrencyTAL : outputCurrencyTAL) ?? undefined
  );

  const bestTradeExactInXswap = useTradeExactInXswap(
    isExactIn ? isBridge ? parsedTALAmountInTAL : parsedAmountInTAL : undefined,
    outputCurrency ?? undefined
  );

  // output -> TAL -> TAL -> input
  // 좀 더 면밀한 검토가 필요한 부분이나 XSwap의 경우 exactOut을 UI에서 차단해서 아래 코드는 사용되지 않음.
  const bestTALTradeExactOutXswap = useTradeExactOutXswap(
    inputCurrencyTAL ?? undefined,
    !isExactIn ? parsedAmount : undefined,
    isBridge
  );
  const bestTradeExactOutXswap = useTradeExactOutXswap(
    inputCurrencyTAL ?? undefined,
    !isExactIn ? parsedAmount : undefined
  );

  const parsedTALAmountOutTAL = tryParseAmountXswap(
    parsedAmount?.toSignificant(6),
    (isExactIn ? inputCurrencyTAL : outputCurrencyTAL) ?? undefined
  );
  const parsedAmountOutTAL = tryParseAmountXswap(
    bestTradeExactOutXswap?.inputAmount.toSignificant(6),
    (isExactIn ? inputCurrencyTAL : outputCurrencyTAL) ?? undefined
  );

  const bestTradeExactOut = useTradeExactOut(
    inputCurrency ?? undefined,
    !isExactIn ? isBridge ? parsedTALAmountOutTAL : parsedAmountOutTAL : undefined
  );
  // << XSwap Key Parts of Code modified by Peter H. Nahm

  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    inputCurrencyTAL ?? undefined,
    outputCurrency ?? undefined,
  ]);

  const relevantTokenBalancesOrg = useCurrencyBalances(account ?? undefined, [
    inputCurrency ?? undefined,
    outputCurrency ?? undefined,
  ]);
  // console.log('== relevantTokenBalances ==>', relevantTokenBalances)

  // // const v2Trade = isExactIn
  // //   ? (outputCurrency?.symbol === 'ETH' || outputCurrency?.symbol === 'KTAL')
  // //   ? bestTradeExactInXswap : bestTradeExactIn
  // //   : bestTradeExactOutXswap;
  // const v2Trade = isExactIn ? bestTradeExactIn : bestTradeExactOut;
  // const v2TradeX = isExactIn ? bestTradeExactInXswap : bestTradeExactOutXswap;
  const v2Trade = isExactIn ? isBridge ? bestTALTradeExactIn : bestTradeExactIn : bestTradeExactOut;
  const v2TradeX = isExactIn ? bestTradeExactInXswap : isBridge ? bestTALTradeExactOutXswap : bestTradeExactOutXswap;

  const currencyBalances = {
    [Field.INPUT]: relevantTokenBalances[0],
    [Field.OUTPUT]: relevantTokenBalances[1],
  };

  const currencyBalancesOrg = {
    [Field.INPUT]: relevantTokenBalancesOrg[0],
    [Field.OUTPUT]: relevantTokenBalancesOrg[1],
  };

  const currencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: inputCurrency ?? undefined,
    [Field.OUTPUT]: outputCurrency ?? undefined,
  };

  let inputError: string | undefined;
  if (!account) {
    inputError = t('Connect Wallet');
  }

  if (!parsedAmount) {
    inputError = inputError ?? t('Enter an amount');
  }

  if (!currencies[Field.INPUT] || !currencies[Field.OUTPUT]) {
    inputError = inputError ?? t('Select a token');
  }

  const formattedTo = isAddress(to);
  if (!to || !formattedTo) {
    inputError = inputError ?? t('Enter a recipient');
  } else if (
    BAD_RECIPIENT_ADDRESSES.indexOf(formattedTo) !== -1 ||
    (bestTradeExactIn && involvesAddress(bestTradeExactIn, formattedTo)) ||
    (bestTradeExactOut && involvesAddress(bestTradeExactOut, formattedTo))
  ) {
    inputError = inputError ?? 'Invalid recipient';
  }

  const [allowedSlippage] = useUserSlippageTolerance();

  const slippageAdjustedAmounts =
    v2Trade &&
    allowedSlippage &&
    computeSlippageAdjustedAmounts(v2Trade, allowedSlippage);

  // compare input balance to max input based on version
  // currencyBalances -> currencyBalancesOrg : Peter H. Nahm
  const [balanceIn, amountIn] = [
    currencyBalancesOrg[Field.INPUT],
    slippageAdjustedAmounts ? slippageAdjustedAmounts[Field.INPUT] : null,
  ];

  if (balanceIn && amountIn && balanceIn.lessThan(amountIn)) {
    // inputError = `Insufficient ${amountIn.currency.symbol} balance`;
    // const chainId = parseInt(window.localStorage.getItem("chainId") ?? "1")
    let SYMBOL = 'ETH'
    if (amountIn.currency.symbol === 'ETH') {
      if (chainId > 1000) SYMBOL = 'KLAY'
    } else {
      SYMBOL = amountIn.currency.symbol ?? ''
    }
    inputError = t(`Insufficient %symbol% balance`, {
      symbol: SYMBOL
    });
  }

  return {
    currencies,
    currencyBalances,
    currencyBalancesOrg,
    parsedAmount,
    v2Trade: v2Trade ?? undefined,
    v2TradeX: v2TradeX ?? undefined,
    inputError,
  };
}

function parseCurrencyFromURLParameter(urlParam: any): string {
  if (typeof urlParam === 'string') {
    const valid = isAddress(urlParam);
    if (valid) return valid;
    if (urlParam.toUpperCase() === 'ETH') return 'ETH';
    if (urlParam.toUpperCase() === 'KLAY') return 'KLAY';
    if (valid === false) return 'ETH';
  }
  return '';
}

function parseTokenAmountURLParameter(urlParam: any): string {
  // eslint-disable-next-line no-restricted-globals
  return typeof urlParam === 'string' && !isNaN(parseFloat(urlParam))
    ? urlParam
    : '';
}

function parseIndependentFieldURLParameter(urlParam: any): Field {
  return typeof urlParam === 'string' && urlParam.toLowerCase() === 'output'
    ? Field.OUTPUT
    : Field.INPUT;
}

const ENS_NAME_REGEX =
  /^[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)?$/;
const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
function validatedRecipient(recipient: any): string | null {
  if (typeof recipient !== 'string') return null;
  const address = isAddress(recipient);
  if (address) return address;
  if (ENS_NAME_REGEX.test(recipient)) return recipient;
  if (ADDRESS_REGEX.test(recipient)) return recipient;
  return null;
}

function validatedCrossChain(crossChain: any): number {
  const defCrossChain = parseInt(process.env.REACT_APP_KLAYTN_ID ?? '8217', 10)
  if (typeof crossChain !== 'number') return defCrossChain;
  if (
    crossChain === 1 ||        // Ethereum Mainnet
    crossChain === 3 ||        // Ethereum Testnet Ropsten
    crossChain === 8217 ||     // Klaytn Mainnet Cypress
    crossChain === 1001        // Klaytn Testnet Baobab
  ) {
    return crossChain
  }
  return defCrossChain;
}

export function queryParametersToSwapState(parsedQs: ParsedQs): SwapState {
  let inputCurrency = parseCurrencyFromURLParameter(parsedQs.inputCurrency);
  let outputCurrency = parseCurrencyFromURLParameter(parsedQs.outputCurrency);
  if (inputCurrency === outputCurrency) {
    if (typeof parsedQs.outputCurrency === 'string') {
      inputCurrency = '';
    } else {
      outputCurrency = '';
    }
  }

  const recipient = validatedRecipient(parsedQs.recipient);
  const crossChain = validatedCrossChain(parsedQs.crossChain);

  return {
    [Field.INPUT]: {
      currencyId: inputCurrency,
    },
    [Field.OUTPUT]: {
      currencyId: outputCurrency,
    },
    typedValue: parseTokenAmountURLParameter(parsedQs.exactAmount),
    independentField: parseIndependentFieldURLParameter(parsedQs.exactField),
    recipient,
    crossChain,
  };
}

// updates the swap state to use the defaults for a given network
export function useDefaultsFromURLSearch():
  | {
      inputCurrencyId: string | undefined;
      outputCurrencyId: string | undefined;
    }
  | undefined {
  const { chainId } = useActiveWeb3React();
  const refresh = window.localStorage.getItem('refresh')
  const xSwapCurreny = window.localStorage.getItem('xSwapCurreny')
  const dispatch = useDispatch<AppDispatch>();
  const parsedQs = useParsedQueryString();
  const [result, setResult] =
    useState<
      | {
          inputCurrencyId: string | undefined;
          outputCurrencyId: string | undefined;
        }
      | undefined
    >();

  useEffect(() => {
    if (!chainId) return;
    if (xSwapCurreny === undefined || xSwapCurreny === 'output') return;
    const parsed = queryParametersToSwapState(parsedQs);
    // TODO : 네트웤트가 스위치 된 경우에는 replace 되도록 처리할 것...
    if (refresh === 'false' && parsed[Field.INPUT].currencyId !== undefined) return;

    dispatch(
      replaceSwapState({
        typedValue: parsed.typedValue,
        field: parsed.independentField,
        inputCurrencyId: parsed[Field.INPUT].currencyId,
        outputCurrencyId: parsed[Field.OUTPUT].currencyId,
        recipient: parsed.recipient,
        crossChain: parsed.crossChain,
      })
    );

    setResult({
      inputCurrencyId: parsed[Field.INPUT].currencyId,
      outputCurrencyId: parsed[Field.OUTPUT].currencyId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, chainId, refresh]);

  return result;
}

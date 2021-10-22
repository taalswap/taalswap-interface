import { currencyEquals, Trade } from 'taalswap-sdk';
import React, { useCallback, useMemo } from 'react';
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent,
} from '../TransactionConfirmationModal';
import SwapModalFooter from './SwapModalFooter';
import SwapModalHeader from './SwapModalHeader';
import { useTranslation } from '../../contexts/Localization';
/**
 * Returns true if the trade requires a confirmation of details before we can submit it
 * @param tradeA trade A
 * @param tradeB trade B
 */
function tradeMeaningfullyDiffers(tradeA: Trade, tradeB: Trade): boolean {
  return (
    tradeA.tradeType !== tradeB.tradeType ||
    !currencyEquals(tradeA.inputAmount.currency, tradeB.inputAmount.currency) ||
    !tradeA.inputAmount.equalTo(tradeB.inputAmount) ||
    !currencyEquals(
      tradeA.outputAmount.currency,
      tradeB.outputAmount.currency
    ) ||
    !tradeA.outputAmount.equalTo(tradeB.outputAmount)
  );
}

// const CACHE_KEY = 'pancakeswap_language';
const CACHE_KEY = 'taalswap_language';

export default function ConfirmSwapModal({
  trade,
  tradeX,
  originalTrade,
  onAcceptChanges,
  allowedSlippage,
  onConfirm,
  onDismiss,
  recipient,
  swapErrorMessage,
  isOpen,
  attemptingTxn,
  txHash,
}: {
  isOpen: boolean;
  trade: Trade | undefined;
  tradeX: Trade | undefined;
  originalTrade: Trade | undefined;
  attemptingTxn: boolean;
  txHash: string | undefined;
  recipient: string | null;
  allowedSlippage: number;
  onAcceptChanges: () => void;
  onConfirm: () => void;
  swapErrorMessage: string | undefined;
  onDismiss: () => void;
}) {
  const { t } = useTranslation();
  const storedLangCode = localStorage.getItem(CACHE_KEY);
  const showAcceptChanges = useMemo(
    () =>
      Boolean(
        trade && originalTrade && tradeMeaningfullyDiffers(trade, originalTrade)
      ),
    [originalTrade, trade]
  );

  const modalHeader = useCallback(() => {
    return trade ? (
      <SwapModalHeader
        trade={trade}
        tradeX={tradeX}
        allowedSlippage={allowedSlippage}
        recipient={recipient}
        showAcceptChanges={showAcceptChanges}
        onAcceptChanges={onAcceptChanges}
      />
    ) : null;
  }, [
    allowedSlippage,
    onAcceptChanges,
    recipient,
    showAcceptChanges,
    trade,
    tradeX,
  ]);

  const modalBottom = useCallback(() => {
    return trade ? (
      <SwapModalFooter
        onConfirm={onConfirm}
        trade={trade}
        tradeX={tradeX}
        disabledConfirm={showAcceptChanges}
        swapErrorMessage={swapErrorMessage}
        allowedSlippage={allowedSlippage}
      />
    ) : null;
  }, [
    allowedSlippage,
    onConfirm,
    showAcceptChanges,
    swapErrorMessage,
    trade,
    tradeX,
  ]);

  // text to show while loading
  // const pendingText = `Swapping ${trade?.inputAmount?.toSignificant(6)} ${
  //   trade?.inputAmount?.currency?.symbol
  // } for ${trade?.outputAmount?.toSignificant(6)} ${
  //   trade?.outputAmount?.currency?.symbol
  // }`;

  const pendingText =
    storedLangCode === 'ko-KR'
      ? `${trade?.inputAmount?.toSignificant(6)} ${
          trade?.inputAmount?.currency?.symbol
        }${t('FromA')} ${trade?.outputAmount?.toSignificant(6)} ${
          trade?.outputAmount?.currency?.symbol
        }${t('ToB')} `
      : `Swapping ${trade?.inputAmount?.toSignificant(6)} ${
          trade?.inputAmount?.currency?.symbol
        } for ${trade?.outputAmount?.toSignificant(6)} ${
          trade?.outputAmount?.currency?.symbol
        }`;

  const confirmationContent = useCallback(
    () =>
      swapErrorMessage ? (
        <TransactionErrorContent
          onDismiss={onDismiss}
          message={swapErrorMessage}
        />
      ) : (
        <ConfirmationModalContent
          title={t('Confirm Swap')}
          onDismiss={onDismiss}
          topContent={modalHeader}
          bottomContent={modalBottom}
        />
      ),
    [onDismiss, modalBottom, modalHeader, swapErrorMessage, t]
  );

  return (
    <TransactionConfirmationModal
      isOpen={isOpen}
      onDismiss={onDismiss}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      content={confirmationContent}
      pendingText={pendingText}
    />
  );
}

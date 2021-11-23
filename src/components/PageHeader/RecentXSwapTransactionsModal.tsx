import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
  Button,
  CheckmarkCircleIcon,
  ErrorIcon,
  Flex,
  Link,
  LinkExternal,
  Modal,
  Text,
} from 'taalswap-uikit';
import { useActiveWeb3React } from 'hooks';
import { useTheme } from 'styled-components';
import { getBscScanLink } from 'utils';
import {
  isTransactionRecent,
  useAllTransactions,
} from 'state/transactions/hooks';
import { TransactionDetails } from 'state/transactions/reducer';
import Loader from 'components/Loader';
import axios from 'axios';
import { useTranslation } from '../../contexts/Localization';
import TOKEN_LIST from '../../constants/token/taalswap.json';
import { SCAN_URL } from '../../config';
import { BRIDGE_ADDRESS } from '../../constants/index';

type RecentTransactionsModalProps = {
  onDismiss?: () => void;
};

// TODO: Fix UI Kit typings
const defaultOnDismiss = () => null;

const newTransactionsFirst = (a: TransactionDetails, b: TransactionDetails) =>
  b.addedTime - a.addedTime;

const getRowStatus = (sortedRecentTransaction: TransactionDetails) => {
  const { hash, receipt } = sortedRecentTransaction;

  if (!hash) {
    return { icon: <Loader />, color: 'text' };
  }

  if (hash && receipt?.status === 1) {
    return { icon: <CheckmarkCircleIcon color="success" />, color: 'success' };
  }

  return { icon: <ErrorIcon color="failure" />, color: 'failure' };
};

const RecentXSwapTransactionsModal = ({
  onDismiss = defaultOnDismiss,
}: RecentTransactionsModalProps) => {
  const { t } = useTranslation();
  const { account, chainId } = useActiveWeb3React();
  const allTransactions = useAllTransactions();
  const [allXSwapTransactions, setAllXSwapTransactions] = useState([]);
  const theme = useTheme();
  const btnColor = theme.isDark ? '#fff' : '#212b36';

  // Logic taken from Web3Status/index.tsx line 175
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions);
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst);
  }, [allTransactions]);

  useEffect(() => {
    const getXSWapTransactions = async () => {
      const url = `http://localhost:4000/bridge/api/user/${account}`;

      await axios.get(url).then((response) => {
        setAllXSwapTransactions(response.data.data);
      });
    };

    getXSWapTransactions();
  }, [account]);

  const getSymbolByAddress = useCallback(
    (address: string | undefined, chain: string) => {
      let curChainId;

      if (chain === 'ETH') curChainId = 3;
      else curChainId = 1001;

      const curToken =
        address !== undefined
          ? TOKEN_LIST.tokens.find(
              (token) =>
                token.address === address?.toLowerCase() &&
                token.chainId === curChainId
            )
          : null;

      return curToken?.symbol;
    },
    []
  );

  const getUrl = (txHash, chainAddress, fromChain) => {
    const urlChainId = Object.keys(BRIDGE_ADDRESS).find(
      (key) => BRIDGE_ADDRESS[key] === chainAddress
    );

    let url;
    if (urlChainId !== undefined) {
      switch (fromChain.toUpperCase()) {
        case 'ETH':
          url = `${SCAN_URL[urlChainId]}/tx/${txHash}`;
          break;
        case 'KLAYTN':
          url = `${SCAN_URL[urlChainId]}/tx/${txHash}`;
          break;
      }
    }

    return url;
  };

  const getSummary = (
    fromSymbol,
    toSymbol,
    formattedAmount,
    formattedXAmount,
    txHash,
    xTxHash,
    fromChain,
    toChain,
    to,
    xFrom
  ) => {
    return (
      <div
        key={txHash}
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          //   flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{ marginRight: '0.3rem' }}>X-Swap</div>
        <Link
          style={{ marginRight: '0.3rem' }}
          href={getUrl(txHash, to, fromChain)}
          target="_blank"
        >{`${parseFloat(formattedAmount?.toFixed(10))} ${fromSymbol}`}</Link>
        <div style={{ marginRight: '0.3rem' }}>for</div>
        <Link
          style={{ marginRight: '0.3rem' }}
          href={getUrl(xTxHash, xFrom, toChain)}
          target="_blank"
        >{`${parseFloat(formattedXAmount?.toFixed(10))} ${toSymbol}`}</Link>
      </div>
    );
  };

  return (
    <Modal
      title={t('Recent X-Swap transactions')}
      onDismiss={onDismiss}
      style={{ position: 'relative' }}
    >
      {!account && (
        <Flex
          justifyContent="center"
          flexDirection="column"
          alignItems="center"
        >
          <Text mb="8px" bold>
            Please connect your wallet to view your recent transactions
          </Text>
          <div
            style={{
              position: 'absolute',
              right: '20px',
              top: '20px',
              cursor: 'pointer',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 30 30"
              onClick={onDismiss}
            >
              <g
                id="___Icons_ic_replace"
                data-name="__🥬Icons/ ic_replace"
                transform="translate(0 16.971) rotate(-45)"
              >
                <g id="_gr" data-name="#gr">
                  <path
                    id="Path"
                    d="M22.5,10.5h-9v-9a1.5,1.5,0,0,0-3,0v9h-9a1.5,1.5,0,0,0,0,3h9v9a1.5,1.5,0,0,0,3,0v-9h9a1.5,1.5,0,0,0,0-3Z"
                    fill={btnColor}
                  />
                </g>
              </g>
            </svg>
          </div>
        </Flex>
      )}
      {/* {account && chainId && sortedRecentTransactions.length === 0 && ( */}
      {account && chainId && allXSwapTransactions.length === 0 && (
        <Flex
          justifyContent="center"
          flexDirection="column"
          alignItems="center"
        >
          <Text mb="8px" bold>
            {t('No recent transactions')}
          </Text>
          <div
            style={{
              position: 'absolute',
              right: '20px',
              top: '20px',
              cursor: 'pointer',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 30 30"
              onClick={onDismiss}
            >
              <g
                id="___Icons_ic_replace"
                data-name="__🥬Icons/ ic_replace"
                transform="translate(0 16.971) rotate(-45)"
              >
                <g id="_gr" data-name="#gr">
                  <path
                    id="Path"
                    d="M22.5,10.5h-9v-9a1.5,1.5,0,0,0-3,0v9h-9a1.5,1.5,0,0,0,0,3h9v9a1.5,1.5,0,0,0,3,0v-9h9a1.5,1.5,0,0,0,0-3Z"
                    fill={btnColor}
                  />
                </g>
              </g>
            </svg>
          </div>
        </Flex>
      )}
      {account &&
        chainId &&
        // sortedRecentTransactions.map((sortedRecentTransaction) => {
        allXSwapTransactions.map((xswapTransaction) => {
          const {
            txHash,
            xTxHash,
            token,
            xToken,
            formattedAmount,
            formattedXAmount,
            fromChain,
            toChain,
            to,
            xFrom,
          } = xswapTransaction;

          const fromSymbol = getSymbolByAddress(token, fromChain);
          const toSymbol = getSymbolByAddress(xToken, toChain);

          return (
            <>
              <Flex
                key={txHash}
                alignItems="center"
                justifyContent="space-between"
                mb="4px"
              >
                {getSummary(
                  fromSymbol,
                  toSymbol,
                  formattedAmount,
                  formattedXAmount,
                  txHash,
                  xTxHash,
                  fromChain,
                  toChain,
                  to,
                  xFrom
                )}
              </Flex>
            </>
          );
        })}
    </Modal>
  );
};

export default RecentXSwapTransactionsModal;

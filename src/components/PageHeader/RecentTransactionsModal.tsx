import React, { useMemo } from 'react';
import {
  Button,
  CheckmarkCircleIcon,
  ErrorIcon,
  Flex,
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
import { useTranslation } from '../../contexts/Localization';

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

const RecentTransactionsModal = ({
  onDismiss = defaultOnDismiss,
}: RecentTransactionsModalProps) => {
  const { t } = useTranslation();
  const { account, chainId } = useActiveWeb3React();
  const allTransactions = useAllTransactions();
  const theme = useTheme();
  const btnColor = theme.isDark ? '#fff' : '#212b36';

  // Logic taken from Web3Status/index.tsx line 175
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions);
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst);
  }, [allTransactions]);

  return (
    <Modal
      title={t('Recent transactions')}
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
      {account && chainId && sortedRecentTransactions.length === 0 && (
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
        sortedRecentTransactions.map((sortedRecentTransaction) => {
          const { hash, summary } = sortedRecentTransaction;
          const { icon, color } = getRowStatus(sortedRecentTransaction);

          return (
            <>
              <Flex
                key={hash}
                alignItems="center"
                justifyContent="space-between"
                mb="4px"
              >
                <LinkExternal
                  href={getBscScanLink(chainId, hash, 'transaction')}
                  color={color}
                >
                  {summary ?? hash}
                </LinkExternal>
                {icon}
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
            </>
          );
        })}
    </Modal>
  );
};

export default RecentTransactionsModal;

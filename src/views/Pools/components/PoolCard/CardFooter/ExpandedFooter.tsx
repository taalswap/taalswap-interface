import React, { useState } from 'react';
import BigNumber from 'bignumber.js';
import styled from 'styled-components';
import { getBalanceNumber } from 'utils/formatBalance';
import { useTranslation } from 'contexts/Localization';
import {
  Flex,
  MetamaskIcon,
  Text,
  TooltipText,
  LinkExternal,
  TimerIcon,
  Skeleton,
  useTooltip,
  Button,
} from 'taalswap-uikit';
import { BASE_BSC_SCAN_URL, BASE_URL } from 'config';
import { Pool } from 'state/types';
import { getAddress, getCakeVaultAddress } from 'utils/addressHelpers';
import { registerToken } from 'utils/wallet';
import Balance from 'views/Components/Balance';
import { getPoolBlockInfo } from 'views/Pools/helpers';
import { useBlock, useCakeVault } from '../../../../../state/hooks';

interface ExpandedFooterProps {
  pool: Pool;
  account: string;
}

const ExpandedWrapper = styled(Flex)`
  svg {
    height: 24px;
    width: 24px;
  }
`;

const ExpandedFooter: React.FC<ExpandedFooterProps> = ({ pool, account }) => {
  const { t } = useTranslation();
  const { currentBlock } = useBlock();
  const {
    totalCakeInVault,
    fees: { performanceFee },
  } = useCakeVault();

  const {
    stakingToken,
    earningToken,
    totalStaked,
    contractAddress,
    sousId,
    isAutoVault,
  } = pool;

  const tokenAddress = earningToken.address
    ? getAddress(earningToken.address)
    : '';
  const poolContractAddress = getAddress(contractAddress);
  const cakeVaultContractAddress = getCakeVaultAddress();
  const imageSrc = `${BASE_URL}/images/tokens/${earningToken.symbol.toLowerCase()}.png`;
  const isMetaMaskInScope = !!(window as Window).ethereum?.isMetaMask;
  const isManualCakePool = sousId === 0;

  const {
    shouldShowBlockCountdown,
    blocksUntilStart,
    blocksRemaining,
    hasPoolStarted,
    blocksToDisplay,
  } = getPoolBlockInfo(pool, currentBlock);

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('Subtracted automatically from each yield harvest and burned.'),
    { placement: 'bottom-start' }
  );

  const getTotalStakedBalance = () => {
    if (isAutoVault) {
      return getBalanceNumber(totalCakeInVault, stakingToken.decimals);
    }
    if (isManualCakePool) {
      const manualCakeTotalMinusAutoVault = new BigNumber(totalStaked).minus(
        totalCakeInVault
      );
      return getBalanceNumber(
        manualCakeTotalMinusAutoVault,
        stakingToken.decimals
      );
    }
    return getBalanceNumber(totalStaked, stakingToken.decimals);
  };

  const [isShown, setIsShown] = useState(false);
  const [isShown2, setIsShown2] = useState(false);
  const [isShown3, setIsShown3] = useState(false);

  return (
    <ExpandedWrapper flexDirection="column">
      <Flex mb="2px" justifyContent="space-between" alignItems="center">
        <Text small>{t('Total staked')}:</Text>
        <Flex alignItems="flex-start">
          {totalStaked ? (
            <>
              <Balance fontSize="14px" value={getTotalStakedBalance()} />
              <Text ml="4px" fontSize="14px">
                {stakingToken.symbol}
              </Text>
            </>
          ) : (
            <Skeleton width="90px" height="21px" />
          )}
        </Flex>
      </Flex>
      {shouldShowBlockCountdown && (
        <Flex mb="2px" justifyContent="space-between" alignItems="center">
          <Text small>{hasPoolStarted ? t('End') : t('Start')}:</Text>
          <Flex alignItems="center">
            {blocksRemaining || blocksUntilStart ? (
              <Balance
                color="primary"
                fontSize="14px"
                value={blocksToDisplay}
                decimals={0}
              />
            ) : (
              <Skeleton width="54px" height="21px" />
            )}
            <Text ml="4px" color="primary" small textTransform="lowercase">
              {t('Blocks')}
            </Text>
            <TimerIcon ml="4px" color="primary" />
          </Flex>
        </Flex>
      )}
      {isAutoVault && (
        <Flex mb="2px" justifyContent="space-between" alignItems="center">
          {tooltipVisible && tooltip}
          <TooltipText ref={targetRef} small>
            {t('Performance Fee')}
          </TooltipText>
          <Flex alignItems="center">
            <Text ml="4px" small>
              {performanceFee / 100}%
            </Text>
          </Flex>
        </Flex>
      )}
      <Flex justifyContent="center" mt="20px" alignItems="center">
        <Flex
          mb="2px"
          mr="30px"
          justifyContent="center"
          style={{ cursor: 'pointer' }}
          onMouseEnter={() => setIsShown(true)}
          onMouseLeave={() => setIsShown(false)}
        >
          <svg
            id="그룹_882"
            data-name="그룹 882"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <g
              id="타원_24"
              data-name="타원 24"
              transform="translate(0 0)"
              fill="none"
              stroke="#00ab55"
              strokeWidth="2"
            >
              <ellipse cx="12" cy="12" rx="12" ry="12" stroke="none" />
              <ellipse cx="12" cy="12" rx="11" ry="11" fill="none" />
            </g>
            <g
              id="그룹_870"
              data-name="그룹 870"
              transform="translate(10.897 6.471)"
            >
              <g id="Shape" transform="translate(0 0)" fill="#00ab55">
                <path
                  d="M 1.103286981582642 11.13615703582764 C 1.083567023277283 11.13615703582764 0.9999969601631165 11.06499671936035 0.9999969601631165 10.92264747619629 L 0.9999969601631165 4.854027271270752 C 0.9999969601631165 4.709187030792236 1.082846999168396 4.640517234802246 1.103286981582642 4.640517234802246 C 1.123726963996887 4.640517234802246 1.206576943397522 4.709187030792236 1.206576943397522 4.854027271270752 L 1.206576943397522 10.92264747619629 C 1.206576943397522 11.06499671936035 1.123006939888 11.13615703582764 1.103286981582642 11.13615703582764 Z M 1.103286981582642 1.427017092704773 C 1.083567023277283 1.427017092704773 0.9999969601631165 1.355857133865356 0.9999969601631165 1.213507056236267 C 0.9999969601631165 1.068667054176331 1.082846999168396 0.999997079372406 1.103286981582642 0.999997079372406 C 1.123726963996887 0.999997079372406 1.206576943397522 1.068667054176331 1.206576943397522 1.213507056236267 C 1.206576943397522 1.355857133865356 1.123006939888 1.427017092704773 1.103286981582642 1.427017092704773 Z"
                  stroke="none"
                />
                <path
                  d="M 1.103286981582642 12.13615703582764 C 0.4935469925403595 12.13615703582764 -3.018417373823468e-06 11.59220695495605 -3.018417373823468e-06 10.92264747619629 L -3.018417373823468e-06 4.854027271270752 C -3.018417373823468e-06 4.183377265930176 0.4935469925403595 3.640516996383667 1.103286981582642 3.640516996383667 C 1.713027000427246 3.640516996383667 2.206577062606812 4.183377265930176 2.206577062606812 4.854027271270752 L 2.206577062606812 10.92264747619629 C 2.206577062606812 11.59220695495605 1.713027000427246 12.13615703582764 1.103286981582642 12.13615703582764 Z M 1.103286981582642 2.427016973495483 C 0.4935469925403595 2.427016973495483 -3.018417373823468e-06 1.88306713104248 -3.018417373823468e-06 1.213507056236267 C -3.018417373823468e-06 0.5428571105003357 0.4935469925403595 -2.912597665272187e-06 1.103286981582642 -2.912597665272187e-06 C 1.713027000427246 -2.912597665272187e-06 2.206577062606812 0.5428571105003357 2.206577062606812 1.213507056236267 C 2.206577062606812 1.88306713104248 1.713027000427246 2.427016973495483 1.103286981582642 2.427016973495483 Z"
                  stroke="none"
                  fill="#00ab55"
                />
              </g>
            </g>
          </svg>
          {isShown && (
            <div
              style={{
                position: 'absolute',
                marginTop: '30px',
                color: '#00ab55',
                fontSize: '13px',
              }}
            >
              {t('View Project Site')}
            </div>
          )}
        </Flex>
        {poolContractAddress && (
          <Flex
            mb="2px"
            mr="26px"
            justifyContent="center"
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => setIsShown2(true)}
            onMouseLeave={() => setIsShown2(false)}
          >
            <svg
              id="그룹_880"
              data-name="그룹 880"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 26.328 26.177"
            >
              <g
                id="타원_25"
                data-name="타원 25"
                transform="translate(0)"
                fill="none"
                stroke="#00ab55"
                strokeWidth="2"
              >
                <circle cx="11.522" cy="11.522" r="11.522" stroke="none" />
                <circle cx="11.522" cy="11.522" r="10.522" fill="none" />
              </g>
              <path
                id="패스_150"
                data-name="패스 150"
                d="M2.949,2.387C3.983,3.291,7.657,6.8,7.657,6.8"
                transform="translate(16.55 17.257)"
                fill="none"
                stroke="#00ab55"
                strokeLinecap="round"
                strokeWidth="3"
              />
              <text
                id="TotalActiveUsers"
                transform="translate(11.896 16)"
                fill="#09ab64"
                fontSize="13"
                fontFamily="BeVietnam-Bold, Be Vietnam"
                fontWeight="700"
                letterSpacing="-0.035em"
              >
                <tspan x="-3.803" y="0">
                  P
                </tspan>
              </text>
            </svg>
            {isShown2 && (
              <div
                style={{
                  position: 'absolute',
                  marginTop: '30px',
                  color: '#00ab55',
                  fontSize: '13px',
                }}
              >
                Project site
              </div>
            )}
          </Flex>
        )}
        {account && isMetaMaskInScope && tokenAddress && (
          <Flex justifyContent="center">
            <Button
              variant="text"
              p="0"
              height="auto"
              onClick={() =>
                registerToken(
                  tokenAddress,
                  earningToken.symbol,
                  earningToken.decimals,
                  imageSrc
                )
              }
              onMouseEnter={() => setIsShown3(true)}
              onMouseLeave={() => setIsShown3(false)}
            >
              <MetamaskIcon ml="4px" width="24px" height="24px" />
              {isShown3 && (
                <div
                  style={{
                    position: 'absolute',
                    marginTop: '48px',
                    color: '#00ab55',
                    fontSize: '13px',
                  }}
                >
                  Add to Metamask
                </div>
              )}
            </Button>
          </Flex>
        )}
      </Flex>
    </ExpandedWrapper>
  );
};

export default React.memo(ExpandedFooter);

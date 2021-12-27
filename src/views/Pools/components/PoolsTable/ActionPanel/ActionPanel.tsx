import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import {
  Box,
  Button,
  Flex,
  HelpIcon,
  Link,
  LinkExternal,
  MetamaskIcon,
  Skeleton,
  Text,
  TimerIcon,
  useTooltip,
} from 'taalswap-uikit';
import { BASE_URL } from 'config';
import { getBscScanBlockCountdownUrl } from 'utils/bscscan';
import BigNumber from 'bignumber.js';
import { Pool } from 'state/types';
import { useTranslation } from 'contexts/Localization';
import Balance from 'views/Components/Balance';
import { CompoundingPoolTag, ManualPoolTag } from 'views/Components/Tags';
import { getAddress } from 'utils/addressHelpers';
import { registerToken } from 'utils/wallet';
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance';
import { getPoolBlockInfo } from 'views/Pools/helpers';
import { useBlock, useCakeVault } from '../../../../../state/hooks';
import Harvest from './Harvest';
import Stake from './Stake';
import Apr from '../Apr';
import maskIcon from './icons/Icon1.svg';

const expandAnimation = keyframes`
  from {
    max-height: 0px;
  }
  to {
    max-height: 700px;
  }
`;

const collapseAnimation = keyframes`
  from {
    max-height: 700px;
  }
  to {
    max-height: 0px;
  }
`;

const StyledActionPanel = styled.div<{ expanded: boolean }>`
  animation: ${({ expanded }) =>
    expanded
      ? css`
          ${expandAnimation} 300ms linear forwards
        `
      : css`
          ${collapseAnimation} 300ms linear forwards
        `};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.detailsBg};
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  padding: 12px;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    padding: 16px 32px;
  }
`;

const ActionContainer = styled.div`
  display: flex;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    align-items: center;
    flex-grow: 1;
    flex-basis: 0;
  }
`;

type MediaBreakpoints = {
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
};

interface ActionPanelProps {
  account: string;
  pool: Pool;
  userDataLoaded: boolean;
  expanded: boolean;
  breakpoints: MediaBreakpoints;
}

const InfoSection = styled(Box)`
  flex: 0 0 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 8px;
  flex-wrap: wrap;
  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 0;
  }
`;

const ActionPanel: React.FC<ActionPanelProps> = ({
  account,
  pool,
  userDataLoaded,
  expanded,
  breakpoints,
}) => {
  const {
    sousId,
    stakingToken,
    earningToken,
    totalStaked,
    endBlock,
    stakingLimit,
    isAutoVault,
  } = pool;
  const { t } = useTranslation();
  const { currentBlock } = useBlock();
  const { isXs, isSm, isMd } = breakpoints;
  const showSubtitle = (isXs || isSm) && sousId === 0;

  const {
    shouldShowBlockCountdown,
    blocksUntilStart,
    blocksRemaining,
    hasPoolStarted,
    blocksToDisplay,
  } = getPoolBlockInfo(pool, currentBlock);

  const isMetaMaskInScope = !!(window as Window).ethereum?.isMetaMask;
  const tokenAddress = earningToken.address
    ? getAddress(earningToken.address)
    : '';
  const imageSrc = `${BASE_URL}/images/tokens/${earningToken.symbol.toLowerCase()}.png`;

  const {
    totalCakeInVault,
    fees: { performanceFee },
  } = useCakeVault();

  const performanceFeeAsDecimal = performanceFee && performanceFee / 100;
  const isManualCakePool = sousId === 0;

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

  const {
    targetRef: totalStakedTargetRef,
    tooltip: totalStakedTooltip,
    tooltipVisible: totalStakedTooltipVisible,
  } = useTooltip(
    t('Total amount of %symbol% staked in this pool', {
      symbol: stakingToken.symbol,
    }),
    {
      placement: 'bottom',
    }
  );

  const manualTooltipText = t(
    'You must harvest and compound your earnings from this pool manually.'
  );
  const autoTooltipText = t(
    'Any funds you stake in this pool will be automagically harvested and restaked (compounded) for you.'
  );

  const {
    targetRef: tagTargetRef,
    tooltip: tagTooltip,
    tooltipVisible: tagTooltipVisible,
  } = useTooltip(isAutoVault ? autoTooltipText : manualTooltipText, {
    placement: 'bottom-start',
  });

  const maxStakeRow = stakingLimit.gt(0) ? (
    <Flex mb="8px" justifyContent="space-between">
      <Text>{t('Max. stake per user')}:</Text>
      <Text>{`${getFullDisplayBalance(
        stakingLimit,
        stakingToken.decimals,
        0
      )} ${stakingToken.symbol}`}</Text>
    </Flex>
  ) : null;

  const blocksRow =
    blocksRemaining || blocksUntilStart ? (
      <Flex mb="8px" justifyContent="space-between">
        <Text>{hasPoolStarted ? t('Ends in') : t('Starts in')}:</Text>
        <Flex>
          <Link external href={getBscScanBlockCountdownUrl(endBlock)}>
            <Balance
              fontSize="16px"
              value={blocksToDisplay}
              decimals={0}
              color="primary"
            />
            <Text ml="4px" color="primary" textTransform="lowercase">
              {t('Blocks')}
            </Text>
            <TimerIcon ml="4px" color="primary" />
          </Link>
        </Flex>
      </Flex>
    ) : (
      <Skeleton width="56px" height="16px" />
    );

  const aprRow = (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      mb="8px"
      width="100%"
    >
      <Text bold fontSize="14px" color="textSubtle">
        {isAutoVault ? t('APY') : t('APR')}
      </Text>
      <Apr
        pool={pool}
        showIcon
        performanceFee={isAutoVault ? performanceFeeAsDecimal : 0}
      />
    </Flex>
  );

  const totalStakedRow = (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      mb="8px"
      width="100%"
    >
      <Text
        maxWidth={['50px', '100%']}
        bold
        lineHeight="1"
        fontSize="14px"
        color="textSubtle"
      >
        {t('Total staked')}
      </Text>
      <Flex alignItems="center">
        {totalStaked ? (
          <>
            <Balance
              fontSize="14px"
              bold
              lineHeight="1"
              value={getTotalStakedBalance()}
              decimals={0}
              unit={` ${stakingToken.symbol}`}
            />
            <span ref={totalStakedTargetRef}>
              <HelpIcon color="textSubtle" width="20px" ml="6px" />
            </span>
          </>
        ) : (
          <Skeleton width="56px" height="16px" />
        )}
        {totalStakedTooltipVisible && totalStakedTooltip}
      </Flex>
    </Flex>
  );

  const [isShown, setIsShown] = useState(false);
  const [isShown2, setIsShown2] = useState(false);
  const [isShown3, setIsShown3] = useState(false);

  return (
    <StyledActionPanel expanded={expanded}>
      <InfoSection>
        {maxStakeRow}
        {(isXs || isSm) && aprRow}
        {(isXs || isSm || isMd) && totalStakedRow}
        {shouldShowBlockCountdown && blocksRow}
        <Flex style={{ width: '100%', justifyContent: 'space-evenly' }}>
          <Flex
            mb="8px"
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
                {t('Info site')}
              </div>
            )}
          </Flex>
          <Flex
            mb="8px"
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
                {t('Project site')}
              </div>
            )}
          </Flex>
          {account && isMetaMaskInScope && tokenAddress && (
            <Flex mb="8px" justifyContent="center">
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
                      marginTop: '53px',
                      color: '#00ab55',
                      fontSize: '13px',
                    }}
                  >
                    {t('Add to Metamask')}
                  </div>
                )}
              </Button>
            </Flex>
          )}
          {tagTooltipVisible && tagTooltip}
        </Flex>
      </InfoSection>
      <ActionContainer>
        {showSubtitle && (
          <Text mt="4px" mb="16px" color="textSubtle" bold fontSize="14px">
            {isAutoVault
              ? t('Automatic restaking')
              : `${t('Earn')} TAL ${t('Stake').toLocaleLowerCase()} TAL`}
          </Text>
        )}
        <Harvest {...pool} userDataLoaded={userDataLoaded} />
        <Stake pool={pool} userDataLoaded={userDataLoaded} />
      </ActionContainer>
    </StyledActionPanel>
  );
};

export default ActionPanel;

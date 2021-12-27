import React from 'react';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { Text, Image, useMatchBreakpoints } from 'taalswap-uikit';
import { useTranslation } from 'contexts/Localization';
import { Pool } from 'state/types';
import { BIG_ZERO } from 'utils/bigNumber';
import { useCakeVault } from '../../../../../state/hooks';
import BaseCell, { CellContent } from './BaseCell';
import CoinImg01 from '../../../../../pages/LandingPageView/images/coin_eth_icon.svg';
import CoinImg02 from '../../../../../pages/LandingPageView/images/coin_taal_icon.svg';

interface NameCellProps {
  pool: Pool;
}

const StyledCell = styled(BaseCell)`
  flex: 5;
  flex-direction: row;
  padding-left: 12px;
  word-break: break-word;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 130px;
  }
`;

const IconImageBody = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  position: relative;

  > div:nth-child(1) {
    z-index: 1;
  }
  > div:nth-child(2) {
    margin-left: -21px;
    z-index: 2;
  }
`;

const IconImage = styled(Image)`
  width: 24px;
  height: 24px;

  /*
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 40px;
    height: 40px;
  }
  */
`;

const IconImageSmall = styled(Image)`
  width: 13px;
  height: 13px;
  border: 1px solid #fff;
  border-radius: 50%;
  /*
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 13px;
    height: 13px;
  }
  */
`;

const NameCell: React.FC<NameCellProps> = ({ pool }) => {
  const { t } = useTranslation();
  const { isXs, isSm } = useMatchBreakpoints();
  const {
    sousId,
    stakingToken,
    earningToken,
    userData,
    isFinished,
    isAutoVault,
  } = pool;
  const {
    userData: { userShares },
  } = useCakeVault();
  const hasVaultShares = userShares && userShares.gt(0);
  const interfaceBaseUrl =
    process.env.REACT_APP_INTERFACE || 'http://localhost:3000';

  const stakingTokenSymbol = stakingToken.symbol;
  const earningTokenSymbol = earningToken.symbol;

  const stakingTokenIconPath = `${interfaceBaseUrl}/images/coins/${stakingToken.symbol.toLowerCase()}.png`;
  const earningTokenIconPath = `${interfaceBaseUrl}/images/coins/${earningToken.symbol.toLowerCase()}.png`;

  // const stakingTokenIconPath = `https://swap.taalswap.finance/images/coins/${stakingToken.symbol.toLowerCase()}.png`
  // const earningTokenIconPath = `https://swap.taalswap.finance/images/coins/${earningToken.symbol.toLowerCase()}.png`

  const iconFile =
    `${earningTokenSymbol}-${stakingTokenSymbol}.svg`.toLocaleLowerCase();

  const stakedBalance = userData?.stakedBalance
    ? new BigNumber(userData.stakedBalance)
    : BIG_ZERO;
  const isStaked = stakedBalance.gt(0);
  const isManualCakePool = sousId === 0;

  const showStakedTag = isAutoVault ? hasVaultShares : isStaked;

  let title = `${t('Earn')} ${earningTokenSymbol}`;
  let subtitle = `${t('Stake')} ${stakingTokenSymbol}`;
  const showSubtitle = sousId !== 0 || (sousId === 0 && !isXs && !isSm);

  if (isAutoVault) {
    title = t('Auto TAL');
    subtitle = t('Automatic restaking');
  } else if (isManualCakePool) {
    title = t('Manual TAL');
    subtitle = `${t('Earn')} TAL, ${t('Stake').toLocaleLowerCase()} TAL`;
  }

  return (
    <StyledCell role="cell">
      {/* <Image src={`/images/pools/${iconFile}`} alt="icon" width={40} height={40} mr="8px" /> */}
      <IconImageBody>
        <IconImage
          src={stakingTokenIconPath}
          alt=""
          width={40}
          height={40}
          mr="8px"
        />
        <IconImageSmall
          src={earningTokenIconPath}
          alt=""
          width={13}
          height={13}
          mr="8px"
        />
      </IconImageBody>
      <CellContent>
        {showStakedTag && (
          <Text
            fontSize="12px"
            bold
            color={isFinished ? 'failure' : 'secondary'}
            textTransform="uppercase"
          >
            {t('Staked')}
          </Text>
        )}
        <Text bold={!isXs && !isSm} small={isXs || isSm} fontSize="14px">
          {title}
        </Text>
        {showSubtitle && (
          <Text fontSize="12px" color="textSubtle">
            {subtitle}
          </Text>
        )}
      </CellContent>
    </StyledCell>
  );
};

export default NameCell;

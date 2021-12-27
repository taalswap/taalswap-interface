import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useTranslation } from 'contexts/Localization';
import { LinkExternalNoIcon, LinkExternal, Text } from 'taalswap-uikit';
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard';
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts';
import { getBscScanAddressUrl } from 'utils/bscscan';
import { CommunityTag, CoreTag, DualTag } from 'views/Components/Tags';
import { useWeb3React } from '@web3-react/core';

import HarvestAction from './HarvestAction';
import StakedAction from './StakedAction';
import Apr, { AprProps } from '../Apr';
import Multiplier, { MultiplierProps } from '../Multiplier';
import Liquidity, { LiquidityProps } from '../Liquidity';
import LpIcon from './Icons/LpIcon';
import LpIcon2 from './Icons/LpIcon2';
import LpIcon3 from './Icons/LpIcon3';

export interface ActionPanelProps {
  apr: AprProps;
  multiplier: MultiplierProps;
  liquidity: LiquidityProps;
  details: FarmWithStakedValue;
  userDataReady: boolean;
  expanded: boolean;
  isLandingPage: boolean;
}

const expandAnimation = keyframes`
  from {
    max-height: 0px;
  }
  to {
    max-height: 500px;
  }
`;

const collapseAnimation = keyframes`
  from {
    max-height: 500px;
  }
  to {
    max-height: 0px;
  }
`;

const Container = styled.div<{ expanded }>`
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
  width: 100%;
  flex-direction: column-reverse;
  padding: 24px;
  position: relative;
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    padding: 16px 32px;
  }
`;

const StyledLinkExternalNoIcon = styled(LinkExternalNoIcon)``;

const StyledLinkExternalCSS = styled.div`
  font-weight: 400;
  cursor: pointer;
`;

const StyledLinkExternal = styled.div`
  font-weight: 400;
  cursor: pointer;
  display: flex;
  justify-content: center;
  margin-right: 16px;
`;
const StyledLinkExternal2 = styled.div`
  font-weight: 400;
  cursor: pointer;
  display: flex;
  justify-content: center;
`;

const StakeContainer = styled.div`
  color: ${({ theme }) => theme.colors.text};
  align-items: center;
  display: flex;
  justify-content: space-between;

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 25px;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-top: 16px;
  }

  > div {
    height: 24px;
    padding: 0 6px;
    font-size: 14px;
    margin-right: 4px;

    svg {
      width: 14px;
    }
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

const InfoContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  margin-top: 24px;
  ${({ theme }) => theme.mediaQueries.lg} {
    width: auto;
    min-width: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: initial;
    margin-top: 0;
  }
`;

const ValueContainer = styled.div`
  // display: block;
  display: flex;
  justify-content: space-around;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  margin: 0 16px;
  border-radius: 8px;
  box-sizing: border-box;
  padding: 16px;
  ${({ theme }) => theme.mediaQueries.lg} {
    display: none;
  }
`;

const ValueWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  // margin: 4px 0px;
  // border: 1px solid red;
  > div {
    justify-content: flex-end;
  }
`;

const ActionPanel: React.FunctionComponent<ActionPanelProps> = ({
  details,
  apr,
  multiplier,
  liquidity,
  userDataReady,
  expanded,
  isLandingPage,
}) => {
  const farm = details;

  const { t } = useTranslation();
  const isActive = farm.multiplier !== '0X';
  const { quoteToken, token, dual } = farm;
  const lpLabel =
    farm.lpSymbol && farm.lpSymbol.toUpperCase().replace('TAAL', '');
  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: quoteToken.address,
    tokenAddress: token.address,
  });
  // const lpAddress = farm.lpAddresses[process.env.REACT_APP_CHAIN_ID]
  const { chainId } = useWeb3React();
  const lpAddress = farm.lpAddresses[chainId];
  const curChainId = localStorage.getItem('chainId');
  const bsc = getBscScanAddressUrl(lpAddress);
  const info = `https://taalswap.info/pair/${lpAddress}`;
  const interfaceBaseUrl =
    process.env.REACT_APP_INTERFACE || 'http://localhost:3000';

  const [isShown, setIsShown] = useState(false);
  const [isShown2, setIsShown2] = useState(false);
  const [isShown3, setIsShown3] = useState(false);

  return (
    <Container expanded={expanded}>
      <InfoContainer>
        {isActive && (
          <StakeContainer>
            {/* <StyledLinkExternalNoIcon href={`http://localhost:3000/#/add/${liquidityUrlPathParts}`}> */}
            <StyledLinkExternalNoIcon
              href={`${interfaceBaseUrl}/#/add/${liquidityUrlPathParts}`}
            >
              <StyledLinkExternal
                onMouseEnter={() => setIsShown(true)}
                onMouseLeave={() => setIsShown(false)}
              >
                <LpIcon />
                {isShown && (
                  <div
                    style={{
                      position: 'absolute',
                      marginTop: '36px',
                      color: '#00ab55',
                      fontSize: '13px',
                    }}
                  >
                    {t('Get %symbol%', { symbol: lpLabel })}
                  </div>
                )}
              </StyledLinkExternal>
            </StyledLinkExternalNoIcon>
          </StakeContainer>
        )}
        <StyledLinkExternalNoIcon href={bsc}>
          <StyledLinkExternal
            onMouseEnter={() => setIsShown2(true)}
            onMouseLeave={() => setIsShown2(false)}
          >
            <LpIcon2 />
            {isShown2 && (
              <div
                style={{
                  position: 'absolute',
                  marginTop: '34px',
                  color: '#00ab55',
                  fontSize: '13px',
                }}
              >
                {t('View Contract')}
              </div>
            )}
          </StyledLinkExternal>
        </StyledLinkExternalNoIcon>
        <StyledLinkExternalNoIcon href={info}>
          <StyledLinkExternal2
            onMouseEnter={() => setIsShown3(true)}
            onMouseLeave={() => setIsShown3(false)}
          >
            <LpIcon3 />
            {isShown3 && (
              <div
                style={{
                  position: 'absolute',
                  marginTop: '34px',
                  color: '#00ab55',
                  fontSize: '13px',
                }}
              >
                {t('See Pair Info')}
              </div>
            )}
          </StyledLinkExternal2>
        </StyledLinkExternalNoIcon>
      </InfoContainer>
      <ValueContainer>
        <ValueWrapper>
          <Apr {...apr} />
        </ValueWrapper>
        <ValueWrapper>
          <Multiplier {...multiplier} />
        </ValueWrapper>
        <ValueWrapper>
          <Liquidity {...liquidity} />
        </ValueWrapper>
      </ValueContainer>
      <ActionContainer>
        <HarvestAction {...farm} userDataReady={userDataReady} />
        <StakedAction {...farm} userDataReady={userDataReady} />
      </ActionContainer>
    </Container>
  );
};

export default ActionPanel;

import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'contexts/Localization';
import styled, { ThemeContext } from 'styled-components';
import { ChainId, Pair } from 'taalswap-sdk';
import { Button, CardBody, HelpIcon, Text, useTooltip } from 'taalswap-uikit';
import { Link } from 'react-router-dom';
import FullPositionCard from 'components/PositionCard';
import { useTokenBalancesWithLoadingIndicator } from 'state/wallet/hooks';
import { StyledInternalLink } from 'components/Shared';
import { LightCard } from 'components/Card';
import { RowBetween } from 'components/Row';
import { AutoColumn } from 'components/Column';
import Container from 'components/Container';

import { useActiveWeb3React } from 'hooks';
import { usePairs } from 'data/Reserves';
import { toV2LiquidityToken, useTrackedTokenPairs } from 'state/user/hooks';
import { Dots } from 'components/swap/styleds';
import PageHeader from 'components/PageHeader';
import AppBody from '../AppBody';
import Teaser from '../LandingPageView/Teaser_page';

const ReferenceElement = styled.div`
  display: flex;
  margin-left: 0.3rem;
  margin-right: auto;
`;

const CardBodyWrap = styled.div`
  text-align: center;
  background-color: ${({ theme }) => theme.colors.tertiary};
  border: 1px solid transparent;
  border-radius: 16px;
  overflow: hidden;

  & div {
    background-color: ${({ theme }) => theme.colors.tertiary};
    border-color: transparent;
  }
`;

export default function Pool() {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const { account, chainId } = useActiveWeb3React();

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs();
  const tokenPairsWithLiquidityTokens = useMemo(
    () =>
      trackedTokenPairs.map((tokens) => ({
        liquidityToken: toV2LiquidityToken(tokens),
        tokens,
      })),
    [trackedTokenPairs]
  );
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens]
  );
  const [v2PairsBalances, fetchingV2PairBalances] =
    useTokenBalancesWithLoadingIndicator(account ?? undefined, liquidityTokens);

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  );

  const v2Pairs = usePairs(
    liquidityTokensWithBalances.map(({ tokens }) => tokens)
  );
  const v2IsLoading =
    fetchingV2PairBalances ||
    v2Pairs?.length < liquidityTokensWithBalances.length ||
    v2Pairs?.some((V2Pair) => !V2Pair);

  const allV2PairsWithLiquidity = v2Pairs
    .map(([, pair]) => pair)
    .filter((v2Pair): v2Pair is Pair => Boolean(v2Pair));

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t(
      'When you add liquidity, you will receive LP tokens to be registered as your share in this liquidity pool.'
    ),
    { placement: 'top-end', tooltipOffset: [20, 10] }
  );

  let CURRENCY;
  switch (chainId) {
    case ChainId.MAINNET:
    case ChainId.ROPSTEN:
    case ChainId.RINKEBY:
      CURRENCY = '/add/3/ETH/0x00';
      break;
    case ChainId.KLAYTN:
    case ChainId.BAOBAB:
      CURRENCY = '/add/1001/KLAY/0x00';
      break;
  }

  return (
    <Container>
      {/* <Teaser /> */}
      {/* <CardNav activeIndex={1} /> */}
      <PageHeader
        title={t('Liquidity')}
        description={t('Add liquidity to receive LP tokens')}
      >
        <AppBody>
          <AutoColumn gap="lg" justify="center">
            <CardBody style={{ width: '100%' }}>
              <Button id="join-pool-button" as={Link} to={CURRENCY} mb="16px">
                {t('Add Liquidity')}
              </Button>

              <AutoColumn gap="12px" style={{ width: '100%' }}>
                <RowBetween padding="0 8px">
                  <Text color={theme.colors.text}>{t('Your Liquidity')}</Text>
                  <ReferenceElement ref={targetRef}>
                    <HelpIcon color="textSubtle" />
                  </ReferenceElement>
                  {tooltipVisible && tooltip}
                </RowBetween>
                <CardBodyWrap>
                  {!account ? (
                    <LightCard padding="2.8rem 2.8rem 0rem 2.8rem">
                      <Text color="textDisabled" textAlign="center">
                        {t('Connect to a wallet to view your liquidity.')}
                      </Text>
                    </LightCard>
                  ) : v2IsLoading ? (
                    <LightCard padding="2.8rem 2.8rem 0rem 2.8rem">
                      <Text color="textDisabled" textAlign="center">
                        <Dots>Loading</Dots>
                      </Text>
                    </LightCard>
                  ) : allV2PairsWithLiquidity?.length > 0 ? (
                    <>
                      {allV2PairsWithLiquidity.map((v2Pair) => (
                        <FullPositionCard
                          key={v2Pair.liquidityToken.address}
                          pair={v2Pair}
                        />
                      ))}
                    </>
                  ) : (
                    <LightCard padding="2.8rem 2.8rem 0rem 2.8rem">
                      <Text color="textDisabled" textAlign="center">
                        {t('No liquidity found.')}
                      </Text>
                    </LightCard>
                  )}

                  <div style={{ padding: '1.8rem 0rem 2.8rem 0rem' }}>
                    <Text
                      fontSize="14px"
                      style={{ padding: '.5rem 0 .5rem 0' }}
                    >
                      {t("Don't see your pool(s)?")}{' '}
                      <StyledInternalLink id="import-pool-link" to="/find">
                        {t('Import here')}
                      </StyledInternalLink>
                    </Text>
                    <Text
                      fontSize="14px"
                      style={{ padding: '.5rem 0 .5rem 0' }}
                    >
                      {t(
                        'Your LP tokens in a farm can be moved back here by unstaking them.'
                      )}
                    </Text>
                  </div>
                </CardBodyWrap>
              </AutoColumn>
            </CardBody>
          </AutoColumn>
        </AppBody>
      </PageHeader>
    </Container>
  );
}

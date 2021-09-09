import { Currency, ETHER, KLAYTN, JSBI, TokenAmount } from 'taalswap-sdk';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  AddIcon,
  Button,
  CardBody,
  ChevronDownIcon,
  Text,
} from 'taalswap-uikit';
import { LightCard } from 'components/Card';
import { AutoColumn, ColumnCenter } from 'components/Column';
import CurrencyLogo from 'components/CurrencyLogo';
import { FindPoolTabs } from 'components/NavigationTabs';
import { MinimalPositionCard } from 'components/PositionCard';
import CurrencySearchModal from 'components/SearchModal/CurrencySearchModal';
import { PairState, usePair } from 'data/Reserves';
import { useActiveWeb3React } from 'hooks';
import { usePairAdder } from 'state/user/hooks';
import { useTokenBalance } from 'state/wallet/hooks';
import { StyledInternalLink } from 'components/Shared';
import Container from 'components/Container';
import { currencyId } from 'utils/currencyId';
import AppBody from '../AppBody';
import { Dots } from '../Pool/styleds';
import { useTranslation } from '../../contexts/Localization';


const AutoColumnDefault = styled(AutoColumn)`

    &:nth-child(1){
      display: flex;
      flex-direction: column;
    }

    ${LightCard} {
      border: 1px solid #eee;
      margin-top: 1.875rem;
    }
`;

const ColumnButtonBody = styled.div`
  display:flex;
  flex-direction: row;
  align-items: center;

  ${ColumnCenter}{
    width: 2.188rem;
    padding: 5px;
    border: 1px solid transparent;
    border-radius: 4px;
    background-color: rgb(243, 245, 247);
    margin: 10px 20px;
  }

  @media screen and (max-width: 720px){
    flex-direction: column;
  }
`;


enum Fields {
  TOKEN0 = 0,
  TOKEN1 = 1,
}

export default function PoolFinder() {
  const { account, chainId } = useActiveWeb3React();

  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [activeField, setActiveField] = useState<number>(Fields.TOKEN1);

  // const [currency0, setCurrency0] = useState<Currency | null>(ETHER);
  let CURRENCY = ETHER;
  if (chainId && chainId > 1000) CURRENCY = KLAYTN;
  const curChainId = localStorage.getItem('chainId');
  const [currency0, setCurrency0] = useState<Currency | null>(CURRENCY);
  const [currency1, setCurrency1] = useState<Currency | null>(null);

  const [pairState, pair] = usePair(
    currency0 ?? undefined,
    currency1 ?? undefined
  );
  const addPair = usePairAdder();

  const { t } = useTranslation();
  useEffect(() => {
    if (pair) {
      addPair(pair);
    }
  }, [pair, addPair]);

  const validPairNoLiquidity: boolean =
    pairState === PairState.NOT_EXISTS ||
    Boolean(
      pairState === PairState.EXISTS &&
        pair &&
        JSBI.equal(pair.reserve0.raw, JSBI.BigInt(0)) &&
        JSBI.equal(pair.reserve1.raw, JSBI.BigInt(0))
    );

  const position: TokenAmount | undefined = useTokenBalance(
    account ?? undefined,
    pair?.liquidityToken
  );
  const hasPosition = Boolean(
    position && JSBI.greaterThan(position.raw, JSBI.BigInt(0))
  );

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      if (activeField === Fields.TOKEN0) {
        setCurrency0(currency);
      } else {
        setCurrency1(currency);
      }
    },
    [activeField]
  );

  const handleSearchDismiss = useCallback(() => {
    setShowSearch(false);
  }, [setShowSearch]);

  const prerequisiteMessage = (
    <LightCard padding="45px 10px" >
      <Text style={{ textAlign: 'center' }}>
        {!account
          ? t('Connect to a wallet to find pools')
          : t('Select a token to find your liquidity.')}
      </Text>
    </LightCard>
  );

  return (
    <Container>
      {/* <CardNav activeIndex={1} /> */}
      <AppBody>
        <FindPoolTabs />
        <CardBody>
          <AutoColumnDefault gap="md">
            <ColumnButtonBody>
              <Button
                onClick={() => {
                  setShowSearch(true);
                  setActiveField(Fields.TOKEN0);
                }}
                startIcon={
                  currency0 ? (
                    <CurrencyLogo
                      currency={currency0}
                      style={{ marginRight: '.5rem' }}
                    />
                  ) : null
                }
                endIcon={<ChevronDownIcon width="24px" color="white" />}
                width="100%"
              >
                {currency0 ? currency0.symbol : t('Select a Token')}
              </Button>

              <ColumnCenter>
                <AddIcon color="textSubtle" />
              </ColumnCenter>

              <Button
                onClick={() => {
                  setShowSearch(true);
                  setActiveField(Fields.TOKEN1);
                }}
                startIcon={
                  currency1 ? (
                    <CurrencyLogo
                      currency={currency1}
                      style={{ marginRight: '.5rem' }}
                    />
                  ) : null
                }
                endIcon={<ChevronDownIcon width="24px" color="white" />}
                width="100%"
              >
                {currency1 ? currency1.symbol : t('Select a Token')}
              </Button>
            </ColumnButtonBody>
            {hasPosition && (
              <ColumnCenter
                style={{
                  justifyItems: 'center',
                  backgroundColor: '',
                  padding: '12px 0px',
                  borderRadius: '12px',
                }}
              >
                <Text style={{ textAlign: 'center' }}>{t('Pool found!')}</Text>
              </ColumnCenter>
            )}

            {currency0 && currency1 ? (
              pairState === PairState.EXISTS ? (
                hasPosition && pair ? (
                  <MinimalPositionCard pair={pair} />
                ) : (
                  <LightCard padding="45px 10px">
                    <AutoColumn gap="sm" justify="center">
                      <Text style={{ textAlign: 'center' }}>
                        {t('You don’t have liquidity in this pool yet.')}
                      </Text>
                      <StyledInternalLink
                        to={`/add/${curChainId}/${currencyId(
                          currency0
                        )}/${currencyId(currency1)}`}
                      >
                        <Text style={{ textAlign: 'center' }}>
                          {t('Doing Add Liquidity')}
                        </Text>
                      </StyledInternalLink>
                    </AutoColumn>
                  </LightCard>
                )
              ) : validPairNoLiquidity ? (
                <LightCard padding="45px 10px">
                  <AutoColumn gap="sm" justify="center">
                    <Text style={{ textAlign: 'center' }}>
                      {t('No pool found.')}
                    </Text>
                    <StyledInternalLink
                      to={`/add/${curChainId}/${currencyId(
                        currency0
                      )}/${currencyId(currency1)}`}
                    >
                      Create pool.
                    </StyledInternalLink>
                  </AutoColumn>
                </LightCard>
              ) : pairState === PairState.INVALID ? (
                <LightCard padding="45px 10px">
                  <AutoColumn gap="sm" justify="center">
                    <Text style={{ textAlign: 'center' }}>
                      {t('Invalid pair')}
                    </Text>
                  </AutoColumn>
                </LightCard>
              ) : pairState === PairState.LOADING ? (
                <LightCard padding="45px 10px">
                  <AutoColumn gap="sm" justify="center">
                    <Text style={{ textAlign: 'center' }}>
                      Loading
                      <Dots />
                    </Text>
                  </AutoColumn>
                </LightCard>
              ) : null
            ) : (
              prerequisiteMessage
            )}
          </AutoColumnDefault>

          <CurrencySearchModal
            isOpen={showSearch}
            onCurrencySelect={handleCurrencySelect}
            onDismiss={handleSearchDismiss}
            showCommonBases
            selectedCurrency={
              (activeField === Fields.TOKEN0 ? currency1 : currency0) ??
              undefined
            }
          />
        </CardBody>
      </AppBody>
    </Container>
  );
}

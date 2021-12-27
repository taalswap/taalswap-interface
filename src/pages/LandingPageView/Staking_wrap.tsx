import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { useWeb3React } from '@web3-react/core';
import { Text, useMatchBreakpoints } from 'taalswap-uikit';
import orderBy from 'lodash/orderBy';
import partition from 'lodash/partition';
import { useTranslation } from 'contexts/Localization';
import usePersistState from 'hooks/usePersistState';
import { latinise } from 'utils/latinise';
import FlexLayout from 'views/Components/layout/Flex';
import { Pool } from 'state/types';
import TimeCounter from 'views/Components/TimeCounter';
import PoolsTable from 'views/Pools/components/PoolsTable/PoolsTable';
import { getAprData, getCakeVaultEarnings } from '../../views/Pools/helpers';
import {
  usePools,
  useFetchCakeVault,
  useFetchPublicPoolsData,
  usePollFarmsData,
  useCakeVault,
} from '../../state/hooks';

const Txtcolor = styled.p`
  color: ${({ theme }) => theme.colors.logoColor};
  text-align: center;
`;

const NUMBER_OF_POOLS_VISIBLE = 12;

const Pools: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const { isXl, isLg } = useMatchBreakpoints();
  const { pools: poolsWithoutAutoVault, userDataLoaded } = usePools(account);
  // const [stakedOnly, setStakedOnly] = usePersistState(false, 'pancake_pool_staked')
  const [stakedOnly, setStakedOnly] = usePersistState(
    false,
    'taalswap_pool_staked'
  );
  const [numberOfPoolsVisible, setNumberOfPoolsVisible] = useState(
    NUMBER_OF_POOLS_VISIBLE
  );
  const [observerIsSet, setObserverIsSet] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('hot');
  const {
    userData: { taalAtLastUserAction, userShares },
    fees: { performanceFee },
    pricePerFullShare,
    totalCakeInVault,
  } = useCakeVault();
  const accountHasVaultShares = userShares && userShares.gt(0);
  const performanceFeeAsDecimal = performanceFee && performanceFee / 100;

  const pools = useMemo(() => {
    const cakePool = poolsWithoutAutoVault.find((pool) => pool.sousId === 0);
    const cakeAutoVault = { ...cakePool, isAutoVault: true };
    return [cakeAutoVault, ...poolsWithoutAutoVault];
  }, [poolsWithoutAutoVault]);

  // TODO aren't arrays in dep array checked just by reference, i.e. it will rerender every time reference changes?
  const [finishedPools, openPools] = useMemo(
    () => partition(pools, (pool) => pool.isFinished),
    [pools]
  );
  const stakedOnlyFinishedPools = useMemo(
    () =>
      finishedPools.filter((pool) => {
        if (pool.isAutoVault) {
          return accountHasVaultShares;
        }
        return (
          pool.userData &&
          new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)
        );
      }),
    [finishedPools, accountHasVaultShares]
  );
  const stakedOnlyOpenPools = useMemo(
    () =>
      openPools.filter((pool) => {
        if (pool.isAutoVault) {
          return accountHasVaultShares;
        }
        return (
          pool.userData &&
          new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)
        );
      }),
    [openPools, accountHasVaultShares]
  );

  usePollFarmsData();
  useFetchCakeVault();
  useFetchPublicPoolsData();

  useEffect(() => {
    const showMorePools = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setNumberOfPoolsVisible(
          (poolsCurrentlyVisible) =>
            poolsCurrentlyVisible + NUMBER_OF_POOLS_VISIBLE
        );
      }
    };

    if (!observerIsSet) {
      const loadMoreObserver = new IntersectionObserver(showMorePools, {
        rootMargin: '0px',
        threshold: 1,
      });
      loadMoreObserver.observe(loadMoreRef.current);
      setObserverIsSet(true);
    }
  }, [observerIsSet]);

  const showFinishedPools = location.pathname.includes('history');

  const sortPools = (poolsToSort: Pool[]) => {
    switch (sortOption) {
      case 'apr':
        // Ternary is needed to prevent pools without APR (like MIX) getting top spot
        return orderBy(
          poolsToSort,
          (pool: Pool) =>
            pool.apr ? getAprData(pool, performanceFeeAsDecimal).apr : 0,
          'desc'
        );
      case 'earned':
        return orderBy(
          poolsToSort,
          (pool: Pool) => {
            if (!pool.userData || !pool.earningTokenPrice) {
              return 0;
            }
            return pool.isAutoVault
              ? getCakeVaultEarnings(
                  account,
                  taalAtLastUserAction,
                  userShares,
                  pricePerFullShare,
                  pool.earningTokenPrice
                ).autoUsdToDisplay
              : pool.userData.pendingReward
                  .times(pool.earningTokenPrice)
                  .toNumber();
          },
          'desc'
        );
      case 'totalStaked':
        return orderBy(
          poolsToSort,
          (pool: Pool) =>
            pool.isAutoVault
              ? totalCakeInVault.toNumber()
              : pool.totalStaked.toNumber(),
          'desc'
        );
      default:
        return poolsToSort;
    }
  };

  const poolsToShow = () => {
    let chosenPools = [];
    if (showFinishedPools) {
      chosenPools = stakedOnly ? stakedOnlyFinishedPools : finishedPools;
    } else {
      chosenPools = stakedOnly ? stakedOnlyOpenPools : openPools;
    }

    if (searchQuery) {
      const lowercaseQuery = latinise(searchQuery.toLowerCase());
      chosenPools = chosenPools.filter((pool) =>
        latinise(pool.earningToken.symbol.toLowerCase()).includes(
          lowercaseQuery
        )
      );
    }

    return sortPools(chosenPools).slice(0, numberOfPoolsVisible);
  };

  const tableLayout = (
    <PoolsTable
      pools={poolsToShow()}
      account={account}
      userDataLoaded={userDataLoaded}
    />
  );

  return (
    <div
      className="farms_wrap"
      style={{ maxWidth: '1280px', margin: '0 auto' }}
    >
      {isLg || isXl ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            borderBottom: '3px solid #00ab55',
          }}
        >
          <Txtcolor className="section_tit">Staking Pools</Txtcolor>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginBottom: '20px',
              marginLeft: '10px',
            }}
          >
            <Txtcolor>(</Txtcolor>
            <p style={{ color: 'red', marginRight: '5px' }}>Starting in </p>
            <TimeCounter />
            <Txtcolor>)</Txtcolor>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            borderBottom: '3px solid #00ab55',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              marginBottom: '-10px',
            }}
          >
            <Txtcolor className="section_tit">Staking Pools</Txtcolor>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              marginBottom: '20px',
            }}
          >
            <Txtcolor>(</Txtcolor>
            <span style={{ color: 'red', marginRight: '5px' }}>
              Starting in
            </span>{' '}
            <TimeCounter />
            <Txtcolor>)</Txtcolor>
          </div>
        </div>
      )}
      {showFinishedPools && (
        <Text fontSize="20px" color="failure" pb="32px">
          {t(
            'These pools are no longer distributing rewards. Please unstake your tokens.'
          )}
        </Text>
      )}
      {/* {viewMode === ViewMode.CARD ? cardLayout : tableLayout} */}
      {tableLayout}
      <div ref={loadMoreRef} />
    </div>
  );
};

export default Pools;

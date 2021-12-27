import React, {
  useEffect,
  useCallback,
  useState,
  useMemo,
  useRef,
} from 'react';
import { useLocation } from 'react-router-dom';
import BigNumber from 'bignumber.js';
import { useWeb3React } from '@web3-react/core';
import { RowType, useMatchBreakpoints } from 'taalswap-uikit';
import styled from 'styled-components';
import { Farm } from 'state/types';
import { useTranslation } from 'contexts/Localization';
import { getBalanceNumber } from 'utils/formatBalance';
import { getFarmApr } from 'utils/apr';
import { orderBy } from 'lodash';
import isArchivedPid from 'utils/farmHelpers';
import { latinise } from 'utils/latinise';
import { OptionProps } from 'views/Components/Select/Select';
import TimeCounter from 'views/Components/TimeCounter';
import {
  useFarms,
  usePollFarmsData,
  usePriceCakeBusd,
} from '../../state/hooks';
import { FarmWithStakedValue } from '../../views/Farms/components/FarmCard/FarmCard';
import Table from '../../views/Farms/components/FarmTable/FarmTable';
import { RowProps } from '../../views/Farms/components/FarmTable/Row';
import {
  DesktopColumnSchema,
  ViewMode,
} from '../../views/Farms/components/types';

const NUMBER_OF_FARMS_VISIBLE = 12;

const Txtcolor = styled.p`
  color: ${({ theme }) => theme.colors.logoColor};
  text-align: center;
`;

const TableWrap: React.FC = () => {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const { data: farmsLP, userDataLoaded } = useFarms();
  const cakePrice = usePriceCakeBusd();
  const [query, setQuery] = useState('');
  const { account } = useWeb3React();
  const [sortOption, setSortOption] = useState('hot');

  const isArchived = pathname.includes('archived');
  const isInactive = pathname.includes('history');
  const isActive = !isInactive && !isArchived;

  const { isXl, isLg } = useMatchBreakpoints();

  usePollFarmsData(isArchived);

  const userDataReady = !account || (!!account && userDataLoaded);

  const [stakedOnly, setStakedOnly] = useState(!isActive);
  useEffect(() => {
    setStakedOnly(!isActive);
  }, [isActive]);

  const activeFarms = farmsLP.filter(
    (farm) =>
      farm.pid !== 0 && farm.multiplier !== '0X' && !isArchivedPid(farm.pid)
  );
  const inactiveFarms = farmsLP.filter(
    (farm) =>
      farm.pid !== 0 && farm.multiplier === '0X' && !isArchivedPid(farm.pid)
  );
  const archivedFarms = farmsLP.filter((farm) => isArchivedPid(farm.pid));

  const stakedOnlyFarms = activeFarms.filter(
    (farm) =>
      farm.userData &&
      new BigNumber(farm.userData.stakedBalance).isGreaterThan(0)
  );

  const stakedInactiveFarms = inactiveFarms.filter(
    (farm) =>
      farm.userData &&
      new BigNumber(farm.userData.stakedBalance).isGreaterThan(0)
  );

  const stakedArchivedFarms = archivedFarms.filter(
    (farm) =>
      farm.userData &&
      new BigNumber(farm.userData.stakedBalance).isGreaterThan(0)
  );

  const farmsList = useCallback(
    (farmsToDisplay: Farm[]): FarmWithStakedValue[] => {
      let farmsToDisplayWithAPR: FarmWithStakedValue[] = farmsToDisplay.map(
        (farm) => {
          if (!farm.lpTotalInQuoteToken || !farm.quoteToken.busdPrice) {
            return farm;
          }
          const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(
            farm.quoteToken.busdPrice
          );
          const apr = isActive
            ? getFarmApr(
                new BigNumber(farm.poolWeight),
                cakePrice,
                totalLiquidity
              )
            : 0;

          return { ...farm, apr, liquidity: totalLiquidity };
        }
      );

      if (query) {
        const lowercaseQuery = latinise(query.toLowerCase());
        farmsToDisplayWithAPR = farmsToDisplayWithAPR.filter(
          (farm: FarmWithStakedValue) => {
            return latinise(farm.lpSymbol.toLowerCase()).includes(
              lowercaseQuery
            );
          }
        );
      }
      return farmsToDisplayWithAPR;
    },
    [cakePrice, query, isActive]
  );

  const loadMoreRef = useRef<HTMLDivElement>(null);

  const [numberOfFarmsVisible, setNumberOfFarmsVisible] = useState(
    NUMBER_OF_FARMS_VISIBLE
  );
  const [observerIsSet, setObserverIsSet] = useState(false);

  const farmsStakedMemoized = useMemo(() => {
    let farmsStaked = [];

    const sortFarms = (farms: FarmWithStakedValue[]): FarmWithStakedValue[] => {
      switch (sortOption) {
        case 'apr':
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => farm.apr,
            'desc'
          );
        case 'multiplier':
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) =>
              farm.multiplier ? Number(farm.multiplier.slice(0, -1)) : 0,
            'desc'
          );
        case 'earned':
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) =>
              farm.userData ? Number(farm.userData.earnings) : 0,
            'desc'
          );
        case 'liquidity':
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => Number(farm.liquidity),
            'desc'
          );
        default:
          return farms;
      }
    };

    if (isActive) {
      farmsStaked = stakedOnly
        ? farmsList(stakedOnlyFarms)
        : farmsList(activeFarms);
    }
    if (isInactive) {
      farmsStaked = stakedOnly
        ? farmsList(stakedInactiveFarms)
        : farmsList(inactiveFarms);
    }
    if (isArchived) {
      farmsStaked = stakedOnly
        ? farmsList(stakedArchivedFarms)
        : farmsList(archivedFarms);
    }

    return sortFarms(farmsStaked).slice(0, numberOfFarmsVisible);
  }, [
    sortOption,
    activeFarms,
    farmsList,
    inactiveFarms,
    archivedFarms,
    isActive,
    isInactive,
    isArchived,
    stakedArchivedFarms,
    stakedInactiveFarms,
    stakedOnly,
    stakedOnlyFarms,
    numberOfFarmsVisible,
  ]);

  useEffect(() => {
    const showMoreFarms = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setNumberOfFarmsVisible(
          (farmsCurrentlyVisible) =>
            farmsCurrentlyVisible + NUMBER_OF_FARMS_VISIBLE
        );
      }
    };

    if (!observerIsSet) {
      const loadMoreObserver = new IntersectionObserver(showMoreFarms, {
        rootMargin: '0px',
        threshold: 1,
      });
      loadMoreObserver.observe(loadMoreRef.current);
      setObserverIsSet(true);
    }
  }, [farmsStakedMemoized, observerIsSet]);

  const getMultiplierAvg = () => {
    let result = 0;
    farmsStakedMemoized.forEach((row) => {
      const multiplier = row.multiplier;
      if (multiplier !== undefined) {
        result += parseInt(multiplier.replace('X', ''));
      }
    });
    return result;
  };

  const rowData = farmsStakedMemoized.map((farm) => {
    const { token, quoteToken } = farm;
    const tokenAddress = token.address;
    const quoteTokenAddress = quoteToken.address;
    const lpLabel =
      farm.lpSymbol &&
      farm.lpSymbol.split(' ')[0].toUpperCase().replace('TAAL', '');

    const row: RowProps = {
      apr: {
        value:
          farm.apr &&
          farm.apr.toLocaleString('en-US', { maximumFractionDigits: 2 }),
        multiplier: farm.multiplier,
        lpLabel,
        tokenAddress,
        quoteTokenAddress,
        cakePrice,
        originalValue: farm.apr,
      },
      farm: {
        image: farm.lpSymbol.split(' ')[0].toLocaleLowerCase(),
        label: lpLabel,
        pid: farm.pid,
      },
      earned: {
        earnings: getBalanceNumber(new BigNumber(farm.userData.earnings)),
        pid: farm.pid,
      },
      liquidity: {
        liquidity: farm.liquidity,
      },
      multiplier: {
        multiplier: farm.multiplier,
        multiplierAvg: getMultiplierAvg(),
      },
      details: farm,
      isLandingPage: true,
    };

    return row;
  });

  const renderContent = (): JSX.Element => {
    const columnSchema = DesktopColumnSchema;

    const columns = columnSchema.map((column) => ({
      id: column.id,
      name: column.name,
      label: column.label,
      sort: (a: RowType<RowProps>, b: RowType<RowProps>) => {
        switch (column.name) {
          case 'farm':
            return b.id - a.id;
          case 'apr':
            if (a.original.apr.value && b.original.apr.value) {
              return (
                Number(a.original.apr.value) - Number(b.original.apr.value)
              );
            }

            return 0;
          case 'earned':
            return a.original.earned.earnings - b.original.earned.earnings;
          default:
            return 1;
        }
      },
      sortable: column.sortable,
    }));

    return (
      <Table
        data={rowData}
        columns={columns}
        userDataReady={userDataReady}
        isLandingPage
      />
    );
  };

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
          <Txtcolor className="section_tit">Farms</Txtcolor>
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
            <Txtcolor className="section_tit">Farms</Txtcolor>
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
      {renderContent()}
      <div ref={loadMoreRef} />
    </div>
  );
};

export default TableWrap;

import React, {
  useEffect,
  useCallback,
  useState,
  useMemo,
  useRef,
} from 'react';
import { Route, useRouteMatch, useLocation } from 'react-router-dom';
import BigNumber from 'bignumber.js';
import { useWeb3React } from '@web3-react/core';
import { Heading, RowType, Toggle, Text, CalculateIcon } from 'taalswap-uikit';
import styled from 'styled-components';
import FlexLayout from 'views/Components/layout/Flex';
import Page from 'views/Components/layout/Page';
import { useFarms, usePollFarmsData, usePriceCakeBusd } from 'state/hooks';
import usePersistState from 'hooks/usePersistState';
import { Farm } from 'state/types';
import { useTranslation } from 'contexts/Localization';
import { getBalanceNumber } from 'utils/formatBalance';
import { getFarmApr } from 'utils/apr';
import { chain, orderBy } from 'lodash';
import isArchivedPid from 'utils/farmHelpers';
import { latinise } from 'utils/latinise';
import PageHeader from 'views/Components/PageHeader';
import SearchInput from 'views/Components/SearchInput';
import Select, { OptionProps } from 'views/Components/Select/Select';
import FarmCard, { FarmWithStakedValue } from './components/FarmCard/FarmCard';
import Table from './components/FarmTable/FarmTable';
import FarmTabButtons from './components/FarmTabButtons';
import { RowProps } from './components/FarmTable/Row';
import ToggleView from './components/ToggleView/ToggleView';
import { DesktopColumnSchema, ViewMode } from './components/types';
import Teaser from '../../pages/LandingPageView/Teaser_page';
import getChainId from '../../utils/getChainId';

const ControlContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

  justify-content: space-between;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 32px;

  ${({ theme }) => theme.mediaQueries.xl} {
    justify-content: space-between;
    flex-direction: row;
    padding: 16px 0;
    flex-wrap: nowrap;
    margin-bottom: 0;
  }
`;

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;

  ${Text} {
    margin-left: 8px;
  }
`;

const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 0px;

  ${({ theme }) => theme.mediaQueries.xl} {
    width: auto;
    padding: 0;
  }
`;

const Customflex = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin-right: 16px;
  ${({ theme }) => theme.mediaQueries.xl} {
    margin-right: 0;
  }
  > ${Text} {
    font-size: 12px;
  }
`;

const ViewControls = styled.div`
  flex-wrap: wrap;
  justify-content: space-between;
  display: flex;
  align-items: center;
  width: 100%;

  > div {
    padding: 8px 0px;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    justify-content: flex-start;
    width: auto;
    flex-wrap: nowrap;
    > div {
      padding: 0;
    }
  }
`;

// const StyledImage = styled(Image)`
//   margin-left: auto;
//   margin-right: auto;
//   margin-top: 58px;
// `

const NUMBER_OF_FARMS_VISIBLE = 12;

const Farms: React.FC = () => {
  const { path } = useRouteMatch();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const { data: farmsLP, userDataLoaded } = useFarms();
  const cakePrice = usePriceCakeBusd();
  const [query, setQuery] = useState('');
  // const [viewMode, setViewMode] = usePersistState(ViewMode.TABLE, 'pancake_farm_view')
  const [viewMode, setViewMode] = usePersistState(
    ViewMode.TABLE,
    'taalswap_farm_view'
  );
  const { account } = useWeb3React();
  const [sortOption, setSortOption] = useState('hot');

  const isArchived = pathname.includes('archived');
  const isInactive = pathname.includes('history');
  const isActive = !isInactive && !isArchived;

  usePollFarmsData(isArchived);

  // Users with no wallet connected should see 0 as Earned amount
  // Connected users should see loading indicator until first userData has loaded
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

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const loadMoreRef = useRef<HTMLDivElement>(null);

  const [numberOfFarmsVisible, setNumberOfFarmsVisible] = useState(
    NUMBER_OF_FARMS_VISIBLE
  );
  const [observerIsSet, setObserverIsSet] = useState(false);
  const chainId = getChainId();

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
    // const a = farmsStakedMemoized.map((row) => console.log(row.multiplier.replace('X', '')))
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
      isLandingPage: false,
    };

    return row;
  });

  const renderContent = (): JSX.Element => {
    if (viewMode === ViewMode.TABLE && rowData.length) {
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
          isLandingPage={false}
        />
      );
    }

    return (
      <div>
        <FlexLayout>
          <Route exact path={`${path}`}>
            {farmsStakedMemoized.map((farm) => (
              <FarmCard
                key={farm.pid}
                farm={farm}
                cakePrice={cakePrice}
                account={account}
                removed={false}
              />
            ))}
          </Route>
          <Route exact path={`${path}/history`}>
            {farmsStakedMemoized.map((farm) => (
              <FarmCard
                key={farm.pid}
                farm={farm}
                cakePrice={cakePrice}
                account={account}
                removed
              />
            ))}
          </Route>
          <Route exact path={`${path}/archived`}>
            {farmsStakedMemoized.map((farm) => (
              <FarmCard
                key={farm.pid}
                farm={farm}
                cakePrice={cakePrice}
                account={account}
                removed
              />
            ))}
          </Route>
        </FlexLayout>
      </div>
    );
  };

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value);
  };

  return (
    <>
      {/* <Teaser /> */}
      <PageHeader>
        <div
          style={{
            borderBottom: '1px solid rgba(133,133,133,0.1)',
            paddingBottom: '32px',
          }}
        >
          <Heading
            as="h1"
            color="text"
            mb="15px"
            style={{ fontSize: '30px', fontWeight: 'bold' }}
          >
            {t('Farms')}
          </Heading>
          <Heading color="textSubtle" style={{ fontSize: '16px' }}>
            {t('Start farming by staking your LP tokens')}
          </Heading>
        </div>
      </PageHeader>
      <Page>
        <ControlContainer>
          <ViewControls>
            <ToggleView
              viewMode={viewMode}
              onToggle={(mode: ViewMode) => setViewMode(mode)}
            />
            <FarmTabButtons
              hasStakeInFinishedFarms={stakedInactiveFarms.length > 0}
            />
            <ToggleWrapper>
              <Toggle
                checked={stakedOnly}
                onChange={() => setStakedOnly(!stakedOnly)}
                scale="sm"
              />
              <Text> {t('Staked only')}</Text>
            </ToggleWrapper>
          </ViewControls>
          <FilterContainer>
            <Customflex>
              <Text textTransform="uppercase" color="textSubtle">
                {t('Sort by')}
              </Text>
              <Select
                options={[
                  {
                    label: t('Hot'),
                    value: 'hot',
                  },
                  {
                    label: t('APR'),
                    value: 'apr',
                  },
                  {
                    label: t('Multiplier'),
                    value: 'multiplier',
                  },
                  {
                    label: t('Earned'),
                    value: 'earned',
                  },
                  {
                    label: t('Liquidity'),
                    value: 'liquidity',
                  },
                ]}
                onChange={handleSortOptionChange}
              />
            </Customflex>
            <LabelWrapper style={{ marginLeft: '16px', width: '50%' }}>
              <Text textTransform="uppercase" color="textSubtle">
                {t('Search')}
              </Text>
              <SearchInput
                onChange={handleChangeQuery}
                placeholder="Search Farms"
              />
            </LabelWrapper>
          </FilterContainer>
        </ControlContainer>
        {renderContent()}
        <div ref={loadMoreRef} />
      </Page>
    </>
  );
};

export default Farms;

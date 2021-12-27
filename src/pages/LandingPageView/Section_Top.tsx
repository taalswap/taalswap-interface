import React, {
  useEffect,
  useCallback,
  useState,
  useMemo,
  useRef,
} from 'react';

import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import BigNumber from 'bignumber.js';
import { useWeb3React } from '@web3-react/core';
import { Text, Skeleton, Button, useModal } from 'taalswap-uikit';
import UnlockButton from 'views/Components/UnlockButton';
import {
  useFarms,
  usePollFarmsData,
  usePriceCakeBusd,
  usePools,
  useCakeVault,
  useFetchCakeVault,
  useFetchPublicPoolsData,
} from 'state/hooks';

import useFarmsWithBalance from 'hooks/useFarmsWithBalance';
import Balance from 'views/Components/Balance';
import BountyModal from 'views/Pools/components/BountyModal';
import { useMasterchef } from 'hooks/useContract';
import { harvest } from 'utils/callHelpers';
import {
  useTotalSupply,
  useBurnedBalance,
  useDeployerBalance,
  useTotalAssets,
} from 'hooks/useTokenBalance';
import { getTaalAddress } from 'utils/addressHelpers';
import { Farm } from 'state/types';
import { useTranslation } from 'contexts/Localization';
import { getBalanceNumber } from 'utils/formatBalance';
import { getFarmApr } from 'utils/apr';
import { orderBy } from 'lodash';
import isArchivedPid from 'utils/farmHelpers';
import { latinise } from 'utils/latinise';

import TimeCounter from 'views/Components/TimeCounter';
import CardValue from 'views/Home/components/CardValue';
import { FarmWithStakedValue } from '../../views/Farms/components/FarmCard/FarmCard';

import circleImg01 from './images/cilcle_icon01.png';
import circleImg02 from './images/cilcle_icon02.png';
import circleImg03 from './images/cilcle_icon03.png';
import circleImg04 from './images/cilcle_icon04.png';
import info2Img01 from './images/info2_icon01.png';
import info2Img02 from './images/info2_icon02.png';
import info2Img03 from './images/info2_icon03.png';
import info2Img04 from './images/info2_icon04.png';
import getKlaytnApiUrl from '../../utils/getKlaytnApiUrl';

const NUMBER_OF_FARMS_VISIBLE = 12;

const StyledTotalTvlDiv = styled.div`
  display: flex;
  justify-content: flex-start;
  align-content: center;
  // align-items: center;
  color: red;
  margin-bottom: 10px;
  ${({ theme }) => theme.mediaQueries.lg} {
    display: flex;
    justify-content: flex-start;
    color: blue;
  }
`;

const StyledTvlItemsWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  ${({ theme }) => theme.mediaQueries.xl} {
    flex-direction: row;
    font-size: 16px;
    margin-bottom: 20px;
  }
`;

const StyledTvlItemDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  font-size: 12px;
  margin-right: 1.5rem;
  ${({ theme }) => theme.mediaQueries.xl} {
    flex-direction: row;
    font-size: 16px;
  }
`;

const Usewrap = styled.ul`
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
`;
const Txtcolor = styled.span`
  color: ${({ theme }) => theme.colors.logoColor};
`;
const Titcolor = styled.span`
  color: ${({ theme }) => theme.colors.textSubtle};
`;
const Titcolor2 = styled.p`
  color: ${({ theme }) => theme.colors.logoColor};
`;
const Txtcolor3 = styled.span`
  color: ${({ theme }) => theme.colors.logoColor};
  border-bottom: 2px solid ${({ theme }) => theme.colors.logoColor};
`;

/* ----------------------------- 임시 ------------------------------ */

const TempDiv = styled.div`
  padding-left: 0px;
  padding-right: 0px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-left: 10px;
    padding-right: 10px;
  }
`;

/* ----------------------------- 임시 끝 ------------------------------ */

const SectionTop: React.FC = () => {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const {
    estimatedCakeBountyReward,
    totalPendingCakeHarvest,
    fees: { callFee },
  } = useCakeVault();

  const { data: farmsLP, userDataLoaded } = useFarms();
  const cakePrice = usePriceCakeBusd();
  const [query, setQuery] = useState('');
  const { account } = useWeb3React();
  const [sortOption, setSortOption] = useState('hot');
  const [talTvl, setTalTvl] = useState(0);
  const [ethTvl, setEthTvl] = useState(0);
  const [klayTvl, setKlayTvl] = useState(0);
  const [talPrice, setTalPrice] = useState(0);
  const [talStakedTotal, setTalStakedTotal] = useState(0);
  const [maxApr, setMaxApr] = useState(0);
  const [transactions24, setTransactions24] = useState(0);
  const [transactions24Eth, setTransactions24Eth] = useState(0);
  const [transactions24Klay, setTransactions24Klay] = useState(0);
  const [volumeUSD24, setVolumeUSD24] = useState(0);
  const [volumeUSD24Eth, setVolumeUSD24Eth] = useState(0);
  const [volumeUSD24Klay, setVolumeUSD24Klay] = useState(0);
  const [pendingTx, setPendingTx] = useState(false);
  const [myAssets, setMyAssets] = useState(0);

  const farmsWithBalance = useFarmsWithBalance();
  const masterChefContract = useMasterchef();
  const balancesWithValue = farmsWithBalance.filter(
    (balanceType) => balanceType.balance.toNumber() > 0
  );
  const cakePriceBusd = usePriceCakeBusd();

  const curChainId =
    localStorage.getItem('chainId') === undefined
      ? process.env.EACT_APP_CHAIN_ID
      : localStorage.getItem('chainId');

  const estimatedDollarBountyReward = useMemo(() => {
    return new BigNumber(estimatedCakeBountyReward).multipliedBy(cakePriceBusd);
  }, [cakePriceBusd, estimatedCakeBountyReward]);

  const hasFetchedDollarBounty = estimatedDollarBountyReward.gte(0);
  const hasFetchedCakeBounty = estimatedCakeBountyReward
    ? estimatedCakeBountyReward.gte(0)
    : false;
  const dollarBountyToDisplay = hasFetchedDollarBounty
    ? getBalanceNumber(estimatedDollarBountyReward, 18)
    : 0;
  const cakeBountyToDisplay = hasFetchedCakeBounty
    ? getBalanceNumber(estimatedCakeBountyReward, 18)
    : 0;
  const isArchived = pathname.includes('archived');
  const isInactive = pathname.includes('history');
  const isActive = !isInactive && !isArchived;

  const totalSupply = useTotalSupply();
  const burnedBalance = getBalanceNumber(useBurnedBalance(getTaalAddress()));
  const deployerBalance = getBalanceNumber(
    useDeployerBalance(getTaalAddress())
  );
  const cakeSupply = totalSupply
    ? getBalanceNumber(totalSupply) - burnedBalance
    : 0;

  const totalAssets = useTotalAssets();

  const interfaceBaseUrl =
    process.env.REACT_APP_INTERFACE || 'http://localhost:3000';

  usePollFarmsData(isArchived);
  useFetchPublicPoolsData();
  useFetchCakeVault();

  // Users with no wallet connected should see 0 as Earned amount
  // Connected users should see loading indicator until first userData has loaded
  const userDataReady = !account || (!!account && userDataLoaded);

  const {
    userData: { userShares },
    fees: { performanceFee },
    totalCakeInVault,
  } = useCakeVault();

  const [stakedOnly, setStakedOnly] = useState(!isActive);
  useEffect(() => {
    setStakedOnly(!isActive);
  }, [isActive]);

  useEffect(() => {
    setMyAssets(totalAssets);
  }, [totalAssets]);

  const { pools: poolsWithoutAutoVault } = usePools(account);
  const pools = useMemo(() => {
    const cakePool = poolsWithoutAutoVault.find((pool) => pool.sousId === 0);
    const cakeAutoVault = { ...cakePool, isAutoVault: true };
    return [cakeAutoVault, ...poolsWithoutAutoVault];
  }, [poolsWithoutAutoVault]);

  const getTalStaked = useCallback(() => {
    let result = 0;
    pools.forEach((pool) => {
      if (pool.isAutoVault) {
        result += getBalanceNumber(
          totalCakeInVault,
          pool.stakingToken.decimals
        );
      } else if (pool.sousId === 0) {
        const manualCakeTotalMinusAutoVault = new BigNumber(
          pool.totalStaked
        ).minus(totalCakeInVault);
        result += getBalanceNumber(
          manualCakeTotalMinusAutoVault,
          pool.stakingToken.decimals
        );
      } else {
        result += getBalanceNumber(
          pool.totalStaked,
          pool.stakingToken.decimals
        );
      }
    });

    setTalStakedTotal(result);
  }, [pools, totalCakeInVault]);

  useEffect(() => {
    async function fetchEthTvlData() {
      let result = 0;
      getTalStaked();
      fetch('https://taalswap-info-api-black.vercel.app/api/tvl', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((response) => {
          if (cakePrice.isNaN()) {
            result = parseFloat(response.data.tvl);
          } else {
            result =
              parseFloat(response.data.tvl) +
              talStakedTotal * cakePrice.toNumber();
          }
          setEthTvl(result);
        });

      setTalPrice(cakePrice.toNumber());
    }

    async function fetchKlayTvlData() {
      let result = 0;
      getTalStaked();
      fetch(`${getKlaytnApiUrl()}/tvl`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((response) => {
          result = parseFloat(response.data.tvl);

          // if (cakePrice.isNaN()) {
          //   result = parseFloat(response.data.tvl)
          // } else {
          //   result = parseFloat(response.data.tvl) + talStakedTotal * cakePrice.toNumber()
          // }
          setKlayTvl(result);
        });

      // setTalPrice(cakePrice.toNumber())
    }

    fetchEthTvlData();
    fetchKlayTvlData();
  }, [ethTvl, setEthTvl, cakePrice, setTalPrice, talStakedTotal, getTalStaked]);

  useEffect(() => {
    async function fetchData24h() {
      await fetch('https://taalswap-info-api-black.vercel.app/api/daily', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((response) => {
          setTransactions24Eth(response.data.transactions);
          setVolumeUSD24Eth(response.data.volumeUSD);
        });

      await fetch(`${getKlaytnApiUrl()}/daily`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((response) => {
          setTransactions24Klay(response.data.transactions);
          setVolumeUSD24Klay(response.data.volumeUSD);
        });

      setTransactions24(transactions24Eth + transactions24Klay);
      setVolumeUSD24(Math.floor(volumeUSD24Eth) + Math.floor(volumeUSD24Klay));
    }

    fetchData24h();
  }, [transactions24Eth, transactions24Klay, volumeUSD24Eth, volumeUSD24Klay]);

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

  const [numberOfFarmsVisible, setNumberOfFarmsVisible] = useState(
    NUMBER_OF_FARMS_VISIBLE
  );

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

  const getTotalAssets = () => {
    let result = 0;
    farmsStakedMemoized.forEach((farm) => {
      if (farm.userData.earnings !== '0') {
        result += Number(farm.liquidity);
      }
    });
    return result;
  };

  const getTotalEarned = () => {
    let result = 0;
    farmsStakedMemoized.forEach((farm) => {
      const earnings = getBalanceNumber(new BigNumber(farm.userData.earnings));
      result += earnings;
    });
    return result;
  };

  const getTotalApr = () => {
    let result = 0;
    let cnt = 0;
    farmsStakedMemoized.forEach((farm) => {
      if (maxApr < farm.apr) {
        setMaxApr(farm.apr);
      }
      if (farm.userData.earnings !== '0') {
        result += farm.apr;
        cnt++;
      }
    });

    const returnValue = result / cnt;

    if (Number.isNaN(returnValue)) {
      return 0;
    }
    return returnValue;
  };

  const TooltipComponent = () => (
    <>
      <Text mb="16px">
        {t(
          'This bounty is given as a reward for providing a service to other users.'
        )}
      </Text>
      <Text mb="16px">
        {t(
          'Whenever you successfully claim the bounty, you’re also helping out by activating the Auto TAL Pool’s compounding function for everyone.'
        )}
      </Text>
      <Text style={{ fontWeight: 'bold' }}>
        {t(
          'Auto-Compound Bounty: %fee%% of all Auto TAL pool users pending yield',
          { fee: callFee / 100 }
        )}
      </Text>
    </>
  );

  const [onPresentBountyModal] = useModal(
    <BountyModal
      cakeBountyToDisplay={cakeBountyToDisplay}
      dollarBountyToDisplay={dollarBountyToDisplay}
      totalPendingCakeHarvest={totalPendingCakeHarvest}
      callFee={callFee}
      TooltipComponent={TooltipComponent}
    />
  );

  const linkToURL = (url: string) => {
    window.location.href = url;
  };

  const harvestAllFarms = useCallback(async () => {
    setPendingTx(true);
    // eslint-disable-next-line no-restricted-syntax
    for (const farmWithBalance of balancesWithValue) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await harvest(masterChefContract, farmWithBalance.pid, account);
      } catch (error) {
        // TODO: find a way to handle when the user rejects transaction or it fails
      }
    }
    setPendingTx(false);
  }, [account, balancesWithValue, masterChefContract]);

  return (
    <div className="top_wrap">
      <div className="cont">
        <div className="cont_top">
          <div>
            <p className="home_title">
              Boost your assets the way <br />
              you&apos;ve never imagined
            </p>
            <p className="home_subtit">
              A cross-chain AMM protocol to safeguard and increase your assets
            </p>
            {/* <Button className="start_btn" onClick={() => linkToURL('http://localhost:3000/#/swap')}> */}
            <Button
              className="start_btn"
              onClick={() => linkToURL(`${interfaceBaseUrl}/#/swap`)}
            >
              {t('Swap')}
            </Button>
          </div>
          <div className="top_buyline">
            <p className="buy_name">{t('Total Value Locked (TVL)')}</p>
            <StyledTotalTvlDiv className="buy_num">
              <div>$</div>
              <div>
                <CardValue
                  value={ethTvl + klayTvl}
                  color="#005046"
                  fontSize="45"
                  decimals={0}
                />
              </div>
            </StyledTotalTvlDiv>
            <StyledTvlItemsWrap>
              <StyledTvlItemDiv>
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <span style={{ color: '#00ab55', marginRight: '5px' }}>
                    Ethereum :{' '}
                  </span>
                  <span>$</span>
                  <CardValue
                    value={ethTvl}
                    color="#005046"
                    fontSize="45"
                    decimals={0}
                  />
                </div>
              </StyledTvlItemDiv>
              <StyledTvlItemDiv>
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <span style={{ color: '#00ab55', marginRight: '5px' }}>
                    Klaytn :{' '}
                  </span>
                  <span>$</span>
                  <CardValue
                    value={klayTvl}
                    color="#005046"
                    fontSize="45"
                    decimals={0}
                  />
                </div>
              </StyledTvlItemDiv>
            </StyledTvlItemsWrap>
            <div className="buy_btnwrap">
              <Button
                value={t('Buy TAL')}
                onClick={() =>
                  parseInt(curChainId) < 1000
                    ? linkToURL(
                        `${interfaceBaseUrl}/#/swap/${curChainId}/ETH/0x00`
                      )
                    : linkToURL(
                        `${interfaceBaseUrl}/#/swap/${curChainId}/KLAY/0x00`
                      )
                }
                className="buy_Btn"
              >
                {t('Buy')}
              </Button>
            </div>
          </div>
        </div>

        {/* ----------------------------- 임시 ------------------------------ */}
        {/* <div
          className="input_wrap"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'nowrap',
          }}
        >
          <TempDiv className="taal_info info02" style={{ width: '100%' }}>
            <Usewrap style={{ justifyContent: 'space-around' }}>
              <li>
                <div>
                  <img src={info2Img02} alt="info_icon" />
                  <Titcolor className="img_tit">{t('# of Transactions (24H)')}</Titcolor>
                </div>
                <Txtcolor className="info_num">
                  <CardValue fontSize="29" value={transactions24} decimals={0} />
                </Txtcolor>
              </li>
              <li>
                <div>
                  <img src={info2Img03} alt="info_icon" />
                  <Titcolor className="img_tit">{t('# of Volume USD (24H)')}</Titcolor>
                </div>
                <div>
                  <Txtcolor className="info_num">
                    <CardValue fontSize="29" value={volumeUSD24} decimals={0} />
                  </Txtcolor>
                  <Titcolor className="info_name">USD</Titcolor>
                </div>
              </li>
            </Usewrap>
          </TempDiv>
          <TempDiv className="taal_info info02" style={{ width: '100%' }}>
            <Usewrap style={{ justifyContent: 'space-around' }}>
              <li>
                <Txtcolor>{t('My Portfolio')}</Txtcolor>
              </li>
              <li>
                <div>
                  <Titcolor className="img_tit" style={{ marginLeft: '0px' }}>
                    {t('My Total Assets')}
                  </Titcolor>
                </div>
                <div>
                  {account && myAssets !== undefined ? (
                    <>
                      {' '}
                      <Txtcolor className="info_num">
                        <CardValue fontSize="29" value={myAssets} />
                      </Txtcolor>
                      <Titcolor className="info_name">USD</Titcolor>
                    </>
                  ) : (
                    <UnlockButton style={{ fontSize: '13px', padding: '10px' }} className="start_btn" width="100%" />
                  )}
                </div>
              </li>
            </Usewrap>
          </TempDiv>
        </div> */}

        {/* ----------------------------- 임시 끝 ------------------------------ */}

        {/* ----------------------------- 원본 시작 ------------------------------ */}
        <div className="input_wrap">
          <div className="taal_info info01">
            <Usewrap>
              <li>
                <img src={circleImg01} alt="circle_icon" />
                <Titcolor className="info_title">{t('TAL Price')}</Titcolor>
              </li>
              <li>
                <Txtcolor className="info_num">
                  <CardValue fontSize="29" value={talPrice} />
                </Txtcolor>
                <Titcolor className="info_name">USD</Titcolor>
              </li>
            </Usewrap>
          </div>
          <div className="taal_info info02">
            <Usewrap>
              <li>
                <div>
                  <img src={info2Img01} alt="info_icon" />
                  <Titcolor className="img_tit">{t('Maximum APR')}</Titcolor>
                </div>
                <Txtcolor
                  className="info_num"
                  style={{ display: 'flex', justifyContent: 'flex-start' }}
                >
                  <span>
                    <CardValue fontSize="29" value={maxApr} />
                  </span>
                  %
                </Txtcolor>
              </li>
              <li>
                <div>
                  <img src={info2Img02} alt="info_icon" />
                  <Titcolor className="img_tit">
                    {t('# of Transactions (24H)')}
                  </Titcolor>
                </div>
                <Txtcolor className="info_num">
                  <CardValue
                    fontSize="29"
                    value={transactions24}
                    decimals={0}
                  />
                </Txtcolor>
              </li>
              <li>
                <div>
                  <img src={info2Img03} alt="info_icon" />
                  <Titcolor className="img_tit">
                    {t('# of Volume USD (24H)')}
                  </Titcolor>
                </div>
                <div>
                  <Txtcolor className="info_num">
                    <CardValue fontSize="29" value={volumeUSD24} decimals={0} />
                  </Txtcolor>
                  <Titcolor className="info_name">USD</Titcolor>
                </div>
              </li>
            </Usewrap>
          </div>

          <div className="taal_info info03">
            <Usewrap>
              <li style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <img src={info2Img04} alt="info_icon" />
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-between',
                  }}
                >
                  <Titcolor
                    style={{ marginRight: '0px', width: 'auto', color: 'red' }}
                    className="info_title"
                  >
                    {t('Rewards starting in')}
                  </Titcolor>
                </div>
                <TimeCounter />
              </li>
              <li>
                <div>
                  <img src={circleImg03} alt="info_icon" />
                  <Titcolor className="info_name">
                    {t('TAL minted per block')}
                  </Titcolor>
                </div>
                <Txtcolor className="info_num">
                  <CardValue fontSize="16px" value={40} decimals={0} />
                </Txtcolor>
              </li>
              <li>
                <div>
                  <img src={info2Img01} alt="info_icon" />
                  <Titcolor className="info_name">
                    {t('Auto TAL Bounty')}
                  </Titcolor>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div className="Tal_num">
                    {hasFetchedCakeBounty ? (
                      <Balance
                        fontSize="16px"
                        bold
                        value={cakeBountyToDisplay}
                        decimals={3}
                      />
                    ) : (
                      <Skeleton height={20} width={96} mb="5px" />
                    )}
                  </div>
                  <div>
                    <Button
                      disabled={
                        !dollarBountyToDisplay ||
                        !cakeBountyToDisplay ||
                        !callFee
                      }
                      onClick={onPresentBountyModal}
                      scale="sm"
                      marginLeft="10px"
                      style={{ fontSize: '14px', padding: '0 10px' }}
                    >
                      {t('Claim')}
                    </Button>
                  </div>
                </div>
              </li>
            </Usewrap>
          </div>
          <div className="taal_info info04">
            <Usewrap>
              <li>
                <div>
                  <img src={circleImg02} alt="circle_icon" />
                  <Titcolor className="info_title">
                    {t('TAL Market Cap.')}
                  </Titcolor>
                </div>
                <div>
                  <Txtcolor className="info_num">
                    <CardValue fontSize="29" value={talPrice * cakeSupply} />
                  </Txtcolor>
                  <Titcolor className="info_name">USD</Titcolor>
                </div>
              </li>
              <li>
                <div>
                  <img src={circleImg03} alt="circle_icon" />
                  <Titcolor className="info_title">{t('TAL Burnt')}</Titcolor>
                </div>
                <div>
                  <Txtcolor className="info_num">
                    <CardValue
                      fontSize="29"
                      value={burnedBalance}
                      decimals={0}
                    />
                  </Txtcolor>
                  <Titcolor className="info_name">TAL</Titcolor>
                </div>
              </li>
              <li>
                <div>
                  <img src={circleImg04} alt="circle_icon" />
                  <Titcolor className="info_title">
                    {t('TAL Circulating Supply')}
                  </Titcolor>
                </div>
                <div>
                  <Txtcolor className="info_num">
                    <CardValue fontSize="29" value={cakeSupply} decimals={0} />
                  </Txtcolor>
                  <Titcolor className="info_name">TAL</Titcolor>
                </div>
              </li>
            </Usewrap>
          </div>
          <div className="taal_info info_portfolio">
            <Usewrap>
              <li>
                <Txtcolor className="info_title">{t('My Portfolio')}</Txtcolor>

                {account ? (
                  <Button
                    disabled={balancesWithValue.length <= 0 || pendingTx}
                    onClick={harvestAllFarms}
                    scale="sm"
                    style={{ fontSize: '14px', padding: '0 10px' }}
                  >
                    {pendingTx
                      ? t('Collecting TAL')
                      : t('Harvest all (%count%)', {
                          count: balancesWithValue.length,
                        })}
                  </Button>
                ) : null}
              </li>
              <li className="list_progressbar">
                <div>
                  <Titcolor className="progressbar_title">
                    {t('My Average APR')}
                  </Titcolor>
                  <div>
                    <Txtcolor3
                      className="info_num"
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <CardValue fontSize="18" value={getTotalApr()} />
                      <p>%</p>
                    </Txtcolor3>
                  </div>
                </div>
              </li>
              <li className="list_date">
                <ul>
                  <li>
                    <div>
                      <Titcolor className="date_title">
                        {t('My Total Assets')}
                      </Titcolor>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end',
                      }}
                    >
                      <Txtcolor className="date_num">
                        <CardValue fontSize="18" value={getTotalAssets()} />
                      </Txtcolor>
                      <Titcolor className="date_name">USD</Titcolor>
                    </div>
                  </li>
                  <li>
                    <div>
                      <Titcolor className="date_title">
                        {t('TAL Earned')}
                      </Titcolor>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end',
                      }}
                    >
                      <Txtcolor className="date_num">
                        <CardValue fontSize="18" value={getTotalEarned()} />
                      </Txtcolor>
                      <Titcolor className="date_name">TAL</Titcolor>
                    </div>
                  </li>
                </ul>
              </li>
            </Usewrap>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionTop;

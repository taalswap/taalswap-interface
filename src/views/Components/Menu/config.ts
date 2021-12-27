import { MenuEntry } from 'taalswap-uikit';
import { ContextApi } from 'contexts/Localization/types';

const frontendBaseUrl =
  process.env.REACT_APP_FRONTEND || 'http://localhost:3000';
const interfaceBaseUrl =
  process.env.REACT_APP_INTERFACE || 'http://localhost:3000';

const config: (t: ContextApi['t']) => MenuEntry[] = (t) => [
  {
    label: t('Home'),
    icon: 'HomeIcon',
    href: `${interfaceBaseUrl}`,
  },
  // {
  //   label: t('Trade'),
  //   icon: 'TradeIcon',
  //   items: [
  //     {
  //       label: t('Exchange'),
  //       href: 'https://exchange.pancakeswap.finance/#/swap',
  //     },
  //     {
  //       label: t('Liquidity'),
  //       href: 'https://exchange.pancakeswap.finance/#/pool',
  //     },
  //     {
  //       label: t('LP Migration'),
  //       href: 'https://v1exchange.pancakeswap.finance/#/migrate',
  //     },
  //     {
  //       label: t('V1 Liquidity (Old)'),
  //       href: 'https://v1exchange.pancakeswap.finance/#/pool',
  //     },
  //   ],
  // },
  // {
  //   label: t('Swap'),
  //   icon: 'TradeIcon',
  //   // href: 'http://localhost:3000/#/swap',
  //   href: `${interfaceBaseUrl}/#/swap`,
  // },
  {
    label: t('X-Swap'),
    icon: 'TradeIcon',
    // href: 'http://localhost:3000/#/swap',
    href: `${interfaceBaseUrl}/#/xswap`,
  },
  {
    label: t('Liquidity'),
    icon: 'LiquidityIcon',
    // href: 'http://localhost:3000/#/liquidity',
    href: `${interfaceBaseUrl}/#/liquidity`,
  },
  {
    label: t('Farms'),
    icon: 'FarmIcon',
    // href: 'http://localhost:3001/farms',
    href: `${frontendBaseUrl}/#/farms`,
  },
  {
    label: t('Staking'),
    icon: 'PoolIcon',
    // href: 'http://localhost:3001/staking',
    href: `${frontendBaseUrl}/#/staking`,
  },
  {
    label: t('Info'),
    icon: 'InfoIcon',
    href: 'https://taalswap.info/home',
  },
  {
    label: t('Partnership'),
    icon: 'TeamBattleIcon',
    href: 'https://docs.google.com/forms/d/e/1FAIpQLSf6UYO1Olnt1Mevz8Ap5sXSd2T8J2UGKxOBT5Z-hzKF7CYhSg/viewform',
  },
  // {
  //   label: t('Prediction (BETA)'),
  //   icon: 'PredictionsIcon',
  //   href: '/prediction',
  // },
  // {
  //   label: t('Lottery'),
  //   icon: 'TicketIcon',
  //   href: '/lottery',
  // },
  // {
  //   label: t('Collectibles'),
  //   icon: 'NftIcon',
  //   href: '/collectibles',
  // },
  // {
  //   label: t('Team Battle'),
  //   icon: 'TeamBattleIcon',
  //   href: '/competition',
  // },
  // {
  //   label: t('Teams & Profile'),
  //   icon: 'GroupsIcon',
  //   items: [
  //     {
  //       label: t('Leaderboard'),
  //       href: '/teams',
  //     },
  //     {
  //       label: t('Task Center'),
  //       href: '/profile/tasks',
  //     },
  //     {
  //       label: t('Your Profile'),
  //       href: '/profile',
  //     },
  //   ],
  // },
  // {
  //   label: t('Info'),
  //   icon: 'InfoIcon',
  //   items: [
  //     {
  //       label: t('Overview'),
  //       href: 'https://pancakeswap.info',
  //     },
  //     {
  //       label: t('Tokens'),
  //       href: 'https://pancakeswap.info/tokens',
  //     },
  //     {
  //       label: t('Pairs'),
  //       href: 'https://pancakeswap.info/pairs',
  //     },
  //     {
  //       label: t('Accounts'),
  //       href: 'https://pancakeswap.info/accounts',
  //     },
  //   ],
  // },
  // {
  //   label: t('IFO'),
  //   icon: 'IfoIcon',
  //   href: '/ifo',
  // },
  // {
  //   label: t('More'),
  //   icon: 'MoreIcon',
  //   items: [
  //     {
  //       label: t('Contact'),
  //       href: 'https://docs.pancakeswap.finance/contact-us',
  //     },
  //     {
  //       label: t('Voting'),
  //       href: 'https://voting.pancakeswap.finance',
  //     },
  //     {
  //       label: t('Github'),
  //       href: 'https://github.com/pancakeswap',
  //     },
  //     {
  //       label: t('Docs'),
  //       href: 'https://docs.pancakeswap.finance',
  //     },
  //     {
  //       label: t('Blog'),
  //       href: 'https://pancakeswap.medium.com',
  //     },
  //     {
  //       label: t('Merch'),
  //       href: 'https://pancakeswap.creator-spring.com/',
  //     },
  //   ],
  // },
];

export default config;

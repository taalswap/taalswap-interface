import { MenuEntry } from 'taalswap-uikit';
import { ContextApi } from 'contexts/Localization/types';

const frontendBaseUrl =
  process.env.REACT_APP_FRONTEND || 'http://localhost:3001';
const interfaceBaseUrl =
  process.env.REACT_APP_INTERFACE || 'http://localhost:3000';

const config: (t: ContextApi['t']) => MenuEntry[] = (t) => [
  {
    label: t('Home'),
    icon: 'HomeIcon',
    href: `${frontendBaseUrl}`,
  },
  // {
  //   label: 'Trade',
  //   icon: 'TradeIcon',
  //   initialOpenState: true,
  //   // status: {
  //   //   text: 'MIGRATE',
  //   //   color: 'warning'
  //   // },
  //   items: [
  //     {
  //       label: 'Exchange',
  //       href: 'http://localhost:3000/#/swap'
  //     },
  //     {
  //       label: 'Liquidity',
  //       href: 'http://localhost:3000/#/pool'
  //     }
  //   ]
  // },
  {
    label: t('Swap Menu'),
    icon: 'TradeIcon',
    // href: 'http://localhost:3000/#/swap',
    href: `${interfaceBaseUrl}/#/swap`,
  },
  {
    label: t('Liquidity Menu'),
    icon: 'LiquidityIcon',
    // href: 'http://localhost:3000/#/liquidity',
    href: `${interfaceBaseUrl}/#/liquidity`,
  },
  {
    label: t('Farms Menu'),
    icon: 'FarmIcon',
    // href: 'http://localhost:3001/farms',
    href: `${frontendBaseUrl}/farms`,
  },
  {
    label: t('Staking'),
    icon: 'PoolIcon',
    // href: 'http://localhost:3001/staking',
    href: `${frontendBaseUrl}/staking`,
  },
  {
    label: t('Info'),
    icon: 'InfoIcon',
    // href: '/pools',
    href: 'https://taalswap.info/home',
  },
  // {
  //   label: 'Prediction',
  //   icon: 'PredictionsIcon',
  //   href: 'https://pools.taalswap.finance/prediction',
  //   status: {
  //     text: 'BETA',
  //     color: 'warning'
  //   }
  // },
  // {
  //   label: 'Lottery',
  //   icon: 'TicketIcon',
  //   href: 'https://pools.taalswap.finance/lottery'
  // },
  // {
  //   label: 'Collectibles',
  //   icon: 'NftIcon',
  //   href: 'https://pools.taalswap.finance/nft'
  // },
  // {
  //   label: 'Team Battle',
  //   icon: 'TeamBattleIcon',
  //   href: 'https://pools.taalswap.finance/competition'
  // },
  // {
  //   label: 'Teams & Profile',
  //   icon: 'GroupsIcon',
  //   items: [
  //     {
  //       label: 'Leaderboard',
  //       href: 'https://pools.taalswap.finance/teams'
  //     },
  //     {
  //       label: 'Task Center',
  //       href: 'https://pools.taalswap.finance/profile/tasks'
  //     },
  //     {
  //       label: 'Your Profile',
  //       href: 'https://pools.taalswap.finance/profile'
  //     }
  //   ]
  // },
  // {
  //   label: 'Info',
  //   icon: 'InfoIcon',
  //   items: [
  //     {
  //       label: 'Overview',
  //       href: 'https://pancakeswap.info'
  //     },
  //     {
  //       label: 'Tokens',
  //       href: 'https://pancakeswap.info/tokens'
  //     },
  //     {
  //       label: 'Pairs',
  //       href: 'https://pancakeswap.info/pairs'
  //     },
  //     {
  //       label: 'Accounts',
  //       href: 'https://pancakeswap.info/accounts'
  //     }
  //   ]
  // },
  // {
  //   label: 'IFO',
  //   icon: 'IfoIcon',
  //   href: 'https://pools.taalswap.finance/ifo'
  // },
  // {
  //   label: 'More',
  //   icon: 'MoreIcon',
  //   items: [
  //     {
  //       label: 'Contact',
  //       href: 'https://docs.pancakeswap.finance/contact-us'
  //     },
  //     {
  //       label: 'Voting',
  //       href: 'https://voting.pancakeswap.finance'
  //     },
  //     {
  //       label: 'Github',
  //       href: 'https://github.com/pancakeswap'
  //     },
  //     {
  //       label: 'Docs',
  //       href: 'https://docs.pancakeswap.finance'
  //     },
  //     {
  //       label: 'Blog',
  //       href: 'https://pancakeswap.medium.com'
  //     },
  //     {
  //       label: 'Merch',
  //       href: 'https://pancakeswap.creator-spring.com/'
  //     }
  //   ]
  // }
];

export default config;

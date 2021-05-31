import { MenuEntry } from 'taalswap-uikit';

const config: MenuEntry[] = [
  {
    label: 'Home',
    icon: 'HomeIcon',
    href: 'http://localhost:3000/'
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
    label: 'Swap',
    icon: 'TradeIcon',
    href: 'http://localhost:3000/#/swap'
  },
  {
    label: 'Liquidity',
    icon: 'PoolIcon',
    href: 'http://localhost:3000/#/pool'
  },
  {
    label: 'Farms',
    icon: 'FarmIcon',
    href: 'http://localhost:3001/farms'
  },
  {
    label: 'Pools',
    icon: 'PoolIcon',
    href: 'http://localhost:3001/pools'
  }
  // {
  //   label: 'Prediction',
  //   icon: 'PredictionsIcon',
  //   href: 'https://pancakeswap.finance/prediction',
  //   status: {
  //     text: 'BETA',
  //     color: 'warning'
  //   }
  // },
  // {
  //   label: 'Lottery',
  //   icon: 'TicketIcon',
  //   href: 'https://pancakeswap.finance/lottery'
  // },
  // {
  //   label: 'Collectibles',
  //   icon: 'NftIcon',
  //   href: 'https://pancakeswap.finance/nft'
  // },
  // {
  //   label: 'Team Battle',
  //   icon: 'TeamBattleIcon',
  //   href: 'https://pancakeswap.finance/competition'
  // },
  // {
  //   label: 'Teams & Profile',
  //   icon: 'GroupsIcon',
  //   items: [
  //     {
  //       label: 'Leaderboard',
  //       href: 'https://pancakeswap.finance/teams'
  //     },
  //     {
  //       label: 'Task Center',
  //       href: 'https://pancakeswap.finance/profile/tasks'
  //     },
  //     {
  //       label: 'Your Profile',
  //       href: 'https://pancakeswap.finance/profile'
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
  //   href: 'https://pancakeswap.finance/ifo'
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

export default config

const tokens = {
  eth: {
    symbol: 'ETH',
    projectLink: 'https://ethereum.org/',
  },
  klay: {
    symbol: 'KLAY',
    projectLink: 'https://www.klaytn.com/',
  },
  // cake: {
  //   symbol: 'TAL',
  //   address: {
  //     56: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
  //     97: '0x7f04Eef81a6061c8631D1519498A9B28708755C8',
  //   },
  //   decimals: 18,
  //   projectLink: 'https://pancakeswap.finance/',
  // },
  // talken: {
  //   symbol: 'TALK',
  //   address: {
  //     56: '',
  //     97: '0x116bFd2490001aFEEa03841b14A3fe02baeE95A7',
  //   },
  //   decimals: 18,
  //   projectLink: 'https://pancakeswap.finance/',
  // },
  taal: {
    symbol: 'TAL',
    address: {
      1: '0x7e6bd46f4ddc58370c0435d496ef7fcc5fe1751d',
      3: '0xebd87e7c13b3aca572665140b6b12349112f0ce0',
      4: '0xe18e460d38441027b6672363d68c9088f3d773bf',
      8217: '0x90a4a420732907b3c38b11058f9aa02b3f4121df',
      1001: '0x6C27d9F6C4067212797794CD931596C2917F7Bf7',   // getTaalAddress()에서 사용
    },
    decimals: 18,
    projectLink: 'https://taalswap.finance/',
  },
  ktaal: {
    symbol: 'TAL',
    address: {
      1: '',
      3: '',
      4: '',
      8217: '0x90a4a420732907b3c38b11058f9aa02b3f4121df',
      1001: '0x6C27d9F6C4067212797794CD931596C2917F7Bf7',
    },
    decimals: 18,
    projectLink: 'https://taalswap.finance/',
  },
  weth: {
    symbol: 'WETH',
    address: {
      1: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      3: '0x46884d7849223e057226a69e5f8215d6ff1b8bd6',
      4: '0x92ecacfc94588aa99fba837be1a98738290e3252',
      8217: '0x5819b6af194a78511c79c85ea68d2377a7e9335f',
      1001: '0xf223e26b018ae1917e84dd73b515620e36a75596',   // getWethAddress()에서 사용 ?
    },
    decimals: 18,
    projectLink: 'https://weth.io/',
  },
  wklay: {
    symbol: 'WKLAY',
    address: {
      1: '',
      3: '',
      4: '',
      8217: '0x5819b6af194a78511c79c85ea68d2377a7e9335f',
      1001: '0xf223e26b018ae1917e84dd73b515620e36a75596',
    },
    decimals: 18,
    projectLink: 'https://www.klaytn.com/',
  },
  usdc: {
    symbol: 'USDC',
    address: {
      1: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      3: '0x2e3aa7718a95a48424c086e6f594c04624a798de',
      4: '0xd16431da4eafe953b4f34923cdb8d833fb1b2e7c',
      8217: '',
      1001: '',
    },
    decimals: 6,
    projectLink: 'https://www.centre.io/usdc/',
  },
  kdai: {
    symbol: 'KDAI',
    address: {
      1: '',
      3: '',
      4: '',
      8217: '0x5c74070fdea071359b86082bd9f9b3deaafbe32b',
      1001: '0xa76639d69cfdbff27abf1d0abc22d5e30e73a07f',
    },
    decimals: 18,
    projectLink: 'https://makerdao.com/en/',
  },
  syrup: {
    symbol: 'SYRUP',
    address: {
      1: '0x6c49ff7da37991f080d1b170690b4bac5d0fc692',
      3: '0x9e5daec08ad770a52e2ca740ea19788fef85ea32',
      4: '0x124bdb941df9fc548d99e21f727357e9c287772e',
      8217: '0xc1dc53378f06331ce3f98701b0b9a0ecbd9230e7',
      1001: '0xDc3eB77A4BCdb4603E4b2fd4BF30BDa67442C3d4',
    },
    decimals: 18,
    projectLink: 'https://taalswap.finance/',
  },
  usdt: {
    symbol: 'USDT',
    address: {
      1: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      3: '0x66b007ea82040320eff7d37bf31a2f7086c27d11',
      4: '0xc958c2ace36870471238319bc29018cc549c126d',
      8217: '',
      1001: ''
    },
    decimals: 6,
    projectLink: 'https://tether.to/',
  },
  kusdt: {
    symbol: 'KUSDT',
    address: {
      1: '',
      3: '',
      4: '',
      8217: '0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167',
      1001: '0x06cb1c92cc93d617aed37811783708ac6370cca5',
    },
    decimals: 6,
    projectLink: 'https://tether.to/',
  },
  // qsd: {
  //   symbol: 'QSD',
  //   address: {
  //     1: '',
  //     3: '',
  //     4: '0x07aaa29e63ffeb2ebf59b33ee61437e1a91a3bb2',
  //     56: '0x07aaa29e63ffeb2ebf59b33ee61437e1a91a3bb2',
  //     97: '',
  //   },
  //   decimals: 18,
  //   projectLink: 'https://chemix.io/home',
  // }
}

export default tokens

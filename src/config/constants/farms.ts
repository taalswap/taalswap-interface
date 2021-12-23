import tokens from './tokens'
import { FarmConfig } from './types'

const farmsConfig: FarmConfig[] = [
  /**
   * These 3 farms (PID 0, 251, 252) should always be at the top of the file.
   */
  {
    pid: 0,
    lpSymbol: 'TAL',
    lpAddresses: {
      1: '0x7e6bd46f4ddc58370c0435d496ef7fcc5fe1751d',
      3: '0xebd87e7c13b3aca572665140b6b12349112f0ce0',
      4: '0xe18e460d38441027b6672363d68c9088f3d773bf',    // TaalToken
    },
    token: tokens.syrup,
    quoteToken: tokens.weth,
  },
  {
    pid: 1,
    lpSymbol: 'TAL-ETH LP',
    lpAddresses: {
      1: '0x5adda6b4e4966f1d8d0498c97aab54829999d65e',
      3: '0xd849f4f9fd23708f849cf2d7f9f2069a24158793',
      4: '0x98d2c51626bdac2a257dda01a60deb51cee2cee6',
    },
    token: tokens.taal,
    quoteToken: tokens.weth,
  },
  {
    pid: 2,
    lpSymbol: 'USDC-ETH LP',
    lpAddresses: {
      1: '0x2d22e163ae5fd9c7b529e0864b69c204a895bc30',
      3: '0xc34fd134bdd68ad96e8bb80bb85cf5f51e6ceb1f',
      4: '0x73b1501e0ab88dc81d95f8ed9aa67938afabda4b',
    },
    token: tokens.usdc,
    quoteToken: tokens.weth,
  },
  {
    pid: 3,
    lpSymbol: 'USDT-ETH LP',
    lpAddresses: {
      1: '0x5fee0c80d26cc393e48f0774a56f0362e82b76e4',
      3: '0x8c84586ce82795f592d41ae4ee5c32932068a992',
      4: '0x1a7bab68f22eb8f84e8920b120bec8130efd6db8',
    },
    token: tokens.usdt,
    quoteToken: tokens.weth,
  },
  {
    pid: 4,
    lpSymbol: 'TAL-USDC LP',
    lpAddresses: {
      1: '0x0eff6a9fbcebec4257e44115b3048bd4f8215eb7',
      3: '0x588492dc4c48d664975d0ed691bdebf9b71d9ccd',
      4: '0x036126bda6190605fadd2028caa8dd7be13c045a',
    },
    token: tokens.taal,
    quoteToken: tokens.usdc,
  },
  {
    pid: 5,
    lpSymbol: 'TAL-USDT LP',
    lpAddresses: {
      1: '0xdfea645431b312aa0bbe41f23a31fac4f36517af',
      3: '0x0951dbf1f71e26e1c480a27ed5593618e1f059bd',
      4: '0xa17d74b8ae149f08c8a1db09e4a55e158163fed1',
    },
    token: tokens.taal,
    quoteToken: tokens.usdt,
  },
  {
    pid: 6,
    lpSymbol: 'USDT-USDC LP',
    lpAddresses: {
      1: '0x73a0ac4498ac839c6a93d36967638759da2be952',
      3: '0xc002144ff412f745350f4243a6c0b88a26ce3edc',
      4: '0xbac68c775b94b2999e8e2fdcda3ea5e57bbb9176',
    },
    token: tokens.usdt,
    quoteToken: tokens.usdc,
  },
  // // {
  // //   pid: 13,
  // //   lpSymbol: 'TALK-ETH LP',
  // //   lpAddresses: {
  // //     97: '0x6e1ca435b981e0478099f616e61e878dfc1629b3',
  // //     56: '',
  // //   },
  // //   token: tokens.talken,
  // //   quoteToken: tokens.weth,
  // // },
  // // {
  // //   pid: 12,
  // //   lpSymbol: 'TAL-ETH LP',
  // //   lpAddresses: {
  // //     97: '0x8029d53f77e11125e620254e65622ad81400e300',
  // //     56: '',
  // //   },
  // //   token: tokens.taal,
  // //   quoteToken: tokens.weth,
  // // },
  // // {
  // //   pid: 2,
  // //   lpSymbol: 'USDT-ETH LP',
  // //   lpAddresses: {
  // //     97: '0xd2dafced17fc1679fbabfd02d10b001405dcd299',
  // //     56: '',
  // //   },
  // //   token: tokens.busd,
  // //   quoteToken: tokens.weth,
  // // },
  // // {
  // //   pid: 1,
  // //   lpSymbol: 'TAL-ETH LP',
  // //   lpAddresses: {
  // //     97: '0xe5582d873e265a1dd4202f20a4c5022cee215f39',
  // //     56: '',
  // //   },
  // //   token: tokens.cake,
  // //   quoteToken: tokens.weth,
  // // },
  // // {
  // //   pid: 10,
  // //   lpSymbol: 'TALK-TAL LP',
  // //   lpAddresses: {
  // //     97: '0xd0a583974af3d09b087b5dc7406fece1cb195aac',
  // //     56: '',
  // //   },
  // //   token: tokens.talken,
  // //   quoteToken: tokens.taal,
  // // },
]

const farmsConfigKlaytn: FarmConfig[] = [
  /**
   * These 3 farms (PID 0, 251, 252) should always be at the top of the file.
   */
  {
    pid: 0,
    lpSymbol: 'TAL',
    lpAddresses: {
      8217: '0x90a4a420732907b3c38b11058f9aa02b3f4121df',   // TaalToken
      1001: '0x6C27d9F6C4067212797794CD931596C2917F7Bf7',
    },
    token: tokens.syrup,
    quoteToken: tokens.wklay,
  },
  {
    pid: 1,
    lpSymbol: 'TAL-KLAY LP',
    lpAddresses: {
      8217: '0xc7e285914833d8e5e58b01fcd22e967fe91a3a97',
      1001: '0xf9abb3377EBC845a9e1878A0180af50E4D0Eed1b',
    },
    token: tokens.ktaal,
    quoteToken: tokens.wklay,
  },
  {
    pid: 2,
    lpSymbol: 'KLAY-KDAI LP',
    lpAddresses: {
      8217: '0xb21f3305a5b35b46a875d3629751901bdd76b807',
      1001: '0x60746098CE92f2d166944216A5e9472C53C1e972'
    },
    token: tokens.kdai,
    quoteToken: tokens.wklay,
  },
  {
    pid: 3,
    lpSymbol: 'KLAY-KUSDT LP',
    lpAddresses: {
      8217: '0x9c0e78bee9639396c85142a95a7569372f649c9a',
      1001: '0x282664424406814715E2D4AED9b8FB4a90102265',
    },
    token: tokens.kusdt,
    quoteToken: tokens.wklay,
  },
  {
    pid: 4,
    lpSymbol: 'TAL-KDAI LP',
    lpAddresses: {
      8217: '0xca74d757a5ca00080f87434fca85fbfb1c3b9a3a',
      1001: '0x0F3b8Bc13BdD1f71ae46781e6fC36917E32DFA92',
    },
    token: tokens.ktaal,
    quoteToken: tokens.kdai,
  },
  {
    pid: 5,
    lpSymbol: 'TAL-KUSDT LP',
    lpAddresses: {
      8217: '0x6965e1e6d4f107c311264e5f1906daeda0311473',
      1001: '0xB12474BE2b21114f9578F01032A8a650Ab0E1022',
    },
    token: tokens.ktaal,
    quoteToken: tokens.kusdt,
  },
  {
    pid: 6,
    lpSymbol: 'KUSDT-KDAI LP',
    lpAddresses: {
      8217: '0xedb390f35d162272239e6b2c40e1320412eeff93',
      1001: '0x506876e566637789BF88716230F0502CA5af5F88',
    },
    token: tokens.kusdt,
    quoteToken: tokens.kdai,
  },
]

// export default farms
export { farmsConfig, farmsConfigKlaytn }

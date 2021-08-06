import { ChainId, JSBI, Percent, Token, WETH } from 'taalswap-sdk';

// export const ROUTER_ADDRESS = '0x913cf96b805221e1631de21cd22b7a93099c00b7';
export const ROUTER_ADDRESS = {
  [ChainId.MAINNET]: '0x913cf96b805221e1631de21cd22b7a93099c00b7',
  [ChainId.ROPSTEN]: '0x43807616f5c7d51a9c83f63e6740f76349669800',
  [ChainId.RINKEBY]: '0xded8b52643c126e996fc1fea9f0c053338bc7e72',
  [ChainId.KLAYTN]: '0xded8b52643c126e996fc1fea9f0c053338bc7e72',
  [ChainId.BAOBAB]: '0xded8b52643c126e996fc1fea9f0c053338bc7e72'
}

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

// export const TAL = new Token(
//   ChainId.MAINNET,
//   '0x90a4a420732907b3c38b11058f9aa02b3f4121df',
//   18,
//   'TAL',
//   'TaalSwap Token'
// );
export const TAL = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0x90a4a420732907b3c38b11058f9aa02b3f4121df',
    18,
    'TAL',
    'TaalSwap Token'
  ),
  [ChainId.ROPSTEN]: new Token(
    ChainId.ROPSTEN,
    '0xebd87e7c13b3aca572665140b6b12349112f0ce0',
    18,
    'TAL',
    'TaalSwap Token'
  ),
  [ChainId.RINKEBY]: new Token(
    ChainId.RINKEBY,
    '0x92ecacfc94588aa99fba837be1a98738290e3252',
    18,
    'TAL',
    'TaalSwap Token'
  ),
  [ChainId.KLAYTN]: new Token(
    ChainId.KLAYTN,
    '0x92ecacfc94588aa99fba837be1a98738290e3252',
    18,
    'TAL',
    'TaalSwap Token'
  ),
  [ChainId.BAOBAB]: new Token(
    ChainId.BAOBAB,
    '0x92ecacfc94588aa99fba837be1a98738290e3252',
    18,
    'TAL',
    'TaalSwap Token'
  )
}

// export const WETH = new Token(ChainId.RINKEBY, '0x92EcACFC94588aa99fba837Be1a98738290E3252', 18, 'WETH', 'Wrapped ETH');
// export const DAI = new Token(ChainId.MAINNET, '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3', 18, 'DAI', 'Dai Stablecoin');
// export const BUSD = new Token(ChainId.RINKEBY, '0xd16431da4EafE953B4f34923CdB8d833FB1B2E7c', 18, 'BUSD', 'Binance USD');
// export const BTCB = new Token(ChainId.MAINNET, '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', 18, 'BTCB', 'Binance BTC');

// export const USDT = new Token(ChainId.MAINNET, '0xdac17f958d2ee523a2206206994597c13d831ec7', 6, 'USDT', 'Tether USD');
export const USDT = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0xdac17f958d2ee523a2206206994597c13d831ec7',
    6,
    'USDT',
    'Tether USD'
  ),
  [ChainId.ROPSTEN]: new Token(
    ChainId.ROPSTEN,
    '0x897ad6a487bd9b490d537b3860860863ae414f1e',
    18,
    'USDT',
    'Tether USD'
  ),
  [ChainId.RINKEBY]: new Token(
    ChainId.RINKEBY,
    '0x92ecacfc94588aa99fba837be1a98738290e3252',
    18,
    'USDT',
    'Tether USD'
  ),
  [ChainId.KLAYTN]: new Token(
    ChainId.KLAYTN,
    '0x92ecacfc94588aa99fba837be1a98738290e3252',
    18,
    'USDT',
    'Tether USD'
  ),
  [ChainId.BAOBAB]: new Token(
    ChainId.BAOBAB,
    '0x92ecacfc94588aa99fba837be1a98738290e3252',
    18,
    'USDT',
    'Tether USD'
  )
}

// export const USDC = new Token(ChainId.MAINNET, '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', 6, 'USDC', 'USD Coin');
export const USDC = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    6,
    'USDC',
    'USD Coin'
  ),
  [ChainId.ROPSTEN]: new Token(
    ChainId.ROPSTEN,
    '0x9c8fa1ee532f8afe9f2e27f06fd836f3c9572f71',
    18,
    'USDC',
    'USD Coin'
  ),
  [ChainId.RINKEBY]: new Token(
    ChainId.RINKEBY,
    '0x92ecacfc94588aa99fba837be1a98738290e3252',
    18,
    'USDC',
    'USD Coin'
  ),
  [ChainId.KLAYTN]: new Token(
    ChainId.KLAYTN,
    '0x92ecacfc94588aa99fba837be1a98738290e3252',
    18,
    'USDC',
    'USD Coin'
  ),
  [ChainId.BAOBAB]: new Token(
    ChainId.BAOBAB,
    '0x92ecacfc94588aa99fba837be1a98738290e3252',
    18,
    'USDC',
    'USD Coin'
  )
}

// export const UST = new Token(
//   ChainId.MAINNET,
//   '0x23396cF899Ca06c4472205fC903bDB4de249D6fC',
//   18,
//   'UST',
//   'Wrapped UST Token'
// );
// export const ETH = new Token(
//   ChainId.MAINNET,
//   '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
//   18,
//   'ETH',
//   'Binance-Peg Ethereum Token'
// );

const WETH_ONLY: ChainTokenList = {
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET]],
  [ChainId.ROPSTEN]: [WETH[ChainId.ROPSTEN]],
  [ChainId.RINKEBY]: [WETH[ChainId.RINKEBY]],
  [ChainId.KLAYTN]: [WETH[ChainId.KLAYTN]],
  [ChainId.BAOBAB]: [WETH[ChainId.BAOBAB]]
};

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], USDC[ChainId.MAINNET], USDT[ChainId.MAINNET]],
  // [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, BUSD, BTCB, USDT, UST, ETH]
  [ChainId.ROPSTEN]: [...WETH_ONLY[ChainId.ROPSTEN], USDC[ChainId.ROPSTEN], USDT[ChainId.ROPSTEN]],
  [ChainId.RINKEBY]: [...WETH_ONLY[ChainId.RINKEBY], USDC[ChainId.RINKEBY], USDT[ChainId.RINKEBY]],
  [ChainId.KLAYTN]: [...WETH_ONLY[ChainId.KLAYTN], USDC[ChainId.KLAYTN], USDT[ChainId.KLAYTN]],
  [ChainId.BAOBAB]: [...WETH_ONLY[ChainId.BAOBAB], USDC[ChainId.BAOBAB], USDT[ChainId.BAOBAB]]
};

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.MAINNET]: {},
  [ChainId.ROPSTEN]: {},
  [ChainId.RINKEBY]: {},
  [ChainId.KLAYTN]: {},
  [ChainId.BAOBAB]: {}
};

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], USDC[ChainId.MAINNET], USDT[ChainId.MAINNET]],
  // [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, BUSD, USDT]
  [ChainId.ROPSTEN]: [...WETH_ONLY[ChainId.ROPSTEN], USDC[ChainId.ROPSTEN], USDT[ChainId.ROPSTEN]],
  [ChainId.RINKEBY]: [...WETH_ONLY[ChainId.RINKEBY], USDC[ChainId.RINKEBY], USDT[ChainId.RINKEBY]],
  [ChainId.KLAYTN]: [...WETH_ONLY[ChainId.KLAYTN], USDC[ChainId.KLAYTN], USDT[ChainId.KLAYTN]],
  [ChainId.BAOBAB]: [...WETH_ONLY[ChainId.BAOBAB], USDC[ChainId.BAOBAB], USDT[ChainId.BAOBAB]]
};

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], USDC[ChainId.MAINNET], USDT[ChainId.MAINNET]],
  // [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, BUSD, BTCB, USDT]
  [ChainId.ROPSTEN]: [...WETH_ONLY[ChainId.ROPSTEN], USDC[ChainId.ROPSTEN], USDT[ChainId.ROPSTEN]],
  [ChainId.RINKEBY]: [...WETH_ONLY[ChainId.RINKEBY], USDC[ChainId.RINKEBY], USDT[ChainId.RINKEBY]],
  [ChainId.KLAYTN]: [...WETH_ONLY[ChainId.KLAYTN], USDC[ChainId.KLAYTN], USDT[ChainId.KLAYTN]],
  [ChainId.BAOBAB]: [...WETH_ONLY[ChainId.BAOBAB], USDC[ChainId.BAOBAB], USDT[ChainId.BAOBAB]]
};

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  // [ChainId.MAINNET]: [
  [ChainId.MAINNET]: [
    [TAL[ChainId.MAINNET], WETH[ChainId.MAINNET]],
    // [CAKE, WBNB],
    [USDC[ChainId.MAINNET], USDT[ChainId.MAINNET]]
    // [DAI, USDT]
  ],
  [ChainId.ROPSTEN]: [[TAL[ChainId.ROPSTEN], WETH[ChainId.ROPSTEN]], [USDC[ChainId.ROPSTEN], USDT[ChainId.ROPSTEN]]],
  [ChainId.RINKEBY]: [[TAL[ChainId.RINKEBY], WETH[ChainId.RINKEBY]], [USDC[ChainId.RINKEBY], USDT[ChainId.RINKEBY]]],
  [ChainId.KLAYTN]: [[TAL[ChainId.KLAYTN], WETH[ChainId.KLAYTN]], [USDC[ChainId.KLAYTN], USDT[ChainId.KLAYTN]]],
  [ChainId.BAOBAB]: [[TAL[ChainId.BAOBAB], WETH[ChainId.BAOBAB]], [USDC[ChainId.BAOBAB], USDT[ChainId.BAOBAB]]]
};

export const NetworkContextName = 'NETWORK';

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 80;
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20;

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000));
export const BIPS_BASE = JSBI.BigInt(10000);
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE); // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE); // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE); // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE); // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE); // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)); // .01 ETH

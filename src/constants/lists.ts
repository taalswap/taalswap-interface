import { ChainId } from 'taalswap-sdk';

// export const DEFAULT_TOKEN_LIST_URL = 'taalswap';
export const DEFAULT_TOKEN_LIST_URL = {
  [ChainId.MAINNET]: 'taalswap',
  [ChainId.ROPSTEN]: 'taalswap-ropsten',
  [ChainId.RINKEBY]: 'taalswap-rinkeby',
  [ChainId.KLAYTN]: 'taalswap-klaytn',
  [ChainId.BAOBAB]: 'taalswap-baobab'
};

export const DEFAULT_LIST_OF_LISTS: string[] = [DEFAULT_TOKEN_LIST_URL[ChainId.MAINNET]];
export const DEFAULT_LIST_OF_LISTS_ROPSTEN: string[] = [DEFAULT_TOKEN_LIST_URL[ChainId.ROPSTEN]];
export const DEFAULT_LIST_OF_LISTS_RINKEBY: string[] = [DEFAULT_TOKEN_LIST_URL[ChainId.RINKEBY]];
export const DEFAULT_LIST_OF_LISTS_KLAYTN: string[] = [DEFAULT_TOKEN_LIST_URL[ChainId.KLAYTN]];
export const DEFAULT_LIST_OF_LISTS_BAOBAB: string[] = [DEFAULT_TOKEN_LIST_URL[ChainId.BAOBAB]];

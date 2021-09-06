import { ChainId } from 'taalswap-sdk'

export const BASE_BSC_SCAN_URL = 'https://etherscan.io'
export const SCAN_URL = {
  [ChainId.MAINNET]: 'https://etherscan.io',
  [ChainId.ROPSTEN]: 'https://ropsten.etherscan.io',
  [ChainId.RINKEBY]: 'https://rinkeby.etherscan.io',
  [ChainId.KLAYTN]: 'https://scope.klaytn.com',
  [ChainId.BAOBAB]: 'https://baobab.scope.klaytn.com',
}
export const NETWORK_NAME = {
  [ChainId.MAINNET]: 'Ethereum Mainnet',
  [ChainId.ROPSTEN]: 'Ethereum Ropsten',
  [ChainId.RINKEBY]: 'Ethereum Rinkeby',
  [ChainId.KLAYTN]: 'Klaytn Cypress',
  [ChainId.BAOBAB]: 'Klaytn Baobab',
}

import { ethers } from 'ethers';
import { Contract } from '@ethersproject/contracts';
import { getAddress } from '@ethersproject/address';
import { AddressZero } from '@ethersproject/constants';
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
import { BigNumber } from '@ethersproject/bignumber';
import { abi as IUniswapV2Router02ABI } from '@uniswap/v2-periphery/build/IUniswapV2Router02.json';
import { ChainId, Currency, CurrencyAmount, ETHER, JSBI, KLAYTN, Percent, Token } from 'taalswap-sdk';
import BRIDGE_ABI from 'constants/abis/bridge.json';
import { BRIDGE_ADDRESS, ROUTER_ADDRESS } from '../constants';
import { TokenAddressMap } from '../state/lists/hooks';

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

const ETH_PREFIXES: { [chainId in ChainId]: string } = {
  1: 'etherscan.io',
  3: 'ropsten.etherscan.io',
  4: 'rinkeby.etherscan.io',
  8217: 'scope.klaytn.com',
  1001: 'baobab.scope.klaytn.com'
};

const RPC_URL: { [chainId in ChainId]: string } = {
  1: process.env.REACT_APP_NETWORK_URL ?? '',
  3: process.env.REACT_APP_NETWORK_URL ?? '',
  4: process.env.REACT_APP_NETWORK_URL ?? '',
  8217: 'https://klaytn.taalswap.info:8651',
  1001: 'https://api.baobab.klaytn.net:8651'
};

export function getBscScanLink(chainId: ChainId, data: string, type: 'transaction' | 'token' | 'address'): string {
  const prefix = `https://${ETH_PREFIXES[chainId] || ETH_PREFIXES[ChainId.MAINNET]}`;

  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`;
    }
    case 'token': {
      return `${prefix}/token/${data}`;
    }
    case 'address':
    default: {
      return `${prefix}/address/${data}`;
    }
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address);
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
}

// add 10%
export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000));
}

// converts a basis points value to a sdk percent
export function basisPointsToPercent(num: number): Percent {
  return new Percent(JSBI.BigInt(Math.floor(num)), JSBI.BigInt(10000));
}

export function calculateSlippageAmount(value: CurrencyAmount, slippage: number): [JSBI, JSBI] {
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`);
  }
  return [
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 - slippage)), JSBI.BigInt(10000)),
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 + slippage)), JSBI.BigInt(10000))
  ];
}

// account is not optional
export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked();
}

// account is optional
export function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library;
}

// account is optional
export function getContract(address: string, ABI: any, library: Web3Provider, account?: string, chainId?: ChainId, xFlag?: boolean): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  let contract
  if (chainId === undefined) chainId = ChainId.BAOBAB

  const xSwapCurrency = window.localStorage.getItem('xSwapCurrency')
  const crossChain = window.localStorage.getItem('crossChain')
  // if (xSwapCurrency === 'output' || crossChain !== null) {     // xSwap 메뉴에서 다른 메뉴로 이동 시 crossChain 값을 삭제함. 타 메뉴에서 getContract 호출 시 사용 갸능...
  if (xSwapCurrency === 'output' || xFlag) {
    if (chainId > 1000) {
      const crossChainProvider = new ethers.providers.JsonRpcProvider(RPC_URL[chainId]);
      contract = new Contract(address, ABI, crossChainProvider);
    } else {
      const crossChainProvider = new ethers.providers.InfuraProvider('ropsten', 'adb9c847d7114ee7bf83995e8f22e098')
      contract = new Contract(address, ABI, crossChainProvider);
    }
  } else {
    contract = new Contract(address, ABI, getProviderOrSigner(library, account) as any);
  }
  return contract;
}

// account is optional
export function getRouterContract(chainId: ChainId, library: Web3Provider, account?: string): Contract {
  const crossChain = window.localStorage.getItem('crossChain') ?? chainId.toString();
  if (crossChain !== chainId.toString()) {
    // TODO : change IUniswapV2Router02ABI to Bridge contract ABI
    return getContract(BRIDGE_ADDRESS[chainId], BRIDGE_ABI, library, account, chainId, false);
  }
  return getContract(ROUTER_ADDRESS[chainId], IUniswapV2Router02ABI, library, account, chainId, false);
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function isTokenOnList(defaultTokens: TokenAddressMap, currency?: Currency): boolean {
  if (currency === ETHER || currency === KLAYTN) return true;
  return Boolean(currency instanceof Token && defaultTokens[currency.chainId]?.[currency.address]);
}

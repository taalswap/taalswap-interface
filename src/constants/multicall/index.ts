import { ChainId } from 'taalswap-sdk';
import MULTICALL_ABI from './abi.json';

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb', // TODO
  [ChainId.ROPSTEN]: '0xE81BFF6533419DCA61cabCd26252EaFEc782aC00',
  [ChainId.RINKEBY]: '0x9B1265E5a12DED869CBe1934828aCe8388FA1362'
};

export { MULTICALL_ABI, MULTICALL_NETWORKS };

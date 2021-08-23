import { ChainId } from 'taalswap-sdk';
import MULTICALL_ABI from './abi.json';

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0xc72160167f700f842ddf553e06bc44186f42b929',
  [ChainId.ROPSTEN]: '0xe81bff6533419dca61cabcd26252eafec782ac00',
  [ChainId.RINKEBY]: '0xe81bff6533419dca61cabcd26252eafec782ac00',
  [ChainId.KLAYTN]: '0x6943fa156da5a68c74696837666ae49c95712431',
  [ChainId.BAOBAB]: '0x6943fa156da5a68c74696837666ae49c95712431'
};

export { MULTICALL_ABI, MULTICALL_NETWORKS };

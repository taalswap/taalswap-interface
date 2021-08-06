import { ChainId } from 'taalswap-sdk';
import { ROUTER_ADDRESS } from '../constants';

export default function getRouterAddress(chain: any): string {
  let routerAddress;

  switch (chain) {
    case '1':
      routerAddress = ROUTER_ADDRESS[ChainId.MAINNET]
      break;
    case '3':
      routerAddress = ROUTER_ADDRESS[ChainId.ROPSTEN]
      break;
    case '4':
      routerAddress = ROUTER_ADDRESS[ChainId.RINKEBY]
      break;
    case '8217':
      routerAddress = ROUTER_ADDRESS[ChainId.KLAYTN]
      break;
    case '1001':
      routerAddress = ROUTER_ADDRESS[ChainId.BAOBAB]
      break;
    default:
      routerAddress = ROUTER_ADDRESS[ChainId.MAINNET]
      break;
  }

  return routerAddress
}

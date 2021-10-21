import { ChainId } from 'taalswap-sdk';
import { BRIDGE_ADDRESS } from '../constants';

export default function getBridgeAddress(chain: any): string {
  let bridgeAddress;

  switch (chain) {
    case ChainId.MAINNET:
      bridgeAddress = BRIDGE_ADDRESS[ChainId.MAINNET]
      break;
    case ChainId.ROPSTEN:
      bridgeAddress = BRIDGE_ADDRESS[ChainId.ROPSTEN]
      break;
    case ChainId.RINKEBY:
      bridgeAddress = BRIDGE_ADDRESS[ChainId.RINKEBY]
      break;
    case ChainId.KLAYTN:
      bridgeAddress = BRIDGE_ADDRESS[ChainId.KLAYTN]
      break;
    case ChainId.BAOBAB:
      bridgeAddress = BRIDGE_ADDRESS[ChainId.BAOBAB]
      break;
    default:
      bridgeAddress = BRIDGE_ADDRESS[ChainId.MAINNET]
      break;
  }

  return bridgeAddress
}

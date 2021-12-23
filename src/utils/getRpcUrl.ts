import random from 'lodash/random'
import { ChainId } from 'taalswap-sdk'
import getChainId from './getChainId'

// Array of available nodes to connect to
export const nodes = [process.env.REACT_APP_NODE_1, process.env.REACT_APP_NODE_2, process.env.REACT_APP_NODE_3]
export const nodesCypress = 'https://klaytn.taalswap.info:8651'
export const nodesBaobab = 'https://api.baobab.klaytn.net:8651'

const getNodeUrl = () => {
  const randomIndex = random(0, nodes.length - 1)
  const chainId = getChainId()
  switch(chainId) {
    case ChainId.MAINNET:
      return nodes[randomIndex]
      break;
    case ChainId.KLAYTN:
      return nodesCypress
      break;
    case ChainId.BAOBAB:
      return nodesBaobab
      break;
    default:
      return nodes[randomIndex]
      break;
  }
  // return nodes[randomIndex]
}

export default getNodeUrl

import Web3 from 'web3'
import { HttpProviderOptions } from 'web3-core-helpers'
import random from 'lodash/random'

export const nodes = [process.env.REACT_APP_NODE_1, process.env.REACT_APP_NODE_2, process.env.REACT_APP_NODE_3]
const randomIndex = random(0, nodes.length - 1)

const RPC_URL = nodes[randomIndex]
const httpProvider = new Web3.providers.HttpProvider(RPC_URL, { timeout: 10000 } as HttpProviderOptions)
const web3EthNoAccount = new Web3(httpProvider)

const getWeb3EthNoAccount = () => {
  return web3EthNoAccount
}

export { getWeb3EthNoAccount }
export default web3EthNoAccount

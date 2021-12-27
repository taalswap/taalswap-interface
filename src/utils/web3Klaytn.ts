import Web3 from 'web3'
import { HttpProviderOptions } from 'web3-core-helpers'

const nodesCypress = 'https://klaytn.taalswap.info:8651'
const nodesBaobab = 'https://api.baobab.klaytn.net:8651'

const RPC_URL = process.env.REACT_APP_KLAYTN_ID === '1001' ? nodesBaobab : nodesCypress
const httpProvider = new Web3.providers.HttpProvider(RPC_URL, { timeout: 10000 } as HttpProviderOptions)
const web3KlaytnNoAccount = new Web3(httpProvider)

const getWeb3KlaytnNoAccount = () => {
  return web3KlaytnNoAccount
}

export { getWeb3KlaytnNoAccount }
export default web3KlaytnNoAccount

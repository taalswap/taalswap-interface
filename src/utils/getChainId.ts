import { parseInt } from 'lodash'

const getChainId = () => {
  const NETWORK_URL = process.env.REACT_APP_CHAIN_ID ?? '1';
  const chainIdStr = window.localStorage.getItem("chainId") ?? 'undefined'
  const chainId = (!chainIdStr || chainIdStr === 'undefined' || chainIdStr === 'NaN')
    ? parseInt(NETWORK_URL, 10)
    : parseInt(chainIdStr, 10)
  return chainId
}

export default getChainId

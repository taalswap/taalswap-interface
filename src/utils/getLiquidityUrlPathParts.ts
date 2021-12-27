// Constructing the two forward-slash-separated parts of the 'Add Liquidity' URL
// Each part of the url represents a different side of the LP pair.
import { isUndefined, parseInt } from 'lodash'
import { getWethAddress } from './addressHelpers'
import getChainId from './getChainId'

const getLiquidityUrlPathParts = ({ quoteTokenAddress, tokenAddress }) => {
  // const chainId = process.env.REACT_APP_CHAIN_ID
  const chainIdStr = window.localStorage.getItem('chainId')
  const chainId = getChainId()
  let CURRENCY
  if (chainId > 1000) {
    CURRENCY = 'KLAY'
  } else {
    CURRENCY = 'ETH'
  }

  const wBNBAddressString = getWethAddress()
  const quoteTokenAddressString: string = quoteTokenAddress ? quoteTokenAddress[chainId] : null
  const tokenAddressString: string = tokenAddress ? tokenAddress[chainId] : null
  const firstPart =
    !quoteTokenAddressString || quoteTokenAddressString === wBNBAddressString ? CURRENCY : quoteTokenAddressString
  const secondPart = !tokenAddressString || tokenAddressString === wBNBAddressString ? CURRENCY : tokenAddressString
  return `${chainId}/${firstPart}/${secondPart}`
}

export default getLiquidityUrlPathParts

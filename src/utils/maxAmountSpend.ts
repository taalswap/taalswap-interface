import { CurrencyAmount, ETHER, KLAYTN, JSBI } from 'taalswap-sdk'
import { MIN_ETH } from '../constants'
import getChainId from "./getChainId";

/**
 * Given some token amount, return the max that can be spent of it
 * @param currencyAmount to return max of
 */
export function maxAmountSpend(currencyAmount?: CurrencyAmount): CurrencyAmount | undefined {
  const chainId = getChainId()
  if (!currencyAmount) return undefined
  if (currencyAmount.currency === ETHER || currencyAmount.currency === KLAYTN) {
    if (JSBI.greaterThan(currencyAmount.raw, MIN_ETH)) {
      if (chainId > 1000) return CurrencyAmount.klaytn(JSBI.subtract(currencyAmount.raw, MIN_ETH))
      return CurrencyAmount.ether(JSBI.subtract(currencyAmount.raw, MIN_ETH))
    }
    if (chainId > 1000) return CurrencyAmount.klaytn(JSBI.BigInt(0))
    return CurrencyAmount.ether(JSBI.BigInt(0))
  }
  return currencyAmount
}

export default maxAmountSpend

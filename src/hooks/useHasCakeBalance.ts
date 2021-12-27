import BigNumber from 'bignumber.js'
import { getTaalAddress } from 'utils/addressHelpers'
import useTokenBalance from './useTokenBalance'

/**
 * A hook to check if a wallet's TAL balance is at least the amount passed in
 */
const useHasCakeBalance = (minimumBalance: BigNumber) => {
  const { balance: cakeBalance } = useTokenBalance(getTaalAddress())
  return cakeBalance.gte(minimumBalance)
}

export default useHasCakeBalance

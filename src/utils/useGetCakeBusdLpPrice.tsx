import { useCurrency } from 'hooks/Tokens'
import { useTradeExactIn } from 'hooks/Trades'
import { tryParseAmount } from 'state/swap/hooks'

const useGetCakeBusdLpPrice = () => {
  const talAddress = '0x78A24ACCF5f557B004C1313b2cAd2E85c345d971'
  const usdcAddress = '0x9c8FA1ee532f8Afe9F2E27f06FD836F3C9572f71'
  const inputCurrency = useCurrency(talAddress)
  const outputCurrency = useCurrency(usdcAddress)
  const parsedAmount = tryParseAmount('1', inputCurrency ?? undefined)
  const bestTradeExactIn = useTradeExactIn(parsedAmount, outputCurrency ?? undefined)
  const price = bestTradeExactIn?.executionPrice.toSignificant(6)
  return price ? parseFloat(price) : undefined
}

export default useGetCakeBusdLpPrice

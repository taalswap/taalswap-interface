import { useCurrency } from 'hooks/Tokens'
import { useTradeExactIn } from 'hooks/Trades'
import { tryParseAmount } from 'state/swap/hooks'

const useGetCakeBusdLpPrice = () => {
  const talAddress = '0x90a4a420732907b3c38b11058f9aa02b3f4121df'
  const usdcAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
  const inputCurrency = useCurrency(talAddress)
  const outputCurrency = useCurrency(usdcAddress)
  const parsedAmount = tryParseAmount('1', inputCurrency ?? undefined)
  const bestTradeExactIn = useTradeExactIn(parsedAmount, outputCurrency ?? undefined)
  const price = bestTradeExactIn?.executionPrice.toSignificant(6)
  return price ? parseFloat(price) : undefined
}

export default useGetCakeBusdLpPrice

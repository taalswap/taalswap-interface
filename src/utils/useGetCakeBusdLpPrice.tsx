import { ChainId } from 'taalswap-sdk';
import { useCurrency } from 'hooks/Tokens'
import { useTradeExactIn } from 'hooks/Trades'
import { tryParseAmount } from 'state/swap/hooks'
import { useActiveWeb3React } from 'hooks'
import { TAL, USDC } from '../constants';

const useGetCakeBusdLpPrice = () => {
  const { chainId } = useActiveWeb3React()
  // const talAddress = '0x90a4a420732907b3c38b11058f9aa02b3f4121df'
  // const usdcAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
  let taalAddress
  let usdcAddress
  switch(chainId) {
    case 1:
      taalAddress = TAL[ChainId.MAINNET];
      usdcAddress = USDC[ChainId.MAINNET];
      break;
    case 3:
      taalAddress = TAL[ChainId.ROPSTEN];
      usdcAddress = USDC[ChainId.ROPSTEN];
      break;
    case 4:
      taalAddress = TAL[ChainId.RINKEBY];
      usdcAddress = USDC[ChainId.RINKEBY];
      break;
    case 8217:
      taalAddress = TAL[ChainId.KLAYTN];
      usdcAddress = USDC[ChainId.KLAYTN];
      break;
    case 1001:
      taalAddress = TAL[ChainId.BAOBAB];
      usdcAddress = USDC[ChainId.BAOBAB];
      break;
  }

  const inputCurrency = useCurrency(taalAddress)
  const outputCurrency = useCurrency(usdcAddress)
  const parsedAmount = tryParseAmount('1', inputCurrency ?? undefined)
  const bestTradeExactIn = useTradeExactIn(parsedAmount, outputCurrency ?? undefined)
  const price = bestTradeExactIn?.executionPrice.toSignificant(6)
  return price ? parseFloat(price) : undefined
}

export default useGetCakeBusdLpPrice

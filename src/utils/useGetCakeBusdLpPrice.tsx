import { ChainId } from 'taalswap-sdk';
import { useCurrency } from 'hooks/Tokens'
import { useTradeExactIn } from 'hooks/Trades'
import { tryParseAmount } from 'state/swap/hooks'
import { useActiveWeb3React } from 'hooks'
import { TAL_ADDRESS, USDC_ADDRESS } from '../constants';
import { NETWORK_CHAIN_ID } from '../connectors';

const useGetCakeBusdLpPrice = () => {
  // const talAddress = '0x90a4a420732907b3c38b11058f9aa02b3f4121df'
  // const usdcAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
  let taalAddress
  let usdcAddress
  switch(NETWORK_CHAIN_ID) {
    case 1:
      taalAddress = TAL_ADDRESS[ChainId.MAINNET];
      usdcAddress = USDC_ADDRESS[ChainId.MAINNET];
      break;
    case 3:
      taalAddress = TAL_ADDRESS[ChainId.ROPSTEN];
      usdcAddress = USDC_ADDRESS[ChainId.ROPSTEN];
      break;
    case 4:
      taalAddress = TAL_ADDRESS[ChainId.RINKEBY];
      usdcAddress = USDC_ADDRESS[ChainId.RINKEBY];
      break;
    case 8217:
      taalAddress = TAL_ADDRESS[ChainId.KLAYTN];
      usdcAddress = USDC_ADDRESS[ChainId.KLAYTN];
      break;
    case 1001:
      taalAddress = TAL_ADDRESS[ChainId.BAOBAB];
      usdcAddress = USDC_ADDRESS[ChainId.BAOBAB];
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

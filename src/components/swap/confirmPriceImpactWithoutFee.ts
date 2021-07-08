import { Percent } from 'taalswap-sdk';
import {
  ALLOWED_PRICE_IMPACT_HIGH,
  PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN,
} from '../../constants';

/**
 * Given the price impact, get user confirmation.
 *
 * @param priceImpactWithoutFee price impact of the trade without the fee.
 */
export default function confirmPriceImpactWithoutFee(
  priceImpactWithoutFee: Percent,
  storedLangCode
): boolean {
  if (!priceImpactWithoutFee.lessThan(PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN)) {
    return (
      window.prompt(
        storedLangCode === 'ko-KR'
          ? `이 토큰교환은 최소한 ${PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN.toFixed(
              0
            )}%의 가격 충격도(price impact)를 가지고 있습니다. 토큰교환을 계속하려면 “confirm”이란 단어를 입력해주세요.`
          : `This swap has a price impact of at least ${PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN.toFixed(
              0
            )}%. Please type the word "confirm" to continue with this swap.`
      ) === 'confirm'
    );
  }
  if (!priceImpactWithoutFee.lessThan(ALLOWED_PRICE_IMPACT_HIGH)) {
    return window.confirm(
      storedLangCode === 'ko-KR'
        ? `이 토큰교환은 최소한 ${ALLOWED_PRICE_IMPACT_HIGH.toFixed(
            0
          )}%의 가격 충격도(price impact)를 가지고 있습니다. 토큰교환을 계속하려면 ”확인” 버튼을 클릭해주세요.`
        : `This swap has a price impact of at least ${ALLOWED_PRICE_IMPACT_HIGH.toFixed(
            0
          )}%. Please confirm that you would like to continue with this swap.`
    );
  }
  return true;
}

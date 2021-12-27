import React from 'react';
import {
  Flex,
  TooltipText,
  IconButton,
  useModal,
  CalculateIcon,
  Skeleton,
  useTooltip,
} from 'taalswap-uikit';
import { useTranslation } from 'contexts/Localization';
import Balance from 'views/Components/Balance';
import ApyCalculatorModal from 'views/Components/ApyCalculatorModal';
import { Pool } from 'state/types';
import { BASE_EXCHANGE_URL } from 'config';
import { getAprData } from 'views/Pools/helpers';
import { useWeb3React } from '@web3-react/core';

interface AprRowProps {
  pool: Pool;
  performanceFee?: number;
}

const AprRow: React.FC<AprRowProps> = ({ pool, performanceFee = 0 }) => {
  const { t } = useTranslation();
  const {
    stakingToken,
    earningToken,
    isFinished,
    apr,
    earningTokenPrice,
    isAutoVault,
  } = pool;

  const tooltipContent = isAutoVault
    ? t(
        'APY includes compounding, APR doesn’t. This pool’s TAL is compounded automatically, so we show APY.'
      )
    : t('This pool’s rewards aren’t compounded automatically, so we show APR');

  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, {
    placement: 'bottom-start',
  });

  const {
    apr: earningsPercentageToDisplay,
    roundingDecimals,
    compoundFrequency,
  } = getAprData(pool, performanceFee);
  const { chainId } = useWeb3React();

  // const apyModalLink =
  //   stakingToken.address &&
  //   `${BASE_EXCHANGE_URL}/#/swap?outputCurrency=${stakingToken.address[process.env.REACT_APP_CHAIN_ID]}`
  const apyModalLink =
    stakingToken.address &&
    `${BASE_EXCHANGE_URL}/#/swap?outputCurrency=${stakingToken.address[chainId]}`;

  const [onPresentApyModal] = useModal(
    <ApyCalculatorModal
      tokenPrice={earningTokenPrice}
      apr={apr}
      linkLabel={t('Get %symbol%', { symbol: stakingToken.symbol })}
      linkHref={apyModalLink || BASE_EXCHANGE_URL}
      earningTokenSymbol={earningToken.symbol}
      roundingDecimals={roundingDecimals}
      compoundFrequency={compoundFrequency}
      performanceFee={performanceFee}
    />
  );

  return (
    <Flex alignItems="center" justifyContent="space-between">
      {tooltipVisible && tooltip}
      <TooltipText ref={targetRef}>
        {isAutoVault ? `${t('APY')}:` : `${t('APR')}:`}
      </TooltipText>
      {isFinished || !apr ? (
        <Skeleton width="82px" height="32px" />
      ) : (
        <Flex alignItems="center">
          <Balance
            fontSize="16px"
            isDisabled={isFinished}
            value={earningsPercentageToDisplay}
            decimals={2}
            unit="%"
            bold
          />
          <IconButton onClick={onPresentApyModal} variant="text" scale="sm">
            <CalculateIcon color="textSubtle" width="18px" />
          </IconButton>
        </Flex>
      )}
    </Flex>
  );
};

export default AprRow;

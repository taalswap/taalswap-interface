import React, { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import styled from 'styled-components';
import {
  Card,
  CardBody,
  Text,
  Flex,
  HelpIcon,
  Button,
  Heading,
  Skeleton,
  useModal,
  Box,
  useTooltip,
} from 'taalswap-uikit';
import { useTranslation } from 'contexts/Localization';
import { getBalanceNumber } from 'utils/formatBalance';
import { useCakeVault, usePriceCakeBusd } from 'state/hooks';
import Balance from 'views/Components/Balance';
import BountyModal from './BountyModal';
import HelpButton from './HelpButton';

const StyledCard = styled(Card)`
  width: 100%;
  flex: 1;
  background: initial;
  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 240px;
  }
`;

const BountyCard = () => {
  const { t } = useTranslation();
  const {
    estimatedCakeBountyReward,
    totalPendingCakeHarvest,
    fees: { callFee },
  } = useCakeVault();
  const cakePriceBusd = usePriceCakeBusd();

  const estimatedDollarBountyReward = useMemo(() => {
    return new BigNumber(estimatedCakeBountyReward).multipliedBy(cakePriceBusd);
  }, [cakePriceBusd, estimatedCakeBountyReward]);

  const hasFetchedDollarBounty = estimatedDollarBountyReward.gte(0);
  const hasFetchedCakeBounty = estimatedCakeBountyReward
    ? estimatedCakeBountyReward.gte(0)
    : false;
  const dollarBountyToDisplay = hasFetchedDollarBounty
    ? getBalanceNumber(estimatedDollarBountyReward, 18)
    : 0;
  const cakeBountyToDisplay = hasFetchedCakeBounty
    ? getBalanceNumber(estimatedCakeBountyReward, 18)
    : 0;

  const TooltipComponent = () => (
    <>
      <Text mb="16px">
        {t(
          'This bounty is given as a reward for providing a service to other users.'
        )}
      </Text>
      <Text mb="16px">
        {t(
          'Whenever you successfully claim the bounty, you’re also helping out by activating the Auto TAL Pool’s compounding function for everyone.'
        )}
      </Text>
      <Text style={{ fontWeight: 'bold' }}>
        {t(
          'Auto-Compound Bounty: %fee%% of all Auto TAL pool users pending yield',
          { fee: callFee / 100 }
        )}
      </Text>
    </>
  );

  const [onPresentBountyModal] = useModal(
    <BountyModal
      cakeBountyToDisplay={cakeBountyToDisplay}
      dollarBountyToDisplay={dollarBountyToDisplay}
      totalPendingCakeHarvest={totalPendingCakeHarvest}
      callFee={callFee}
      TooltipComponent={TooltipComponent}
    />
  );

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <TooltipComponent />,
    {
      placement: 'bottom-end',
      tooltipOffset: [20, 10],
    }
  );

  return (
    <>
      {tooltipVisible && tooltip}
      <StyledCard
        style={{ boxShadow: 'none', minWidth: 'initial', borderRadius: '0' }}
      >
        <CardBody style={{ display: 'flex', padding: '0', width: '100%' }}>
          <HelpButton />
          <Flex flexDirection="row" mr="10px" mt="10px">
            <Flex alignItems="center">
              <Text fontSize="14px" bold color="textSubtle" mr="4px">
                {t('Auto TAL Bounty')}
              </Text>
              <Box ref={targetRef}>
                <HelpIcon color="textSubtle" />
              </Box>
            </Flex>
          </Flex>
          <Flex alignItems="center" justifyContent="space-between" mt="10px">
            <Flex flexDirection="column" mr="10px">
              <Heading>
                {hasFetchedCakeBounty ? (
                  <Balance
                    fontSize="16px"
                    bold
                    value={cakeBountyToDisplay}
                    decimals={3}
                  />
                ) : (
                  <Skeleton height={20} width={96} mb="5px" />
                )}
              </Heading>
              {hasFetchedDollarBounty ? (
                <Balance
                  fontSize="12px"
                  color="textSubtle"
                  value={dollarBountyToDisplay}
                  decimals={2}
                  unit=" USD"
                  prefix="~"
                />
              ) : (
                <Skeleton height={16} width={62} />
              )}
            </Flex>
            <Button
              disabled={
                !dollarBountyToDisplay || !cakeBountyToDisplay || !callFee
              }
              onClick={onPresentBountyModal}
              scale="sm"
              mr="5px"
            >
              {t('Claim')}
            </Button>
          </Flex>
        </CardBody>
      </StyledCard>
    </>
  );
};

export default BountyCard;

import React from 'react';
import styled from 'styled-components';
import { Flex, Link, Skeleton, Text, TimerIcon } from 'taalswap-uikit';
import { getBscScanBlockCountdownUrl } from 'utils/bscscan';
import { Pool } from 'state/types';
import { useBlock } from 'state/hooks';
import Balance from 'views/Components/Balance';
import { useTranslation } from 'contexts/Localization';
import { getPoolBlockInfo } from 'views/Pools/helpers';
import BaseCell, { CellContent } from './BaseCell';

interface FinishCellProps {
  pool: Pool;
}

const StyledCell = styled(BaseCell)`
  flex: 2 0 80px;
  word-break: break-word;
  justify-content: center;
`;

const EndsInCell: React.FC<FinishCellProps> = ({ pool }) => {
  const { sousId, totalStaked, endBlock, isFinished } = pool;
  const { currentBlock } = useBlock();
  const { t } = useTranslation();

  const {
    shouldShowBlockCountdown,
    blocksUntilStart,
    blocksRemaining,
    hasPoolStarted,
    blocksToDisplay,
  } = getPoolBlockInfo(pool, currentBlock);

  const isCakePool = sousId === 0;

  const renderBlocks = shouldShowBlockCountdown ? (
    <Flex alignItems="center">
      <Flex flex="1.3">
        <Balance fontSize="14px" value={blocksToDisplay} decimals={0} />
        <Text ml="4px" textTransform="lowercase">
          {t('Blocks')}
        </Text>
      </Flex>
      <Flex flex="1">
        <Link
          external
          href={getBscScanBlockCountdownUrl(endBlock)}
          onClick={(e) => e.stopPropagation()}
        >
          <TimerIcon ml="4px" />
        </Link>
      </Flex>
    </Flex>
  ) : (
    <Text>-</Text>
  );

  // A bit hacky way to determine if public data is loading relying on totalStaked
  // Opted to go for this since we don't really need a separate publicDataLoaded flag
  // anywhere else
  const isLoadingPublicData =
    !totalStaked.gt(0) ||
    !currentBlock ||
    (!blocksRemaining && !blocksUntilStart);
  const showLoading = isLoadingPublicData && !isCakePool && !isFinished;
  return (
    <StyledCell role="cell">
      <CellContent>
        {showLoading ? <Skeleton width="80px" height="16px" /> : renderBlocks}
      </CellContent>
    </StyledCell>
  );
};

export default EndsInCell;

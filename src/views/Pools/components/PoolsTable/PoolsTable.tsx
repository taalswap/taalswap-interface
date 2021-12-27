import React, { useRef } from 'react'
import styled from 'styled-components'
import { Text, Button, ChevronUpIcon,useMatchBreakpoints } from 'taalswap-uikit'
import { useTranslation } from 'contexts/Localization'
import { Pool } from 'state/types'
import PoolRow from './PoolRow'
import BaseCell, { CellContent } from './Cells/BaseCell'

interface PoolsTableProps {
  pools: Pool[]
  userDataLoaded: boolean
  account: string
}

const StyledTable = styled.div`
  border-radius: 16px;
  > div:not(:last-child) {
    border-bottom: 2px solid rgba(133, 133, 133, 0.1);
  }
`

const StyledTableBorder = styled.div`
  border-radius: 16px;
  filter: ${({ theme }) => theme.card.dropShadow};
  background: ${({ theme }) => theme.card.background};
  background-size: 400% 400%;
`

const ScrollButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
`
const StyledRow = styled.div`
  background: ${({ theme }) => theme.colors.tertiary};
  display: flex;
  cursor: pointer;
  border-bottom: none !important;
`
const StyledCell = styled(BaseCell)`
  flex-direction: row;
  border-bottom: 2px solid rgba(133, 133, 133, 0.1);
`
const PoolsTable: React.FC<PoolsTableProps> = ({ pools, userDataLoaded, account }) => {
  const { isLg, isXl, isSm, isMd, isXs } = useMatchBreakpoints()
  const { t } = useTranslation()
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const scrollToTop = (): void => {
    tableWrapperEl.current.scrollIntoView({
      behavior: 'smooth',
    })
  }
  return (
    <StyledTableBorder>
      <StyledTable role="table" ref={tableWrapperEl}>
        <StyledRow role="row" style={{ borderRadius: "8px 8px 0 0", position: 'sticky', top:0, zIndex: 1000 }}>
          {isLg  && (
            <>
            <StyledCell role="cell" style={{ flex: '1 0 130px', paddingLeft: '20px' }}>
            <CellContent>
              <Text fontSize="14px" color="textSubtle" bold>
                {t('Pair')}
              </Text>
            </CellContent>
          </StyledCell>
          <StyledCell role="cell" style={{ flex: '1 0 100px' }}>
            <CellContent>
              <Text fontSize="14px" color="textSubtle" bold>
                {t('Earned')}
              </Text>
            </CellContent>
          </StyledCell>
          <StyledCell role="cell" style={{ flex: '0 0 120px' }}>
            <CellContent>
              <Text fontSize="14px" color="textSubtle" bold>
                {t('APY/APR')}
              </Text>
            </CellContent>
          </StyledCell>
            <StyledCell role="cell" style={{ flex: '2 0 220px' }}>
              <CellContent>
                <Text fontSize="14px" color="textSubtle" bold>
                  {t('Total Staked')}
                </Text>
              </CellContent>
            </StyledCell>
            </>
          )}

          {isXl && (
            <>
            <StyledCell role="cell" style={{ flex: '1 0 130px', paddingLeft: '20px' }}>
            <CellContent>
              <Text fontSize="14px" color="textSubtle" bold>
                {t('Pair')}
              </Text>
            </CellContent>
          </StyledCell>
          <StyledCell role="cell" style={{ flex: '1 0 100px' }}>
            <CellContent>
              <Text fontSize="14px" color="textSubtle" bold>
                {t('Earned')}
              </Text>
            </CellContent>
          </StyledCell>
          <StyledCell role="cell" style={{ flex: '0 0 120px' }}>
            <CellContent>
              <Text fontSize="14px" color="textSubtle" bold>
                {t('APY/APR')}
              </Text>
            </CellContent>
          </StyledCell>
            <StyledCell role="cell" style={{ flex: '2 0 100px' }}>
              <CellContent>
                <Text fontSize="14px" color="textSubtle" bold>
                  {t('Total Staked')}
                </Text>
              </CellContent>
            </StyledCell>
              <StyledCell role="cell" style={{ flex: '2 0 80px' }}>
                <CellContent>
                  <Text fontSize="14px" color="textSubtle">
                    {t('Blocks')}
                  </Text>
                </CellContent>
              </StyledCell>
              <StyledCell role="cell" style={{ flex: '0 0 120px' }}>
                <CellContent>
                  <Text fontSize="14px" color="textSubtle" bold>
                    {t('Details View')}
                  </Text>
                </CellContent>
              </StyledCell>
            </>
          )}

          {isMd && (
            <>
            <StyledCell role="cell" style={{ flex: '1 0 130px', paddingLeft: '20px' }}>
            <CellContent>
              <Text fontSize="14px" color="textSubtle" bold>
                {t('Pair')}
              </Text>
            </CellContent>
          </StyledCell>
          <StyledCell role="cell" style={{ flex: '1 0 100px' }}>
            <CellContent>
              <Text fontSize="14px" color="textSubtle" bold>
                {t('Earned')}
              </Text>
            </CellContent>
          </StyledCell>
          <StyledCell role="cell" style={{ flex: '1 0 50px' }}>
            <CellContent>
              <Text fontSize="14px" color="textSubtle" bold>
                {t('APY/APR')}
              </Text>
            </CellContent>
          </StyledCell>
            <StyledCell role="cell" style={{ flex: '1' }}>
                <CellContent>
                  <Text fontSize="14px" color="textSubtle">
                    {t('')}
                  </Text>
                </CellContent>
              </StyledCell>
            </>
          )}
          {isSm && (
            <>
            <StyledCell role="cell" style={{ flex: '5', paddingLeft: '20px' }}>
            <CellContent>
              <Text fontSize="14px" color="textSubtle" bold>
                {t('Pair')}
              </Text>
            </CellContent>
          </StyledCell>
          <StyledCell role="cell" style={{ flex: '4.5' }}>
            <CellContent>
              <Text fontSize="14px" color="textSubtle" bold>
                {t('Earned')}
              </Text>
            </CellContent>
          </StyledCell>
          <StyledCell role="cell" style={{ flex: '1 0 50px' }}>
            <CellContent>
              <Text fontSize="14px" color="textSubtle" bold>
                {t('APY/APR')}
              </Text>
            </CellContent>
          </StyledCell>
            <StyledCell role="cell" style={{ flex: '1' }}>
                <CellContent>
                  <Text fontSize="14px" color="textSubtle">
                    {t('')}
                  </Text>
                </CellContent>
              </StyledCell>
            </>
          )}
          {isXs && (
            <>
            <StyledCell role="cell" style={{ flex: '5', paddingLeft: '12px' }}>
            <CellContent>
              <Text fontSize="14px" color="textSubtle" bold>
                {t('Pair')}
              </Text>
            </CellContent>
          </StyledCell>
          <StyledCell role="cell" style={{ flex: '4.5' }}>
            <CellContent>
              <Text fontSize="14px" color="textSubtle" bold>
                {t('Earned')}
              </Text>
            </CellContent>
          </StyledCell>
          <StyledCell role="cell" style={{ flex: '1 0 50px' }}>
            <CellContent>
              <Text fontSize="14px" color="textSubtle" bold>
                {t('APY/APR')}
              </Text>
            </CellContent>
          </StyledCell>
            <StyledCell role="cell" style={{ flex: '1' }}>
                <CellContent>
                  <Text fontSize="14px" color="textSubtle">
                    {t('')}
                  </Text>
                </CellContent>
              </StyledCell>
            </>
          )}
        </StyledRow>

        {pools.map((pool) => (
          <PoolRow
            key={pool.isAutoVault ? 'auto-cake' : pool.sousId}
            pool={pool}
            account={account}
            userDataLoaded={userDataLoaded}
          />
        ))}

        <ScrollButtonContainer>
          <Button variant="text" onClick={scrollToTop}>
            {t('To Top')}
            <ChevronUpIcon color="primary" />
          </Button>
        </ScrollButtonContainer>
      </StyledTable>
    </StyledTableBorder>
  )
}

export default PoolsTable

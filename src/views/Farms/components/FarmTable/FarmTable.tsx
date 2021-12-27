import React, { useRef } from 'react'
import styled from 'styled-components'
import { useTable, Button, ChevronUpIcon, ColumnType, useMatchBreakpoints } from 'taalswap-uikit'
import { useTranslation } from 'contexts/Localization'
import CellLayout from './CellLayout'
import Row, { RowProps } from './Row'

export interface ITableProps {
  data: RowProps[]
  columns: ColumnType<RowProps>[]
  userDataReady: boolean
  sortColumn?: string
  isLandingPage: boolean
}

const Container = styled.div`
  filter: ${({ theme }) => theme.card.dropShadow};
  width: 100%;
  background: ${({ theme }) => theme.card.background};
  border-radius: 16px;
  // margin: 16px 0px;
`

const TableWrapper = styled.div`
  overflow: visible;
  &::-webkit-scrollbar {
    display: none;
  }
`

const StyledTable = styled.table`
  border-collapse: collapse;
  font-size: 14px;
  border-radius: 4px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
`

const TableBody = styled.tbody`
  & tr {
    td {
      font-size: 14px;
      vertical-align: middle;
    }
  }
  & tr {
    th {
      text-align: left;
      background: ${({ theme }) => theme.colors.tertiary};
      color: ${({ theme }) => theme.colors.textSubtle};
      font-size:14px;
      border-bottom: 2px solid rgba(133, 133, 133, 0.1);
    }
  }
  & tr td {
    border-bottom: 2px solid rgba(133, 133, 133, 0.1);
  }
  tr td tr td{
    border-bottom: none;
  }
  `

const TableContainer = styled.div`
  position: relative;
`

const ScrollButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
`

const CellInner = styled.div`
  padding: 24px 0px;
  display: flex;
  width: 100%;
  align-items: center;
  padding-right: 8px;

  ${({ theme }) => theme.mediaQueries.xl} {
    padding-right: 18px;
  }
`

const FarmTable: React.FC<ITableProps> = (props) => {
  const { isXl, isSm, isMd, isLg } = useMatchBreakpoints()
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()
  const { data, columns, userDataReady, isLandingPage } = props

  const { rows } = useTable(columns, data, { sortable: true, sortColumn: 'farm' })

  const scrollToTop = (): void => {
    tableWrapperEl.current.scrollIntoView({
      behavior: 'smooth',
    })
  }

  return (
    <Container>
      <TableContainer>
        <TableWrapper ref={tableWrapperEl}>
          <StyledTable>
            <TableBody>
              <tr style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
                <th style={{ borderRadius: '8px 0 0 0', paddingLeft: '20px' }}>
                  <CellInner>
                    <CellLayout>{t('Pair')}</CellLayout>
                  </CellInner>
                </th>
                <th>
                  <CellInner>
                    <CellLayout>{t('Earned')}</CellLayout>
                  </CellInner>
                </th>
                <th>
                  <CellInner>
                    <CellLayout>{t('APR')}</CellLayout>
                  </CellInner>
                </th>
                {isXl && (
                  <>
                    <th>
                      <CellInner>
                        <CellLayout>{t('Liquidity')}</CellLayout>
                      </CellInner>
                    </th>
                    <th>
                      <CellInner>
                        <CellLayout>{t('Multiplier')}</CellLayout>
                      </CellInner>
                    </th>
                  </>
                )}
                {isSm || isMd ? (
                  <th style={{ borderRadius: '0 8px 0 0' }}>
                    <CellInner>
                      <CellLayout> </CellLayout>
                    </CellInner>
                  </th>
                ) : (
                  <th style={{ borderRadius: '0 8px 0 0' }}>
                    <CellInner>
                      <CellLayout>{t('Details View')}</CellLayout>
                    </CellInner>
                  </th>
                )}
              </tr>
              {rows.map((row) => {
                return (
                  <Row
                    {...row.original}
                    userDataReady={userDataReady}
                    key={`table-row-${row.id}`}
                    isLandingPage={isLandingPage}
                  />
                )
              })}
            </TableBody>
          </StyledTable>
        </TableWrapper>
        <ScrollButtonContainer>
          <Button variant="text" onClick={scrollToTop}>
            {t('To Top')}
            <ChevronUpIcon color="primary" />
          </Button>
        </ScrollButtonContainer>
      </TableContainer>
    </Container>
  )
}

export default FarmTable

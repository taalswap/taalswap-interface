import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { Flex, Heading, HistoryIcon, IconButton, Text, TuneIcon, useModal } from 'taalswap-uikit'
import useI18n from 'hooks/useI18n'
import SettingsModal from './SettingsModal'
import RecentTransactionsModal from './RecentTransactionsModal'

interface PageHeaderProps {
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
}
/* to do */
const StyledPageHeader = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.disabled};
  padding: 24px;
`

const Details = styled.div`
  flex: 1;
`

const PageHeader = ({ title, description, children }: PageHeaderProps) => {
  const TranslateString = useI18n()
  const [onPresentSettings] = useModal(<SettingsModal translateString={TranslateString} />)
  const [onPresentRecentTransactions] = useModal(<RecentTransactionsModal translateString={TranslateString} />)

  return (
    <StyledPageHeader>
      <Flex alignItems='center'>
        <Details>
          <Heading mb='8px'>{title}</Heading>
          {description && (
            <Text color='#a7b2b3' fontSize='14px'>
              {description}
            </Text>
          )}
        </Details>
        <IconButton variant='text' onClick={onPresentSettings} title={TranslateString(1200, 'Settings')}>
          <TuneIcon width='24px' color='#00ab55' />
        </IconButton>
        <IconButton
          variant='text'
          onClick={onPresentRecentTransactions}
          title={TranslateString(1202, 'Recent transactions')}
        >
          <HistoryIcon width='24px' color='#00ab55' />
        </IconButton>
      </Flex>
      {children && <Text mt='16px'>{children}</Text>}
    </StyledPageHeader>
  )
}

export default PageHeader

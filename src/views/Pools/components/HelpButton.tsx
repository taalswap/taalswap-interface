import React from 'react'
import styled from 'styled-components'
import { Text, Button, HelpIcon, Link } from 'taalswap-uikit'
import { useTranslation } from 'contexts/Localization'

const ButtonText = styled(Text)`
  display: none;
  ${({ theme }) => theme.mediaQueries.xs} {
    display: block;
  }
`

const StyledLink = styled(Link)`
  margin-right: 16px;
  display: flex;
  justify-content: flex-end;

  &:hover {
    text-decoration: none;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1;
  }
`

const HelpButton = () => {
  const { t } = useTranslation()
  return (
    <StyledLink external href="https://taalswap.gitbook.io/taalswap-docs-v-2-0/">
      <Button
        px={['14px', null, null, null, '20px']}
        scale="sm"
        variant="helpbtn"
        style={{ padding: '0 11px', height: '36px', marginTop: '10px' }}
      >
        <ButtonText color="textSubtle" bold fontSize="14px">
          {t('Help')}
        </ButtonText>
        <HelpIcon color="textSubtle" ml={[null, null, null, 0, '4px']} />
      </Button>
    </StyledLink>
  )
}

export default HelpButton

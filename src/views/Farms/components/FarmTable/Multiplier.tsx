import React from 'react'
import styled from 'styled-components'
import { HelpIcon, Skeleton, useTooltip } from 'taalswap-uikit'
import { useTranslation } from 'contexts/Localization'

const ReferenceElement = styled.div`
  display: inline-block;
`

export interface MultiplierProps {
  multiplier: string
  multiplierAvg: number
}

const MultiplierWrapper = styled.div`
  color: ${({ theme }) => theme.colors.text};
  // width: 90px;
  // border: 1px solid red;
  ${({ theme }) => theme.mediaQueries.lg} {
    margin-right: 0;
  }
`

const Container = styled.div`
  display: flex;
  align-items: center;
`

const Multiplier: React.FunctionComponent<MultiplierProps> = ({ multiplier, multiplierAvg }) => {
  const count = multiplier !== undefined ? parseInt(multiplier.replace('X', '')) : 0
  const displayMultiplier = multiplier ? (
    `${multiplier.toLowerCase()} (${((count / multiplierAvg) * 100).toFixed(2)}%)`
  ) : (
    <Skeleton width={30} />
  )
  const { t } = useTranslation()
  const tooltipContent = (
    <div>
      {t('‘Multiplier’ registers the amount of TAL rewards each farm will get')}
      <br />
      <br />
      {t('For example, if a 1x farm was getting 1 TAL per block, a 40x farm would be getting 40 TAL per block.')}
    </div>
  )
  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, {
    placement: 'top-end',
    tooltipOffset: [20, 10],
  })

  return (
    <Container>
      <MultiplierWrapper>{displayMultiplier}</MultiplierWrapper>
      <ReferenceElement ref={targetRef}>
        <HelpIcon color="textSubtle" />
      </ReferenceElement>
      {tooltipVisible && tooltip}
    </Container>
  )
}

export default Multiplier

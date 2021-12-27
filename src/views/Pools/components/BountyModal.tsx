import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { DEFAULT_GAS_LIMIT } from 'config'
import styled from 'styled-components'
import { Modal, Text, Flex, Button, HelpIcon, AutoRenewIcon, useTooltip } from 'taalswap-uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import { useCakeVaultContract } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import { useTranslation } from 'contexts/Localization'
import UnlockButton from 'views/Components/UnlockButton'
import Balance from 'views/Components/Balance'

interface BountyModalProps {
  cakeBountyToDisplay: number
  dollarBountyToDisplay: number
  totalPendingCakeHarvest: BigNumber
  callFee: number
  onDismiss?: () => void
  TooltipComponent: React.ElementType
}

const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundDisabled};
  height: 1px;
  margin: 16px auto;
  width: 100%;
`

const BountyModal: React.FC<BountyModalProps> = ({
  cakeBountyToDisplay,
  dollarBountyToDisplay,
  totalPendingCakeHarvest,
  callFee,
  onDismiss,
  TooltipComponent,
}) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { theme } = useTheme()
  const { toastError, toastSuccess } = useToast()
  const cakeVaultContract = useCakeVaultContract()
  const [pendingTx, setPendingTx] = useState(false)
  const callFeeAsDecimal = callFee / 100
  const totalYieldToDisplay = getBalanceNumber(totalPendingCakeHarvest, 18)
  const { targetRef, tooltip, tooltipVisible } = useTooltip(<TooltipComponent />, {
    placement: 'bottom',
    tooltipPadding: { right: 15 },
  })
  const btnColor = theme.isDark ? '#fff' : '#212b36'

  const handleConfirmClick = async () => {
    cakeVaultContract.methods
      .harvest()
      .send({ from: account, gas: DEFAULT_GAS_LIMIT })
      .on('sending', () => {
        setPendingTx(true)
      })
      .on('receipt', () => {
        toastSuccess(t('Bounty collected!'), t('TAL bounty has been sent to your wallet.'))
        setPendingTx(false)
        onDismiss()
      })
      .on('error', (error) => {
        console.error(error)
        toastError(
          t('Could not be collected'),
          t('There may be an issue with your transaction, or another user claimed the bounty first.'),
        )
        setPendingTx(false)
        onDismiss()
      })
  }

  return (
    <Modal title={t('Claim Bounty')} onDismiss={onDismiss} style={{ position: 'relative' }}>
      {tooltipVisible && tooltip}
      <div style={{ position: 'absolute', right: '20px', top: '20px', cursor: 'pointer' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" onClick={onDismiss}>
          <g id="___Icons_ic_replace" data-name="__🥬Icons/ ic_replace" transform="translate(0 16.971) rotate(-45)">
            <g id="_gr" data-name="#gr">
              <path
                id="Path"
                d="M22.5,10.5h-9v-9a1.5,1.5,0,0,0-3,0v9h-9a1.5,1.5,0,0,0,0,3h9v9a1.5,1.5,0,0,0,3,0v-9h9a1.5,1.5,0,0,0,0-3Z"
                fill={btnColor}
              />
            </g>
          </g>
        </svg>
      </div>
      <Flex alignItems="flex-start" justifyContent="space-between">
        <Text>{t('You’ll claim')}</Text>
        <Flex flexDirection="column">
          <Balance bold value={cakeBountyToDisplay} decimals={7} unit=" TAL" />
          <Text fontSize="12px" color="textSubtle">
            <Balance
              fontSize="12px"
              color="textSubtle"
              value={dollarBountyToDisplay}
              decimals={2}
              unit=" USD"
              prefix="~"
            />
          </Text>
        </Flex>
      </Flex>
      <Divider />
      <Flex alignItems="center" justifyContent="space-between">
        <Text fontSize="14px" color="textSubtle">
          {t('Pool total pending yield')}
        </Text>
        <Balance color="textSubtle" value={totalYieldToDisplay} unit=" TAL" />
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" mb="24px">
        <Text fontSize="14px" color="textSubtle">
          {t('Bounty')}
        </Text>
        <Text fontSize="14px" color="textSubtle">
          {callFeeAsDecimal}%
        </Text>
      </Flex>
      {account ? (
        <Button
          isLoading={pendingTx}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
          onClick={handleConfirmClick}
          mb="28px"
        >
          {t('Confirm')}
        </Button>
      ) : (
        <UnlockButton mb="28px" />
      )}
      <Flex justifyContent="center" alignItems="center">
        <Text fontSize="16px" bold color="textSubtle" mr="4px">
          {t('What’s this?')}
        </Text>
        <span ref={targetRef}>
          <HelpIcon color="textSubtle" />
        </span>
      </Flex>
    </Modal>
  )
}

export default BountyModal

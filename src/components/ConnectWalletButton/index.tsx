import React from 'react'
import { Button, ButtonProps, useWalletModal } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import useAuth from 'hooks/useAuth'

const UnlockButton: React.FC<ButtonProps> = (props) => {
  const TranslateString = useI18n()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout)

  return (
    <Button onClick={onPresentConnectModal} {...props} style={{ backgroundColor: 'rgb(0, 171, 85)' }}>
      {TranslateString(292, 'Unlock Wallet')}
    </Button>
  )
}

export default UnlockButton

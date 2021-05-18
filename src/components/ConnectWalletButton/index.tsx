import React from 'react'
import { Button, ButtonProps, useWalletModal} from 'taalswap-uikit'
import useI18n from 'hooks/useI18n'
import useAuth from 'hooks/useAuth'

const UnlockButton: React.FC<ButtonProps> = (props) => {
  const TranslateString = useI18n()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout)

  return (
    <Button onClick={onPresentConnectModal} {...props} style={{ backgroundColor: '#00ab55' }}>
      {TranslateString(292, 'Unlock Wallet')}
    </Button>
  )
}

export default UnlockButton

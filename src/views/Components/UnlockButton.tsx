import React from 'react'
import { Button, useWalletModal } from 'taalswap-uikit'
import useAuth from 'hooks/useAuth'
import { useTranslation } from 'contexts/Localization'

const UnlockButton = (props) => {
  const { t } = useTranslation()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(
    login,
    logout,
    undefined,
    process.env.REACT_APP_CHAIN_ID,
    process.env.REACT_APP_KLAYTN_ID,
  )

  return (
    <Button onClick={onPresentConnectModal} {...props}>
      {t('Unlock Wallet')}
    </Button>
  )
}

export default UnlockButton

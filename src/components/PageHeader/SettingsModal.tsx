import React from 'react'
import { useTranslation } from 'contexts/Localization';
import { Modal } from 'taalswap-uikit'
import { useTheme } from "styled-components";
import SlippageToleranceSetting from './SlippageToleranceSetting'
import TransactionDeadlineSetting from './TransactionDeadlineSetting'
import AudioSetting from './AudioSetting'


type SettingsModalProps = {
  onDismiss?: () => void
}

// TODO: Fix UI Kit typings
const defaultOnDismiss = () => null

const SettingsModal = ({ onDismiss = defaultOnDismiss }: SettingsModalProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const btnColor = theme.isDark ? "#fff" : "#212b36";

  return (
    <Modal title={t('Settings')} onDismiss={onDismiss} style={{position:'relative'}}>
      <div style={{position:"absolute",right:"20px",top:'20px',cursor:'pointer'}}>
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" onClick={onDismiss}>
  <g id="___Icons_ic_replace" data-name="__🥬Icons/ ic_replace" transform="translate(0 16.971) rotate(-45)">
    <g id="_gr" data-name="#gr">
      <path id="Path" d="M22.5,10.5h-9v-9a1.5,1.5,0,0,0-3,0v9h-9a1.5,1.5,0,0,0,0,3h9v9a1.5,1.5,0,0,0,3,0v-9h9a1.5,1.5,0,0,0,0-3Z" fill={btnColor}/>
    </g>
  </g>
</svg>
      </div>
      <SlippageToleranceSetting />
      <TransactionDeadlineSetting />
      <AudioSetting />
    </Modal>
  )
}

export default SettingsModal

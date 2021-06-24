import React from 'react'
import { Box, Flex, PancakeToggle, Text, useMatchBreakpoints } from 'taalswap-uikit'
import { useAudioModeManager } from 'state/user/hooks'
import { useTranslation } from '../../contexts/Localization';

const AudioSetting = () => {
  const { t } = useTranslation();
  const { isSm, isXs } = useMatchBreakpoints()
  const [audioPlay, toggleSetAudioMode] = useAudioModeManager()

  return (
    <Box mb='16px'>
      <Flex alignItems='center' mb='8px'>
        <Text bold>{t('Audio')}</Text>
      </Flex>
      <Box>
        <PancakeToggle scale={isSm || isXs ? 'sm' : 'md'} checked={audioPlay} onChange={toggleSetAudioMode} />
      </Box>
    </Box>
  )
}

export default AudioSetting

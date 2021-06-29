import { useContext, useEffect } from 'react'
import { ThemeContext as StyledThemeCopntext } from 'styled-components'
import { ThemeContext } from '../ThemeContext'

const useTheme = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext)
  const theme = useContext(StyledThemeCopntext)
  useEffect(() => {
    const postMsg = {'key': 'IS_DARK', 'value': JSON.stringify(isDark)}
    // @ts-ignore
    postCrossDomainMessage(postMsg)
  }, [isDark])
  return { isDark, toggleTheme, theme }
}

export default useTheme

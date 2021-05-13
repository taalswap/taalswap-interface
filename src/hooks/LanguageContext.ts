import React, { createContext } from 'react'
import { Language } from 'taalswap-uikit'

export interface LanguageObject {
  code: string
  language: string
  locale: string
}

interface LanguageState {
  selectedLanguage: LanguageObject
  setSelectedLanguage: (langObject: Language) => void
  translatedLanguage: LanguageObject
  setTranslatedLanguage: React.Dispatch<React.SetStateAction<LanguageObject>>
}

const defaultLanguageState: LanguageState = {
  selectedLanguage: { code: '', language: '', locale: '' },
  setSelectedLanguage: (): void => undefined,
  translatedLanguage: { code: '', language: '', locale: '' },
  setTranslatedLanguage: (): void => undefined
}

export const LanguageContext = createContext(defaultLanguageState as LanguageState)

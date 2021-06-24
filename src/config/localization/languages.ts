import { Language } from 'taalswap-uikit';

export const EN: Language = {
  locale: 'en-US',
  language: 'English',
  code: 'en',
};
export const KO: Language = { locale: 'ko-KR', language: '한국어', code: 'ko' };

export const languages = {
  'en-US': EN,
  'ko-KR': KO,
};

export const languageList = Object.values(languages);

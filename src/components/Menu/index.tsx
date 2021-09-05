import React, { useContext } from 'react';
import { Menu as UikitMenu } from 'taalswap-uikit';
import { useWeb3React } from '@web3-react/core';
import { languageList } from 'config/localization/languages';

import { useTranslation } from 'contexts/Localization';
import useTheme from 'hooks/useTheme';
import useGetLocalProfile from 'hooks/useGetLocalProfile';
import useAuth from 'hooks/useAuth';
import useGetCakeBusdLpPrice from 'utils/useGetCakeBusdLpPrice';
import links from './config';

const Menu: React.FC = (props) => {
  const { account } = useWeb3React();
  const { login, logout } = useAuth();
  const { currentLanguage, setLanguage, t } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const cakeBusdPrice = useGetCakeBusdLpPrice();
  const profile = useGetLocalProfile();

  return (
    <UikitMenu
      links={links(t)}
      account={account as string}
      login={login}
      logout={logout}
      isDark={isDark}
      toggleTheme={toggleTheme}
      currentLang={currentLanguage?.code || ''}
      langs={languageList}
      setLang={setLanguage}
      cakePriceUsd={cakeBusdPrice}
      profile={profile}
      blockchain={process.env.REACT_APP_CHAIN_ID ?? "1"}
      {...props}
    />
  );
};

export default Menu;

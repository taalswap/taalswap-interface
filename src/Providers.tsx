import React from 'react';
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core';
import { Provider } from 'react-redux';
import { ModalProvider } from 'taalswap-uikit';
import { LanguageProvider } from 'contexts/Localization';
import { ThemeContextProvider } from './ThemeContext';
import { NetworkContextName } from './constants';
import store from './state';
import getLibrary from './utils/getLibrary';

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);

const Providers: React.FC = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <Provider store={store}>
          <ThemeContextProvider>
            <LanguageProvider>
              <ModalProvider>{children}</ModalProvider>
            </LanguageProvider>
          </ThemeContextProvider>
        </Provider>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  );
};

export default Providers;

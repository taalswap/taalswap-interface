import React, { Suspense, useEffect, useState } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { Credentials, StringTranslations } from '@crowdin/crowdin-api-client';
import { Language, useModal } from 'taalswap-uikit';
import VersionBar from 'components/VersionBar';
import Pools from 'views/Pools';
import Farms from 'views/Farms';
import Popups from '../components/Popups';
import Web3ReactManager from '../components/Web3ReactManager';
import {
  RedirectDuplicateTokenIds,
  RedirectOldAddLiquidityPathStructure,
} from './AddLiquidity/redirects';
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects';
import AddLiquidity from './AddLiquidity';
import Pool from './Pool';
import PoolFinder from './PoolFinder';
import RemoveLiquidity from './RemoveLiquidity';
import Swap from './Swap';
import XSwap from './XSwap';

import Migration from './Migration';
// import LandingPageView from './LandingPageView';
import { RedirectPathToSwapOnly, RedirectSwapTokenIds } from './Swap/redirects';
import { allLanguages, EN } from '../constants/localisation/languageCodes';
import { LanguageContext } from '../hooks/LanguageContext';
import { TranslationsContext } from '../hooks/TranslationsContext';
import UseV2ExchangeModal from '../components/UseV2ExchangeModal';

import Menu from '../components/Menu';
import useGetDocumentTitlePrice from '../hooks/useGetDocumentTitlePrice';

import LandingPageView from './LandingPageView';

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
`;

const BodyWrapper = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;
  margin-bottom: 64px;
  ${({ theme }) => theme.mediaQueries.lg} {
    margin-bottom: 0;
  }
`;

// const CACHE_KEY = 'pancakeswap_language';
const CACHE_KEY = 'taalswap_language';

const frontendBaseUrl =
  process.env.REACT_APP_FRONTEND || 'http://localhost:3000';

export default function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<any>(undefined);
  const [translatedLanguage, setTranslatedLanguage] = useState<any>(undefined);
  const [translations, setTranslations] = useState<Array<any>>([]);
  const apiKey = `${process.env.REACT_APP_CROWDIN_APIKEY}`;
  const projectId = parseInt(`${process.env.REACT_APP_CROWDIN_PROJECTID}`);
  const fileId = 6;

  const credentials: Credentials = {
    token: apiKey,
  };

  const stringTranslationsApi = new StringTranslations(credentials);

  const getStoredLang = (storedLangCode: string) => {
    return allLanguages.filter((language) => {
      return language.code === storedLangCode;
    })[0];
  };

  useEffect(() => {
    const storedLangCode = localStorage.getItem(CACHE_KEY);
    if (storedLangCode) {
      const storedLang = getStoredLang(storedLangCode);
      setSelectedLanguage(storedLang);
    } else {
      setSelectedLanguage(EN);
    }
  }, []);

  const fetchTranslationsForSelectedLanguage = async () => {
    stringTranslationsApi
      .listLanguageTranslations(
        projectId,
        selectedLanguage.code,
        undefined,
        fileId,
        200
      )
      .then((translationApiResponse) => {
        if (translationApiResponse.data.length < 1) {
          setTranslations(['error']);
        } else {
          setTranslations(translationApiResponse.data);
        }
      })
      .then(() => setTranslatedLanguage(selectedLanguage))
      .catch((error) => {
        setTranslations(['error']);
        console.error(error);
      });
  };

  useEffect(() => {
    if (selectedLanguage) {
      fetchTranslationsForSelectedLanguage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguage]);

  const handleLanguageSelect = (langObject: Language) => {
    setSelectedLanguage(langObject);
    localStorage.setItem(CACHE_KEY, langObject.code);
  };

  useGetDocumentTitlePrice();

  return (
    <Suspense fallback={null}>
      <HashRouter>
        <AppWrapper>
          {/* <LanguageContext.Provider
            value={{
              selectedLanguage,
              setSelectedLanguage: handleLanguageSelect,
              translatedLanguage,
              setTranslatedLanguage,
            }}
          > */}
          <TranslationsContext.Provider
            value={{ translations, setTranslations }}
          >
            <Switch>
              <Route exact strict path="/" component={LandingPageView} />
              <Menu>
                <BodyWrapper>
                  <Popups />
                  <Web3ReactManager>
                    <Switch>
                      {process.env.REACT_APP_SITE_STOP === 'true' ? (
                        <>
                          <Route
                            exact
                            path="/swap"
                            component={() => {
                              window.location.assign(`${frontendBaseUrl}`);
                              return null;
                            }}
                          />
                          <Route
                            exact
                            path="/liquidity"
                            component={() => {
                              window.location.assign(`${frontendBaseUrl}`);
                              return null;
                            }}
                          />
                          <Route
                            exact
                            strict
                            path="/swap/:isAdmin"
                            component={Swap}
                          />
                          <Route
                            exact
                            strict
                            path="/liquidity/:isAdmin"
                            component={Pool}
                          />
                        </>
                      ) : (
                        <>
                          <Route exact strict path="/" component={Swap} />
                          <Route exact strict path="/swap" component={Swap} />
                          <Route exact strict path="/xswap" component={XSwap} />
                          <Route
                            exact
                            strict
                            path="/liquidity"
                            component={Pool}
                          />
                          <Route exact strict path="/farms" component={Farms} />
                          <Route
                            exact
                            strict
                            path="/staking"
                            component={Pools}
                          />
                          <Route
                            exact
                            path="/swap/:chainId/:currencyIdA/:currencyIdB"
                            component={RedirectSwapTokenIds}
                          />
                          <Route
                            exact
                            strict
                            path="/find"
                            component={PoolFinder}
                          />
                          <Route exact path="/add" component={AddLiquidity} />
                          <Route exact path="/migrate" component={Migration} />
                          <Route
                            exact
                            strict
                            path="/remove/:currencyIdA/:currencyIdB"
                            component={RemoveLiquidity}
                          />

                          {/* Redirection: These old routes are still used in the code base */}
                          <Route
                            exact
                            path="/add/:currencyIdA"
                            component={RedirectOldAddLiquidityPathStructure}
                          />
                          <Route
                            exact
                            path="/add/:chainId/:currencyIdA/:currencyIdB"
                            component={RedirectDuplicateTokenIds}
                          />
                          <Route
                            exact
                            strict
                            path="/remove/:tokens"
                            component={RedirectOldRemoveLiquidityPathStructure}
                          />
                        </>
                      )}
                      {/* <Route component={RedirectPathToSwapOnly} /> */}
                    </Switch>
                  </Web3ReactManager>
                </BodyWrapper>
              </Menu>
            </Switch>
          </TranslationsContext.Provider>
          {/* </LanguageContext.Provider> */}
        </AppWrapper>
      </HashRouter>
    </Suspense>
  );
}

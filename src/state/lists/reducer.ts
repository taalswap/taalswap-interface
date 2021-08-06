import { ChainId } from 'taalswap-sdk';
import { createReducer } from '@reduxjs/toolkit';
import { getVersionUpgrade, VersionUpgrade } from '@uniswap/token-lists';
// eslint-disable-next-line import/no-unresolved
import { TokenList } from '@uniswap/token-lists/dist/types';
import {
  DEFAULT_LIST_OF_LISTS, DEFAULT_LIST_OF_LISTS_BAOBAB, DEFAULT_LIST_OF_LISTS_KLAYTN,
  DEFAULT_LIST_OF_LISTS_RINKEBY,
  DEFAULT_LIST_OF_LISTS_ROPSTEN,
  DEFAULT_TOKEN_LIST_URL
} from '../../constants/lists';
import { updateVersion } from '../global/actions';
import { acceptListUpdate, addList, fetchTokenList, removeList, selectList } from './actions';
import { useActiveWeb3React } from '../../hooks';
import DEFAULT_LIST from '../../constants/token/taalswap.json'
import DEFAULT_LIST_ROPSTEN from '../../constants/token/taalswap-ropsten.json'
import DEFAULT_LIST_RINKEBY from '../../constants/token/taalswap-rinkeby.json'
import DEFAULT_LIST_KLAYTN from '../../constants/token/taalswap-klaytn.json'
import DEFAULT_LIST_BAOBAB from '../../constants/token/taalswap-baobab.json'

export interface ListsState {
  readonly [chain: string]: {
    readonly byUrl: {
      readonly [url: string]: {
        readonly current: TokenList | null
        readonly pendingUpdate: TokenList | null
        readonly loadingRequestId: string | null
        readonly error: string | null
      }
    }
    // this contains the default list of lists from the last time the updateVersion was called, i.e. the app was reloaded
    readonly lastInitializedDefaultListOfLists?: string[]
    readonly selectedListUrl: string | undefined
  }
}

const NEW_LIST_STATE: ListsState[number]['byUrl'][string] = {
  error: null,
  current: null,
  loadingRequestId: null,
  pendingUpdate: null
};

type Mutable<T> = { -readonly [P in keyof T]: T[P] extends ReadonlyArray<infer U> ? U[] : T[P] }

const initialStates: ListsState = {
  [ChainId.MAINNET]: {
    lastInitializedDefaultListOfLists: DEFAULT_LIST_OF_LISTS,
    byUrl: {
      ...DEFAULT_LIST_OF_LISTS.reduce<Mutable<ListsState[ChainId.MAINNET]['byUrl']>>((memo, listUrl) => {
        memo[listUrl] = NEW_LIST_STATE[ChainId.MAINNET];
        return memo;
      }, {}),
      [DEFAULT_TOKEN_LIST_URL[ChainId.MAINNET]]: {
        error: null,
        current: DEFAULT_LIST,
        loadingRequestId: null,
        pendingUpdate: null
      }
    },
    selectedListUrl: DEFAULT_TOKEN_LIST_URL[ChainId.MAINNET]
  },
  [ChainId.ROPSTEN]: {
    lastInitializedDefaultListOfLists: DEFAULT_LIST_OF_LISTS_ROPSTEN,
    byUrl: {
      ...DEFAULT_LIST_OF_LISTS.reduce<Mutable<ListsState[ChainId.ROPSTEN]['byUrl']>>((memo, listUrl) => {
        memo[listUrl] = NEW_LIST_STATE[ChainId.ROPSTEN];
        return memo;
      }, {}),
      [DEFAULT_TOKEN_LIST_URL[ChainId.ROPSTEN]]: {
        error: null,
        current: DEFAULT_LIST_ROPSTEN,
        loadingRequestId: null,
        pendingUpdate: null
      }
    },
    selectedListUrl: DEFAULT_TOKEN_LIST_URL[ChainId.ROPSTEN]
  }
};

export default createReducer(initialStates, (builder) => {
  const { chainId } = useActiveWeb3React();
  let initialState;
  let chain = 1;
  switch (chainId) {
    case 1:
      initialState = initialStates[ChainId.MAINNET];
      chain = 1;
      break;
    case 3:
      initialState = initialStates[ChainId.ROPSTEN];
      chain = 3;
      break;
  }

  builder
    .addCase(fetchTokenList.pending, (state, { payload: { requestId, url } }) => {
      state[chain].byUrl[url] = {
        current: null,
        pendingUpdate: null,
        ...state[chain].byUrl[url],
        loadingRequestId: requestId,
        error: null
      };
    })
    .addCase(fetchTokenList.fulfilled, (state, { payload: { requestId, tokenList, url } }) => {
      const current = state[chain].byUrl[url]?.current;
      const loadingRequestId = state[chain].byUrl[url]?.loadingRequestId;

      // no-op if update does nothing
      if (current) {
        const upgradeType = getVersionUpgrade(current.version, tokenList.version);
        if (upgradeType === VersionUpgrade.NONE) return;
        if (loadingRequestId === null || loadingRequestId === requestId) {
          state[chain].byUrl[url] = {
            ...state[chain].byUrl[url],
            loadingRequestId: null,
            error: null,
            current,
            pendingUpdate: tokenList
          };
        }
      } else {
        state[chain].byUrl[url] = {
          ...state[chain].byUrl[url],
          loadingRequestId: null,
          error: null,
          current: tokenList,
          pendingUpdate: null
        };
      }
    })
    .addCase(fetchTokenList.rejected, (state, { payload: { url, requestId, errorMessage } }) => {
      if (state[chain].byUrl[url]?.loadingRequestId !== requestId) {
        // no-op since it's not the latest request
        return;
      }

      state[chain].byUrl[url] = {
        ...state[chain].byUrl[url],
        loadingRequestId: null,
        error: errorMessage,
        current: null,
        pendingUpdate: null
      };
    })
    .addCase(selectList, (state, { payload: url }) => {
      state[chain].selectedListUrl = url;
      // automatically adds list
      if (!state[chain].byUrl[url]) {
        state[chain].byUrl[url] = NEW_LIST_STATE[chain];
      }
    })
    .addCase(addList, (state, { payload: url }) => {
      if (!state[chain].byUrl[url]) {
        state[chain].byUrl[url] = NEW_LIST_STATE[chain];
      }
    })
    .addCase(removeList, (state, { payload: url }) => {
      if (state[chain].byUrl[url]) {
        delete state[chain].byUrl[url];
      }
      if (state[chain].selectedListUrl === url) {
        state[chain].selectedListUrl = Object.keys(state[chain].byUrl)[0];
      }
    })
    .addCase(acceptListUpdate, (state, { payload: url }) => {
      if (!state[chain].byUrl[url]?.pendingUpdate) {
        throw new Error('accept list update called without pending update');
      }
      state[chain].byUrl[url] = {
        ...state[chain].byUrl[url],
        pendingUpdate: null,
        current: state[chain].byUrl[url].pendingUpdate
      };
    })
    .addCase(updateVersion, (state) => {
      // state loaded from localStorage, but new lists have never been initialized
      if (!state[chain].lastInitializedDefaultListOfLists) {
        state[chain].byUrl = initialState.byUrl;
        state[chain].selectedListUrl = undefined;
      } else if (state[chain].lastInitializedDefaultListOfLists) {
        // @ts-ignore
        const lastInitializedSet = state[chain].lastInitializedDefaultListOfLists.reduce<Set<string>>(
          (s, l) => s.add(l),
          new Set()
        );
        const newListOfListsSet = DEFAULT_LIST_OF_LISTS.reduce<Set<string>>((s, l) => s.add(l), new Set());

        switch(chainId) {
          default:
          case 1:
            DEFAULT_LIST_OF_LISTS.forEach((listUrl) => {
              if (!lastInitializedSet.has(listUrl)) {
                state[chain].byUrl[listUrl] = NEW_LIST_STATE[chain];
              }
            });
            break;
          case 3:
            DEFAULT_LIST_OF_LISTS_ROPSTEN.forEach((listUrl) => {
              if (!lastInitializedSet.has(listUrl)) {
                state[chain].byUrl[listUrl] = NEW_LIST_STATE[chain];
              }
            });
            break;
          case 4:
            DEFAULT_LIST_OF_LISTS_RINKEBY.forEach((listUrl) => {
              if (!lastInitializedSet.has(listUrl)) {
                state[chain].byUrl[listUrl] = NEW_LIST_STATE[chain];
              }
            });
            break;
          case 8271:
            DEFAULT_LIST_OF_LISTS_KLAYTN.forEach((listUrl) => {
              if (!lastInitializedSet.has(listUrl)) {
                state[chain].byUrl[listUrl] = NEW_LIST_STATE[chain];
              }
            });
            break;
          case 1001:
            DEFAULT_LIST_OF_LISTS_BAOBAB.forEach((listUrl) => {
              if (!lastInitializedSet.has(listUrl)) {
                state[chain].byUrl[listUrl] = NEW_LIST_STATE[chain];
              }
            });
            break;
        }

        // @ts-ignore
        state[chain].lastInitializedDefaultListOfLists.forEach((listUrl) => {
          if (!newListOfListsSet.has(listUrl)) {
            delete state[chain].byUrl[listUrl];
          }
        });
      }

      switch(chainId) {
        case 1:
          state[chain].lastInitializedDefaultListOfLists = DEFAULT_LIST_OF_LISTS;
          break;
        case 3:
          state[chain].lastInitializedDefaultListOfLists = DEFAULT_LIST_OF_LISTS_ROPSTEN;
          break;
        case 4:
          state[chain].lastInitializedDefaultListOfLists = DEFAULT_LIST_OF_LISTS_RINKEBY;
          break;
        case 8271:
          state[chain].lastInitializedDefaultListOfLists = DEFAULT_LIST_OF_LISTS_KLAYTN;
          break;
        case 1001:
          state[chain].lastInitializedDefaultListOfLists = DEFAULT_LIST_OF_LISTS_BAOBAB;
          break;
      }
    })
  }
);

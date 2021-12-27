import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { save, load } from 'redux-localstorage-simple';
import { useDispatch } from 'react-redux';
import application from './application/reducer';
import { updateVersion } from './global/actions';
import user from './user/reducer';
import transactions from './transactions/reducer';
import swap from './swap/reducer';
import mint from './mint/reducer';
import lists from './lists/reducer';
import burn from './burn/reducer';
import multicall from './multicall/reducer';
import toasts from './toasts';
import farms from './farms';
import pools from './pools';
import block from './block';
import achievements from './achievements';
import collectibles from './collectibles';
import predictions from './predictions';
import profile from './profile';
import teams from './teams';
import { getThemeCache } from '../utils/theme';

type MergedState = {
  user: {
    [key: string]: any;
  };
  transactions: {
    [key: string]: any;
  };
};
const PERSISTED_KEYS: string[] = ['user', 'transactions'];
const loadedState = load({ states: PERSISTED_KEYS }) as MergedState;
if (loadedState.user) {
  loadedState.user.userDarkMode = getThemeCache();
}

const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    application,
    user,
    transactions,
    swap,
    mint,
    burn,
    multicall,
    lists,
    toasts,
    farms,
    pools,
    block,
    achievements,
    collectibles,
    predictions,
    profile,
    teams,
  },
  middleware: [
    ...getDefaultMiddleware({ thunk: false }),
    save({ states: PERSISTED_KEYS }),
  ],
  preloadedState: loadedState,
});

store.dispatch(updateVersion());

export default store;

export type AppState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export type AppDispatch = typeof store.dispatch;

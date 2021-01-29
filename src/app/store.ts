import {
  Action,
  configureStore,
  getDefaultMiddleware,
  ThunkAction,
  combineReducers,
} from '@reduxjs/toolkit';
import { createBrowserHistory, History } from 'history';
import { useDispatch } from 'react-redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { combineEpics, createEpicMiddleware } from 'redux-observable';

import appEpic from './epics/app';
import appReducer from './slices/app';

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

const rootEpic = combineEpics(appEpic);

const createRootReducer = (history: History<any>) =>
  combineReducers({
    router: connectRouter(history),
    app: appReducer,
  });

export const history = createBrowserHistory();
const rootReducer = createRootReducer(history);

export type RootState = ReturnType<typeof rootReducer>;

const epicMiddleware = createEpicMiddleware<Action, Action, RootState>();

export const store = configureStore({
  middleware: [
    ...getDefaultMiddleware(),
    epicMiddleware,
    routerMiddleware(history),
  ],
  reducer: rootReducer,
});

epicMiddleware.run(rootEpic);

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

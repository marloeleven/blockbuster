import { Action } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
// import { push } from 'connected-react-router';

import { combineEpics, Epic, ofType } from 'redux-observable';
import { defer, empty } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import * as appActions from 'app/slices/app';

const startGameEpic: Epic<Action, Action, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(appActions.startGame),
    switchMap(() =>
      defer(() => Promise.resolve(true)).pipe(switchMap(() => empty()))
    )
  );

/*
Sample page redirection after triggering an action

const setPagesEpic: Epic<Action, Action, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(appActions.setPages),
    switchMap(() => of(push('/pages')))
  );


Sample
const setPageIdEpic: Epic<Action, Action, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(appActions.setPageId),
    switchMap(() =>
      defer(() => {
        const { pageId, pageAccessToken: accessToken } = state$.value.app;

        if (!isEmpty(pageId)) {
          return fbApi.getLiveVideos(pageId, accessToken);
        }

        return [];
      }).pipe(
        switchMap((liveVideos) => {
          return of(appActions.setLiveVideos(liveVideos));
        })
      )
    )
  );

*/

export default combineEpics(startGameEpic);

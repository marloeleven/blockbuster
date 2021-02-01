import { Action, ActionCreatorWithoutPayload } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
// import { push } from 'connected-react-router';

import { combineEpics, Epic, ofType } from 'redux-observable';
import { pipe } from 'rxjs';
import { tap, filter, ignoreElements } from 'rxjs/operators';

import * as appActions from 'app/slices/app';
import { createSenderChannel } from 'observables/broadcast-channel';
import { IBroadcastChannels } from 'types';

const isControl = (action: any[]) =>
  pipe(
    ofType(...action),
    filter(() => !window.location.pathname.includes('game')),
    tap(sender),
    ignoreElements()
  );

const sender = createSenderChannel(IBroadcastChannels.MAIN);

const relayActionsEpic: Epic<Action, Action, RootState> = (action$, state$) =>
  action$.pipe(
    isControl([
      appActions.startGame,
      appActions.endGame,
      appActions.setLetters,
      appActions.setSelectedLetter,
      appActions.toggleShowQuestion,
      appActions.toggleShowAnswer,
      appActions.toggleBlink,
      appActions.assignLetter,
      appActions.removeLetter,
    ])
  );

export default combineEpics(relayActionsEpic);

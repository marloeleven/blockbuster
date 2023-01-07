import {
  Action,
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
} from '@reduxjs/toolkit';
import { RootState } from 'app/store';

import { combineEpics, Epic, ofType } from 'redux-observable';
import { pipe } from 'rxjs';
import { tap, filter, ignoreElements, map } from 'rxjs/operators';

import * as appActions from 'app/slices/app';
import { createSenderChannel } from 'observables/broadcast-channel';
import { IBroadcastChannels, IQuestion, ITeams } from 'types';
import { resyncAnimation$ } from 'handlers/subscriptions';

type IAction =
  | ActionCreatorWithoutPayload<string>
  | ActionCreatorWithPayload<string[][], string>
  | ActionCreatorWithPayload<string[], string>
  | ActionCreatorWithPayload<string, string>
  | ActionCreatorWithPayload<IQuestion, string>
  | ActionCreatorWithPayload<ITeams, string>;

const isControl = (action: IAction[]) =>
  pipe(
    ofType(...action),
    filter(() => !window.location.pathname.includes('game'))
  );

const sender = createSenderChannel(IBroadcastChannels.MAIN);

const relayActionsEpic: Epic<Action, Action, RootState> = (action$, state$) =>
  action$.pipe(
    isControl([
      appActions.startGame,
      appActions.endGame,
      appActions.setLetters,
      appActions.setSelectedLetter,
      appActions.setQuestion,
      appActions.toggleShowQuestion,
      appActions.toggleShowAnswer,
      appActions.toggleBlink,
      appActions.assignLetter,
      appActions.removeLetter,
    ]),
    filter(() => !window.location.href.includes('game')),
    tap(sender),
    ignoreElements()
  );

const syncGameWindowEpic: Epic<Action, Action, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(appActions.syncGameWindow),
    map(() => state$.value),
    filter(({ app }) => app.isRunning),
    tap(({ app }) => {
      sender({
        type: appActions.startGame.type,
      });

      app.blueLetters.forEach((letter) => {
        sender({
          type: appActions.setSelectedLetter.type,
          payload: letter,
        });

        sender({
          type: appActions.assignLetter.type,
          payload: ITeams.BLUE,
        });
      });

      app.redLetters.forEach((letter) => {
        sender({
          type: appActions.setSelectedLetter.type,
          payload: letter,
        });

        sender({
          type: appActions.assignLetter.type,
          payload: ITeams.RED,
        });
      });

      sender({
        type: appActions.setLetters.type,
        payload: app.letters,
      });

      sender({
        type: appActions.setSelectedLetter.type,
        payload: app.selectedLetter,
      });

      if (app.blinkers.blue) {
        sender({
          type: appActions.toggleBlink.type,
          payload: ITeams.BLUE,
        });
      }

      if (app.blinkers.red) {
        sender({
          type: appActions.toggleBlink.type,
          payload: ITeams.RED,
        });
      }
    }),
    ignoreElements()
  );

const animationSyncEpic: Epic<Action, Action, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(
      ...[
        appActions.assignLetter,
        appActions.removeLetter,
        appActions.toggleBlink,
      ]
    ),
    tap(() => resyncAnimation$.next()),
    ignoreElements()
  );

export default combineEpics(
  relayActionsEpic,
  syncGameWindowEpic,
  animationSyncEpic
);

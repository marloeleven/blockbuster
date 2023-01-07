import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';

import { IBroadcastChannels, IGameWindowEvents } from 'types';

import gameWindow from 'handlers/gameWindow';

import * as appActions from 'app/slices/app';

import Game from './game';
import BasicControls from './basic-controls';

import QuestionsList from 'components/questionslist';
import { createMessageChannel } from 'observables/broadcast-channel';
import { map } from 'rxjs/operators';

function GameControls() {
  const [isWindowOpen, setWindowOpen] = useState(false);
  const dispatch = useDispatch();

  const isRunning = useSelector(appActions.get.isRunning);

  const onOpenWindow = useCallback(() => {
    if (isWindowOpen) {
      return;
    }

    setWindowOpen(true);
    gameWindow.open();
  }, [isWindowOpen]);

  useEffect(() => {
    const gameWindowSub = createMessageChannel(IBroadcastChannels.GAME)
      .pipe(map((data) => data as IGameWindowEvents))
      .subscribe((event) => {
        setWindowOpen(event === IGameWindowEvents.OPEN);

        if (event === IGameWindowEvents.OPEN) {
          dispatch(appActions.syncGameWindow());
        }
      });

    return () => gameWindowSub.unsubscribe();
  }, []);

  return (
    <div className="flex flex-row controls">
      <div className="left w-full flex flex-col">
        <div
          className={clsx(
            {
              'pointer-events-none': !isRunning,
            },
            'game-container'
          )}
        >
          <Game />
        </div>
        <BasicControls />
      </div>
      <div className="right p-5 flex flex-col">
        <button
          className="button open-game-window mb-3"
          disabled={isWindowOpen}
          onClick={onOpenWindow}
        >
          Open Game Window
        </button>
        <div className="history flex flex-col flex-grow">
          <h3>Questions List</h3>
          <div className="list flex-grow h-0 overflow-y-auto">
            <QuestionsList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameControls;

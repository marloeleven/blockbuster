import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';

import { IGameWindowEvents, IModalManagerActions, IQuestion } from 'types';

import { onGameWindow$ } from 'handlers/subscriptions';
import gameWindow from 'handlers/gameWindow';

import fetchGSheets from 'api/gsheets';

import * as appActions from 'app/slices/app';

import Game from './game';
import BasicControls from './basic-controls';

import { modalManager$, ModalManagerContext } from 'components/modal-manager';
import QuestionsList from 'components/questionslist';

import { useEffectOnce } from 'hooks';

function GameControls() {
  const [isWindowOpen, setWindowOpen] = useState(false);

  const isRunning = useSelector(appActions.get.isRunning);

  const modalManager = useContext(ModalManagerContext);

  const dispatch = useDispatch();

  const onOpenWindow = useCallback(() => {
    console.warn('openWIndow', isWindowOpen);
    if (isWindowOpen) {
      return;
    }

    setWindowOpen(true);
    gameWindow.open();
  }, [isWindowOpen]);

  useEffect(() => {
    const gameWindowSub = onGameWindow$.subscribe((event) => {
      console.warn('window state', event);
      setWindowOpen(event === IGameWindowEvents.OPEN);
    });

    return () => gameWindowSub.unsubscribe();
  }, []);

  useEffectOnce(async () => {
    modalManager.showModal({
      title: 'Please wait...',
      message: 'Fetching questions from the server',
      okButton: {
        enabled: false,
      },
      cancelButton: {
        enabled: false,
      },
    });

    await fetchGSheets().then((data) => {
      modalManager$.next(IModalManagerActions.OK);
      dispatch(appActions.setQuestionsList(data as IQuestion[]));
    });
  });

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

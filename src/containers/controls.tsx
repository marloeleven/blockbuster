import React, { useCallback, useEffect, useState } from 'react';

import Game from './game';

import gameWindow from 'handlers/gameWindow';
import { onGameWindow$ } from 'handlers/subscriptions';
import { IGameWindowEvents } from 'types';

import BasicControls from './basic-controls';

export default () => {
  const [isWindowOpen, setWindowOpen] = useState(false);

  const onOpenWindow = useCallback(() => {
    console.warn('openWIndow', isWindowOpen);
    if (isWindowOpen) {
      return;
    }

    gameWindow.open();
  }, [isWindowOpen]);

  useEffect(() => {
    const gameWindowSub = onGameWindow$.subscribe((event) => {
      console.warn('window state', event);
      setWindowOpen(event === IGameWindowEvents.OPEN);
    });

    return () => gameWindowSub.unsubscribe();
  }, []);

  return (
    <div className="flex flex-row controls">
      <div className="left w-full flex flex-col">
        <div className="game-container">
          <Game />
        </div>
        <BasicControls />
      </div>
      <div className="right p-5 flex flex-col">
        <button className="button open-game-window mb-3" onClick={onOpenWindow}>
          Open Game Window
        </button>
        <div className="history flex flex-col flex-grow">
          <h3>Actions History</h3>
          <div className="list flex-grow">
            <ul>
              <li>1</li>
              <li>2</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

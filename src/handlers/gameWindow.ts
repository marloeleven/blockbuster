import { IGameWindowEvents } from 'types';
import { gameWindow$ } from './subscriptions';

import { generatePath } from 'react-router';

class GameWindow {
  windowInstance: Window | null = null;

  open() {
    if (this.windowInstance) {
      return;
    }

    this.windowInstance = window.open(
      `${window.location.origin}/#/game`,
      '_blank'
    );

    gameWindow$.next(IGameWindowEvents.OPEN);

    this.bindWindowEvents();

    return this.windowInstance;
  }

  private bindWindowEvents() {
    if (this.windowInstance) {
      console.warn('bind event');
      // use DataChannel to listen to onclose event
    }
  }

  close() {
    if (this.windowInstance) {
      this.windowInstance.close();
    }

    this.windowInstance = null;

    gameWindow$.next(IGameWindowEvents.CLOSE);
  }
}

export default new GameWindow();

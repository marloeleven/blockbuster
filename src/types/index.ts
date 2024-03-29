declare global {
  interface Window {
    test: any;
    FB: {
      init: Function;
    };
  }
}

export enum IBroadcastChannels {
  MAIN = 'main',
  GAME = 'game',
}

export enum IGameWindowEvents {
  OPEN = 'open',
  CLOSE = 'close',
}

export enum ITeams {
  RED = 'red',
  BLUE = 'blue',
}

export type IFunction = (...args: any[]) => any;

export enum IModalManagerActions {
  OK = 'ok',
  CANCEL = 'cancel',
}

export interface IQuestion {
  answer: string;
  question: string;
}

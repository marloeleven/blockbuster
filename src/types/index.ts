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

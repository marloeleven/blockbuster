import { Observable } from 'rxjs';
import { IBroadcastChannels } from 'types';

export const createMessageChannel = (channelName: IBroadcastChannels) =>
  new Observable((observer) => {
    const chan = new BroadcastChannel(channelName);
    chan.onmessage = (event) => observer.next(event.data);
    chan.onmessageerror = (error) =>
      console.log(`Error receive on channel ${channelName}`, error);

    return () => chan.close();
  });

export const createSenderChannel = (channelName: IBroadcastChannels) => {
  const channel = new BroadcastChannel(channelName);
  return (message: any) => channel.postMessage(message);
};

/*
  // Usage

  const channel = createMessageChannel(IBroadcastChannels.GAME);
  const subs = channel.subscribe((data) => {
    // do something to `data`
  });

  // to close the channel
  subs.unsubscribe();

  const channel = createSenderChannel(IBroadcastChannels.GAME);
  // send message to game
  channel.send(data);
*/

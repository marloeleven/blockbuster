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

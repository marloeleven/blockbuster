import { EventEmitter } from 'events';
import { fromEvent, merge, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { IGameWindowEvents } from 'types';

export const gameWindow$ = new Subject();
export const onGameWindow$ = gameWindow$.pipe(
  map((data) => data as IGameWindowEvents)
);

merge(
  fromEvent(window, 'contextmenu'),
  fromEvent(window, 'selectstart')
).subscribe((event) => {
  if (process.env.NODE_ENV === 'production') {
    event.preventDefault();
  }
});

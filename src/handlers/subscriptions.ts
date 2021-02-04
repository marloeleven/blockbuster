import { fromEvent, merge, Subject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
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

export const resyncAnimation$ = new Subject();
export const onResyncAnimation$ = resyncAnimation$.pipe(debounceTime(250));

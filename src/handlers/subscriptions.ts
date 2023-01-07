import { fromEvent, merge, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';


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

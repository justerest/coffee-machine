import { Observable } from 'rxjs';

export interface HotObservable<T> extends Observable<T> {
  value: T;
}

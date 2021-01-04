import { Observable } from 'rxjs';

import { assert } from './assert';

export function getStreamValue<T>(stream: Observable<T>): T {
  const initialValue = {};
  let result: any = initialValue;
  const subscription = stream.subscribe((value) => (result = value));
  subscription.unsubscribe();
  assert(result !== initialValue, 'Stream not emit sync value');
  return result;
}

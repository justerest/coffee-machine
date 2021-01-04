import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { HotObservable } from 'src/utils/HotObservable';
import { truthy } from 'src/utils/truthy';
import { Heater } from '../Heater';

export class Boiler {
  get enabled(): boolean {
    return this.heater.enabled;
  }

  onEmpty: Observable<unknown> = this.emptySubject.pipe(filter(truthy));

  constructor(private emptySubject: HotObservable<boolean>, private heater: Heater) {}

  isEmpty(): boolean {
    return this.emptySubject.value;
  }

  enable(): void {
    this.heater.enable();
  }

  disable(): void {
    this.heater.disable();
  }
}

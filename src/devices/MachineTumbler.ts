import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { not } from '../utils/not';
import { truthy } from '../utils/truthy';

export class MachineTumbler {
  private subject = new BehaviorSubject(false);
  private onDisableManuallySubject = new Subject();

  enabled$: Observable<boolean> = this.subject.asObservable();

  onEnable: Observable<unknown> = this.subject.pipe(filter(truthy));

  onDisable: Observable<unknown> = this.subject.pipe(filter(not));

  onDisableManually: Observable<unknown> = this.onDisableManuallySubject.asObservable();

  isEnabled(): boolean {
    return this.subject.value;
  }

  enable(): void {
    this.subject.next(true);
  }

  disable(): void {
    this.subject.next(false);
  }

  disableManually(): void {
    this.disable();
    this.onDisableManuallySubject.next();
  }
}

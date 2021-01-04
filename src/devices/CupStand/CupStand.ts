import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { HotObservable } from 'src/utils/HotObservable';
import { not } from 'src/utils/not';

export enum CupStandStatus {
  NoCup,
  CupEmpty,
  CupNotEmpty,
  CupFull,
}

export class CupStand {
  hasCup$: Observable<boolean> = this.statusSubject.pipe(map(() => this.hasCup()));

  onCupTaken: Observable<unknown> = this.hasCup$.pipe(filter(not));

  onCupFull: Observable<unknown> = this.statusSubject.pipe(filter(() => this.isCupFull()));

  hasNotEmptyCup$: Observable<boolean> = this.statusSubject.pipe(map(() => this.hasNotEmptyCup()));

  constructor(private statusSubject: HotObservable<CupStandStatus>) {}

  hasCup(): boolean {
    return this.statusSubject.value !== CupStandStatus.NoCup;
  }

  isCupFull(): boolean {
    return this.statusSubject.value === CupStandStatus.CupFull;
  }

  hasNotEmptyCup(): boolean {
    return (
      this.statusSubject.value === CupStandStatus.CupFull ||
      this.statusSubject.value === CupStandStatus.CupNotEmpty
    );
  }
}

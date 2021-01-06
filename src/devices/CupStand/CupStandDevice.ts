import { merge } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Device } from '../Device';
import { MachineTumbler } from '../MachineTumbler';
import { WaterSource } from '../WaterSource/WaterSource';
import { CupStand } from './CupStand';

export class CupStandDevice implements Device {
  constructor(
    private cupStand: CupStand,
    private waterSource: WaterSource,
    private machineTumbler: MachineTumbler,
  ) {}

  isReady(): boolean {
    return this.cupStand.hasCup() && !this.cupStand.isCupFull();
  }

  activate(): void {
    this.openCloseWaterSourceOnCupChangesWhenMachineEnabled();
    this.closeWaterSourceOnCupFull();
    this.disableMachineOnCupFull();
  }

  private openCloseWaterSourceOnCupChangesWhenMachineEnabled(): void {
    merge(this.cupStand.hasCup$, this.machineTumbler.onEnable)
      .pipe(filter(() => this.machineTumbler.isEnabled()))
      .subscribe(() => this.toggleWaterSource());
  }

  private toggleWaterSource(): void {
    return this.cupStand.hasCup() ? this.waterSource.open() : this.waterSource.close();
  }

  private closeWaterSourceOnCupFull(): void {
    this.cupStand.onCupFull.subscribe(() => this.waterSource.close());
  }

  private disableMachineOnCupFull(): void {
    this.cupStand.onCupFull.subscribe(() => this.machineTumbler.disable());
  }
}

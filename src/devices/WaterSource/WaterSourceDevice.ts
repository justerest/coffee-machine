import { merge } from 'rxjs';
import { filter } from 'rxjs/operators';

import { CupStand } from '../CupStand/CupStand';
import { Device } from '../Device';
import { MachineTumbler } from '../MachineTumbler';
import { WaterSource } from './WaterSource';

export class WaterSourceDevice implements Device {
  constructor(
    private cupStand: CupStand,
    private waterSource: WaterSource,
    private machineTumbler: MachineTumbler,
  ) {}

  isReady(): boolean {
    return true;
  }

  activate(): void {
    this.openCloseWaterSourceOnCupChangesOrMachineEnabled();
    this.closeWaterSourceOnCupFull();
    this.closeWaterSourceOnMachineDisable();
  }

  private openCloseWaterSourceOnCupChangesOrMachineEnabled(): void {
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

  private closeWaterSourceOnMachineDisable(): void {
    this.machineTumbler.onDisable.subscribe(() => this.waterSource.close());
  }
}

import { debounce } from 'rxjs/operators';

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
    this.disableMachineOnCupFull();
  }

  private openCloseWaterSourceOnCupChangesWhenMachineEnabled(): void {
    this.cupStand.hasCup$
      .pipe(debounce(() => this.machineTumbler.onEnable))
      .subscribe((hasCup) => (hasCup ? this.waterSource.open() : this.waterSource.close()));
  }

  private disableMachineOnCupFull(): void {
    this.cupStand.onCupFull.subscribe(() => this.machineTumbler.disable());
  }
}

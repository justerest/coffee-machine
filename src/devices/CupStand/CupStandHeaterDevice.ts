import { merge } from 'rxjs';
import { debounce } from 'rxjs/operators';

import { Device } from '../Device';
import { Heater } from '../Heater';
import { MachineTumbler } from '../MachineTumbler';
import { CupStand } from './CupStand';

export class CupStandHeaterDevice implements Device {
  constructor(
    private cupStand: CupStand,
    private heater: Heater,
    private machineTumbler: MachineTumbler,
  ) {}

  isReady(): boolean {
    return true;
  }

  activate(): void {
    this.enableDisableHeaterOnCupNotEmptyWhenMachineEnabled();
    this.disableHeaterOnMachineDisableAfterCupTaken();
    this.disableHeaterImmediatelyOnMachineDisableManually();
  }

  private enableDisableHeaterOnCupNotEmptyWhenMachineEnabled(): void {
    merge(this.cupStand.hasNotEmptyCup$, this.machineTumbler.onEnable)
      .pipe(debounce(() => this.machineTumbler.onEnable))
      .subscribe(() =>
        this.cupStand.hasNotEmptyCup() ? this.heater.enable() : this.heater.disable(),
      );
  }

  private disableHeaterOnMachineDisableAfterCupTaken(): void {
    this.machineTumbler.onDisable
      .pipe(debounce(() => this.cupStand.onCupTaken))
      .subscribe(() => this.heater.disable());
  }

  private disableHeaterImmediatelyOnMachineDisableManually(): void {
    this.machineTumbler.onDisableManually.subscribe(() => this.heater.disable());
  }
}

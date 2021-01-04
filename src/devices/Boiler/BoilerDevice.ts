import { Device } from '../Device';
import { MachineTumbler } from '../MachineTumbler';
import { Boiler } from './Boiler';

export class BoilerDevice implements Device {
  constructor(private boiler: Boiler, private machineTumbler: MachineTumbler) {}

  isReady(): boolean {
    return !this.boiler.isEmpty();
  }

  activate(): void {
    this.enableDisableOnMachineTumblerChanges();
    this.disableMachineOnBoilerEmpty();
  }

  private enableDisableOnMachineTumblerChanges(): void {
    this.machineTumbler.enabled$.subscribe((enabled) =>
      enabled ? this.boiler.enable() : this.boiler.disable(),
    );
  }

  private disableMachineOnBoilerEmpty(): void {
    this.boiler.onEmpty.subscribe(() => this.machineTumbler.disable());
  }
}

import { Device } from '../Device';
import { MachineTumbler } from '../MachineTumbler';
import { WaterSource } from './WaterSource';

export class WaterSourceDevice implements Device {
  constructor(private waterSource: WaterSource, private machineTumbler: MachineTumbler) {}

  isReady(): boolean {
    return true;
  }

  activate(): void {
    this.machineTumbler.onDisable.subscribe(() => this.waterSource.close());
  }
}

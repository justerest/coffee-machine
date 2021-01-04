import { Observable } from 'rxjs';

import { Device } from './devices/Device';
import { MachineTumbler } from './devices/MachineTumbler';

export class CoffeeMachine implements Device {
  working$: Observable<boolean> = this.machineTumbler.enabled$;

  constructor(private machineTumbler: MachineTumbler, private devices: Device[]) {}

  isReady(): boolean {
    return this.devices.every((device) => device.isReady());
  }

  activate(): void {
    this.devices.forEach((device) => device.activate());
  }

  isWorking(): boolean {
    return this.machineTumbler.isEnabled();
  }

  start(): void {
    if (this.isReady()) {
      this.machineTumbler.enable();
    }
  }

  stop(): void {
    this.machineTumbler.disableManually();
  }
}

import { PressureValve } from './PressureValve';

export class WaterSource {
  get opened(): boolean {
    return !this.pressureValve.opened;
  }

  constructor(private pressureValve: PressureValve) {}

  open(): void {
    this.pressureValve.close();
  }

  close(): void {
    this.pressureValve.open();
  }
}

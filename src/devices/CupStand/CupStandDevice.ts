import { Device } from '../Device';
import { MachineTumbler } from '../MachineTumbler';
import { CupStand } from './CupStand';

export class CupStandDevice implements Device {
  constructor(private cupStand: CupStand, private machineTumbler: MachineTumbler) {}

  isReady(): boolean {
    return this.cupStand.hasCup() && !this.cupStand.isCupFull();
  }

  activate(): void {
    this.cupStand.onCupFull.subscribe(() => this.machineTumbler.disable());
  }
}

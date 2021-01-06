import { BehaviorSubject } from 'rxjs';

import { MachineTumbler } from '../MachineTumbler';
import { CupStand, CupStandStatus } from './CupStand';
import { CupStandDevice } from './CupStandDevice';

describe(CupStandDevice.name, () => {
  it('should disable machine on cup full', () => {
    const { machineTumbler, cupStandStatusSubject } = createTestEnv();
    machineTumbler.enable();
    cupStandStatusSubject.next(CupStandStatus.CupFull);
    expect(machineTumbler.isEnabled()).toBe(false);
  });
});

const createTestEnv = (cupStandStatus: CupStandStatus = CupStandStatus.CupEmpty) => {
  const machineTumbler = new MachineTumbler();
  const cupStandStatusSubject = new BehaviorSubject(cupStandStatus);
  const cupStandDevice = new CupStandDevice(new CupStand(cupStandStatusSubject), machineTumbler);
  cupStandDevice.activate();
  return { machineTumbler, cupStandStatusSubject };
};

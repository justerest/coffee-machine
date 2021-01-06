import { BehaviorSubject } from 'rxjs';

import { MachineTumbler } from '../MachineTumbler';
import { PressureValve } from '../WaterSource/PressureValve';
import { WaterSource } from '../WaterSource/WaterSource';
import { CupStand, CupStandStatus } from './CupStand';
import { CupStandDevice } from './CupStandDevice';

describe(CupStandDevice.name, () => {
  it('should open water source on start', () => {
    const { machineTumbler, waterSource } = createTestEnv();
    machineTumbler.enable();
    expect(waterSource.opened).toBe(true);
  });

  it('should open water source on start if no cup', () => {
    const { machineTumbler, waterSource } = createTestEnv(CupStandStatus.NoCup);
    machineTumbler.enable();
    expect(waterSource.opened).toBe(false);
  });

  it('should open water source after stop/start', () => {
    const { machineTumbler, waterSource } = createTestEnv();
    machineTumbler.enable();
    machineTumbler.disable();
    waterSource.close();
    machineTumbler.enable();
    expect(waterSource.opened).toBe(true);
  });

  it('should close water source on cup taken', () => {
    const { machineTumbler, waterSource, cupStandStatusSubject } = createTestEnv();
    machineTumbler.enable();
    cupStandStatusSubject.next(CupStandStatus.NoCup);
    expect(waterSource.opened).toBe(false);
  });

  it('should open water source on cup taken/put', () => {
    const { machineTumbler, waterSource, cupStandStatusSubject } = createTestEnv();
    machineTumbler.enable();
    cupStandStatusSubject.next(CupStandStatus.NoCup);
    cupStandStatusSubject.next(CupStandStatus.CupNotEmpty);
    expect(waterSource.opened).toBe(true);
  });

  it('should disable machine on cup full', () => {
    const { machineTumbler, cupStandStatusSubject } = createTestEnv();
    machineTumbler.enable();
    cupStandStatusSubject.next(CupStandStatus.CupFull);
    expect(machineTumbler.isEnabled()).toBe(false);
  });
});

const createTestEnv = (cupStandStatus: CupStandStatus = CupStandStatus.CupEmpty) => {
  const machineTumbler = new MachineTumbler();
  const waterSource = new WaterSource(new PressureValve());
  const cupStandStatusSubject = new BehaviorSubject(cupStandStatus);
  const cupStandDevice = new CupStandDevice(
    new CupStand(cupStandStatusSubject),
    waterSource,
    machineTumbler,
  );
  cupStandDevice.activate();
  return { machineTumbler, waterSource, cupStandStatusSubject };
};

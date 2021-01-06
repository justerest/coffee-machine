import { BehaviorSubject } from 'rxjs';

import { CupStand, CupStandStatus } from '../CupStand/CupStand';
import { MachineTumbler } from '../MachineTumbler';
import { PressureValve } from './PressureValve';
import { WaterSource } from './WaterSource';
import { WaterSourceDevice } from './WaterSourceDevice';

describe(WaterSourceDevice.name, () => {
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

  it('should close water source on cup full', () => {
    const { machineTumbler, cupStandStatusSubject, waterSource } = createTestEnv();
    machineTumbler.enable();
    cupStandStatusSubject.next(CupStandStatus.CupFull);
    expect(waterSource.opened).toBe(false);
  });
});

const createTestEnv = (cupStandStatus: CupStandStatus = CupStandStatus.CupEmpty) => {
  const machineTumbler = new MachineTumbler();
  const waterSource = new WaterSource(new PressureValve());
  const cupStandStatusSubject = new BehaviorSubject(cupStandStatus);
  const waterSourceDevice = new WaterSourceDevice(
    new CupStand(cupStandStatusSubject),
    waterSource,
    machineTumbler,
  );
  waterSourceDevice.activate();
  return { machineTumbler, waterSource, cupStandStatusSubject };
};

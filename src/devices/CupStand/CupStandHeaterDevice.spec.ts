import { BehaviorSubject } from 'rxjs';

import { HotObservable } from 'src/utils/HotObservable';
import { Heater } from '../Heater';
import { MachineTumbler } from '../MachineTumbler';
import { CupStand, CupStandStatus } from './CupStand';
import { CupStandHeaterDevice } from './CupStandHeaterDevice';

describe(CupStandHeaterDevice.name, () => {
  it('should not enable heater before machine enable', () => {
    const cupStandStatus = new BehaviorSubject(CupStandStatus.CupNotEmpty);
    const { cupStandHeaterDevice, cupStandHeater } = createTestEnv({ cupStandStatus });
    cupStandHeaterDevice.activate();
    expect(cupStandHeater.enabled).toBe(false);
  });

  it('should enable heater on machine enable if cup not empty', () => {
    const cupStandStatus = new BehaviorSubject(CupStandStatus.CupNotEmpty);
    const { cupStandHeaterDevice, machineTumbler, cupStandHeater } = createTestEnv({
      cupStandStatus,
    });
    cupStandHeaterDevice.activate();
    machineTumbler.enable();
    expect(cupStandHeater.enabled).toBe(true);
  });

  it('should not enable heater on machine enable if cup empty', () => {
    const cupStandStatus = new BehaviorSubject(CupStandStatus.CupEmpty);
    const { cupStandHeaterDevice, machineTumbler, cupStandHeater } = createTestEnv({
      cupStandStatus,
    });
    cupStandHeaterDevice.activate();
    machineTumbler.enable();
    expect(cupStandHeater.enabled).toBe(false);
  });

  it('should disable heater on machine manually stop', () => {
    const cupStandStatus = new BehaviorSubject(CupStandStatus.CupNotEmpty);
    const { cupStandHeaterDevice, machineTumbler, cupStandHeater } = createTestEnv({
      cupStandStatus,
    });
    cupStandHeaterDevice.activate();
    machineTumbler.enable();
    machineTumbler.disableManually();
    expect(cupStandHeater.enabled).toBe(false);
  });

  it('should not disable heater on machine stop', () => {
    const cupStandStatus = new BehaviorSubject(CupStandStatus.CupNotEmpty);
    const { cupStandHeaterDevice, machineTumbler, cupStandHeater } = createTestEnv({
      cupStandStatus,
    });
    cupStandHeaterDevice.activate();
    machineTumbler.enable();
    machineTumbler.disable();
    expect(cupStandHeater.enabled).toBe(true);
  });

  it('should disable heater on cup taken', () => {
    const cupStandStatus = new BehaviorSubject(CupStandStatus.CupNotEmpty);
    const { cupStandHeaterDevice, machineTumbler, cupStandHeater } = createTestEnv({
      cupStandStatus,
    });
    cupStandHeaterDevice.activate();
    machineTumbler.enable();
    cupStandStatus.next(CupStandStatus.NoCup);
    expect(cupStandHeater.enabled).toBe(false);
  });

  it('should enable heater after manually machine stop and start', () => {
    const { cupStandHeaterDevice, cupStandHeater, machineTumbler } = createTestEnv({
      cupStandStatus: new BehaviorSubject(CupStandStatus.CupNotEmpty),
    });
    cupStandHeaterDevice.activate();
    machineTumbler.enable();
    machineTumbler.disableManually();
    machineTumbler.enable();
    expect(cupStandHeater.enabled).toBe(true);
  });

  it('should not enable heater after machine stop and cup taken/put', () => {
    const cupStandStatus = new BehaviorSubject(CupStandStatus.CupNotEmpty);
    const { cupStandHeaterDevice, cupStandHeater, machineTumbler } = createTestEnv({
      cupStandStatus,
    });
    cupStandHeaterDevice.activate();
    machineTumbler.enable();
    machineTumbler.disable();
    cupStandStatus.next(CupStandStatus.NoCup);
    cupStandStatus.next(CupStandStatus.CupNotEmpty);
    expect(cupStandHeater.enabled).toBe(false);
  });
});

const createTestEnv = ({
  cupStandStatus = new BehaviorSubject<CupStandStatus>(CupStandStatus.CupEmpty),
}: {
  cupStandStatus: HotObservable<CupStandStatus>;
}) => {
  const machineTumbler = new MachineTumbler();
  const cupStandHeater = new Heater();
  const cupStand = new CupStand(cupStandStatus);
  const cupStandHeaterDevice = new CupStandHeaterDevice(cupStand, cupStandHeater, machineTumbler);
  return { cupStandHeaterDevice, cupStandHeater, machineTumbler };
};

import { BehaviorSubject } from 'rxjs';

import { CoffeeMachine } from './CoffeeMachine';
import { Boiler } from './devices/Boiler/Boiler';
import { BoilerDevice } from './devices/Boiler/BoilerDevice';
import { CupStand, CupStandStatus } from './devices/CupStand/CupStand';
import { CupStandDevice } from './devices/CupStand/CupStandDevice';
import { CupStandHeaterDevice } from './devices/CupStand/CupStandHeaterDevice';
import { Heater } from './devices/Heater';
import { MachineTumbler } from './devices/MachineTumbler';
import { PressureValve } from './devices/WaterSource/PressureValve';
import { WaterSource } from './devices/WaterSource/WaterSource';
import { WaterSourceDevice } from './devices/WaterSource/WaterSourceDevice';
import { describeClass } from './utils/describeClass';
import { getStreamValue } from './utils/getStreamValue';

describeClass(CoffeeMachine, {
  isWorking: () => {
    it('should returns false by default', () => {
      const { coffeeMachine } = createTestEnv();
      expect(coffeeMachine.isWorking()).toBe(false);
    });

    it('should returns true on start', () => {
      const { coffeeMachine } = createTestEnv();
      coffeeMachine.start();
      expect(coffeeMachine.isWorking()).toBe(true);
    });

    it('should returns false on stop', () => {
      const { coffeeMachine } = createTestEnv();
      coffeeMachine.start();
      coffeeMachine.stop();
      expect(coffeeMachine.isWorking()).toBe(false);
    });

    it('should returns false on start if boiler is empty', () => {
      const { coffeeMachine } = createTestEnv({ boilerIsEmpty: true });
      coffeeMachine.start();
      expect(coffeeMachine.isWorking()).toBe(false);
    });

    it('should returns false on boiler is empty', () => {
      const boilerIsEmpty = new BehaviorSubject<boolean>(false);
      const { coffeeMachine } = createTestEnvWithMocks({ boilerIsEmpty });
      coffeeMachine.start();
      boilerIsEmpty.next(true);
      expect(coffeeMachine.isWorking()).toBe(false);
    });
  },

  working$: () => {
    it('should emit false by default', () => {
      const { coffeeMachine } = createTestEnv();
      expect(getStreamValue(coffeeMachine.working$)).toBe(false);
    });

    it('should emit true on start', () => {
      const { coffeeMachine } = createTestEnv();
      coffeeMachine.start();
      expect(getStreamValue(coffeeMachine.working$)).toBe(true);
    });

    it('should emit false on boiler is empty', () => {
      const boilerIsEmpty = new BehaviorSubject<boolean>(false);
      const { coffeeMachine } = createTestEnvWithMocks({ boilerIsEmpty });
      const spy = jasmine.createSpy();
      coffeeMachine.start();
      coffeeMachine.working$.subscribe(spy);
      spy.calls.reset();
      boilerIsEmpty.next(true);
      expect(spy).toHaveBeenCalledWith(false);
    });
  },

  start: () => {
    it('should enable boiler', () => {
      const { coffeeMachine, boiler } = createTestEnv();
      coffeeMachine.start();
      expect(boiler.enabled).toBe(true);
    });

    it('should not enable boiler if boiler is empty', () => {
      const { coffeeMachine, boiler } = createTestEnv({ boilerIsEmpty: true });
      coffeeMachine.start();
      expect(boiler.enabled).toBe(false);
    });

    it('should not open water source if boiler is empty', () => {
      const { coffeeMachine, waterSource } = createTestEnv({ boilerIsEmpty: true });
      coffeeMachine.start();
      expect(waterSource.opened).toBe(false);
    });

    it('should not enable boiler if heated stand has not cup', () => {
      const cupStandStatus = CupStandStatus.NoCup;
      const { coffeeMachine, boiler } = createTestEnv({ cupStandStatus });
      coffeeMachine.start();
      expect(boiler.enabled).toBe(false);
    });

    it('should not enable boiler if heated stand cup full', () => {
      const cupStandStatus = CupStandStatus.CupFull;
      const { coffeeMachine, boiler } = createTestEnv({ cupStandStatus });
      coffeeMachine.start();
      expect(boiler.enabled).toBe(false);
    });
  },

  stop: () => {
    it('should disable boiler', () => {
      const { coffeeMachine, boiler } = createTestEnv();
      coffeeMachine.start();
      coffeeMachine.stop();
      expect(boiler.enabled).toBe(false);
    });

    it('should close water source', () => {
      const { coffeeMachine, waterSource } = createTestEnv();
      coffeeMachine.start();
      coffeeMachine.stop();
      expect(waterSource.opened).toBe(false);
    });

    it('should disable cup stand heater', () => {
      const cupStandStatus = CupStandStatus.CupNotEmpty;
      const { coffeeMachine, cupStandHeater } = createTestEnv({ cupStandStatus });
      coffeeMachine.start();
      coffeeMachine.stop();
      expect(cupStandHeater.enabled).toBe(false);
    });
  },

  commonTestCases: () => {
    describe('on boiler is empty', () => {
      it('should disable boiler', () => {
        const boilerIsEmpty = new BehaviorSubject<boolean>(false);
        const { coffeeMachine, boiler } = createTestEnvWithMocks({ boilerIsEmpty });
        coffeeMachine.start();
        boilerIsEmpty.next(true);
        expect(boiler.enabled).toBe(false);
      });

      it('should close water source', () => {
        const boilerIsEmpty = new BehaviorSubject<boolean>(false);
        const { coffeeMachine, waterSource } = createTestEnvWithMocks({ boilerIsEmpty });
        coffeeMachine.start();
        boilerIsEmpty.next(true);
        expect(waterSource.opened).toBe(false);
      });
    });

    describe('on cup taken', () => {
      it('should close water source', () => {
        const cupStandStatus = new BehaviorSubject(CupStandStatus.CupEmpty);
        const { coffeeMachine, waterSource } = createTestEnvWithMocks({ cupStandStatus });
        coffeeMachine.start();
        cupStandStatus.next(CupStandStatus.NoCup);
        expect(waterSource.opened).toBe(false);
      });

      it('should disable cup stand heater', () => {
        const cupStandStatus = new BehaviorSubject(CupStandStatus.CupNotEmpty);
        const { coffeeMachine, cupStandHeater } = createTestEnvWithMocks({ cupStandStatus });
        coffeeMachine.start();
        cupStandStatus.next(CupStandStatus.NoCup);
        expect(cupStandHeater.enabled).toBe(false);
      });

      it('should disable cup stand heater after stop by full cup', () => {
        const cupStandStatus = new BehaviorSubject(CupStandStatus.CupNotEmpty);
        const { coffeeMachine, cupStandHeater } = createTestEnvWithMocks({ cupStandStatus });
        coffeeMachine.start();
        cupStandStatus.next(CupStandStatus.CupFull);
        cupStandStatus.next(CupStandStatus.NoCup);
        cupStandStatus.next(CupStandStatus.CupNotEmpty);
        expect(cupStandHeater.enabled).toBe(false);
      });
    });

    describe('on cup put', () => {
      it('should open water source', () => {
        const cupStandStatus = new BehaviorSubject(CupStandStatus.CupEmpty);
        const { coffeeMachine, waterSource } = createTestEnvWithMocks({ cupStandStatus });
        coffeeMachine.start();
        cupStandStatus.next(CupStandStatus.NoCup);
        cupStandStatus.next(CupStandStatus.CupEmpty);
        expect(waterSource.opened).toBe(true);
      });
    });

    describe('on cup full', () => {
      it('should disable boiler', () => {
        const cupStandStatus = new BehaviorSubject(CupStandStatus.CupEmpty);
        const { coffeeMachine, boiler } = createTestEnvWithMocks({ cupStandStatus });
        coffeeMachine.start();
        cupStandStatus.next(CupStandStatus.CupFull);
        expect(boiler.enabled).toBe(false);
      });

      it('should close water source', () => {
        const cupStandStatus = new BehaviorSubject(CupStandStatus.CupEmpty);
        const { coffeeMachine, waterSource } = createTestEnvWithMocks({ cupStandStatus });
        coffeeMachine.start();
        cupStandStatus.next(CupStandStatus.CupFull);
        expect(waterSource.opened).toBe(false);
      });
    });
  },
});

const createTestEnv = ({
  boilerIsEmpty = false,
  cupStandStatus = CupStandStatus.CupEmpty,
}: { boilerIsEmpty?: boolean; cupStandStatus?: CupStandStatus } = {}) => {
  return createTestEnvWithMocks({
    boilerIsEmpty: new BehaviorSubject(boilerIsEmpty),
    cupStandStatus: new BehaviorSubject(cupStandStatus),
  });
};

const createTestEnvWithMocks = ({
  boilerIsEmpty = new BehaviorSubject<boolean>(false),
  cupStandStatus = new BehaviorSubject<CupStandStatus>(CupStandStatus.CupEmpty),
}: {
  boilerIsEmpty?: BehaviorSubject<boolean>;
  cupStandStatus?: BehaviorSubject<CupStandStatus>;
}) => {
  const boiler = new Boiler(boilerIsEmpty, new Heater());
  const waterSource = new WaterSource(new PressureValve());
  const machineTumbler = new MachineTumbler();
  const cupStandHeater = new Heater();
  const cupStand = new CupStand(cupStandStatus);
  const coffeeMachine = new CoffeeMachine(machineTumbler, [
    new BoilerDevice(boiler, machineTumbler),
    new CupStandDevice(cupStand, waterSource, machineTumbler),
    new WaterSourceDevice(waterSource, machineTumbler),
    new CupStandHeaterDevice(cupStand, cupStandHeater, machineTumbler),
  ]);
  coffeeMachine.activate();
  return { coffeeMachine, boiler, waterSource, cupStandHeater };
};

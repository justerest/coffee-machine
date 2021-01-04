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
import { HotObservable } from './utils/HotObservable';

main();

function main(): void {
  const coffeeMachine = createCoffeeMachine({
    boilerEmptySubject: new BehaviorSubject(false),
    boilerHeater: { enabled: false, enable: () => {}, disable: () => {} },
    pressureValve: { opened: false, open: () => {}, close: () => {} },
    cupStandStatusSubject: new BehaviorSubject(CupStandStatus.CupEmpty),
    cupStandHeater: new Heater(),
  });
  coffeeMachine.activate();
  coffeeMachine.start();
  coffeeMachine.stop();
  coffeeMachine.working$.subscribe(console.log);
}

interface CoffeeMachineApi {
  boilerEmptySubject: HotObservable<boolean>;
  boilerHeater: Heater;
  pressureValve: PressureValve;
  cupStandStatusSubject: HotObservable<CupStandStatus>;
  cupStandHeater: Heater;
}

function createCoffeeMachine({
  boilerEmptySubject,
  boilerHeater,
  pressureValve,
  cupStandStatusSubject,
  cupStandHeater,
}: CoffeeMachineApi): CoffeeMachine {
  const boiler = new Boiler(boilerEmptySubject, boilerHeater);
  const waterSource = new WaterSource(pressureValve);
  const machineTumbler = new MachineTumbler();
  const cupStand = new CupStand(cupStandStatusSubject);
  return new CoffeeMachine(machineTumbler, [
    new BoilerDevice(boiler, machineTumbler),
    new CupStandDevice(cupStand, waterSource, machineTumbler),
    new WaterSourceDevice(waterSource, machineTumbler),
    new CupStandHeaterDevice(cupStand, cupStandHeater, machineTumbler),
  ]);
}

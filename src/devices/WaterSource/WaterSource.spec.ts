import { describeClass } from '../../utils/describeClass';
import { PressureValve } from './PressureValve';
import { WaterSource } from './WaterSource';

describeClass(WaterSource, {
  opened: () => {
    it('should be false on default', () => {
      const { waterSource } = createTestEnv();
      expect(waterSource.opened).toBe(false);
    });
  },

  open: () => {
    it('should close pressure valve', () => {
      const { waterSource, pressureValve } = createTestEnv();
      waterSource.open();
      expect(pressureValve.opened).toBe(false);
    });
  },

  close: () => {
    it('should open pressure valve', () => {
      const { waterSource, pressureValve } = createTestEnv();
      waterSource.open();
      waterSource.close();
      expect(pressureValve.opened).toBe(true);
    });
  },
});

const createTestEnv = () => {
  const pressureValve = new PressureValve();
  const waterSource = new WaterSource(pressureValve);
  return { waterSource, pressureValve };
};

export class PressureValve {
  opened = true;

  open(): void {
    this.opened = true;
  }

  close(): void {
    this.opened = false;
  }
}

export function truthy<T>(value: T): value is NonNullable<T> {
  return !!value;
}

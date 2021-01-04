const COMMON_TEST_CASES = 'commonTestCases';

export function describeClass<T>(
  ctor: new (...args: any[]) => T,
  tests: { [key in keyof T]?: () => void } & { [key in typeof COMMON_TEST_CASES]?: () => void },
): void {
  describe(ctor.name, () =>
    Object.entries(tests).forEach(([instanceMemberName, test]) =>
      describe(getTestName(instanceMemberName), test as () => void),
    ),
  );
}

function getTestName(instanceMemberName: string): string {
  return instanceMemberName === COMMON_TEST_CASES ? ''.padStart(20, '-') : `+${instanceMemberName}`;
}

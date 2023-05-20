import { useCallback, useState } from 'react';

export interface UseUncontrolledInput<T> {
  /** Value for controlled state */
  value?: T;

  /** Initial value for uncontrolled state */
  defaultValue?: T;

  /** Final value for uncontrolled state when value and defaultValue are not provided */
  finalValue?: T;

  /** Controlled state onChange handler */
  onChange?(value: T): void;
}

const useMemoizedFn = (fn: any) => useCallback(fn || (() => {}), [fn]);

export function useUncontrolled<T>({
  value,
  defaultValue,
  finalValue,
  onChange,
}: UseUncontrolledInput<T>): [T, (value: T) => void, boolean] {
  const stableOnChange = useMemoizedFn(onChange);

  const [uncontrolledValue, setUncontrolledValue] = useState(
    defaultValue !== undefined ? defaultValue : finalValue,
  );

  const handleUncontrolledChange = useCallback(
    (val: T) => {
      setUncontrolledValue(val);
      stableOnChange?.(val);
    },
    [stableOnChange],
  );

  if (value !== undefined) {
    return [value as T, stableOnChange, true];
  }

  return [uncontrolledValue as T, handleUncontrolledChange, false];
}

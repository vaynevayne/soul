import { useState } from 'react';

/**
 * @description Adjusting some state when a prop changes
 * @param prop
 * @param cb
 * @example useWatch(columns, columns=> {})
 */
export const useWatch = <T = any>(
  prop: T,
  cb: (newValue: T, oldValue: T | undefined) => void,
  option?: { immediate?: boolean },
) => {
  const [prevProp, setPrevProp] = useState(
    option?.immediate ? undefined : prop,
  );

  if (prop !== prevProp) {
    cb(prop, prevProp);
    setPrevProp(prop);
  }
};

import React, { useEffect } from 'react';
import { PhantomString, ST } from './types';
import { env } from './env';
export const useAsyncEffect = <T = void>(cb: () => Promise<T>, dependencies: any[] = []) => {
  useEffect(() => {
    const resp = cb();
    return () => {
      resp.then((next) => {
        if (typeof next === 'function') { next(); }
      });
    };
  }, dependencies);
};

type ErrorConstructor = new (message: string) => Error;
export function isNotBlank<T>(item: T, message: string = 'null assertion failed', E: ErrorConstructor = Error): void {
  const invalid = (item === null || item === undefined);
  if (invalid) { throw new E(message); }
}

export default {};

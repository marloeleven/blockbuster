import { useEffect } from 'react';
import { IFunction } from 'types';

export default function useEffectOnce(callback: IFunction) {
  useEffect(() => {
    callback();
  }, []);
}

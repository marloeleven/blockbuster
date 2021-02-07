import { useState } from 'react';
import useEffectOnce from 'hooks/useEffectOnce';

const LOADING = 'loading';
const ERROR = 'error';
const SUCCESS = 'success';

export default function useFecth(promise: any) {
  const [status, setStatus] = useState<string>(LOADING);
  const [result, setResult] = useState<any>();
  const [suspender, setSuspender] = useState<Promise<any>>(
    new Promise(() => {})
  );

  useEffectOnce(() => {
    const promiseResult = promise()
      .then((res: any) => {
        setResult(res);

        setStatus(SUCCESS);
      })
      .catch((e: Error) => {
        setResult(e);
        setStatus(ERROR);
      });

    setSuspender(promiseResult);
  });

  return {
    read: () => {
      switch (status) {
        case LOADING:
          throw suspender;
        case ERROR:
          throw result;
        case SUCCESS:
        default:
          return result;
      }
    },
  };
}

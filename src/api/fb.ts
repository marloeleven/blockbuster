import lscache from 'lscache';
import isEmpty from 'lodash/isEmpty';

interface IURLParams {
  [key: string]: any;
}

interface ICacheList {
  id: string;
  list: [];
}

const generateURL = (paramsObj: IURLParams) => {
  const baseURL = [window.location.origin].join('/');

  const params = new URLSearchParams(paramsObj).toString();

  return { baseURL, params };
};

/*
  This is a sample Api handler
*/

const PAGES = 'pages';
export const getPages = (userId: string, access_token: string) => {
  const { baseURL, params } = generateURL({ access_token });

  return new Promise(async (resolve, reject) => {
    const cache: ICacheList = lscache.get(PAGES);

    if (!isEmpty(cache) && cache && cache.id === userId) {
      resolve(cache.list);
      return;
    }

    const { data } = await fetch(
      `${baseURL}/me/accounts?fields=id,name,access_token&${params}`
    )
      .then((r) => r.json())
      .catch(reject);

    lscache.set(PAGES, data);

    resolve(data);
  });
};

export default {
  getPages,
};

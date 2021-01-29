import React from 'react';
import { Route } from 'react-router-dom';

import Home from 'containers/home';

interface IPage {
  exact?: boolean;
  path: string;
  component: React.ComponentClass<any, any> | React.FunctionComponent<any>;
}

const routes: IPage[] = [
  // {
  //   path: '/page',
  //   component: Page,
  // },
  {
    exact: true,
    path: '/',
    component: Home,
  },
];

export default () => (
  <>
    {routes.map((route) => (
      <Route key={route.path} {...route} />
    ))}
  </>
);

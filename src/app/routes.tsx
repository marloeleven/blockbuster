import React from 'react';
import { Route } from 'react-router-dom';

import Home from 'containers/home';
import Game from 'containers/game';

interface IPage {
  exact?: boolean;
  path: string;
  component: React.ComponentClass<any, any> | React.FunctionComponent<any>;
}

const routes: IPage[] = [
  {
    path: '/game',
    component: Game,
  },
  {
    exact: true,
    path: '/',
    component: Home,
  },
];

export default function Routes() {
  return (
    <>
      {routes.map((route) => (
        <Route key={route.path} {...route} />
      ))}
    </>
  );
}

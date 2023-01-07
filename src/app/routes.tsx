import React from 'react';
import { Route, Switch, HashRouter } from 'react-router-dom';

import Home from 'containers/home';
import Game from 'containers/game';

export default function Routes() {
  return (
    <HashRouter>
      <Switch>
        <Route path="/game">
          <Game />
        </Route>
        <Route path="/" exact>
          <Home />
        </Route>
      </Switch>
    </HashRouter>
  );
}

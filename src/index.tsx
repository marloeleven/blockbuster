import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';

import { store, history } from 'app/store';

import ErrorBoundary from './containers/errorboundary';
import Loader from 'containers/loader';

import App from './App';

import './index.css';
import { ConnectedRouter } from 'connected-react-router';

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <Suspense fallback={<Loader />}>
              <App />
            </Suspense>
          </ConnectedRouter>
        </Provider>
      </HashRouter>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root')
);

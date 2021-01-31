import React from 'react';
import Routes from 'app/routes';

import ModalManager from 'components/modal-manager';

export type IEventCallbackVoid = (event: any) => void;
interface IAppContext {}

export const AppContext = React.createContext<IAppContext>({});

const App: React.FC = () => {
  return (
    <AppContext.Provider value={{}}>
      <ModalManager>
        <Routes />
      </ModalManager>
    </AppContext.Provider>
  );
};

export default App;

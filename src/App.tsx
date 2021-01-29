import React from 'react';
import Routes from 'app/routes';

export type IEventCallbackVoid = (event: any) => void;
interface IAppContext {}

export const AppContext = React.createContext<IAppContext>({});

const App: React.FC = () => {
  return (
    <AppContext.Provider value={{}}>
      <Routes />
    </AppContext.Provider>
  );
};

export default App;

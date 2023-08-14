import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './components/_serviceworker';
import { StateProvider } from './components/_stateprovider';
import reducer, { initialState } from './components/_reducer';

ReactDOM.render(
  <React.StrictMode>
    <StateProvider initialState={initialState} reducer={reducer}>    
      <App />
    </StateProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
serviceWorker.unregister();

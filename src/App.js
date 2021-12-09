import React from 'react';
import './assets/css/index.css';

import Router from './Router';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { rootReducer, rootSaga } from './store';

const sagaMiddleware = createSagaMiddleware();

export const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga);

function App() {
  return (
    <Provider store={store}>
      <div className='App'>
        <Router />
      </div>
    </Provider>
  );
}

export default App;

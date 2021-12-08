import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import AuthRoute from './components/AuthRoute';

// Importar componentes
import Header from './components/Header';
import Error from './components/Error';
import Musicians from './screens/Musicians';
import Musician from './screens/Musician';
import ManageMusician from './screens/ManageMusician';
import Login from './screens/Login';

export default function Router() {
  return (
    <BrowserRouter>
      <Header />

      {/* CONFIGURAR RUTAS Y PÁGINAS */}
      <Switch>
        <AuthRoute exact path='/login' component={Login} type='guest' />
        <AuthRoute exact path='/' component={Musicians} type='private' />
        <AuthRoute
          exact
          path='/musician'
          component={ManageMusician}
          type='private'
        />
        <AuthRoute
          exact
          path='/musician/:id'
          component={Musician}
          type='private'
        />
        <AuthRoute
          exact
          path='/musician/edit/:id'
          component={ManageMusician}
          type='private'
        />

        <Route component={Error} />
      </Switch>
    </BrowserRouter>
  );
}

import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import AuthRoute from './components/AuthRoute';

// Importar componentes
import Header from './components/Header';
import Error from './components/Error';
import Login from './screens/Login';
import Musicians from './screens/Musician/Musicians';
import Musician from './screens/Musician/Musician';
import ManageMusician from './screens/Musician/ManageMusician';
import Businesses from './screens/Business/Businesses';
import Business from './screens/Business/Business';
import ManageBusiness from './screens/Business/ManageBusiness';

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
        <AuthRoute
          exact
          path='/businesses'
          component={Businesses}
          type='private'
        />
        <AuthRoute
          exact
          path='/business'
          component={ManageBusiness}
          type='private'
        />
        <AuthRoute
          exact
          path='/business/:id'
          component={Business}
          type='private'
        />
        <AuthRoute
          exact
          path='/business/edit/:id'
          component={ManageBusiness}
          type='private'
        />

        <Route component={Error} />
      </Switch>
    </BrowserRouter>
  );
}

import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import AuthRoute from './components/AuthRoute';

// Importar componentes
import Header from './components/Header';
import Footer from './components/Footer';
import Error from './components/Error';
import Example from './screens/Example';
import Login from './screens/Login';

export default function Router() {
  return (
    <BrowserRouter>
      <Header />

      {/* CONFIGURAR RUTAS Y PÁGINAS */}
      <Switch>
        <AuthRoute exact path='/login' component={Login} type='guest' />
        <AuthRoute exact path='/' component={Example} type='private' />

        <Route component={Error} />
      </Switch>

      <div className='clearfix'></div>

      <Footer />
    </BrowserRouter>
  );
}

import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// Importar componentes
import Header from './components/Header';
import Footer from './components/Footer';
import Error from './components/Error';
import Example from './components/Example';

export default function Router() {
  return (
    <BrowserRouter>
      <Header />

      {/* CONFIGURAR RUTAS Y PÁGINAS */}
      <Switch>
        <Route exact path='/' component={Example} />

        <Route component={Error} />
      </Switch>

      <div className='clearfix'></div>

      <Footer />
    </BrowserRouter>
  );
}

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
import Posts from './screens/Post/Posts';
import Post from './screens/Post/Post';
import ManagePost from './screens/Post/ManagePost';
import Events from './screens/Event/Events';
import Event from './screens/Event/Event';
import ManageEvent from './screens/Event/ManageEvent';
import Bands from './screens/Band/Bands';
import Band from './screens/Band/Band';
import ManageBand from './screens/Band/ManageBand';

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
          path='/musicians'
          component={Musicians}
          type='private'
        />
        <AuthRoute
          exact
          path='/musicians/:id'
          component={Musicians}
          type='private'
        />
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
          path='/businesses/:id'
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
        <AuthRoute exact path='/posts' component={Posts} type='private' />
        <AuthRoute exact path='/posts/:id' component={Posts} type='private' />
        <AuthRoute exact path='/post' component={ManagePost} type='private' />
        <AuthRoute exact path='/post/:id' component={Post} type='private' />
        <AuthRoute
          exact
          path='/post/edit/:id'
          component={ManagePost}
          type='private'
        />
        <AuthRoute exact path='/events' component={Events} type='private' />
        <AuthRoute exact path='/events/:id' component={Events} type='private' />
        <AuthRoute exact path='/event' component={ManageEvent} type='private' />
        <AuthRoute exact path='/event/:id' component={Event} type='private' />
        <AuthRoute
          exact
          path='/event/edit/:id'
          component={ManageEvent}
          type='private'
        />
        <AuthRoute exact path='/bands' component={Bands} type='private' />
        <AuthRoute exact path='/bands/:id' component={Bands} type='private' />
        <AuthRoute exact path='/band' component={ManageBand} type='private' />
        <AuthRoute exact path='/band/:id' component={Band} type='private' />
        <AuthRoute
          exact
          path='/band/edit/:id'
          component={ManageBand}
          type='private'
        />

        <Route component={Error} />
      </Switch>
    </BrowserRouter>
  );
}

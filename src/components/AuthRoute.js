import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { auth } from '../config';

const AuthRoute = (props) => {
  const { type } = props;
  if (type === 'guest' && auth.currentUser) return <Redirect to='/' />;
  if (type === 'private' && !auth.currentUser) return <Redirect to='/login' />;

  return <Route {...props} />;
};

export default AuthRoute;

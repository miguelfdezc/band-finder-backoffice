import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { auth } from '../config';

function Header() {
  const history = useHistory();
  const [isLogged, setIsLogged] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setIsLogged(!isLogged);
    });

    return unsubscribe;
  }, [isLogged]);

  const signOut = async () => {
    await auth
      .signOut()
      .then(() => history.push('/login'))
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <nav className='navbar navbar-expand-lg navbar-dark bg-primary'>
      <NavLink className='navbar-brand' to='/'>
        Band Finder Backoffice
      </NavLink>
      {auth.currentUser && (
        <button
          className='navbar-toggler'
          type='button'
          data-toggle='collapse'
          data-target='#navbarNavDropdown'
          aria-controls='navbarNavDropdown'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
      )}
      {auth.currentUser && (
        <div className='collapse navbar-collapse' id='navbarNavDropdown'>
          <ul className='navbar-nav ml-auto'>
            <li className='nav-item'>
              <div
                className='nav-link'
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  history.push('/');
                }}
              >
                Músicos
              </div>
            </li>
            <li className='nav-item'>
              <div
                className='nav-link'
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  history.push('/businesses');
                }}
              >
                Negocios
              </div>
            </li>
            <li className='nav-item'>
              <div
                className='nav-link'
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  history.push('/posts');
                }}
              >
                Publicaciones
              </div>
            </li>
            <li className='nav-item'>
              <div
                className='nav-link'
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  history.push('/events');
                }}
              >
                Eventos
              </div>
            </li>
            <li className='nav-item'>
              <div
                className='nav-link'
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  history.push('/bands');
                }}
              >
                Bandas
              </div>
            </li>
            <li className='nav-item'>
              <div
                className='nav-link'
                style={{ cursor: 'pointer' }}
                onClick={signOut}
              >
                Cerrar sesión
              </div>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Header;

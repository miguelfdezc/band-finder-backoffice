import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { auth } from '../config';
import Global from '../Global';
import axios from 'axios';

export default function Login() {
  const url = Global.url;
  const history = useHistory();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!email || !password) {
      setError('Error: faltan campos del formulario por rellenar');
      return false;
    }
    return true;
  };

  const signIn = async (e) => {
    try {
      e.preventDefault()
      if (validateForm()) {
        const isAdmin = await (await axios.post(`${url}/permisos/admin`, { email })).data.isAdmin
        console.log(isAdmin);
        if (isAdmin) await auth.signInWithEmailAndPassword(email, password).then(() => history.push('/'));
        else setError('Forbidden: el usuario no tiene permisos de administrador')
      }
    } catch (err) {
      setError(err.message)
    }
  };

  return (
    <div className='container-fluid'>
      <div className='row justify-content-center mb-3'>
        <div className='col-auto'>
          <h2>Iniciar sesión</h2>
        </div>
      </div>
      <div className='row justify-content-center'>
        <div className='col-auto'>
          <form onSubmit={signIn}>
            <div className='form-group'>
              <label htmlFor='email' className=''>Email</label>
              <input
                id='email'
                className='form-control'
                name='email'
                placeholder='usuario@email.com'
                type='text'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='password'>Contraseña</label>
              <input
                id='password'
                className='form-control'
                name='password'
                placeholder='********'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type='submit' className='btn btn-primary btn-block' onClick={signIn}>
              Login
            </button>
          </form>
        </div>
      </div>
      <div className='row mt-3 justify-content-center'>
        <div className='col-auto'>
          {error && <div className='alert alert-danger'>{error}</div>}
        </div>
      </div>
    </div>
  );
}

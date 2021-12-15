import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Global from '../Global';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginAction } from '../store/actions';
import { useForm } from 'react-hook-form';

export default function Login() {
  const url = Global.url;
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onFormSubmit = async () => {
    try {
      const isAdmin = await (
        await axios.post(`${url}/auth/admin`, { email })
      ).data.isAdmin;
      if (isAdmin) dispatch(loginAction(email, password, history));
      else setError('Forbidden: el usuario no tiene permisos de administrador');
    } catch (err) {
      setError(err.message);
    }
  };

  const onErrors = (errors) => setError(errors.message);

  const registerOptions = {
    email: {
      required: 'Email es obligatorio',
      pattern: {
        value:
          /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
        message: 'Email debe ser válido',
      },
    },
    password: {
      required: 'Contraseña es obligatoria',
      minLength: {
        value: 8,
        message: 'Contraseña debe tener al menos 8 caracteres',
      },
    },
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
          <form onSubmit={handleSubmit(onFormSubmit, onErrors)}>
            <div className='form-group'>
              <label htmlFor='email' className=''>
                Email
              </label>
              <input
                id='email'
                {...register('email', registerOptions.email)}
                className='form-control'
                name='email'
                placeholder='usuario@email.com'
                type='text'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <small className='text-danger'>
                {errors.email && errors.email.message}
              </small>
            </div>
            <div className='form-group'>
              <label htmlFor='password'>Contraseña</label>
              <input
                id='password'
                {...register('password', registerOptions.password)}
                className='form-control'
                name='password'
                placeholder='********'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <small className='text-danger'>
                {errors.password && errors.password.message}
              </small>
            </div>
            <button
              type='submit'
              className='btn btn-primary btn-block'
              onClick={handleSubmit(onFormSubmit, onErrors)}
            >
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

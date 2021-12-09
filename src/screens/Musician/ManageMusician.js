import React, { useState, useEffect } from 'react';
import { firebase, storage } from '../../config';
import Global from '../../Global';
import axios from 'axios';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';

export default function ManageMusician() {
  const url = Global.url;

  const authUser = useSelector((state) => state.auth.authUser);

  const [musician, setMusician] = useState({});
  const [error, setError] = useState('');

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      axios
        .get(`${url}/users/${id}?uid=${authUser}`)
        .then((response) => {
          setMusician(response.data.user);
        })
        .catch((error) => {
          setError(error.message);
          console.error('Ha habido un error!', error);
        });
    }
    // eslint-disable-next-line
  }, [id, url]);

  const handleChange = (e, type) => {
    if (e.target.files[0]) {
      let file = e.target.files[0];
      var storageRef = storage.ref();
      var uploadTask = storageRef.child(`musicos/${id}/${type}`).put(file);

      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        null,
        (err) => {
          setError(err);
        },
        () => {
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then((url) => {
              if (type === 'photoURL')
                setMusician({ ...musician, photoURL: url });
              else if (type === 'imagenFondo')
                setMusician({ ...musician, imagenFondo: url });
            })
            .catch((e) => setError(e));
          // document.getElementById('file').value = null;
        }
      );
    }
  };

  return (
    <div className='container'>
      <div className='row justify-content-center mb-3'>
        <div className='col-auto'>
          <h2>{id ? 'Editar' : 'Crear'} Músic@</h2>
        </div>
      </div>
      {id && musician.uid ? (
        <form onSubmit={() => {}}>
          <div className='row'>
            <div className='col'>
              <div className='form-group'>
                <label htmlFor='uid' className=''>
                  UID
                </label>
                <input
                  id='uid'
                  className='form-control'
                  name='uid'
                  placeholder='123456789ABC'
                  type='text'
                  value={musician.uid ?? ''}
                  disabled
                />
              </div>
              <div className='form-group'>
                <label htmlFor='email' className=''>
                  Email
                </label>
                <input
                  id='email'
                  className='form-control'
                  name='email'
                  placeholder='usuario@email.com'
                  type='text'
                  value={musician.email ?? ''}
                  onChange={(e) =>
                    setMusician({ ...musician, email: e.target.value })
                  }
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
                  value={musician.password ?? ''}
                  onChange={(e) =>
                    setMusician({ ...musician, password: e.target.value })
                  }
                  required
                />
              </div>
              <div className='row'>
                <div className='col'>
                  <p>Verificado</p>
                  <label className='radio mr-2'>
                    <input
                      id='emailVerifiedYes'
                      className='m-1'
                      name='emailVerified'
                      type='radio'
                      checked={musician.emailVerified}
                      onChange={() =>
                        setMusician({ ...musician, emailVerified: true })
                      }
                    />
                    Sí
                  </label>
                  <label className='radio mr-2'>
                    <input
                      id='emailVerifiedNo'
                      className='m-1'
                      name='emailVerified'
                      type='radio'
                      checked={!musician.emailVerified}
                      onChange={() =>
                        setMusician({ ...musician, emailVerified: false })
                      }
                    />
                    No
                  </label>
                </div>
                <div className='col'>
                  <p>Bloqueado</p>
                  <label className='radio mr-2'>
                    <input
                      id='disabledYes'
                      className='m-1'
                      name='disabled'
                      type='radio'
                      checked={musician.disabled}
                      onChange={() =>
                        setMusician({ ...musician, disabled: true })
                      }
                    />
                    Sí
                  </label>
                  <label className='radio mr-2'>
                    <input
                      id='disabledNo'
                      className='m-1'
                      name='disabled'
                      type='radio'
                      checked={!musician.disabled}
                      onChange={() =>
                        setMusician({ ...musician, disabled: false })
                      }
                    />
                    No
                  </label>
                </div>
              </div>
              <div className='form-group'>
                <label htmlFor='photoURL' className=''>
                  Imagen Perfil
                </label>
                <br />
                <div className='row'>
                  <div className='col'>
                    <img
                      src={musician.photoURL}
                      style={{ height: '100px', width: '100px' }}
                      alt='Imagen Perfil'
                    />
                  </div>
                  <div className='col align-self-center'>
                    <input
                      type='file'
                      id='photoURL'
                      onChange={(e) => {
                        e.preventDefault();
                        handleChange(e, 'photoURL');
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className='form-group'>
                <label htmlFor='imagenFondo' className=''>
                  Imagen Fondo
                </label>
                <br />
                <div className='row'>
                  <div className='col'>
                    <img
                      src={musician.imagenFondo}
                      style={{ height: '100px', width: '100px' }}
                      alt='Imagen Fondo'
                    />
                  </div>
                  <div className='col align-self-center'>
                    <input
                      type='file'
                      id='imagenFondo'
                      onChange={(e) => {
                        e.preventDefault();
                        handleChange(e, 'imagenFondo');
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className='col'>
              <div className='form-group'>
                <label htmlFor='usuario' className=''>
                  Usuario
                </label>
                <input
                  id='usuario'
                  className='form-control'
                  name='usuario'
                  placeholder='usuario'
                  type='text'
                  value={musician.usuario ?? ''}
                  onChange={(e) =>
                    setMusician({ ...musician, usuario: e.target.value })
                  }
                  required
                />
              </div>
              <div className='form-group'>
                <label htmlFor='displayName' className=''>
                  Nombre
                </label>
                <input
                  id='displayName'
                  className='form-control'
                  name='displayName'
                  placeholder='John Doe'
                  type='text'
                  value={musician.displayName ?? ''}
                  onChange={(e) =>
                    setMusician({ ...musician, displayName: e.target.value })
                  }
                  required
                />
              </div>
              <div className='form-group'>
                <label htmlFor='phone' className=''>
                  Teléfono
                </label>
                <input
                  id='phone'
                  className='form-control'
                  name='phone'
                  placeholder='+34 123 456 789'
                  type='text'
                  value={musician.phoneNumber ?? ''}
                  onChange={(e) =>
                    setMusician({ ...musician, phoneNumber: e.target.value })
                  }
                  required
                />
              </div>
              <div className='form-group'>
                <label htmlFor='descripcion' className=''>
                  Descripción
                </label>
                <textarea
                  id='descripcion'
                  className='form-control'
                  name='descripcion'
                  placeholder='Descripción...'
                  value={musician.descripcion ?? ''}
                  onChange={(e) =>
                    setMusician({ ...musician, descripcion: e.target.value })
                  }
                />
              </div>
              <div className='form-group'>
                <label htmlFor='valoracion' className=''>
                  Valoración
                </label>
                <input
                  id='valoracion'
                  className='form-control'
                  name='valoracion'
                  placeholder='0'
                  type='number'
                  min={0}
                  max={5}
                  step='0.1'
                  value={musician.valoracion ?? 0.0}
                  onChange={(e) =>
                    setMusician({ ...musician, valoracion: e.target.value })
                  }
                  required
                />
              </div>
              <div className='form-group'>
                <label htmlFor='actuaciones' className=''>
                  Actuaciones
                </label>
                <input
                  id='actuaciones'
                  className='form-control'
                  name='actuaciones'
                  placeholder='0'
                  type='number'
                  min={0}
                  value={musician.actuaciones ?? 0}
                  onChange={(e) =>
                    setMusician({ ...musician, actuaciones: e.target.value })
                  }
                  required
                />
              </div>
              <div className='form-group'>
                <label htmlFor='fans' className=''>
                  Fans
                </label>
                <input
                  id='fans'
                  className='form-control'
                  name='fans'
                  placeholder='0'
                  type='number'
                  min={0}
                  value={musician.fans ?? 0}
                  onChange={(e) =>
                    setMusician({ ...musician, fans: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>
          <button
            type='submit'
            className={`btn btn-${id ? 'warning' : 'success'} btn-block`}
            onClick={() => {
              axios
                .put(`${url}/users/${id}?uid=${authUser}`, musician)
                .then((response) => {
                  setMusician(response.data.user);
                })
                .catch((error) => {
                  setError(error.message);
                  console.error('Ha habido un error!', error);
                });
            }}
          >
            Editar
          </button>
        </form>
      ) : (
        <form onSubmit={() => {}}>
          <div className='row'>
            <div className='col'>
              <div className='form-group'>
                <label htmlFor='email' className=''>
                  Email
                </label>
                <input
                  id='email'
                  className='form-control'
                  name='email'
                  placeholder='usuario@email.com'
                  type='text'
                  value={musician.email ?? ''}
                  onChange={(e) =>
                    setMusician({ ...musician, email: e.target.value })
                  }
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
                  value={musician.password ?? ''}
                  onChange={(e) =>
                    setMusician({ ...musician, password: e.target.value })
                  }
                  required
                />
              </div>
              <div className='form-group'>
                <label htmlFor='usuario' className=''>
                  Usuario
                </label>
                <input
                  id='usuario'
                  className='form-control'
                  name='usuario'
                  placeholder='usuario'
                  type='text'
                  value={musician.usuario ?? ''}
                  onChange={(e) =>
                    setMusician({ ...musician, usuario: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>
          <button
            type='submit'
            className={`btn btn-${id ? 'warning' : 'success'} btn-block`}
            onClick={() => {
              axios
                .post(`${url}/users/musicos`, musician)
                .then((response) => {
                  setMusician(response.data.user);
                })
                .catch((error) => {
                  setError(error.message);
                  console.error('Ha habido un error!', error);
                });
            }}
          >
            Crear
          </button>
        </form>
      )}
      <div className='row mt-3 justify-content-center'>
        <div className='col-auto'>
          {error && <div className='alert alert-danger'>{error}</div>}
        </div>
      </div>
    </div>
  );
}

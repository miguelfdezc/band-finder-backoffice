import React, { useState, useEffect } from 'react';
import 'moment/locale/es';
import Global from '../Global';
import axios from 'axios';
import { useParams, useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Musician() {
  let url = Global.url;

  const history = useHistory();

  const authUser = useSelector((state) => state.auth.authUser);

  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`${url}/users/${id}?uid=${authUser}`)
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((error) => {
        setMessage(error.message);
        console.error('Ha habido un error!', error);
      });
    // eslint-disable-next-line
  }, [id, url]);

  const deleteMusician = (id) => {
    axios
      .delete(`${url}/users/${id}?uid=${authUser}`)
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        setMessage(error.message);
        console.error('Ha habido un error!', error);
      });
  };

  return (
    <>
      {user && (
        <div className='container'>
          <div className='row mt-3'>
            <div className='col-10'>
              <h2>Músic@: {user.usuario}</h2>
            </div>
            <div className='col-2'>
              <Link
                to={`/musician/edit/${user.uid}`}
                className='btn btn-warning m-1'
              >
                Editar
              </Link>
              <button
                className='btn btn-danger'
                onClick={() => {
                  deleteMusician(user.uid);
                  history.goBack();
                }}
              >
                Eliminar
              </button>
            </div>
          </div>

          <div className='row mt-3'>
            <div className='col'>
              <table className='table table-striped'>
                <tbody>
                  <tr>
                    <th>UID</th>
                    <td>{user.uid}</td>
                    <th>Email</th>
                    <td>{user.email}</td>
                  </tr>
                  <tr>
                    <th>Verificado</th>
                    <td>{user.emailVerified ? 'Sí' : 'No'}</td>
                    <th>PhotoURL</th>
                    <td>
                      <a href={user.photoURL}>{user.photoURL}</a>
                    </td>
                  </tr>
                  <tr>
                    <th>Nombre</th>
                    <td>{user.displayName}</td>
                    <th>Grupo</th>
                    <td>{user.customClaims.type}</td>
                  </tr>
                  <tr>
                    <th>Bloqueado</th>
                    <td>{user.disabled ? 'Sí' : 'No'}</td>
                    <th>Fecha de creación</th>
                    <td>{user.metadata.creationTime}</td>
                  </tr>
                  <tr>
                    <th>Último Inicio de sesión</th>
                    <td>{user.metadata.lastSignInTime ?? '-'}</td>
                    <th>Descripción</th>
                    <td>{user.descripcion === '' ? '-' : user.descripcion}</td>
                  </tr>
                  <tr>
                    <th>Usuario</th>
                    <td>{user.usuario}</td>
                    <th>Imagen Fondo</th>
                    <td>{user.imagenFondo === '' ? '-' : user.imagenFondo}</td>
                  </tr>
                  <tr>
                    <th>Actuaciones</th>
                    <td>{user.actuaciones}</td>
                    <th>Ubicación</th>
                    <td>{user.ubicacion === '' ? '-' : user.ubicacion}</td>
                  </tr>
                  <tr>
                    <th>Valoración</th>
                    <td>{user.valoracion}</td>
                    <th>Fans</th>
                    <td>{user.fans}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className='row mt-2'>
            <div className='col'>
              {message !== '' && (
                <div
                  className='alert alert-success alert-dismissible fade show'
                  role='alert'
                >
                  <span>{message}</span>
                  <button
                    type='button'
                    className='close'
                    data-dismiss='alert'
                    aria-label='Close'
                  >
                    <span aria-hidden='true'>&times;</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

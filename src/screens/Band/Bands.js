import React, { useState, useEffect } from 'react';
import 'moment/locale/es';
import Global from '../../Global';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import '../../assets/css/musicians.css';
// import Pagination from 'react-bootstrap/Pagination';
import { useSelector } from 'react-redux';

export default function Bands() {
  let url = Global.url;

  const authUser = useSelector((state) => state.auth.authUser);

  const [message, setMessage] = useState('');
  const [bands, setBands] = useState([]);

  useEffect(() => {
    axios
      .get(`${url}/bands`)
      .then((response) => {
        setBands(response.data.bands);
      })
      .catch((error) => {
        setMessage(error.message);
        console.error('Ha habido un error!', error);
      });
    // eslint-disable-next-line
  }, []);

  const deleteBand = (id) => {
    axios
      .delete(`${url}/bands/${id}?uid=${authUser}`)
      .then((response) => {
        setMessage(response.data.message);
        setBands(bands.filter((p) => p.id !== id));
      })
      .catch((error) => {
        setMessage(error.message);
        console.error('Ha habido un error!', error);
      });
  };

  return (
    <>
      {bands.length > 0 && (
        <div className='container' style={{ height: 'calc(100vh - 120px)' }}>
          <div className='row mt-3'>
            <div className='col-11'>
              <h2>Listado de bandas</h2>
            </div>
            <div className='col-1'>
              <Link to='/band' className='btn btn-success'>
                Crear
              </Link>
            </div>
          </div>

          <div className='row mt-3'>
            <div className='col musicians'>
              <table className='table table-striped'>
                <thead>
                  <tr>
                    <th className='col-2'>ID</th>
                    <th className='col-3'>Fundador</th>
                    <th className='col-1'>Nombre</th>
                    <th className='col-1'>Valoración</th>
                    <th className='col-1'>Miembros</th>
                    <th className='col-1'>Actuaciones</th>
                    <th className='col-3' colSpan='3'>
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bands.map((band, index) => (
                    <tr key={index}>
                      <td className='col-2'>{band.id}</td>
                      <td className='col-3'>
                        <Link to={`/musician/${band.fundador.usuario}`}>
                          {band.fundador.usuario}
                        </Link>
                      </td>
                      <td className='col-1'>{band.nombre}</td>
                      <td className='col-1'>{band.valoracion}</td>
                      <td className='col-1'>{band.miembros.length}</td>
                      <td className='col-1'>{band.actuaciones}</td>
                      <td className='col-1'>
                        <Link
                          to={`/band/${band.id}`}
                          style={{ color: '#17a2b8' }}
                        >
                          Ver
                        </Link>
                      </td>
                      <td className='col-1'>
                        <Link
                          to={`/band/edit/${band.id}`}
                          style={{ color: '#ffc107' }}
                        >
                          Editar
                        </Link>
                      </td>
                      <td className='col-1'>
                        <span
                          className='text-danger'
                          onClick={() => deleteBand(band.id)}
                        >
                          Eliminar
                        </span>
                      </td>
                    </tr>
                  ))}
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

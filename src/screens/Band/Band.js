import React, { useState, useEffect } from 'react';
import 'moment/locale/es';
import Global from '../../Global';
import axios from 'axios';
import { useParams, useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Location } from 'react-ionicons';
import GoogleMapReact from 'google-map-react';

export default function Band() {
  let url = Global.url;

  const history = useHistory();

  const authUser = useSelector((state) => state.auth.authUser);

  const [message, setMessage] = useState('');
  const [band, setBand] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`${url}/bands/${id}`)
      .then((response) => {
        setBand(response.data.band);
      })
      .catch((error) => {
        setMessage(error.response.data.message);
      });
    // eslint-disable-next-line
  }, [id, url]);

  const deleteBand = (id) => {
    axios
      .delete(`${url}/bands/${id}?uid=${authUser}`)
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        setMessage(error.response.data.message);
      });
  };

  return (
    <div className='container'>
      {band && (
        <>
          <div className='row mt-3'>
            <div className='col-10'>
              <h2>Banda: {band.nombre}</h2>
            </div>
            <div className='col-2'>
              <Link
                to={`/band/edit/${band.id}`}
                className='btn btn-warning m-1'
              >
                Editar
              </Link>
              <button
                className='btn btn-danger'
                onClick={() => {
                  deleteBand(band.id);
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
                    <th>ID</th>
                    <td>{band.id}</td>
                    <th>Fundador</th>
                    <td>
                      <Link to={`/musician/${band.fundador.usuario}`}>
                        {band.fundador.usuario}
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <th>Nombre</th>
                    <td>{band.nombre}</td>
                    <th>Fecha fundación</th>
                    <td>
                      {moment(band.fechaFundacion).format('DD')}{' '}
                      {moment(band.fechaFundacion).format('MMM')}{' '}
                      {moment(band.fechaFundacion).format('YYYY')}
                    </td>
                  </tr>
                  <tr>
                    <th>Fans</th>
                    <td>{band.fans}</td>
                    <th>Actuaciones</th>
                    <td>{band.actuaciones}</td>
                  </tr>
                  <tr>
                    <th>Miembros</th>
                    <td>{band.miembros.length}</td>
                    <th>Aplicaciones</th>
                    <td>{band.aplicaciones.length}</td>
                  </tr>
                  <tr>
                    <th>Nivel</th>
                    <td>{band.nivel}</td>
                    <th>Descripción</th>
                    <td>{band.descripcion ?? '-'}</td>
                  </tr>
                  <tr>
                    <th>Instrumentos</th>
                    <td>
                      {band.instrumentos.map((instrumento, index) => (
                        <span key={index}>
                          {instrumento}
                          {index !== band.instrumentos.length - 1 ? ', ' : '.'}
                        </span>
                      ))}
                    </td>
                    <th>Géneros</th>
                    <td>
                      {band.generos.map((genero, index) => (
                        <span key={index}>
                          {genero}
                          {index !== band.generos.length - 1 ? ', ' : '.'}
                        </span>
                      ))}
                    </td>
                  </tr>
                  <tr>
                    <th>Imagen perfil</th>
                    <td>
                      <a
                        href={band.imagenPerfil}
                        target='_blank'
                        rel='noreferrer'
                      >
                        {band.imagenPerfil}
                      </a>
                    </td>
                    <th>Imagen fondo</th>
                    <td>
                      <a
                        href={band.imagenFondo}
                        target='_blank'
                        rel='noreferrer'
                      >
                        {band.imagenFondo}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <th>Ciudad</th>
                    <td>{band.ciudad}</td>
                    <th>Valoración</th>
                    <td>{band.valoracion} / 5</td>
                  </tr>
                  <tr>
                    <th>Ubicación</th>
                    <td colSpan='3'>
                      <div style={{ height: '200px', width: '100%' }}>
                        <GoogleMapReact
                          bootstrapURLKeys={{
                            key: process.env.REACT_APP_MAPS_API_KEY,
                          }}
                          defaultCenter={{
                            lat: band.ubicacion.latitude,
                            lng: band.ubicacion.longitude,
                          }}
                          defaultZoom={11}
                        >
                          <Location
                            lat={band.ubicacion.latitude}
                            lng={band.ubicacion.longitude}
                            text='My Marker'
                            color={'#ff0000'}
                            title={band.ciudad}
                            height='30px'
                            width='30px'
                            style={{ cursor: 'pointer' }}
                            onClick={() =>
                              window.open(
                                `http://www.google.com/maps/place/${band.ubicacion.latitude},${band.ubicacion.longitude}`,
                                '_blank'
                              )
                            }
                          />
                        </GoogleMapReact>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      <div className='row mt-2'>
        <div className='col'>
          {message !== '' && (
            <div
              className='alert alert-danger alert-dismissible fade show'
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
  );
}

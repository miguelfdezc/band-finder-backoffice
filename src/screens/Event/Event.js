import React, { useState, useEffect } from 'react';
import 'moment/locale/es';
import Global from '../../Global';
import axios from 'axios';
import { useParams, useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import moment from 'moment';

export default function Event() {
  let url = Global.url;

  const history = useHistory();

  const authUser = useSelector((state) => state.auth.authUser);

  const [message, setMessage] = useState('');
  const [event, setEvent] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`${url}/events/${id}`)
      .then((response) => {
        setEvent(response.data.event);
      })
      .catch((error) => {
        setMessage(error.response.data.message);
      });
    // eslint-disable-next-line
  }, [id, url]);

  const deleteEvent = (id) => {
    axios
      .delete(`${url}/events/${id}?uid=${authUser}`)
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        setMessage(error.response.data.message);
      });
  };

  return (
    <div className='container'>
      {event && (
        <>
          <div className='row mt-3'>
            <div className='col-10'>
              <h2>Evento: {event.titulo}</h2>
            </div>
            <div className='col-2'>
              <Link
                to={`/event/edit/${event.id}`}
                className='btn btn-warning m-1'
              >
                Editar
              </Link>
              <button
                className='btn btn-danger'
                onClick={() => {
                  deleteEvent(event.id);
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
                    <td>{event.id}</td>
                    <th>Usuario</th>
                    <td>
                      <Link to={`/business/${event.usuario}`}>
                        {event.usuario}
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <th>Título</th>
                    <td>{event.titulo}</td>
                    <th>Imagen</th>
                    <td>
                      <a href={event.imagen} target='_blank' rel='noreferrer'>
                        {event.imagen}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <th>Fecha inicio</th>
                    <td>
                      {moment(event.fechaInicio).format('DD')}{' '}
                      {moment(event.fechaInicio).format('MMM')}{' '}
                      {moment(event.fechaInicio).format('YYYY')}
                    </td>
                    <th>Hora inicio</th>
                    <td>{moment(event.horaInicio).format('HH:mm')}</td>
                  </tr>
                  <tr>
                    <th>Fecha fin</th>
                    <td>
                      {moment(event.fechaFin).format('DD')}{' '}
                      {moment(event.fechaFin).format('MMM')}{' '}
                      {moment(event.fechaInicio).format('YYYY')}
                    </td>
                    <th>Hora fin</th>
                    <td>{moment(event.horaFin).format('HH:mm')}</td>
                  </tr>
                  <tr>
                    <th>Ubicación</th>
                    <td>{event.ubicacion}</td>
                    <th>Tipo</th>
                    <td>{event.tipo}</td>
                  </tr>
                  <tr>
                    <th>Descripción</th>
                    <td>{event.descripcion ?? '-'}</td>
                    <th>Asistentes</th>
                    <td>{event.asistentes.length}</td>
                  </tr>
                  <tr>
                    <th>Fechas</th>
                    <td colSpan='3'>
                      {event.fechas.map((fecha, index) => (
                        <span key={index}>
                          {moment(
                            Math.round(
                              fecha['_seconds'] +
                                fecha['_nanoseconds'] / 1000000000
                            ) * 1000
                          ).format('DD/MM/YYYY')}
                          {index !== event.fechas.length - 1 ? ', ' : '.'}
                        </span>
                      ))}
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

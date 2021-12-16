import React, { useState, useEffect } from 'react';
import { firebase, storage } from '../../config';
import Global from '../../Global';
import axios from 'axios';
import { useHistory, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { useForm } from 'react-hook-form';

export default function ManageEvent() {
  const url = Global.url;

  const history = useHistory();

  const authUser = useSelector((state) => state.auth.authUser);

  const [event, setEvent] = useState({
    imagen: '',
    tipo: 'puntual',
    fechaInicio: moment().format('YYYY-MM-DD'),
    fechaFin: moment().format('YYYY-MM-DD'),
    horaInicio: moment().toISOString(),
    horaFin: moment().toISOString(),
  });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  const { id } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });

  const onFormSubmit = async () => {
    try {
      if (id) {
        axios
          .put(`${url}/events/${id}?uid=${authUser}`, event)
          .then((response) => {
            setEvent(response.data.event);
            history.push('/events');
          })
          .catch((error) => {
            setError(error.message);
            console.error('Ha habido un error!', error);
          });
      } else {
        axios
          .post(`${url}/events`, event)
          .then((response) => {
            setEvent(response.data.event);
            history.push('/events');
          })
          .catch((error) => {
            setError(error.message);
            console.error('Ha habido un error!', error);
          });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const onErrors = (errors) => setError(errors.message);

  const registerOptions = {
    titulo: {
      required: 'Título es obligatorio',
      maxLength: {
        value: 30,
        message: 'Título debe tener como máximo 30 caracteres',
      },
    },
    ubicacion: {
      required: 'Ubicación es obligatorio',
      maxLength: {
        value: 50,
        message: 'Ubicación debe tener como máximo 50 caracteres',
      },
    },
    fechaFin: {
      validate: {
        greaterThanStart: (value) => {
          let inicio = new Date(event.fechaInicio);
          let fin = new Date(value);
          return fin.getTime() >= inicio.getTime();
        },
      },
    },
    descripcion: {
      maxLength: {
        value: 150,
        message: 'Descripción debe tener como máximo 150 caracteres',
      },
    },
  };

  useEffect(() => {
    axios
      .get(`${url}/users/collection/negocios?uid=${authUser}`)
      .then((response) => {
        setUsers(response.data.users);
      })
      .catch((error) => {
        setError(error.message);
        console.error('Ha habido un error!', error);
      });
    if (id) {
      axios
        .get(`${url}/events/${id}`)
        .then((response) => {
          setEvent(response.data.event);
        })
        .catch((error) => {
          setError(error.message);
          console.error('Ha habido un error!', error);
        });
    }
    // eslint-disable-next-line
  }, [id, url]);

  useEffect(() => {
    if (users && users.length > 0) {
      if (!event.usuario) {
        setEvent({ ...event, usuario: users[0].uid });
      }
    }
    // eslint-disable-next-line
  }, [users]);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      let file = e.target.files[0];
      var storageRef = storage.ref();
      var uploadTask = storageRef.child(`events/${id}`).put(file);

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
              setEvent({ ...event, imagen: url });
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
          <h2>{id ? 'Editar' : 'Crear'} Evento</h2>
        </div>
      </div>
      {event && (
        <form onSubmit={handleSubmit(onFormSubmit, onErrors)}>
          <div className='row'>
            <div className='col'>
              <div className='form-group'>
                <label htmlFor='usuario' className=''>
                  Usuario
                </label>
                <br />
                <select
                  className='form-control'
                  aria-label='usuario'
                  onChange={(e) =>
                    setEvent({ ...event, usuario: e.target.value })
                  }
                  value={event.usuario}
                >
                  {users.map((opt, index) => (
                    <option key={index} value={opt.uid}>
                      {opt.uid} - {opt.email}
                    </option>
                  ))}
                </select>
              </div>
              <div className='form-group'>
                <label htmlFor='tipo' className=''>
                  Tipo
                </label>
                <br />
                <select
                  className='form-control'
                  aria-label='tipo'
                  onChange={(e) => setEvent({ ...event, tipo: e.target.value })}
                  value={event.tipo}
                >
                  <option value='puntual'>Puntual</option>
                  <option value='diario'>Diario</option>
                  <option value='semanal'>Semanal</option>
                  <option value='mensual'>Mensual</option>
                </select>
              </div>
              <div className='form-group'>
                <label htmlFor='fechaInicio' className=''>
                  Fecha inicio
                </label>
                <input
                  id='fechaInicio'
                  className='form-control'
                  name='fechaInicio'
                  type='date'
                  value={moment(event.fechaInicio).format('YYYY-MM-DD')}
                  onChange={(e) =>
                    setEvent({ ...event, fechaInicio: e.target.value })
                  }
                />
              </div>
              <div className='form-group'>
                <label htmlFor='fechaFin' className=''>
                  Fecha fin
                </label>
                {((id && event.fechaInicio && event.fechaInicio.length > 0) ||
                  !id) && (
                  <input
                    id='fechaFin'
                    {...register('fechaFin', registerOptions.fechaFin)}
                    className='form-control'
                    name='fechaFin'
                    type='date'
                    min={moment(event.fechaInicio).format('YYYY-MM-DD')}
                    value={moment(event.fechaFin).format('YYYY-MM-DD')}
                    onChange={(e) =>
                      setEvent({ ...event, fechaFin: e.target.value })
                    }
                  />
                )}
                <small className='text-danger'>
                  {errors.fechaFin &&
                    'Fecha fin tiene que ser posterior a fecha inicio'}
                </small>
              </div>
              <div className='form-group'>
                <label htmlFor='imagen' className=''>
                  Imagen
                </label>
                <br />
                <div className='row'>
                  {event.imagen && event.imagen.length > 0 && (
                    <div className='col'>
                      <img
                        src={event.imagen}
                        style={{ height: '100px', width: '100px' }}
                        alt='Imagen Evento'
                      />
                    </div>
                  )}
                  <div className='col align-self-center'>
                    <input
                      type='file'
                      id='imagen'
                      onChange={(e) => {
                        e.preventDefault();
                        handleChange(e);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className='col'>
              <div className='form-group'>
                <label htmlFor='titulo' className=''>
                  Título
                </label>
                <input
                  id='titulo'
                  {...register('titulo', registerOptions.titulo)}
                  className='form-control'
                  name='titulo'
                  placeholder='Título del evento...'
                  type='text'
                  value={event.titulo ?? ''}
                  onChange={(e) =>
                    setEvent({ ...event, titulo: e.target.value })
                  }
                />
                <small className='text-danger'>
                  {errors.titulo && errors.titulo.message}
                </small>
              </div>
              <div className='form-group'>
                <label htmlFor='ubicacion' className=''>
                  Ubicación
                </label>
                <input
                  id='ubicacion'
                  {...register('ubicacion', registerOptions.ubicacion)}
                  className='form-control'
                  name='ubicacion'
                  placeholder='Calle, número'
                  type='text'
                  value={event.ubicacion ?? ''}
                  onChange={(e) =>
                    setEvent({ ...event, ubicacion: e.target.value })
                  }
                />
                <small className='text-danger'>
                  {errors.ubicacion && errors.ubicacion.message}
                </small>
              </div>
              <div className='form-group'>
                <label htmlFor='horaInicio' className=''>
                  Hora inicio
                </label>
                <input
                  id='horaInicio'
                  className='form-control'
                  name='horaInicio'
                  type='time'
                  value={moment(event.horaInicio).format('HH:mm')}
                  onChange={(e) =>
                    setEvent({
                      ...event,
                      horaInicio: moment(e.target.value, 'HH:mm')
                        .toDate()
                        .toISOString(),
                    })
                  }
                />
              </div>
              <div className='form-group'>
                <label htmlFor='horaFin' className=''>
                  Hora fin
                </label>
                <input
                  id='horaFin'
                  className='form-control'
                  name='horaFin'
                  type='time'
                  value={moment(event.horaFin).format('HH:mm')}
                  onChange={(e) =>
                    setEvent({
                      ...event,
                      horaFin: moment(e.target.value, 'HH:mm')
                        .toDate()
                        .toISOString(),
                    })
                  }
                />
              </div>
              <div className='form-group'>
                <label htmlFor='descripcion' className=''>
                  Descripción
                </label>
                <textarea
                  id='descripcion'
                  {...register('descripcion', registerOptions.descripcion)}
                  className='form-control'
                  name='descripcion'
                  placeholder='Descripción...'
                  value={event.descripcion ?? ''}
                  onChange={(e) =>
                    setEvent({ ...event, descripcion: e.target.value })
                  }
                />
                <small className='text-danger'>
                  {errors.descripcion && errors.descripcion.message}
                </small>
              </div>
            </div>
          </div>
          <button
            type='submit'
            className={`btn btn-${id ? 'warning' : 'success'} btn-block`}
            onClick={handleSubmit(onFormSubmit, onErrors)}
          >
            {id && event.id ? 'Editar' : 'Crear'}
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

import React, { useState, useEffect } from 'react';
import { firebase, storage } from '../../config';
import Global from '../../Global';
import axios from 'axios';
import { useHistory, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import moment from 'moment';
import * as genres_es from '../../assets/data/genres_es.json';
import * as instruments_es from '../../assets/data/instruments_es.json';
import { Add, Location } from 'react-ionicons';
import GoogleMapReact from 'google-map-react';
import { useForm } from 'react-hook-form';

export default function ManageBand() {
  const url = Global.url;

  const history = useHistory();

  const authUser = useSelector((state) => state.auth.authUser);

  const [band, setBand] = useState({
    usuario: '',
    nombre: '',
    descripcion: '',
    nivel: 'principiante',
    fechaFundacion: new Date(),
    ubicacion: {
      longitude: 0,
      latitude: 0,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    ciudad: '',
    generos: [],
    instrumentos: [],
    imagenPerfil: '',
    imagenFondo: '',
    actuaciones: 0,
    valoracion: 0.0,
    fans: 0,
  });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  const [allGenres, setAllGenres] = useState([]);
  const [genres, setGenres] = useState([]);

  const [allInstruments, setAllInstruments] = useState([]);
  const [instruments, setInstruments] = useState([]);

  const [genero, setGenero] = useState(genres[0] ? genres[0].key : '');
  const [instrumento, setInstrumento] = useState(
    instruments[0] ? instruments[0].key : ''
  );

  useEffect(() => {
    if (genres[0]) setGenero(genres[0].key);
  }, [genres]);

  useEffect(() => {
    if (instruments[0]) setInstrumento(instruments[0].key);
  }, [instruments]);

  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });

  const { id } = useParams();

  useEffect(() => {
    setAllGenres(genres_es.genres);
    setAllInstruments(instruments_es.instruments);
    navigator.geolocation.getCurrentPosition(function (position) {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setGenres(genres_es.genres.filter((g) => !band.generos.includes(g.key)));
    setInstruments(
      instruments_es.instruments.filter(
        (i) => !band.instrumentos.includes(i.key)
      )
    );
    // eslint-disable-next-line
  }, [band.generos, band.instrumentos]);

  useEffect(() => {
    axios
      .get(`${url}/users/collection/musicos?uid=${authUser}`)
      .then((response) => {
        setUsers(response.data.users);
      })
      .catch((error) => {
        setError(error.message);
        console.error('Ha habido un error!', error);
      });
    if (id) {
      axios
        .get(`${url}/bands/${id}`)
        .then((response) => {
          setBand(response.data.band);
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
      if (!band.usuario) {
        setBand({ ...band, usuario: users[0].uid });
      }
    }
    // eslint-disable-next-line
  }, [users]);

  const handleChange = (e, type) => {
    if (e.target.files[0]) {
      let file = e.target.files[0];
      var storageRef = storage.ref();
      var uploadTask = storageRef.child(`bands/${id}`).put(file);

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
              if (type === 'imagenPerfil') setBand({ ...band, photoURL: url });
              else if (type === 'imagenFondo')
                setBand({ ...band, imagenFondo: url });
            })
            .catch((e) => setError(e));
          // document.getElementById('file').value = null;
        }
      );
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });

  const onFormSubmit = async () => {
    try {
      if (id) {
        axios
          .put(`${url}/bands/${id}?uid=${authUser}`, band)
          .then((response) => {
            setBand(response.data.band);
            history.push('/bands');
          })
          .catch((error) => {
            setError(error.message);
            console.error('Ha habido un error!', error);
          });
      } else {
        axios
          .post(`${url}/bands`, band)
          .then((response) => {
            setBand(response.data.band);
            history.push('/bands');
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
    nombre: {
      required: 'Nombre es obligatorio',
      maxLength: {
        value: 30,
        message: 'Nombre debe tener como máximo 30 caracteres',
      },
    },
    ciudad: {
      required: 'Ciudad es obligatoria',
      maxLength: {
        value: 30,
        message: 'Ciudad debe tener como máximo 30 caracteres',
      },
    },
    descripcion: {
      maxLength: {
        value: 150,
        message: 'Descripción debe tener como máximo 150 caracteres',
      },
    },
  };

  return (
    <div className='container'>
      <div className='row justify-content-center mb-3'>
        <div className='col-auto'>
          <h2>{id ? 'Editar' : 'Crear'} Banda</h2>
        </div>
      </div>
      {band && (
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
                    setBand({ ...band, usuario: e.target.value })
                  }
                  value={band.usuario}
                >
                  {users.map((opt, index) => (
                    <option key={index} value={opt.uid}>
                      {opt.uid} - {opt.email}
                    </option>
                  ))}
                </select>
              </div>
              <div className='form-group'>
                <label htmlFor='nivel' className=''>
                  Nivel
                </label>
                <br />
                <select
                  className='form-control'
                  aria-label='nivel'
                  onChange={(e) => setBand({ ...band, nivel: e.target.value })}
                  value={band.nivel}
                >
                  <option value='principiante'>Principiante</option>
                  <option value='intermedio'>Intermedio</option>
                  <option value='avanzado'>Avanzado</option>
                </select>
              </div>
              <div className='form-group'>
                <label htmlFor='fechaFundacion' className=''>
                  Fecha fundación
                </label>
                <input
                  id='fechaFundacion'
                  className='form-control'
                  name='fechaFundacion'
                  type='date'
                  value={moment(band.fechaFundacion).format('YYYY-MM-DD')}
                  onChange={(e) =>
                    setBand({ ...band, fechaFundacion: e.target.value })
                  }
                />
              </div>
              <div className='form-group'>
                <label htmlFor='imagenPerfil' className=''>
                  Imagen perfil
                </label>
                <br />
                <div className='row'>
                  {band.imagenPerfil && band.imagenPerfil.length > 0 && (
                    <div className='col'>
                      <img
                        src={band.imagenPerfil}
                        style={{ height: '100px', width: '100px' }}
                        alt='Imagen Perfil Banda'
                      />
                    </div>
                  )}
                  <div className='col align-self-center'>
                    <input
                      type='file'
                      id='imagenPerfil'
                      onChange={(e) => {
                        e.preventDefault();
                        handleChange(e, 'imagenPerfil');
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className='form-group'>
                <label htmlFor='imagenFondo' className=''>
                  Imagen fondo
                </label>
                <br />
                <div className='row'>
                  {band.imagenFondo && band.imagenFondo.length > 0 && (
                    <div className='col'>
                      <img
                        src={band.imagenFondo}
                        style={{ height: '100px', width: '100px' }}
                        alt='Imagen Fondo Banda'
                      />
                    </div>
                  )}
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
              {((id &&
                band.ubicacion &&
                Object.keys(band.ubicacion).length !== 0 &&
                band.ubicacion.latitude !== 0) ||
                (!id && location.latitude !== 0)) && (
                <div
                  className='form-group'
                  style={{ height: '200px', width: '100%' }}
                >
                  <GoogleMapReact
                    bootstrapURLKeys={{
                      key: process.env.REACT_APP_MAPS_API_KEY,
                    }}
                    defaultZoom={11}
                    defaultCenter={{
                      lat: id ? band.ubicacion.latitude : location.latitude,
                      lng: id ? band.ubicacion.longitude : location.longitude,
                    }}
                    onClick={(e) => {
                      setBand({
                        ...band,
                        ubicacion: {
                          ...band.ubicacion,
                          latitude: e.lat,
                          longitude: e.lng,
                        },
                      });
                    }}
                  >
                    <Location
                      lat={id ? band.ubicacion.latitude : location.latitude}
                      lng={id ? band.ubicacion.longitude : location.longitude}
                      color={'#ff0000'}
                      title={band.ciudad}
                      height='30px'
                      width='30px'
                      style={{ cursor: 'pointer' }}
                      onClick={() =>
                        window.open(
                          `http://www.google.com/maps/place/${
                            id ? band.ubicacion.latitude : location.latitude
                          },${
                            id ? band.ubicacion.longitude : location.longitude
                          }`,
                          '_blank'
                        )
                      }
                    />
                  </GoogleMapReact>
                </div>
              )}
            </div>
            <div className='col'>
              <div className='form-group'>
                <label htmlFor='nombre' className=''>
                  Nombre
                </label>
                <input
                  id='nombre'
                  {...register('nombre', registerOptions.nombre)}
                  className='form-control'
                  name='nombre'
                  placeholder='Nombre de la banda...'
                  type='text'
                  value={band.nombre ?? ''}
                  onChange={(e) => setBand({ ...band, nombre: e.target.value })}
                />
                <small className='text-danger'>
                  {errors.nombre && errors.nombre.message}
                </small>
              </div>
              <div className='form-group'>
                <label htmlFor='ciudad' className=''>
                  Ciudad
                </label>
                <input
                  id='ciudad'
                  {...register('ciudad', registerOptions.ciudad)}
                  className='form-control'
                  name='ciudad'
                  placeholder='Ciudad, País'
                  type='text'
                  value={band.ciudad ?? ''}
                  onChange={(e) => setBand({ ...band, ciudad: e.target.value })}
                />
                <small className='text-danger'>
                  {errors.ciudad && errors.ciudad.message}
                </small>
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
                  value={band.descripcion ?? ''}
                  onChange={(e) =>
                    setBand({ ...band, descripcion: e.target.value })
                  }
                />
                <small className='text-danger'>
                  {errors.descripcion && errors.descripcion.message}
                </small>
              </div>
              {id && (
                <>
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
                      min='0'
                      value={band.actuaciones}
                      onChange={(e) =>
                        setBand({ ...band, actuaciones: e.target.value })
                      }
                      disabled
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
                      min='0'
                      value={band.fans}
                      onChange={(e) =>
                        setBand({ ...band, fans: e.target.value })
                      }
                      disabled
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
                      min='0'
                      max='5'
                      step='0.1'
                      value={band.valoracion}
                      onChange={(e) =>
                        setBand({ ...band, valoracion: e.target.value })
                      }
                      disabled
                    />
                  </div>
                </>
              )}
              <div className='form-group'>
                <label htmlFor='instrumentos' className=''>
                  Instrumentos
                </label>
                <br />
                {band.instrumentos && band.instrumentos.length > 0 && (
                  <>
                    {band.instrumentos.map((instrumento, index) => (
                      <span key={index}>
                        {
                          allInstruments.find(
                            (value) => value.key === instrumento
                          ).title
                        }
                        {index !== band.instrumentos.length - 1 ? ', ' : '.'}
                      </span>
                    ))}
                  </>
                )}
                <div className='input-group'>
                  <select
                    className='form-control'
                    aria-label='instrumentos'
                    onChange={(e) => setInstrumento(e.target.value)}
                  >
                    {instruments.map((value, index) => (
                      <option key={index} value={value.key}>
                        {value.title}
                      </option>
                    ))}
                  </select>
                  <div className='input-group-append'>
                    <button className='btn btn-success'>
                      <Add
                        color={'#FFF'}
                        height='20px'
                        width='20px'
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => {
                          e.preventDefault();
                          setBand({
                            ...band,
                            instrumentos: [...band.instrumentos, instrumento],
                          });
                        }}
                      />
                    </button>
                  </div>
                </div>
              </div>
              <div className='form-group'>
                <label htmlFor='generos' className=''>
                  Géneros
                </label>
                <br />
                {band.generos && band.generos.length > 0 && (
                  <>
                    {band.generos.map((genero, index) => (
                      <span key={index}>
                        {allGenres.find((value) => value.key === genero).title}
                        {index !== band.generos.length - 1 ? ', ' : '.'}
                      </span>
                    ))}
                  </>
                )}
                <div className='input-group'>
                  <select
                    className='form-control'
                    aria-label='generos'
                    onChange={(e) => setGenero(e.target.value)}
                  >
                    {genres.map((value, index) => (
                      <option key={index} value={value.key}>
                        {value.title}
                      </option>
                    ))}
                  </select>
                  <div className='input-group-append'>
                    <button className='btn btn-success'>
                      <Add
                        color={'#FFF'}
                        height='20px'
                        width='20px'
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => {
                          e.preventDefault();
                          setBand({
                            ...band,
                            generos: [...band.generos, genero],
                          });
                        }}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            type='submit'
            className={`btn btn-${id ? 'warning' : 'success'} btn-block`}
            onClick={handleSubmit(onFormSubmit, onErrors)}
          >
            {id && band.id ? 'Editar' : 'Crear'}
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

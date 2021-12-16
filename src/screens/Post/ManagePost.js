import React, { useState, useEffect } from 'react';
import { firebase, storage } from '../../config';
import Global from '../../Global';
import axios from 'axios';
import { useHistory, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

export default function ManagePost() {
  const url = Global.url;

  const history = useHistory();

  const authUser = useSelector((state) => state.auth.authUser);

  const [post, setPost] = useState({ imagen: '', video: '' });
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
          .put(`${url}/posts/${id}?uid=${authUser}`, post)
          .then((response) => {
            setPost(response.data.post);
            history.push('/posts');
          })
          .catch((error) => {
            setError(error.message);
            console.error('Ha habido un error!', error);
          });
      } else {
        axios
          .post(`${url}/posts`, post)
          .then((response) => {
            setPost(response.data.post);
            history.push('/posts');
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
    descripcion: {
      maxLength: {
        value: 150,
        message: 'Descripción debe tener como máximo 150 caracteres',
      },
    },
  };

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
        .get(`${url}/posts/${id}`)
        .then((response) => {
          setPost(response.data.post);
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
      if (!post.usuario) {
        setPost({ ...post, usuario: users[0].uid });
      }
    }
    // eslint-disable-next-line
  }, [users]);

  const handleChange = (e, type) => {
    if (e.target.files[0]) {
      let file = e.target.files[0];
      var storageRef = storage.ref();
      var uploadTask = storageRef.child(`posts/${id}/${type}`).put(file);

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
              if (type === 'imagen')
                setPost({ ...post, imagen: url, video: '' });
              else if (type === 'video')
                setPost({ ...post, video: url, imagen: '' });
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
          <h2>{id ? 'Editar' : 'Crear'} Publicación</h2>
        </div>
      </div>
      {post && (
        <form onSubmit={handleSubmit(onFormSubmit, onErrors)}>
          <div className='row'>
            <div className='col'>
              <div className='form-group'>
                <label htmlFor='usuario' className=''>
                  Usuario
                </label>
                <select
                  className='form-control'
                  aria-label='usuario'
                  onChange={(e) =>
                    setPost({ ...post, usuario: e.target.value })
                  }
                  value={post.usuario}
                >
                  {users.map((opt, index) => (
                    <option key={index} value={opt.uid}>
                      {opt.uid} - {opt.email}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='col'>
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
                  value={post.descripcion ?? ''}
                  onChange={(e) =>
                    setPost({ ...post, descripcion: e.target.value })
                  }
                />
                <small className='text-danger'>
                  {errors.descripcion && errors.descripcion.message}
                </small>
              </div>
            </div>
            <div className='row'>
              <div className='col'>
                <div className='form-group'>
                  <label htmlFor='imagen' className=''>
                    Imagen
                  </label>
                  <br />
                  <div className='row'>
                    {post.imagen && post.imagen.length > 0 && (
                      <div className='col'>
                        <img
                          src={post.imagen}
                          style={{ height: '100px', width: '100px' }}
                          alt='Imagen Publicación'
                        />
                      </div>
                    )}
                    <div className='col align-self-center'>
                      <input
                        type='file'
                        id='imagen'
                        onChange={(e) => {
                          e.preventDefault();
                          handleChange(e, 'imagen');
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className='col'>
                <div className='form-group'>
                  <label htmlFor='video' className=''>
                    Video
                  </label>
                  <br />
                  <div className='row'>
                    {post.video && post.video.length > 0 && (
                      <div className='col'>
                        <video
                          style={{
                            maxWidth: '100%',
                            height: 'auto',
                            maxHeight: '100%',
                          }}
                          autoPlay
                          muted
                          controls
                        >
                          <source src={post.video} type='video/mp4' />
                        </video>
                      </div>
                    )}
                    <div className='col align-self-center'>
                      <input
                        type='file'
                        id='video'
                        onChange={(e) => {
                          e.preventDefault();
                          handleChange(e, 'video');
                        }}
                      />
                    </div>
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
            {id && post.id ? 'Editar' : 'Crear'}
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

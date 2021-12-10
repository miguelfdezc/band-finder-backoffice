import React, { useState, useEffect } from 'react';
import 'moment/locale/es';
import Global from '../../Global';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import '../../assets/css/musicians.css';
// import Pagination from 'react-bootstrap/Pagination';
import { useSelector } from 'react-redux';

export default function Posts() {
  let url = Global.url;

  const authUser = useSelector((state) => state.auth.authUser);

  const [message, setMessage] = useState('');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get(`${url}/posts`)
      .then((response) => {
        setPosts(response.data.posts);
      })
      .catch((error) => {
        setMessage(error.message);
        console.error('Ha habido un error!', error);
      });
    // eslint-disable-next-line
  }, []);

  const deletePost = (id) => {
    axios
      .delete(`${url}/posts/${id}?uid=${authUser}`)
      .then((response) => {
        setMessage(response.data.message);
        setPosts(posts.filter((p) => p.id !== id));
      })
      .catch((error) => {
        setMessage(error.message);
        console.error('Ha habido un error!', error);
      });
  };

  return (
    <>
      {posts.length > 0 && (
        <div className='container' style={{ height: 'calc(100vh - 120px)' }}>
          <div className='row mt-3'>
            <div className='col-11'>
              <h2>Listado de publicaciones</h2>
            </div>
            <div className='col-1'>
              <Link to='/post' className='btn btn-success'>
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
                    <th className='col-3'>Usuario</th>
                    <th className='col-1'>Comentarios</th>
                    <th className='col-1'>Compartido</th>
                    <th className='col-2'>Me gusta</th>
                    <th className='col-3' colSpan='3'>
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post, index) => (
                    <tr key={index}>
                      <td className='col-2'>{post.id}</td>
                      <td className='col-3'>
                        <Link to={`/musician/${post.usuario}`}>
                          {post.usuario}
                        </Link>
                      </td>
                      <td className='col-1'>{post.comentarios.length}</td>
                      <td className='col-1'>{post.shared}</td>
                      <td className='col-2'>{post.likes.length}</td>
                      <td className='col-1'>
                        <Link
                          to={`/post/${post.id}`}
                          style={{ color: '#17a2b8' }}
                        >
                          Ver
                        </Link>
                      </td>
                      <td className='col-1'>
                        <Link
                          to={`/post/edit/${post.id}`}
                          style={{ color: '#ffc107' }}
                        >
                          Editar
                        </Link>
                      </td>
                      <td className='col-1'>
                        <span
                          className='text-danger'
                          onClick={() => deletePost(post.id)}
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

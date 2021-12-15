import React, { useState, useEffect } from 'react';
import 'moment/locale/es';
import Global from '../../Global';
import axios from 'axios';
import { useParams, useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Post() {
  let url = Global.url;

  const history = useHistory();

  const authUser = useSelector((state) => state.auth.authUser);

  const [message, setMessage] = useState('');
  const [post, setPost] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`${url}/posts/${id}`)
      .then((response) => {
        setPost(response.data.post);
      })
      .catch((error) => {
        setMessage(error.response.data.message);
      });
    // eslint-disable-next-line
  }, [id, url]);

  const deletePost = (id) => {
    axios
      .delete(`${url}/posts/${id}?uid=${authUser}`)
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        setMessage(error.response.data.message);
      });
  };

  return (
    <div className='container'>
      {post && (
        <>
          <div className='row mt-3'>
            <div className='col-10'>
              <h2>Publicación</h2>
            </div>
            <div className='col-2'>
              <Link
                to={`/post/edit/${post.id}`}
                className='btn btn-warning m-1'
              >
                Editar
              </Link>
              <button
                className='btn btn-danger'
                onClick={() => {
                  deletePost(post.id);
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
                    <td>{post.id}</td>
                    <th>Usuario</th>
                    <td>
                      <Link to={`/musician/${post.usuario}`}>
                        {post.usuario}
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <th>Compartido</th>
                    <td>{post.shared}</td>
                    <th>{post.video.length > 0 ? 'Video' : 'Imagen'}</th>
                    <td>
                      <a
                        href={post.video.length > 0 ? post.video : post.imagen}
                      >
                        {post.video.length > 0 ? post.video : post.imagen}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <th>Me gusta</th>
                    <td>{post.likes.length > 0 ? post.likes.length : 0}</td>
                    <th>Comentarios</th>
                    <td>{post.comentarios.length}</td>
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

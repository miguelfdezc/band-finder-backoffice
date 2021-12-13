import React, { useState, useEffect } from 'react';
import 'moment/locale/es';
import Global from '../../Global';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import '../../assets/css/musicians.css';
// import Pagination from 'react-bootstrap/Pagination';
import { useSelector } from 'react-redux';
import Pagination from '../../components/Pagination';

export default function Posts() {
  let url = Global.url;

  const authUser = useSelector((state) => state.auth.authUser);

  const [message, setMessage] = useState('');
  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);

  const [length, setLength] = useState(0);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const responseLength = await axios.get(`${url}/length/posts`);

        setLength(responseLength.data.length);

        const responsePosts = await axios.get(
          `${url}/posts?offset=${
            (currentPage - 1) * postsPerPage
          }&limit=${postsPerPage}`
        );
        setPosts(responsePosts.data.posts);

        setLoading(false);
      } catch (error) {
        setMessage(error.message);
        console.error('Ha habido un error!', error);
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    setLoading(true);
    axios
      .get(
        `${url}/posts?offset=${
          (currentPage - 1) * postsPerPage
        }&limit=${postsPerPage}`
      )
      .then((response) => {
        setPosts(response.data.posts);
        setLoading(false);
      })
      .catch((error) => {
        setMessage(error.message);
        console.error('Ha habido un error!', error);
        setLoading(false);
      });
  };

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
            <div className='col'>
              <h2>Listado de publicaciones</h2>
            </div>
            <div className='col'>
              <Pagination
                itemsPerPage={postsPerPage}
                totalItems={length}
                paginate={paginate}
                currentPage={currentPage}
                itemName={'musicians'}
              />
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
                  {loading ? (
                    <tr>
                      <td colSpan='6' className='center'>
                        Cargando publicaciones...
                      </td>
                    </tr>
                  ) : (
                    <>
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
                    </>
                  )}
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

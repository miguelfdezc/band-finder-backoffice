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

export default function Musicians() {
  let url = Global.url;

  const authUser = useSelector((state) => state.auth.authUser);

  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [musiciansPerPage] = useState(10);

  const [length, setLength] = useState(0);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const responseLength = await axios.get(`${url}/length/musicians`);

        setLength(responseLength.data.length);

        const responseMusicians = await axios.get(
          `${url}/users/collection/musicos?uid=${authUser}&offset=${
            (currentPage - 1) * musiciansPerPage
          }&limit=${musiciansPerPage}`
        );
        setUsers(responseMusicians.data.users);

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
        `${url}/users/collection/musicos?uid=${authUser}&offset=${
          (currentPage - 1) * musiciansPerPage
        }&limit=${musiciansPerPage}`
      )
      .then((response) => {
        setUsers(response.data.users);
        setLoading(false);
      })
      .catch((error) => {
        setMessage(error.message);
        console.error('Ha habido un error!', error);
        setLoading(false);
      });
  };

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
      {users.length > 0 && (
        <div className='container' style={{ height: 'calc(100vh - 120px)' }}>
          <div className='row mt-3'>
            <div className='col'>
              <h2>Listado de músicos</h2>
            </div>
            <div className='col'>
              <Pagination
                itemsPerPage={musiciansPerPage}
                totalItems={length}
                paginate={paginate}
                currentPage={currentPage}
                itemName={'musicians'}
              />
            </div>
            <div className='col-1'>
              <Link to='/musician' className='btn btn-success'>
                Crear
              </Link>
            </div>
          </div>

          <div className='row mt-3'>
            <div className='col musicians'>
              <table className='table table-striped'>
                <thead>
                  <tr>
                    <th className='col-4'>UID</th>
                    <th className='col-3'>Email</th>
                    <th className='col-2'>Usuario</th>
                    <th className='col-3' colSpan='3'>
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan='4' className='center'>
                        Cargando músicos...
                      </td>
                    </tr>
                  ) : (
                    <>
                      {users.map((user, index) => (
                        <tr key={index}>
                          <td className='col-4'>{user.uid}</td>
                          <td className='col-3'>
                            <a href={`mailto:${user.email}`}>{user.email}</a>
                          </td>
                          <td className='col-2'>{user.usuario}</td>
                          <td className='col-1'>
                            <Link
                              to={`/musician/${user.uid}`}
                              style={{ color: '#17a2b8' }}
                            >
                              Ver
                            </Link>
                          </td>
                          <td className='col-1'>
                            <Link
                              to={`/musician/edit/${user.uid}`}
                              style={{ color: '#ffc107' }}
                            >
                              Editar
                            </Link>
                          </td>
                          <td className='col-1'>
                            <span
                              className='text-danger'
                              onClick={() => deleteMusician(user.uid)}
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

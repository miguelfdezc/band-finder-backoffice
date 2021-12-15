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

export default function Bands() {
  let url = Global.url;

  const authUser = useSelector((state) => state.auth.authUser);

  const [message, setMessage] = useState('');
  const [bands, setBands] = useState([]);

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [bandsPerPage] = useState(10);

  const [length, setLength] = useState(0);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const responseLength = await axios.get(`${url}/length/bands`);

        setLength(responseLength.data.length);

        const responseBands = await axios.get(
          `${url}/bands?offset=${
            (currentPage - 1) * bandsPerPage
          }&limit=${bandsPerPage}`
        );
        setBands(responseBands.data.bands);

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
        `${url}/bands?offset=${
          (pageNumber - 1) * bandsPerPage
        }&limit=${bandsPerPage}`
      )
      .then((response) => {
        setBands(response.data.bands);
        setLoading(false);
      })
      .catch((error) => {
        setMessage(error.message);
        console.error('Ha habido un error!', error);
        setLoading(false);
      });
  };

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
          <div className='row mt-3 '>
            <div className='col'>
              <h2>Listado de bandas</h2>
            </div>
            <div className='col'>
              <Pagination
                itemsPerPage={bandsPerPage}
                totalItems={length}
                paginate={paginate}
                currentPage={currentPage}
                itemName={'bands'}
              />
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
                  {loading ? (
                    <tr>
                      <td colSpan='7' className='center'>
                        Cargando bandas...
                      </td>
                    </tr>
                  ) : (
                    <>
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

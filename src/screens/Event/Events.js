import React, { useState, useEffect } from 'react';
import 'moment/locale/es';
import Global from '../../Global';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import '../../assets/css/musicians.css';
// import Pagination from 'react-bootstrap/Pagination';
import { useSelector } from 'react-redux';
import moment from 'moment';
import Pagination from '../../components/Pagination';

export default function Events() {
  let url = Global.url;

  const authUser = useSelector((state) => state.auth.authUser);

  const [message, setMessage] = useState('');
  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(10);

  const [length, setLength] = useState(0);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const responseLength = await axios.get(`${url}/length/events`);

        setLength(responseLength.data.length);

        const responseEvents = await axios.get(
          `${url}/events?offset=${
            (currentPage - 1) * eventsPerPage
          }&limit=${eventsPerPage}`
        );
        setEvents(responseEvents.data.events);

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
        `${url}/events?offset=${
          (currentPage - 1) * eventsPerPage
        }&limit=${eventsPerPage}`
      )
      .then((response) => {
        setEvents(response.data.events);
        setLoading(false);
      })
      .catch((error) => {
        setMessage(error.message);
        console.error('Ha habido un error!', error);
        setLoading(false);
      });
  };

  const deleteEvent = (id) => {
    axios
      .delete(`${url}/events/${id}?uid=${authUser}`)
      .then((response) => {
        setMessage(response.data.message);
        setEvents(events.filter((p) => p.id !== id));
      })
      .catch((error) => {
        setMessage(error.message);
        console.error('Ha habido un error!', error);
      });
  };

  return (
    <>
      {events.length > 0 && (
        <div className='container' style={{ height: 'calc(100vh - 120px)' }}>
          <div className='row mt-3'>
            <div className='col'>
              <h2>Listado de eventos</h2>
            </div>
            <div className='col'>
              <Pagination
                itemsPerPage={eventsPerPage}
                totalItems={length}
                paginate={paginate}
                currentPage={currentPage}
                itemName={'musicians'}
              />
            </div>
            <div className='col-1'>
              <Link to='/event' className='btn btn-success'>
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
                    <th className='col-1'>Asistentes</th>
                    <th className='col-1'>Tipo</th>
                    <th className='col-2'>Fecha y hora</th>
                    <th className='col-3' colSpan='3'>
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan='6' className='center'>
                        Cargando eventos...
                      </td>
                    </tr>
                  ) : (
                    <>
                      {events.map((event, index) => (
                        <tr key={index}>
                          <td className='col-2'>{event.id}</td>
                          <td className='col-3'>
                            <Link to={`/business/${event.usuario}`}>
                              {event.usuario}
                            </Link>
                          </td>
                          <td className='col-1'>{event.asistentes.length}</td>
                          <td className='col-1'>{event.tipo}</td>
                          <td className='col-2'>
                            {moment(event.fechaInicio).format('DD')}{' '}
                            {moment(event.fechaInicio).format('MMM')}{' '}
                            {moment(event.horaInicio).format('HH:mm')}
                          </td>
                          <td className='col-1'>
                            <Link
                              to={`/event/${event.id}`}
                              style={{ color: '#17a2b8' }}
                            >
                              Ver
                            </Link>
                          </td>
                          <td className='col-1'>
                            <Link
                              to={`/event/edit/${event.id}`}
                              style={{ color: '#ffc107' }}
                            >
                              Editar
                            </Link>
                          </td>
                          <td className='col-1'>
                            <span
                              className='text-danger'
                              onClick={() => deleteEvent(event.id)}
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

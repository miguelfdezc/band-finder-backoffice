import React, { useState, useEffect } from 'react';
import 'moment/locale/es';
import Global from '../Global';
import axios from 'axios';

export default function Proceso1() {
  let url = Global.url;

  const [message, setMessage] = useState(null);

  useEffect(() => {
    axios
      .get(`${url}/holaMundo`)
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        setMessage(error.message);
        console.error('Ha habido un error!', error);
      });
  }, [url, message]);

  return (
    <div className='container-fluid'>
      <div className='row justify-content-center mt-3'>
        <div className='col-auto'>
          <h1>{message}</h1>
        </div>
      </div>
    </div>
  );
}

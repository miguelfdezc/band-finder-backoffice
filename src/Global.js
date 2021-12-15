const Global = {
  url:
    process.env.REACT_APP_ENV === 'production'
      ? 'https://band-finder-api.herokuapp.com/api'
      : 'http://localhost:8000/api',
};

export default Global;

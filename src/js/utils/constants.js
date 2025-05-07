// const MAIN_URL = window.location.origin;
const MAIN_URL = process.env.NODE_ENV == 'production' ? 'http://localhost:3000': 'http://localhost:3000';
export const USER_URL = MAIN_URL + '/api/users';
export const DATA_URL = MAIN_URL + '/api/data';
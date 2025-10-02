// const MAIN_URL = window.location.origin;
const MAIN_URL = process.env.NODE_ENV == 'production' ? 'https://factory.euromov.eu/enfield': 'http://localhost:3000';
export const USER_URL = MAIN_URL + '/api/users';
export const DATA_URL = MAIN_URL + '/api/data';

// Auth page logos.
export const LOGO = ["assets/res/input/img/enfield.png", "assets/res/input/img/imt.png"];
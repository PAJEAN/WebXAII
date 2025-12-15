// const MAIN_URL = window.location.origin;
const MAIN_URL = process.env.NODE_ENV == 'production' ? 'https://factory.euromov.eu/enfield/': 'http://localhost:3000';
// const MAIN_URL = process.env.NODE_ENV == 'production' ? 'http://localhost:3000': 'http://localhost:3000';
export const USER_URL = MAIN_URL + '/api/users';
export const DATA_URL = MAIN_URL + '/api/data';

// Auth page logos.
export const LOGO = ["assets/res/img/imt.png", "assets/res/img/imtbs.png", "assets/res/img/enfield.png"];
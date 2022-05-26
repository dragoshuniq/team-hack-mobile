const BASE = '/api';
const AUTH = BASE + '/auth';

export const API_ROUTES = {
  REGISTER: AUTH + '/register',
  LOGIN: AUTH + '/login',
  GOOGLE_LOGIN: AUTH + '/googlelogin',
  FACEBOOK_LOGIN: AUTH + '/facebooklogin',
  FORGOT_PASSWORD: AUTH + '/forgotpassword',
};

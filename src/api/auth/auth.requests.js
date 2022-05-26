import axios from 'axios';
import {API_ROUTES} from 'constants/endpoints/endpoints';

export const loginAppRequest = async data => {
  return axios
    .post(API_ROUTES.LOGIN, {
      ...data,
    })
    .then(response => {
      return response.data;
    });
};

export const googleSignInRequest = async token => {
  return axios
    .post(API_ROUTES.GOOGLE_LOGIN, {
      token,
    })
    .then(response => {
      return response.data;
    });
};

export const facebookSignInRequest = async data => {
  return axios
    .post(API_ROUTES.FACEBOOK_LOGIN, {
      ...data,
    })
    .then(response => {
      return response.data;
    });
};

export const registerRequest = async data => {
  return axios
    .post(API_ROUTES.REGISTER, {
      ...data,
    })
    .then(response => {
      return response.data;
    });
};

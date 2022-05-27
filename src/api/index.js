import axios from 'axios';
import {API_ROUTES} from 'constants/endpoints/endpoints';

export const getAllUserByDevice = async uniqueDeviceId => {
  return axios.get(API_ROUTES.GET_DEVICE, {uniqueDeviceId}).then(response => {
    return response.data;
  });
};

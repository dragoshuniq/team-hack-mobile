import * as TYPES from './app.actions-types';

export const setter = value => ({
  type: TYPES.SETTER,
  value,
});

export const getAllUserByDevice = uniqueDeviceId => ({
  type: TYPES.GET_ALL_USERS_BY_DEVICE,
  uniqueDeviceId,
});

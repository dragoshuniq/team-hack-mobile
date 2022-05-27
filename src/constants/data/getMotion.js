import {motions} from './motions.data';
export const getMotion = speed => {
  if (speed < 0.5) {
    return motions[0].value;
  }
  if (speed > 0.5 && speed < 5) {
    return motions[1].value;
  }
  if (speed > 5 && speed < 7) {
    return motions[2].value;
  }
  if (speed > 7 && speed < 13) {
    return motions[3].value;
  }
  if (speed > 13) {
    return motions[4].value;
  }
  return motions[0].value;
};

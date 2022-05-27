import {put, takeEvery, call, select} from 'redux-saga/effects';
import axios from 'axios';
import {AccountRole} from 'constants/data/account-role';
import {getUniqueId} from 'react-native-device-info';

// * Action types
import {GET_ALL_USERS_BY_DEVICE} from 'app-redux/actions/app/app.actions-types';
import {setter} from 'app-redux/actions/app/app.actions';
import {replaceNavigation} from 'navigation/Root.navigation';
import {getAllUserByDevice} from 'api/index';
import {
  /* Getting the unique device id. */
  setStorageData,
  clearStorageData,
} from 'helpers/storage';

import {SCREENS} from 'constants/screens/screen.names';
// * Generators
const getState = state => state.appReducer;

function* getAllUsersByDeviceGenerator({uniqueDeviceId = getUniqueId()}) {
  try {
    yield put(setter({isLoading: true}));
    const res = yield call(getAllUserByDevice, uniqueDeviceId);
    const state = yield select(getState);
    const parents = res.users.filter(pr => pr.role === AccountRole.PARINTE);
    const currentUser = res.users.filter(
      pr => pr.uniqueDeviceId === state.uniqueDeviceId,
    );

    yield put(
      setter({
        parents: parents,
        isSignedIn: parents.length > 0,
        user: currentUser[0],
      }),
    );
  } catch (error) {
  } finally {
    yield put(setter({isLoading: false}));
  }
}

// * Watcher
export function* appActionWatcher() {
  yield takeEvery(GET_ALL_USERS_BY_DEVICE, getAllUsersByDeviceGenerator);
}

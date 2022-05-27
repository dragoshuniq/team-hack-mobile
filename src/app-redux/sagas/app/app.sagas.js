import {put, takeEvery, call} from 'redux-saga/effects';
import axios from 'axios';

// * Action types
import {GET_ALL_USERS_BY_DEVICE} from 'app-redux/actions/app/app.actions-types';
import {setter} from 'app-redux/actions/app/app.actions';
import {replaceNavigation} from 'navigation/Root.navigation';
import {getAllUserByDevice} from 'api/index';
import {setStorageData, clearStorageData} from 'helpers/storage';

import {SCREENS} from 'constants/screens/screen.names';
// * Generators

function* getAllUsersByDeviceGenerator({uniqueDeviceId}) {
  try {
    yield put(setter({isLoading: true}));
    const res = yield call(getAllUserByDevice, {
      uniqueDeviceId,
    });
    yield put(setter({parents: res.users, isSignedIn: res.users.length > 0}));
  } catch (error) {
  } finally {
    yield put(setter({isLoading: false}));
  }
}

// * Watcher
export function* appActionWatcher() {
  yield takeEvery(GET_ALL_USERS_BY_DEVICE, getAllUsersByDeviceGenerator);
}

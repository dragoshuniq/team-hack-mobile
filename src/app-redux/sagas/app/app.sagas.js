import {put, takeEvery, call} from 'redux-saga/effects';
import axios from 'axios';

// * Action types
import {} from 'app-redux/actions/app/app.actions-types';
import {setter} from 'app-redux/actions/app/app.actions';
import {replaceNavigation} from 'navigation/Root.navigation';
import {
  loginAppRequest,
  registerRequest,
  googleSignInRequest,
  facebookSignInRequest,
} from 'api/index';
import {setStorageData, clearStorageData} from 'helpers/storage';

import {SCREENS} from 'constants/screens/screen.names';
// * Generators

function* sampleGenerator() {
  try {
  } catch (error) {}
}

// * Watcher
export function* appActionWatcher() {
  // yield takeEvery(SIGN_IN, signInGenerator);
}

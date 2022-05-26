import {all} from 'redux-saga/effects';
import {authActionWatcher} from './auth/auth.sagas';

export default function* rootSaga() {
  yield all([authActionWatcher()]);
}

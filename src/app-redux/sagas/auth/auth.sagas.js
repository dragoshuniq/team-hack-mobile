import {put, takeEvery, call} from 'redux-saga/effects';
import axios from 'axios';

import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';

// * Action types
import {
  SIGN_IN,
  SIGN_UP,
  SIGN_IN_GOOGLE,
  SIGN_IN_FACEBOOK,
} from 'app-redux/actions/app/app.actions-types';
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

function* signInGenerator({email, password}) {
  try {
    const res = yield call(loginAppRequest, {email, password});

    yield setStorageData('token', res.token);
    yield put(setter({isSignedIn: true}));
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.token}`;
  } catch (error) {
    yield put(
      setter({
        response: {
          isResponse: true,
          message: error.response.data.message,
          type: false,
        },
      }),
    );
  }
}

function* signUpGenerator({email, password}) {
  try {
    yield put(setter({isLoading: true}));
    const res = yield call(registerRequest, {email, password});

    if (res) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.token}`;
      yield setStorageData('token', res.token);
      yield put(setter({isSignedIn: true}));
    }
  } catch (error) {
    yield put(
      setter({
        response: {
          isResponse: true,
          message: error.response.data.message,
          type: false,
        },
      }),
    );
  } finally {
    yield put(setter({isLoading: false}));
  }
}

function* signInGoogleGenerator() {
  try {
    yield GoogleSignin.hasPlayServices();
    yield GoogleSignin.signIn();
    const tokens = yield GoogleSignin.getTokens();
    const res = yield call(googleSignInRequest, tokens.idToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.token}`;
    yield setStorageData('token', res.token);
    yield put(setter({isSignedIn: true}));
  } catch (error) {
    yield put(
      setter({
        response: {
          isResponse: true,
          message: 'Sorry, you are not signed in!',
          type: false,
        },
      }),
    );
  }
}

function* signInFacebookGenerator() {
  try {
    const loginResult = yield LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);
    if (!loginResult.isCanceled) {
      const tokens = yield AccessToken.getCurrentAccessToken();
      const res = yield call(facebookSignInRequest, {
        token: tokens.accessToken,
        userID: tokens.userID,
      });
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.token}`;
      yield setStorageData('token', res.token);
    }
    yield put(setter({isSignedIn: true}));
  } catch (error) {
    yield put(
      setter({
        response: {
          isResponse: true,
          message: 'Sorry, you are not signed in!',
          type: false,
        },
      }),
    );
  }
}

// * Watcher
export function* authActionWatcher() {
  yield takeEvery(SIGN_IN, signInGenerator);
  yield takeEvery(SIGN_UP, signUpGenerator);
  yield takeEvery(SIGN_IN_GOOGLE, signInGoogleGenerator);
  yield takeEvery(SIGN_IN_FACEBOOK, signInFacebookGenerator);
}

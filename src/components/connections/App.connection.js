// * Redux
import {connect} from 'react-redux';

// * Components
import SignIn from 'components/screens/Auth/SignIn/SignIn.screen.js';
import SignUp from 'components/screens/Auth/SignUp/SignUp.screen.js';
import ResetPassword from 'components/screens/Auth/ResetPassword/ResetPassword.screen.js';
import Onboarding from 'components/screens/Auth/Onboarding/Onboarding.screen.js';
import Home from 'components/screens/Home/Home.screen.js';

import {
  setter,
  signIn,
  signUp,
  resetPassword,
  signInGoogle,
  signInFacebook,
} from 'app-redux/actions/app/app.actions';
// * Map state to props
const mapStateToProps = (state, ownProps) => ({
  ...state.appReducer,
});

// * Map actions to props
const mapDispatchToProps = dispatch => ({
  setter: value => dispatch(setter(value)),
  signIn: (email, password) => dispatch(signIn(email, password)),
  signUp: (email, password) => dispatch(signUp(email, password)),
  resetPassword: email => dispatch(resetPassword(email)),
  signInGoogle: data => dispatch(signInGoogle(data)),
  signInFacebook: data => dispatch(signInFacebook(data)),
});

export default {
  SignIn: connect(mapStateToProps, mapDispatchToProps)(SignIn),
  SignUp: connect(mapStateToProps, mapDispatchToProps)(SignUp),
  ResetPassword: connect(mapStateToProps, mapDispatchToProps)(ResetPassword),
  Onboarding: connect(mapStateToProps, mapDispatchToProps)(Onboarding),
  Home: connect(mapStateToProps, mapDispatchToProps)(Home),
};
// * Redux
import {connect} from 'react-redux';

// * Components
import Home from 'components/screens/Home/Home.screen.js';
import QRcode from 'components/screens/Home/QRcode.screen';
import ChildMap from 'components/screens/Home/ChildMap.screen';
import ChildSupport from 'components/screens/Home/ChildSupport.screen';

import {setter} from 'app-redux/actions/app/app.actions';
// * Map state to props
const mapStateToProps = (state, ownProps) => ({
  ...state.appReducer,
});

// * Map actions to props
const mapDispatchToProps = dispatch => ({
  setter: value => dispatch(setter(value)),
});

export default {
  Home: connect(mapStateToProps, mapDispatchToProps)(Home),
  QRcode: connect(mapStateToProps, mapDispatchToProps)(QRcode),
  ChildMap: connect(mapStateToProps, mapDispatchToProps)(ChildMap),
  ChildSupport: connect(mapStateToProps, mapDispatchToProps)(ChildSupport),
};

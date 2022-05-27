import React from 'react';
import Connection from 'components/connections/App.connection';
import {createStackNavigator} from '@react-navigation/stack';
import Splash from 'components/screens/Splash/Splash.screen.js';
import TatNavigation from './Tab.navigation';
import RNBootSplash from 'react-native-bootsplash';
import {useDispatch, useSelector} from 'react-redux';
import {setter} from 'app-redux/actions/app/app.actions';
import {SCREENS} from 'constants/screens/screen.names';
import axios from 'axios';
import {getStorageData} from 'helpers/storage';
import Geolocation from '@react-native-community/geolocation';

const Stack = createStackNavigator();

export default function AppStackNavigator({navigation}) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = React.useState(true);
  const isSignedIn = useSelector(state => state.appReducer.isSignedIn);

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getStorageData('token');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(
            token,
          )}`;
          dispatch(setter({isSignedIn: true}));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
        await RNBootSplash.hide({fade: true});
      }
    };
    checkAuth();
  }, []);

  React.useEffect(() => {
    Geolocation.getCurrentPosition(({coords}) => {
      dispatch(setter({location: coords}));
    });
  }, []);

  if (isLoading) {
    return <Splash />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={SCREENS.ChildMap} component={Connection.ChildMap} />
      <Stack.Screen name={SCREENS.QRCODE} component={Connection.QRcode} />
      <Stack.Screen name={SCREENS.TAB_NAVIGATION} component={TatNavigation} />
      {/* {isSignedIn ? (
        <>
          <Stack.Screen
            name={SCREENS.TAB_NAVIGATION}
            component={TatNavigation}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name={SCREENS.RESET_PASSWORD}
            component={Connection.ResetPassword}
          />
        </>
      )} */}
    </Stack.Navigator>
  );
}

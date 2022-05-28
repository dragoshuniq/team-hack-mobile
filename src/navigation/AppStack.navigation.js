import React from 'react';
import Connection from 'components/connections/App.connection';
import {createStackNavigator} from '@react-navigation/stack';
import Splash from 'components/screens/Splash/Splash.screen.js';
import TatNavigation from './Tab.navigation';
import RNBootSplash from 'react-native-bootsplash';
import {useDispatch, useSelector} from 'react-redux';
import {setter, getAllUserByDevice} from 'app-redux/actions/app/app.actions';
import {SCREENS} from 'constants/screens/screen.names';
import axios from 'axios';
import {getStorageData} from 'helpers/storage';
import Geolocation from '@react-native-community/geolocation';
import {getUniqueId} from 'react-native-device-info';
import useChangeLocation from 'helpers/useChangeLocation';
import {Platform, PermissionsAndroid} from 'react-native';
import {getMotion} from 'constants/data/getMotion';
import {Notifications} from 'react-native-notifications';
import {
  gyroscope,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';

const Stack = createStackNavigator();
setUpdateIntervalForType(SensorTypes.gyroscope, 200);
export default function AppStackNavigator({navigation}) {
  const dispatch = useDispatch();
  const [locationStatus, setLocationStatus] = React.useState('');

  const appReducer = useSelector(state => state.appReducer);
  const {isSignedIn, isLoading} = appReducer;

  React.useEffect(() => {
    dispatch(getAllUserByDevice(appReducer.uniqueDeviceId));
  }, []);

  React.useEffect(() => {
    if (!isLoading) RNBootSplash.hide({fade: true});
  }, [isLoading]);

  const {sendDeviceLocation: changeLocation} = useChangeLocation();
  let watchID;

  React.useEffect(() => {
    const uniqueDeviceId = getUniqueId();
    dispatch(setter({uniqueDeviceId}));
  }, []);

  React.useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        // getOneTimeLocation();
        subscribeLocationLocation();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            getOneTimeLocation();
            subscribeLocationLocation();
          } else {
            setLocationStatus('Permission Denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };
    requestLocationPermission();
    return () => {
      Geolocation.clearWatch(watchID);
    };
  }, []);
  const getOneTimeLocation = () => {
    setLocationStatus('Getting Location ...');
    Geolocation.getCurrentPosition(
      position => {
        setLocationStatus('Getting Location');

        dispatch(setter({location: position.coords}));
        console.log(
          'Location--------------------------------------------------------',
        );
        changeLocation(getUniqueId(), {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          motion: getMotion(position.coords.speed),
        });
      },
      error => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000,
      },
    );
  };

  const subscribeLocationLocation = () => {
    watchID = Geolocation.watchPosition(
      position => {
        setLocationStatus('WatchLocation');

        changeLocation(getUniqueId(), {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          motion: getMotion(position.coords.speed),
        });
        console.log(position.coords);

        dispatch(setter({location: position.coords}));
      },
      error => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
      },
    );
  };

  React.useEffect(() => {
    // const subscription = gyroscope.subscribe(({x, y, z, timestamp}) => {
    //   let at = Math.sqrt(x * x + y * y + z * z);
    //   if (at > 50) {
    //     console.log(at);
    //   }
    // });
    // return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return <Splash />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {isSignedIn ? (
        <Stack.Screen name={SCREENS.TAB_NAVIGATION} component={TatNavigation} />
      ) : (
        <Stack.Screen name={SCREENS.QRCODE} component={Connection.QRcode} />
      )}
    </Stack.Navigator>
  );
}

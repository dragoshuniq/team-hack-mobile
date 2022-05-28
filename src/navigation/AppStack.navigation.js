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
import DeviceInfo from 'react-native-device-info';

import {AreaType} from 'constants/data/areas.types';

import {
  gyroscope,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';
import * as geolib from 'geolib';

const Stack = createStackNavigator();
setUpdateIntervalForType(SensorTypes.gyroscope, 200);
export default function AppStackNavigator({navigation}) {
  const dispatch = useDispatch();
  const [locationStatus, setLocationStatus] = React.useState('');
  const appReducer = useSelector(state => state.appReducer);
  const {isSignedIn, isLoading, user} = appReducer;

  React.useEffect(() => {
    dispatch(getAllUserByDevice(appReducer.uniqueDeviceId));
  }, []);

  React.useEffect(() => {
    if (!isLoading) RNBootSplash.hide({fade: true});
  }, [isLoading]);

  const {sendDeviceLocation: changeLocation, sendNotification} =
    useChangeLocation();
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
        const userLoc = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        if (user) {
          user.areas.forEach((area, ia) => {
            if (area.coord.length === 1) {
              const marker = {
                latitude: area.coord[0].lat,
                longitude: area.coord[0].lng,
              };
              const distance = geolib.getDistance(userLoc, marker);
              console.log('distance: ' + distance);
              if (distance < area.maxDistance) {
                const message =
                  'Copilul se afla la ' +
                  distance +
                  ' m distanta de ' +
                  area.name;
                sendNotification({
                  title: message,
                  subtitle: message,
                  message,
                  backgroundTop: 'green',
                  backgroundBottom: 'green',
                  native: true,
                  vibrate: 5,
                  duration: 10000,
                  theme: 'darkblue',
                });
              }
            } else {
              const isInPosition = geolib.isPointInPolygon(
                userLoc,
                area?.coord.map(({lat, lng}) => ({
                  latitude: lat,
                  longitude: lng,
                })),
              );
              if (isInPosition) {
                if (area.type === AreaType.DANGER) {
                  sendNotification({
                    title: 'Copilul se afla intr-o zona periculoasa!',
                    subtitle: 'Copilul se afla intr-o zona periculoasa!',
                    message: 'Copilul se afla intr-o zona periculoasa!',
                    backgroundTop: 'red',
                    backgroundBottom: 'red',
                    native: true,
                    vibrate: 5,
                    duration: 10000,
                    theme: 'red',
                  });
                } else {
                  sendNotification({
                    title: 'Copilul a ajuns la!' + area.name,
                    subtitle: 'Copilul a ajuns la!' + area.name,
                    message: 'Copilul a ajuns la!' + area.name,
                    backgroundTop: 'green',
                    backgroundBottom: 'green',
                    native: true,
                    vibrate: 5,
                    duration: 10000,
                    theme: 'darkblue',
                  });
                }
              }
              console.log('isInPosition' + ia, isInPosition);
            }
          });
        }

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
    if (!DeviceInfo.isEmulator()) {
      const subscription = gyroscope.subscribe(({x, y, z, timestamp}) => {
        let at = Math.sqrt(x * x + y * y + z * z);

        if (at > 25) {
          console.log(at);

          sendNotification({
            title: 'Copilul a cazut!',
            subtitle: 'Urgenta, Copilul a cazut!',
            message: 'Alerta! Copilul a cazut!',
            backgroundTop: 'red',
            backgroundBottom: 'red',
            native: true,
            vibrate: 5,
            duration: 10000,
            theme: 'red',
          });
        }
      });
      return () => subscription.unsubscribe();
    }
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

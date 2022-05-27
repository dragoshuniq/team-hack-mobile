import React from 'react';
import {Platform, PermissionsAndroid} from 'react-native';
import {Provider} from 'react-redux';
import {store, sagaMiddleware} from 'app-redux/store/store';
import Navigation from 'navigation/index';
import sagas from 'app-redux/sagas/index';
import axios from 'axios';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {Settings} from 'react-native-fbsdk-next';
import Geolocation from '@react-native-community/geolocation';

GoogleSignin.configure({
  webClient:
    '1057553385734-enjolc0737atqati641v1u32ong78hhr.apps.googleusercontent.com',
});
axios.defaults.baseURL = 'http://localhost:8080';
sagaMiddleware.run(sagas);

export default function Main() {
  const [location, setLocation] = React.useState(null);
  const [locationStatus, setLocationStatus] = React.useState(null);

  let watchID;
  React.useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        getOneTimeLocation();
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
      //Will give you the current location
      position => {
        setLocationStatus('Getting Location');

        setLocation(position.coords);
      },
      error => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  };

  const subscribeLocationLocation = () => {
    watchID = Geolocation.watchPosition(
      position => {
        setLocationStatus('WatchLocation');
        setLocation(position.coords);
      },
      error => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        maximumAge: 1000,
      },
    );
  };

  console.log(locationStatus, location);

  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}

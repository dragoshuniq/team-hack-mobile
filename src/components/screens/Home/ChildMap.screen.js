import React, {useEffect} from 'react';
import {StyleSheet, View, Animated, Dimensions, Platform} from 'react-native';
import MapView, {Polygon} from 'react-native-maps';
import {COLORS, SCREEN_SIZE, APP_STYLES} from 'theme/theme';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Splash from 'components/screens/Splash/Splash.screen.js';
import {AreaType} from 'constants/data/areas.types';
const ChildMap = props => {
  const {location, user} = props;

  if (!location) {
    return <Splash />;
  }

  return (
    <View style={styles.container}>
      <MapView
        initialRegion={{
          ...location,
          latitudeDelta: 0.06,
          longitudeDelta: 0.05,
        }}
        // showsUserLocation
        style={styles.container}>
        <MapView.Marker coordinate={location}>
          <Animated.View style={styles.markerWrap}>
            <Animated.Image
              source={{uri: user?.profileImage?.fileUrl}}
              style={[styles.userImage]}
              resizeMode="cover"
            />
          </Animated.View>
        </MapView.Marker>
        {user.areas.map(({coord, _id, type}) => {
          if (coord.length > 1)
            return (
              <Polygon
                key={_id}
                coordinates={coord.map(c => ({
                  latitude: c.lat,
                  longitude: c.lng,
                }))}
                fillColor={
                  AreaType.DANGER === type
                    ? 'rgba(255, 0, 0, 0.5)'
                    : 'rgba(0, 255, 0, 0.3)'
                }
                strokeColor={'transparent'}
              />
            );
          const coords = {
            latitude: coord[0].lat,
            longitude: coord[0].lng,
          };
          return (
            <MapView.Marker key={_id} coordinate={coords}>
              <Animated.View style={styles.markerWrap}>
                <Animated.Image
                  source={require('assets/marker.png')}
                  style={[styles.marker]}
                  resizeMode="cover"
                />
              </Animated.View>
            </MapView.Marker>
          );
        })}
      </MapView>
    </View>
  );
};

export default ChildMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  markerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  marker: {
    width: 30,
    height: 30,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
});

const triangleCoords = [
  {latitude: 25.774, longitude: -80.19},
  {latitude: 18.466, longitude: -66.118},
  {latitude: 32.321, longitude: -64.757},
  {latitude: 25.774, longitude: -80.19},
];

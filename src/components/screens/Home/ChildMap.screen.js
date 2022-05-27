import React, {useEffect} from 'react';
import {StyleSheet, View, Animated, Dimensions, Platform} from 'react-native';
import MapView from 'react-native-maps';
import {COLORS, SCREEN_SIZE, APP_STYLES} from 'theme/theme';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Splash from 'components/screens/Splash/Splash.screen.js';

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
        {[].map((marker, index) => {
          return (
            <MapView.Marker
              key={index}
              coordinate={marker.location}
              onPress={e => console.log(e)}>
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

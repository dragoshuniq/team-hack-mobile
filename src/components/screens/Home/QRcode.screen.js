import {
  View,
  Text,
  SafeAreaView,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import React from 'react';
import QRCode from 'react-native-qrcode-svg';
import {getUniqueId} from 'react-native-device-info';
import Splash from 'components/screens/Splash/Splash.screen.js';

export default function QrCode() {
  const [isLoading, setLoading] = React.useState(true);

  const [deviceId, setDeviceId] = React.useState(null);
  React.useEffect(() => {
    const uniqueDeviceId = getUniqueId();
    setDeviceId(uniqueDeviceId);
    setLoading(false);
  }, []);

  if (isLoading) {
    return <Splash />;
  }
  return (
    <View style={{flex: 1}}>
      <View style={styles.qrContainer}>
        <Text style={styles.textInfo}>Scanați pentru a începe!</Text>
        <QRCode value={deviceId} size={300} logo={require('assets/logo.png')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  qrContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInfo: {
    marginBottom: 40,
    fontWeight: 'bold',
    fontSize: 26,
  },
});

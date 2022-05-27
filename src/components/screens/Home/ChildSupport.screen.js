import React from 'react';
import {
  Linking,
  Alert,
  Platform,
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {COLORS, SCREEN_SIZE, APP_STYLES} from 'theme/theme';
import Ion from 'react-native-vector-icons/Ionicons';
import {Picker} from '@react-native-picker/picker';
import {useFormik} from 'formik';
import {problemList} from 'constants/data/support.data';
import Input from 'utils/Input';
import Mat from 'react-native-vector-icons/MaterialIcons';
import {Notifications} from 'react-native-notifications';

export default function ChildSupport(props) {
  const dim = useWindowDimensions();
  const {parents} = props;
  const dialCall = number => {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }
    Linking.openURL(phoneNumber);
  };

  React.useEffect(() => {
    Notifications.ios.checkPermissions().then(currentPermissions => {
      console.log('Badges enabled: ' + !!currentPermissions.badge);
      console.log('Sounds enabled: ' + !!currentPermissions.sound);
      console.log('Alerts enabled: ' + !!currentPermissions.alert);
      console.log('Car Play enabled: ' + !!currentPermissions.carPlay);
      console.log(
        'Critical Alerts enabled: ' + !!currentPermissions.criticalAlert,
      );
      console.log('Provisional enabled: ' + !!currentPermissions.provisional);
      console.log(
        'Provides App Notification Settings enabled: ' +
          !!currentPermissions.providesAppNotificationSettings,
      );
      console.log('Announcement enabled: ' + !!currentPermissions.announcement);
    });
  }, []);

  const {handleSubmit, handleChange, values, setFieldValue} = useFormik({
    initialValues: {
      problem: problemList[2],
      person: parents[0],
    },
    onSubmit: sendNotification,
  });

  function sendNotification(data) {
    pushNotification();
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        <View>
          <Text style={styles.inputLabel}>Raporteaza problema</Text>

          <Picker
            selectedValue={values.problem}
            onValueChange={itemValue => setFieldValue('problem', itemValue)}>
            {problemList.map(pr => {
              return <Picker.Item key={pr} label={pr} value={pr} />;
            })}
          </Picker>
          {values.problem === problemList[problemList.length - 1] && (
            <Input
              title={'Problema'}
              value={values.title}
              editable
              onChangeText={handleChange('title')}
              placeholder={'Ex. problema...'}
              width={dim.width * 0.9}
            />
          )}
          <Text style={styles.inputLabel}>Alege persoana</Text>
          <Picker
            selectedValue={values.problem}
            onValueChange={itemValue => setFieldValue('person', itemValue)}>
            {parents.map(pr => {
              return (
                <Picker.Item
                  key={pr.id}
                  label={`${pr.name} ${pr.surname}`}
                  value={pr.id}
                />
              );
            })}
          </Picker>
        </View>
      </ScrollView>
      <View
        style={{
          marginBottom: 80,
        }}>
        <TouchableOpacity
          style={[
            styles.urgentCall,
            {backgroundColor: COLORS.GREEN, marginBottom: 10},
          ]}
          onPress={handleSubmit}>
          <Text style={styles.urgentCallText}>Raporteaza</Text>
          <Mat name="report" color="white" size={26} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.urgentCall}
          onPress={() => {
            dialCall('0790386718');
          }}>
          <Text style={styles.urgentCallText}>Urgenta</Text>
          <Ion name="ios-call" color="white" size={26} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  urgentCall: {
    width: '90%',
    backgroundColor: COLORS.RED,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    padding: 15,
    ...APP_STYLES.SHADOW,
  },
  urgentCallText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    marginRight: 20,
  },
  inputLabel: {
    margin: 10,
    fontWeight: '500',
    fontSize: 22,
    textAlign: 'center',
  },
});

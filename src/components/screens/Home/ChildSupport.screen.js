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
import useChangeLocation from 'helpers/useChangeLocation';

export default function ChildSupport(props) {
  const dim = useWindowDimensions();
  const {parents, user} = props;
  const dialCall = number => {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }
    Linking.openURL(phoneNumber);
  };

  const {handleSubmit, handleChange, values, setFieldValue} = useFormik({
    initialValues: {
      problem: problemList[2],
      person: parents[0],
    },
    onSubmit: notify,
  });
  const {sendNotification} = useChangeLocation();

  function notify(data) {
    sendNotification({
      title: data.problem,
      subtitle: data.problem,
      message: data.problem,
      theme: 'darkblue',
      native: true,
      duration: 10000,
    });
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
            dialCall(user.phoneNo);
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

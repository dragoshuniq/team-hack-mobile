import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Connection from 'components/connections/App.connection';
import {SCREENS} from 'constants/screens/screen.names';

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen
        name={'home'}
        component={Connection.Home}
        options={{
          tabBarShowLabel: false,
        }}
      />
    </Tab.Navigator>
  );
}

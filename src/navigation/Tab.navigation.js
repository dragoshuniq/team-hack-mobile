import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Connection from 'components/connections/App.connection';
import {SCREENS} from 'constants/screens/screen.names';
import {TabScreens} from 'constants/screens/screens.selector';
import TabBar from './TabBar.component';

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <TabBar {...props} />}>
      {TabScreens.map((screen, index) => {
        return (
          <Tab.Screen
            key={index}
            name={screen.name}
            component={Connection[screen.source]}
            options={{
              tabBarShowLabel: false,
              ...screen?.options,
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
}

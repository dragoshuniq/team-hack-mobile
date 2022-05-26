import React from 'react';
import AppNavigation from './AppStack.navigation';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './Root.navigation';

export default function Navigation() {
  return (
    <NavigationContainer ref={navigationRef}>
      <AppNavigation />
    </NavigationContainer>
  );
}

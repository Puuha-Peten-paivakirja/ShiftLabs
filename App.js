import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import GroupScreen from './src/screens/GroupScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AddShiftScreen from './src/screens/AddShiftScreen';
import ShiftScreen from './src/screens/ShiftScreen';
import AllShiftsScreen from './src/screens/AllShiftsScreen';
import SignUpScreen from './src/screens/SignUpScreen.js';
import SignInScreen from './src/screens/SignInScreen.js';

const Stack = createStackNavigator();
import { UserProvider } from './src/context/UserProvider.js';
import MainNavigator from './src/navigation/MainNavigator.js';

export default function App() {
  return (
    <UserProvider>
      <MainNavigator />
    </UserProvider>
  );
}

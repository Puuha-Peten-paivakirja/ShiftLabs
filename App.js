import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen.js';
import GroupScreen from './src/screens/GroupScreen.js';
import WelcomeScreen from './src/screens/WelcomeScreen.js';
import SettingsScreen from './src/screens/SettingsScreen.js';
import AddShiftScreen from './src/screens/ShiftScreen.js';
import ShiftScreen from './src/screens/ShiftScreen.js';
import AllShiftsScreen from './src/screens/AllShiftsScreen.js';
import SignUpScreen from './src/screens/SignUpScreen.js';
import SignInScreen from './src/screens/SignInScreen.js';
import { UserProvider } from './src/context/UserProvider.js';

const Stack = createStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Group" component={GroupScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="AddShift" component={AddShiftScreen} />
          <Stack.Screen name="Shift" component={ShiftScreen} />
          <Stack.Screen name="AllShifts" component={AllShiftsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
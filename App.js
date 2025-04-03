import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import GroupScreen from './src/screens/GroupScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AddShiftScreen from './src/screens/ShiftScreen';
import ShiftScreen from './src/screens/ShiftScreen';
import AllShiftsScreen from './src/screens/AllShiftsScreen';
import SignUpScreen from './src/screens/SignUpScreen.js';
import SignInScreen from './src/screens/SignInScreen.js';
import CalendarScreen from './src/screens/CalendarScreen.js'
import SingleCalendarEvent from './src/screens/SingleCalendarEvent.js'
import AddCalendarEvent from './src/screens/AddCalendarEvent.js';

const Stack = createStackNavigator();

export default function App() {
  return (
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
        <Stack.Screen name="Calendar" component={CalendarScreen} />
        <Stack.Screen name="SingleCalendarEvent" component={SingleCalendarEvent} />
        <Stack.Screen name="AddCalendarEvent" component={AddCalendarEvent} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
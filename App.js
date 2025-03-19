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

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Group" component={GroupScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="AddShift" component={AddShiftScreen} />
        <Stack.Screen name="Shift" component={ShiftScreen} />
        <Stack.Screen name="AllShifts" component={AllShiftsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
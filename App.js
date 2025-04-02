import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';


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

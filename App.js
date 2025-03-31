import React from 'react';
import { UserProvider } from './src/context/UserProvider.js';
import MainNavigator from './src/navigation/MainNavigator.js';

export default function App() {
  return (
    <UserProvider>
      <MainNavigator />
    </UserProvider>
  );
}

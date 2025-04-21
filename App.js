import React from 'react';
import { UserProvider } from './src/context/UserProvider.js';
import MainNavigator from './src/navigation/MainNavigator.js';
import { ShiftTimerProvider } from './src/context/ShiftTimerContext.js';

export default function App() {
  return (
    <UserProvider>
      <ShiftTimerProvider>
        <MainNavigator />
      </ShiftTimerProvider>
    </UserProvider>
  );
}

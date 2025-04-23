import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from '../screens/HomeScreen.js'
import WelcomeScreen from '../screens/WelcomeScreen.js'
import SignUpScreen from '../screens/SignUpScreen.js'
import SignInScreen from '../screens/SignInScreen.js'
import GroupScreen from '../screens/GroupScreen.js'
import SettingsScreen from '../screens/SettingsScreen.js'
import AddShiftScreen from '../screens/AddShiftScreen.js'
import AllShiftsScreen from '../screens/AllShiftsScreen.js'
import ResetPasswordScreen from '../screens/ResetPasswordScreen.js'
import { useUser } from '../context/useUser.js'
import SpecificGroupScreen from '../screens/SpecificGroupScreen.js'
import CalendarScreen from '../screens/CalendarScreen.js'
import SingleCalendarEvent from '../screens/SingleCalendarEvent.js'
import AddCalendarEvent from '../screens/AddCalendarEvent.js'
import GroupSettingsScreen from '../screens/GroupSettingsScreen.js'

const Stack = createStackNavigator()

export default function MainNavigator() {
  const { user } = useUser()

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={user ? 'Home' : 'Welcome'} >
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='Welcome' component={WelcomeScreen} />
        <Stack.Screen name='SignUp' component={SignUpScreen} />
        <Stack.Screen name='SignIn' component={SignInScreen} />
        <Stack.Screen name='ResetPassword' component={ResetPasswordScreen} />
        <Stack.Screen name='Group' component={GroupScreen} />
        <Stack.Screen name='Settings' component={SettingsScreen} />
        <Stack.Screen name='AddShift' component={AddShiftScreen} />
        <Stack.Screen name='AllShifts' component={AllShiftsScreen} />
        <Stack.Screen name='SpecificGroup' component={SpecificGroupScreen}/>
        <Stack.Screen name="Calendar" component={CalendarScreen} />
        <Stack.Screen name="SingleCalendarEvent" component={SingleCalendarEvent} />
        <Stack.Screen name="AddCalendarEvent" component={AddCalendarEvent} />
        <Stack.Screen name='GroupSettingsScreen' component={GroupSettingsScreen}/>

      </Stack.Navigator>
    </NavigationContainer>
  )
}

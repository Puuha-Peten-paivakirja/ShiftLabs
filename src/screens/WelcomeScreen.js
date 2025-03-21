import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { Topbar } from '../components/Topbar.js'
import { CustomButton } from '../components/CustomButton'
import { useNavigation } from '@react-navigation/native'

export default function WelcomeScreen() {
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <Topbar title='Welcome'/>

      <View style={styles.contentContainer}>
        <Text>Welcome</Text>
        <View style={styles.buttonsContainer}>
          <CustomButton title={'Sign up'} onPress={() => navigation.navigate('SignUp')} />
          <CustomButton title={'Sign in'} onPress={() => navigation.navigate('SignIn')} />
          <CustomButton title={'Guest'} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  textContainer: {
    flex: 2
  },
  buttonsContainer: {
    gap: 20
  }
})

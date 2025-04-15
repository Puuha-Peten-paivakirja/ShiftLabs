import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { Topbar } from '../components/Topbar.js'
import { CustomButton } from '../components/CustomButton'
import { useNavigation } from '@react-navigation/native'
import styles from '../styles/Welcome.js'

export default function WelcomeScreen() {
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <Topbar title='Welcome'/>

      <View style={styles.contentContainer}>
        <View></View>
        <View style={styles.buttonsContainer}>
          <CustomButton title={'Sign up'} onPress={() => navigation.navigate('SignUp')} />
          <CustomButton
            title={'Sign in'}
            onPress={() => navigation.navigate('SignIn')} 
            style={{backgroundColor: '#d8bcfc'}}
          />
          <CustomButton
            title={'Guest'}
            onPress={() => navigation.navigate('Home')}
            style={{backgroundColor: '#d8bcfc'}}
          />        
        </View>
      </View>
    </View>
  )
}

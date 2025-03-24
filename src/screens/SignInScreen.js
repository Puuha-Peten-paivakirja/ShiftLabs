import React, { useState } from 'react'
import { View, TouchableOpacity, Text, Alert } from 'react-native'
import { TextInput } from 'react-native-paper'
import Ionicons from '@expo/vector-icons/Ionicons'
import styles from '../styles/SignIn.js'
import { CustomButton } from '../components/CustomButton'
import { Topbar } from '../components/Topbar.js'
import { CommonActions, useNavigation } from '@react-navigation/native'
import { auth, signInWithEmailAndPassword } from '../firebase/config.js' 

export default function GroupScreen() {
  const navigation = useNavigation()

  const [userInfo, setUserInfo] = useState({email: '', password: '',})

  const signIn = () => {
    signInWithEmailAndPassword(auth, userInfo.email, userInfo.password)
      .then(() => {
        setUserInfo({email: '', password: ''}) // Clear userInfo after a successful login
        navigation.dispatch( // Clear the navigation stack and redirect the user to the home page
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Home' }]
          })
        )
      })
      .catch((error) => {
        if (error.code === 'auth/invalid-email') {
          Alert.alert('Error', 'Email is not valid')
        }
        else if (error.code === 'auth/invalid-credential') {
          Alert.alert('Error', 'Invalid credentials')
        }
        else {
          Alert.alert('Error', error.message)
        }
      })
  }

  return (
    <View style={styles.container}>
      <Topbar title='Sign in' />

      <View style={styles.contentContainer}>
        <View>
          <View style={styles.upperEmpty}></View>
          <View style={styles.credentialsInputRow}>
            <TextInput
              style={styles.credentialsInput}
              label='Email'
              value={userInfo.email}
              onChangeText={text => setUserInfo({...userInfo, email: text})}
              keyboardType='email-address'
              numberOfLines={1}
            />
            <TouchableOpacity style={styles.clearCredentialsIcon} onPress={() => setUserInfo({...userInfo, email: ''})}>
              <Ionicons name='close-circle' size={20} />
            </TouchableOpacity>
          </View>

          <View style={styles.credentialsInputRow}>
            <TextInput
              style={styles.credentialsInput}
              label='Password'
              value={userInfo.password}
              onChangeText={text => setUserInfo({...userInfo, password: text})}
              secureTextEntry={true}
              numberOfLines={1}
            />
            <TouchableOpacity style={styles.clearCredentialsIcon} onPress={() => setUserInfo({...userInfo, password: ''})}>
              <Ionicons name='close-circle' size={20} />
            </TouchableOpacity>
          </View>
          <View style={styles.lowerEmpty}></View>
        </View>

        <View style={styles.bottomContainer}>
          <CustomButton title={'Sign in'} onPress={() => signIn()}/>
            <View style={styles.bottomText}>
              <Text style={styles.signInText}>Forgot your password? </Text>
              <TouchableOpacity activeOpacity={0.75}>
                <Text style={styles.signInTextLink}>Reset password</Text>
              </TouchableOpacity>
            </View>
        </View>
      </View>
    </View>
  )
}

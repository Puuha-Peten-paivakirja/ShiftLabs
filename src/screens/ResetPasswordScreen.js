import React, { useState } from 'react'
import { View, Text, Alert, TouchableOpacity } from 'react-native'
import { Topbar } from '../components/Topbar.js'
import styles from '../styles/ResetPassword.js'
import { TextInput } from 'react-native-paper'
import Ionicons from '@expo/vector-icons/Ionicons'
import { CustomButton } from '../components/CustomButton'
import { auth, sendPasswordResetEmail } from '../firebase/config.js'
import { useNavigation } from '@react-navigation/native'

export default function ResetPasswordScreen() {
  const navigation = useNavigation()

  const [email, setEmail] = useState('')
  const [isDisabled, setIsDisabled] = useState(false)
  
  const resetPassword = () => {
    setIsDisabled(true)

    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert('Email sent', 'An email containing a password reset link has been sent to your email address. You will be now redirected to the login page.', [
          {
            onPress: () => navigation.goBack()
          }
        ])
      })
      .catch((error) => {
        if (error.code === 'auth/invalid-email') {
          Alert.alert('Error', 'Invalid email', [
            {
              onPress: () => setIsDisabled(false)
            }
          ])
        }
        else if (error.code === 'auth/missing-email') {
          Alert.alert('Error', 'Email is required', [
            {
              onPress: () => setIsDisabled(false)
            }
          ])
        }
        else {
          Alert.alert('Error', error.message, [
            {
              onPress: () => setIsDisabled(false)
            }
          ])
        }
      })
  }

  return (
    <View style={styles.container}>
      <Topbar title='Reset password' />
      
      <View style={styles.center}>
        <View style={styles.textContent}>
          <Text style={styles.title}>Forgot password?</Text>
          <Text style={styles.text}>Plese enter your email address and we</Text>
          <Text style={styles.text}>will send you a link to reset your password</Text>
        </View>
      </View>

      <View style={styles.center}>
        <TextInput
          style={styles.credentialsInput}
          label='Email'
          value={email}
          onChangeText={text => setEmail(text)}
          keyboardType='email-address'
          numberOfLines={1}
          autoCapitalize='none'
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.clearCredentialsIcon} onPress={() => setEmail('')}>
          <Ionicons name='close-circle' size={20} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.center}>
        <View style={styles.buttonContainer}>
          <CustomButton
            title={'Reset'}
            onPress={() => resetPassword()}
            isDisabled={isDisabled}
          />
        </View>
      </View>
    </View>
  )
}

import React, { useState } from 'react'
import { View, Text, Alert, TouchableOpacity } from 'react-native'
import { Topbar } from '../components/Topbar.js'
import styles from '../styles/ResetPassword.js'
import { TextInput } from 'react-native-paper'
import Ionicons from '@expo/vector-icons/Ionicons'
import { CustomButton } from '../components/CustomButton'

export default function ResetPasswordScreen() {
  const [userInfo, setUserInfo] = useState({email: '', password: '',})
  const [isDisabled, setIsDisabled] = useState(false)

  return (
    <View style={styles.container}>
      <Topbar title='Forgot password?' />
      <View style={styles.credentialsInputRow}>
        <TextInput
          style={styles.credentialsInput}
          label='Email'
          value={userInfo.email}
          onChangeText={text => setUserInfo({...userInfo, email: text})}
          keyboardType='email-address'
          numberOfLines={1}
          autoCapitalize='none'
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.clearCredentialsIcon} onPress={() => setUserInfo({...userInfo, email: ''})}>
          <Ionicons name='close-circle' size={20} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

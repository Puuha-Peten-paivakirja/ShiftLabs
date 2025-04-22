import React, { useState } from 'react'
import { View, Text, Alert, TouchableOpacity } from 'react-native'
import { Topbar } from '../components/Topbar.js'
import styles from '../styles/ResetPassword.js'
import { TextInput } from 'react-native-paper'
import Ionicons from '@expo/vector-icons/Ionicons'
import { CustomButton } from '../components/CustomButton'
import { auth, sendPasswordResetEmail } from '../firebase/config.js'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'

export default function ResetPasswordScreen() {
  const navigation = useNavigation()
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [isDisabled, setIsDisabled] = useState(false)
  
  const resetPassword = () => {
    setIsDisabled(true)

    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert(t('email-sent'), t('password-reset-email'), [
          {
            onPress: () => navigation.goBack()
          }
        ])
      })
      .catch((error) => {
        if (error.code === 'auth/invalid-email') {
          Alert.alert(t('error'), t('invalid-email'), [
            {
              onPress: () => setIsDisabled(false)
            }
          ])
        }
        else if (error.code === 'auth/missing-email') {
          Alert.alert(t('error'), t('email-is-required'), [
            {
              onPress: () => setIsDisabled(false)
            }
          ])
        }
        else {
          Alert.alert(t('error'), error.message, [
            {
              onPress: () => setIsDisabled(false)
            }
          ])
        }
      })
  }

  return (
    <View style={styles.container}>
      <Topbar title={t('reset-password')} showGoBackButton={true} />
      
      <View style={styles.center}>
        <View style={styles.textContent}>
          <Text style={styles.title}>{t('forgot-your-password')}</Text>
          <Text style={styles.text}>{t('forgot-password-text-1')}</Text>
          <Text style={styles.text}>{t('forgot-password-text-2')}</Text>
        </View>
      </View>

      <View style={styles.center}>
        <TextInput
          style={styles.credentialsInput}
          label={t('email-address')}
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
            title={t('reset')}
            onPress={() => resetPassword()}
            isDisabled={isDisabled}
          />
        </View>
      </View>
    </View>
  )
}

import React, { useState } from 'react'
import { View, TouchableOpacity, Text, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { TextInput } from 'react-native-paper'
import Ionicons from '@expo/vector-icons/Ionicons'
import styles from '../styles/SignIn.js'
import { CustomButton } from '../components/CustomButton'
import { Topbar } from '../components/Topbar.js'
import { CommonActions, useNavigation } from '@react-navigation/native'
import { auth, signInWithEmailAndPassword } from '../firebase/config.js'
import { useTranslation } from 'react-i18next'

export default function SignInScreen() {
  const navigation = useNavigation()
  const { t } = useTranslation()
  const [isDisabled, setIsDisabled] = useState(false)
  const [userInfo, setUserInfo] = useState({email: '', password: '',})

  const signIn = () => {
    setIsDisabled(true)

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
          Alert.alert(t('error'), t('email-is-not-valid'), [
            {
              onPress: () => setIsDisabled(false)
            }
          ])
        }
        else if (error.code === 'auth/invalid-credential' || error.code === 'auth/missing-password') {
          Alert.alert(t('error'), t('invalid-credentials'), [
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
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Topbar title={t('sign-in')} showGoBackButton={true} />

        <View style={styles.contentContainer}>
          <View>
            <View style={styles.upperEmpty}></View>
            <View style={styles.credentialsInputRow}>
              <TextInput
                style={styles.credentialsInput}
                label={t('email-address')}
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

            <View style={styles.credentialsInputRow}>
              <TextInput
                style={styles.credentialsInput}
                label={t('password')}
                value={userInfo.password}
                onChangeText={text => setUserInfo({...userInfo, password: text})}
                secureTextEntry={true}
                numberOfLines={1}
                autoCapitalize='none'
                autoCorrect={false}
              />
              <TouchableOpacity style={styles.clearCredentialsIcon} onPress={() => setUserInfo({...userInfo, password: ''})}>
                <Ionicons name='close-circle' size={20} />
              </TouchableOpacity>
            </View>
            <View style={styles.lowerEmpty}></View>
          </View>

          <View style={styles.bottomContainer}>
            <CustomButton
              title={t('sign-in')}
              onPress={() => signIn()}
              isDisabled={isDisabled}
            />
              <View style={styles.bottomText}>
                <Text style={styles.signInText}>{t('forgot-your-password')}</Text>
                <TouchableOpacity activeOpacity={0.75} onPress={() => navigation.navigate('ResetPassword')}>
                  <Text style={styles.signInTextLink}>{t('reset-password')}</Text>
                </TouchableOpacity>
              </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

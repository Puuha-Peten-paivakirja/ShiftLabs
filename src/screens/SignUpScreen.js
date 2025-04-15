import React, { useState } from 'react'
import { View, TouchableOpacity, Text, Alert } from 'react-native'
import { TextInput } from 'react-native-paper'
import Ionicons from '@expo/vector-icons/Ionicons'
import styles from '../styles/SignUp.js'
import { CustomButton } from '../components/CustomButton'
import { Topbar } from '../components/Topbar.js'
import { useNavigation, CommonActions } from '@react-navigation/native'
import { auth, createUserWithEmailAndPassword, firestore, USERS, setDoc, doc } from '../firebase/config.js' 
import isEmail from 'validator/lib/isEmail'
import isStrongPassword from 'validator/lib/isStrongPassword'

export default function SignUpScreen() {
  const navigation = useNavigation()

  const [isDisabled, setIsDisabled] = useState(false)
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmedPassword: ''
  })

  const validateUserInputs = () => {
    if (!userInfo.firstName || userInfo.firstName.trim().length === 0) {
      Alert.alert('Error', 'Firstname is required', [
        {
          onPress: () => setIsDisabled(false)
        }
      ])
      return false
    }
    else if (userInfo.firstName.length > 35) {
      Alert.alert('Error', 'Maximum length of first name is 35 characters', [
        {
          onPress: () => setIsDisabled(false)
        }
      ])
      return false
    }
    else if (userInfo.lastName.length > 35) {
      Alert.alert('Error', 'Maximum length of last name is 35 characters', [
        {
          onPress: () => setIsDisabled(false)
        }
      ])
      return false
    }
    else if (!userInfo.lastName ||userInfo.lastName.trim().length === 0) {
      Alert.alert('Error', 'Lastname is required', [
        {
          onPress: () => setIsDisabled(false)
        }
      ])
      return false
    }
    else if (!userInfo.email ||userInfo.email.trim().length === 0) {
      Alert.alert('Error', 'Email is required', [
        {
          onPress: () => setIsDisabled(false)
        }
      ])
      return false
    }
    else if (!isEmail(userInfo.email)) {
      Alert.alert('Error', 'Email is not valid', [
        {
          onPress: () => setIsDisabled(false)
        }
      ])
      return false
    }
    else if (!userInfo.password || !isStrongPassword(userInfo.password, {minLength: 8, minLowercase:1 , minUppercase: 1, minNumbers: 1, minSymbols: 0}) || userInfo.password.length > 30) {
      Alert.alert('Error', 'Password must contain 8-30 characters, 1 number, 1 uppercase letter and 1 lowercase letter', [
        {
          onPress: () => setIsDisabled(false)
        }
      ])
      return false
    }
    else if (!userInfo.confirmedPassword || userInfo.confirmedPassword !== userInfo.password) {
      Alert.alert('Error', 'Passwords do not match', [
        {
          onPress: () => setIsDisabled(false)
        }
      ])
      return false
    }
    else {
      return true
    }
  }

  const signUp = () => {
    setIsDisabled(true)

    if (!validateUserInputs()) { // Check if the information given by the user is valid 
      return
    }

    createUserWithEmailAndPassword(auth, userInfo.email, userInfo.password)
      .then((userCredential) => {
        setDoc(doc(firestore, USERS, userCredential.user.uid), { // Adding a document into 'users' collection
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          email: userInfo.email
        })
          .then(() => {
            setUserInfo({ // Clear userInfo after a successful registration 
              firstName: '',
              lastName: '',
              email: '',
              password: '',
              confirmedPassword: ''
            })
            navigation.dispatch( // Clear the navigation stack and redirect the user to the home page
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Home' }]
              })
            )
          })
          .catch((error) => {
            console.log(error)
            setIsDisabled(false)
          })
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('Error', 'Email already in use', [
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
      <Topbar title='Sign up' />

      <View style={styles.contentContainer}>
        <View>
          <View style={styles.nameInputRow}>
            <View style={styles.nameInputHalf}>
              <TextInput
                style={styles.nameInput}
                label='First name'
                value={userInfo.firstName}
                onChangeText={text => setUserInfo({...userInfo, firstName: text})}
                numberOfLines={1}
                autoCorrect={false}
              />
              <TouchableOpacity style={styles.clearNameIcon} onPress={() => setUserInfo({...userInfo, firstName: ''})}>
                <Ionicons name='close-circle' size={20} />
              </TouchableOpacity>
            </View>

            <View style={styles.nameInputHalf}>
              <TextInput
                style={styles.nameInput}
                label='Last name'
                value={userInfo.lastName}
                onChangeText={text => setUserInfo({...userInfo, lastName: text})}
                numberOfLines={1}
                autoCorrect={false}
              />
              <TouchableOpacity style={styles.clearNameIcon} onPress={() => setUserInfo({...userInfo, lastName: ''})}>
                <Ionicons name='close-circle' size={20} />
              </TouchableOpacity>
            </View>
          </View>

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

          <View style={styles.credentialsInputRow}>
            <TextInput
              style={styles.credentialsInput}
              label='Password'
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

          <View style={styles.credentialsInputRow}>
            <TextInput
              style={styles.credentialsInput}
              label='Confirm password'
              value={userInfo.confirmedPassword}
              onChangeText={text => setUserInfo({...userInfo, confirmedPassword: text})}
              secureTextEntry={true}
              numberOfLines={1}
              autoCapitalize='none'
              autoCorrect={false}
            />
            <TouchableOpacity style={styles.clearCredentialsIcon} onPress={() => setUserInfo({...userInfo, confirmedPassword: ''})}>
              <Ionicons name='close-circle' size={20} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <CustomButton
            title={'Sign up'}
            onPress={() => signUp()}
            isDisabled={isDisabled}
          />
          <View style={styles.bottomText}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <TouchableOpacity activeOpacity={0.75}>
              <Text style={styles.signInTextLink} onPress={() => navigation.navigate('SignIn')}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

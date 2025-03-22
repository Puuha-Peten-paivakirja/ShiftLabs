import React, { useState } from 'react'
import { View, TouchableOpacity, Text, Alert } from 'react-native'
import { TextInput } from 'react-native-paper'
import Ionicons from '@expo/vector-icons/Ionicons'
import styles from '../styles/SignUp.js'
import { CustomButton } from '../components/CustomButton'
import { Topbar } from '../components/Topbar.js'
import { useNavigation } from '@react-navigation/native'
import { getAuth, createUserWithEmailAndPassword, firestore, USERS, addDoc, collection } from '../firebase/config.js' 
import isEmail from 'validator/lib/isEmail'
import isStrongPassword from 'validator/lib/isStrongPassword'

export default function WelcomeScreen() {
  const navigation = useNavigation()

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmedPassword: ''
  })

  const validateUserInputs = () => {
    if (user.firstName.trim().length === 0) {
      Alert.alert('Error', 'Firstname is required')
      return false
    }
    else if (user.lastName.trim().length === 0) {
      Alert.alert('Error', 'Lastname is required')
      return false
    }
    else if (user.email.trim().length === 0) {
      Alert.alert('Error', 'Email is required')
      return false
    }
    else if (!isEmail(user.email)) {
      Alert.alert('Error', 'Email is not valid')
      return false
    }
    else if (!isStrongPassword(user.password, {minLength: 8, minLowercase:1 , minUppercase: 1, minNumbers: 1, minSymbols: 0})) {
      Alert.alert('Error', 'Password must contain at least 8 characters, 1 number, 1 uppercase letter and 1 lowercase letter')
      return false
    }
    else if (user.confirmedPassword.trim().length === 0 || user.confirmedPassword !== user.password) {
      Alert.alert('Error', 'Passwords do not match')
      return false
    }
    else {
      return true
    }
  }

  const signUp = () => {
    const auth = getAuth()

    if (!validateUserInputs()) {
      return
    }

    createUserWithEmailAndPassword(auth, user.email, user.password)
      .then((result) => {
        console.log(result.user)
        addDoc(collection(firestore, USERS), {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        })
          .then(() => {
            setUser({
              ...user, 
              firstName: '',
              lastName: '',
              email: '',
              password: '',
              confirmedPassword: ''
            })
            navigation.navigate('SignIn')
          })
          .catch((error) => {
            console.log(error)
          })
      })
      .catch((error) => {
        console.log(error)
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
                value={user.firstName}
                onChangeText={text => setUser({...user, firstName: text})}
                numberOfLines={1}
              />
              <TouchableOpacity style={styles.clearNameIcon} onPress={() => setUser({...user, firstName: ''})}>
                <Ionicons name='close-circle' size={20} />
              </TouchableOpacity>
            </View>

            <View style={styles.nameInputHalf}>
              <TextInput
                style={styles.nameInput}
                label='Last name'
                value={user.lastName}
                onChangeText={text => setUser({...user, lastName: text})}
                numberOfLines={1}
              />
              <TouchableOpacity style={styles.clearNameIcon} onPress={() => setUser({...user, lastName: ''})}>
                <Ionicons name='close-circle' size={20} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.credentialsInputRow}>
            <TextInput
              style={styles.credentialsInput}
              label='Email'
              value={user.email}
              onChangeText={text => setUser({...user, email: text})}
              keyboardType='email-address'
              numberOfLines={1}
            />
            <TouchableOpacity style={styles.clearCredentialsIcon} onPress={() => setUser({...user, email: ''})}>
              <Ionicons name='close-circle' size={20} />
            </TouchableOpacity>
          </View>

          <View style={styles.credentialsInputRow}>
            <TextInput
              style={styles.credentialsInput}
              label='Password'
              value={user.password}
              onChangeText={text => setUser({...user, password: text})}
              secureTextEntry={true}
              numberOfLines={1}
            />
            <TouchableOpacity style={styles.clearCredentialsIcon} onPress={() => setUser({...user, password: ''})}>
              <Ionicons name='close-circle' size={20} />
            </TouchableOpacity>
          </View>

          <View style={styles.credentialsInputRow}>
            <TextInput
              style={styles.credentialsInput}
              label='Confirm password'
              value={user.confirmedPassword}
              onChangeText={text => setUser({...user, confirmedPassword: text})}
              secureTextEntry={true}
              numberOfLines={1}
            />
            <TouchableOpacity style={styles.clearCredentialsIcon} onPress={() => setUser({...user, confirmedPassword: ''})}>
              <Ionicons name='close-circle' size={20} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <CustomButton title={'Sign up'} onPress={() => signUp()}/>
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

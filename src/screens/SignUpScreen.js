import React, { useState } from 'react'
import { View, TextInput, TouchableOpacity } from 'react-native'
import Navbar from '../components/Navbar'
import Ionicons from '@expo/vector-icons/Ionicons'
import styles from '../styles/SignUp'
import { CustomButton } from '../components/CustomButton'

export default function WelcomeScreen() {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmedPassword: ''
  })

  return (
    <View style={styles.container}>
      <Navbar />

      <View style={styles.nameInputRow}>
        <View style={styles.nameInputHalf}>
          <TextInput
            style={styles.nameInput}
            placeholder='First name'
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
            placeholder='Last name'
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
          placeholder='Email'
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
          placeholder='Password'
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
          placeholder='Confirm password'
          value={user.confirmedPassword}
          onChangeText={text => setUser({...user, confirmedPassword: text})}
          secureTextEntry={true}
          numberOfLines={1}
        />
        <TouchableOpacity style={styles.clearCredentialsIcon} onPress={() => setUser({...user, confirmedPassword: ''})}>
          <Ionicons name='close-circle' size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton title={'Sign up'} />
      </View>
    </View>
  )
}

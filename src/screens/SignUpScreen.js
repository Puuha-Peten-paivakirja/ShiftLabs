import React from 'react'
import { View, TextInput, TouchableOpacity } from 'react-native'
import Navbar from '../components/Navbar'
import Ionicons from '@expo/vector-icons/Ionicons'
import styles from "../styles/SignUp"

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Navbar />

      <View style={styles.nameInputRow}>
        <View style={styles.nameInputHalf}>
          <TextInput
            style={styles.nameInput}
            placeholder='First name'
            numberOfLines={1}
          />
          <TouchableOpacity style={styles.clearNameIcon}>
            <Ionicons name='close-circle' size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.nameInputHalf}>
          <TextInput
            style={styles.nameInput}
            placeholder='Last name'
            numberOfLines={1}
          />
          <TouchableOpacity style={styles.clearNameIcon}>
            <Ionicons name='close-circle' size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.credentialsInputRow}>
        <TextInput
          style={styles.credentialsInput}
          placeholder='Email'
          keyboardType='email-address'
          numberOfLines={1}
        />
        <TouchableOpacity style={styles.clearCredentialsIcon}>
          <Ionicons name='close-circle' size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.credentialsInputRow}>
        <TextInput
          style={styles.credentialsInput}
          placeholder='Password'
          secureTextEntry={true}
          numberOfLines={1}
        />
        <TouchableOpacity style={styles.clearCredentialsIcon}>
          <Ionicons name='close-circle' size={20} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

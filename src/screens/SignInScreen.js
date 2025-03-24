import React, { useState } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { TextInput } from 'react-native-paper'
import Ionicons from '@expo/vector-icons/Ionicons'
import { CustomButton } from '../components/CustomButton'
import { Topbar } from '../components/Topbar.js'

export default function GroupScreen() {
  return (
    <View>
      <Topbar title='Sign in' />
    </View>
  )
}

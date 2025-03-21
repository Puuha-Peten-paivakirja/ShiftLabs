import React from 'react'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'

export function CustomButton({title, style, onPress}) {
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        style
      ]}
      activeOpacity={0.75}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 164,
    height: 40,
    backgroundColor: '#68548c',
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff'
  }
})

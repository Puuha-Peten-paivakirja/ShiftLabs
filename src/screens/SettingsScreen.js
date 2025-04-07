import react from 'react'
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native'
import Navbar from '../components/Navbar'
import Feather from '@expo/vector-icons/Feather'

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Navbar />

      <View style={styles.profilePictureContainer}>
        <Image source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} style={styles.profilePicture}/>
      </View>

      <View style={styles.nameContainer}>
        <View style={styles.nameTextContainer}>
          <Text style={styles.textStyle}>Name:</Text>
          <Text style={styles.textStyle} numberOfLines={1}>Placeholder Name</Text>
        </View>
        <TouchableOpacity style={styles.editNameIcon}>
          <Feather name='edit' size={20} />
        </TouchableOpacity>
      </View>
    </View>
  )
}










const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  profilePictureContainer: {
    marginTop: 20
  },
  profilePicture: {
    height: 160,
    width: 160,
    borderRadius: 80
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    maxWidth: '75%',
  },
  nameTextContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 16
  },
  editNameIcon: {
    marginLeft: 16
  },
})

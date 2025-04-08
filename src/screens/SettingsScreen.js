import react, { useState } from 'react'
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native'
import Navbar from '../components/Navbar'
import Feather from '@expo/vector-icons/Feather'
import { TextInput } from 'react-native-paper'
import Ionicons from '@expo/vector-icons/Ionicons'

export default function SettingsScreen() {
  const [editingName, setEditingName] = useState(false)
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  })

  const startNameEdit = () => {
    setEditingName(true)
  }

  const cancelEdit = () => {
    setUserInfo({
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    })
    setEditingName(false)
  }

  return (
    <View style={styles.container}>
      <Navbar />

      <View style={styles.profilePictureContainer}>
        <Image source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} style={styles.profilePicture}/>
      </View>
      {editingName ? (
        <View style={styles.editNameContainer}>
          <Text style={styles.textStyle}>Name:</Text>
          <View style={styles.editNameRow}>
            <View style={styles.editNameHalf}>
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

            <View style={styles.editNameHalf}>
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

          <View style={styles.confirmAndCancel}>
            <TouchableOpacity style={styles.confirmButton} activeOpacity={0.75}>
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              activeOpacity={0.75}
              onPress={() => cancelEdit()}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.nameContainer}>
          <View style={styles.nameTextContainer}>
            <Text style={styles.textStyle}>Name:</Text>
            <Text style={styles.textStyle} numberOfLines={1}>placeholder name</Text>
          </View>
          <TouchableOpacity style={styles.editNameIcon} onPress={() => startNameEdit()}>
            <Feather name='edit' size={20} />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.emailContainer}>
        <View style={styles.emailTextContainer}>
          <Text style={styles.textStyle}>Email address:</Text>
          <Text style={styles.textStyle} numberOfLines={1}>placeholder.name@gmail.com</Text>
        </View>
        <TouchableOpacity style={styles.editEmailIcon}>
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
  editNameContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  editNameRow: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 4
  },
  editNameHalf: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  nameInput: {
    width: 144,
    backgroundColor: '#e6e0e9',
    paddingRight: 32,
    borderBottomColor: 'black',
    borderBottomWidth: 0.8
  },
  clearNameIcon: {
    position: 'absolute',
    right: 4
  },
  confirmAndCancel: {
    marginTop: 20,
    flexDirection: 'row',
    gap: 4
  },
  confirmButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 40,
    backgroundColor: '#228B22',
    borderRadius: 4,
  },
  cancelButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 40,
    backgroundColor: '#D22B2B',
    borderRadius: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff'
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: '100%'
  },
  nameTextContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '60%'
  },
  textStyle: {
    fontSize: 16
  },
  editNameIcon: {
    position: 'absolute',
    right: 40
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: '100%'
  },
  emailTextContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '60%',
  },
  editEmailIcon: {
    position: 'absolute',
    right: 40
  },
})

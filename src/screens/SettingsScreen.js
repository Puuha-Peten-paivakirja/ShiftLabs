import react, { useState, useEffect } from 'react'
import { View, StyleSheet, Image, Text, TouchableOpacity, Platform, Alert } from 'react-native'
import Navbar from '../components/Navbar'
import Feather from '@expo/vector-icons/Feather'
import { TextInput } from 'react-native-paper'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useUser } from '../context/useUser'
import { firestore, USERS, doc, updateDoc, onSnapshot, getDocs, collection, GROUPS, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from '../firebase/config.js'
import isStrongPassword from 'validator/lib/isStrongPassword' 

export default function SettingsScreen() {
  const { user } = useUser()
  const userRef = user ? doc(firestore, USERS, user.uid) : null
  const [isDisabled, setIsDisabled] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [editingEmail, setEditingEmail] = useState(false)
  const [editingPassword, setEditingPassword] = useState(false)
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
  })
  const [editInfo, setEditInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    newPassword: '',
    confirmedNewPassword: ''
  })

  useEffect(() => {
    if(!user) return
    
    const unsubscribe = onSnapshot(userRef, (document) => {
      setUserInfo({
        firstName: document.data().firstName,
        lastName: document.data().lastName,
        email: document.data().email
      })
      setEditInfo({
        firstName: document.data().firstName,
        lastName: document.data().lastName
      })
    })
    return () => {
      unsubscribe()
    }
  }, [])

  const startNameEdit = () => {
    setEditingEmail(false)
    setEditingPassword(false)
    setEditingName(true)
  }

  const startEmailEdit = () => {
    setEditingName(false)
    setEditingPassword(false)
    setEditingEmail(true)
  }

  const startPasswordEdit = () => {
    setEditingEmail(false)
    setEditingName(false)
    setEditingPassword(true)
  }

  const cancelEdit = () => {
    setEditInfo({
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: '',
      newPassword: '',
      confirmedNewPassword: ''
    })
    setUserInfo({...userInfo, currentPassword: ''})
    setEditingName(false)
    setEditingEmail(false)
    setEditingPassword(false)
  }

  const checkPasswordInputs = () => {
    if (!editInfo.newPassword || editInfo.newPassword.length > 30 || !isStrongPassword(editInfo.newPassword, {minLength: 8, minLowercase:1 , minUppercase: 1, minNumbers: 1, minSymbols: 0})) {
      Alert.alert('Error', 'Password must contain 8-30 characters, 1 number, 1 uppercase letter and 1 lowercase letter', [
        {
          onPress: () => setIsDisabled(false)
        }
      ])
      return false
    }
    else if (!editInfo.confirmedNewPassword || editInfo.confirmedNewPassword !== editInfo.newPassword) {
      Alert.alert('Error', 'Confirmed password does not match with new password', [
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

  const updateUserPassword = async () => {
    setIsDisabled(true)

    if (!checkPasswordInputs()) {
      return
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, userInfo.currentPassword)
      await reauthenticateWithCredential(user, credential)
      await updatePassword(user, editInfo.newPassword)
      setEditingPassword(false)
      cancelEdit()
      Alert.alert('Password changed', 'Password changed successfully', [
        {
          onPress: () => setIsDisabled(false)
        }
      ])
    }
    catch (error) {
      if (error.code === 'auth/missing-password') {
        Alert.alert('Error', 'Password is missing', [
          {
            onPress: () => setIsDisabled(false)
          }
        ])
      }
      else if (error.code === 'auth/invalid-credential') {
        Alert.alert('Error', 'Current password is invalid', [
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
    }
  }

  const updateNameInUsersCollection = async () => {
      await updateDoc(userRef, {
        firstName: editInfo.firstName,
        lastName: editInfo.lastName
      })
  }

  const updateNameInGroupUsersSubCollection = async () => {
    const groupsRef = collection(firestore, GROUPS)
    const allGroups = await getDocs(groupsRef)
    const groupIds = allGroups.docs.map((doc) => doc.id)

  }

  const updateName = async () => {
    if (editInfo.firstName.length > 35 || editInfo.lastName.length > 35) {
      Alert.alert(('Error', 'Maximum length for first/last name is 35 characters'))
      return
    }
    else if (!editInfo.firstName || editInfo.firstName.trim().length === 0) {
      Alert.alert(('Error', 'Firstname is required'))
      return
    }
    else if (!editInfo.lastName || editInfo.lastName.trim().length === 0) {
      Alert.alert(('Error', 'Lastname is required'))
      return
    }
    else {
      await updateNameInUsersCollection()
      await updateNameInGroupUsersSubCollection()
      setEditingName(false)
    }
  }

  return (
    <View style={styles.container}>
      <Navbar />

      <View style={styles.profilePictureContainer}>
        <Image source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} style={styles.profilePicture}/>
      </View>

      {editingName ? (
        <View style={styles.editContainer}>
          <Text style={styles.textStyle}>Name:</Text>
          <View style={styles.editNameRow}>
            <View style={styles.editNameHalf}>
              <TextInput 
                style={styles.nameInput}
                label='First name'
                value={editInfo.firstName}
                onChangeText={text => setEditInfo({...editInfo, firstName: text})}
                numberOfLines={1}
                autoCorrect={false}
              />
              <TouchableOpacity style={styles.clearNameIcon} onPress={() => setEditInfo({...editInfo, firstName: ''})}>
                <Ionicons name='close-circle' size={20} />
              </TouchableOpacity>
            </View>

            <View style={styles.editNameHalf}>
            <TextInput 
                style={styles.nameInput}
                label='Last name'
                value={editInfo.lastName}
                onChangeText={text => setEditInfo({...editInfo, lastName: text})}
                numberOfLines={1}
                autoCorrect={false}
              />
              <TouchableOpacity style={styles.clearNameIcon} onPress={() => setEditInfo({...editInfo, lastName: ''})}>
                <Ionicons name='close-circle' size={20} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.confirmAndCancel}>
            <TouchableOpacity
              style={styles.confirmButton}
              activeOpacity={0.75}
              onPress={() => updateName()}
              disabled={isDisabled}
            >
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              activeOpacity={0.75}
              onPress={() => cancelEdit()}
              disabled={isDisabled}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.notEditingContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.textStyle}>Name:</Text>
            <Text style={styles.textStyle} numberOfLines={1}>{userInfo.firstName} {userInfo.lastName}</Text>
          </View>
          <TouchableOpacity style={styles.editIcon} onPress={() => startNameEdit()}>
            <Feather name='edit' size={20} />
          </TouchableOpacity>
        </View>
      )}

      {editingEmail ? (
        <View style={styles.editContainer}>
          <Text style={styles.textStyle}>Email address:</Text>

          <View style={styles.editRow}>
            <TextInput
              style={styles.input}
              label='Current email address'
              value={userInfo.email}
              numberOfLines={1}
              disabled={true}
            />
          </View>

          <View style={styles.editRow}>
            <TextInput
              style={styles.input}
              label='New email address'
              value={editInfo.email}
              onChangeText={text => setEditInfo({...editInfo, email: text})}
              numberOfLines={1}
              autoCapitalize='none'
              autoCorrect={false}
            />
            <TouchableOpacity style={styles.clearIcon} onPress={() => setEditInfo({...editInfo, email: ''})}>
              <Ionicons name='close-circle' size={20} />
            </TouchableOpacity>
          </View>

          <View style={styles.editRow}>
            <TextInput
              style={styles.input}
              label='Password'
              value={userInfo.currentPassword}
              onChangeText={text => setUserInfo({...userInfo, currentPassword: text})}
              secureTextEntry={true}
              numberOfLines={1}
              autoCapitalize='none'
              autoCorrect={false}
            />
            <TouchableOpacity style={styles.clearIcon} onPress={() => setUserInfo({...userInfo, currentPassword: ''})}>
              <Ionicons name='close-circle' size={20} />
            </TouchableOpacity>
          </View>

          <View style={styles.confirmAndCancel}>
            <TouchableOpacity 
              style={styles.confirmButton} 
              activeOpacity={0.75}
            
              disabled={isDisabled}
            >
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              activeOpacity={0.75}
              onPress={() => cancelEdit()}
              disabled={isDisabled}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : ( 
        <View style={styles.notEditingContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.textStyle}>Email address:</Text>
            <Text style={styles.textStyle} numberOfLines={1}>{userInfo.email}</Text>
          </View>
          <TouchableOpacity style={styles.editIcon} onPress={() => startEmailEdit()}>
            <Feather name='edit' size={20} />
          </TouchableOpacity>
        </View>
      )}

      {editingPassword ? (
        <View style={styles.editContainer}>
          <Text style={styles.textStyle}>Change password:</Text>

          <View style={styles.editRow}>
            <TextInput
              style={styles.input}
              label='Current password'
              value={userInfo.currentPassword}
              onChangeText={text => setUserInfo({...userInfo, currentPassword: text})}
              secureTextEntry={true}
              numberOfLines={1}
              autoCapitalize='none'
              autoCorrect={false}
            />
            <TouchableOpacity style={styles.clearIcon} onPress={() => setUserInfo({...userInfo, currentPassword: ''})}>
              <Ionicons name='close-circle' size={20} />
            </TouchableOpacity>
          </View>

          <View style={styles.editRow}>
            <TextInput
              style={styles.input}
              label='New password'
              value={editInfo.newPassword}
              onChangeText={text => setEditInfo({...editInfo, newPassword: text})}
              secureTextEntry={true}
              numberOfLines={1}
              autoCapitalize='none'
              autoCorrect={false}
            />
            <TouchableOpacity style={styles.clearIcon} onPress={() => setEditInfo({...editInfo, newPassword: ''})}>
              <Ionicons name='close-circle' size={20} />
            </TouchableOpacity>
          </View>

          <View style={styles.editRow}>
            <TextInput
              style={styles.input}
              label='Confirm new password'
              value={editInfo.confirmedNewPassword}
              onChangeText={text => setEditInfo({...editInfo, confirmedNewPassword: text})}
              secureTextEntry={true}
              numberOfLines={1}
              autoCapitalize='none'
              autoCorrect={false}
            />
            <TouchableOpacity style={styles.clearIcon} onPress={() => setEditInfo({...editInfo, confirmedNewPassword: ''})}>
              <Ionicons name='close-circle' size={20} />
            </TouchableOpacity>
          </View>

          <View style={styles.confirmAndCancel}>
            <TouchableOpacity
              style={styles.confirmButton}
              activeOpacity={0.75}
              onPress={() => updateUserPassword()}
              disabled={isDisabled}
            >
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              activeOpacity={0.75}
              onPress={() => cancelEdit()}
              disabled={isDisabled}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.notEditingContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.textStyle}>Change password:</Text>
            <Text style={styles.textStyle} numberOfLines={1}>* * * * * * * *</Text>
          </View>
          <TouchableOpacity style={styles.editIcon} onPress={() => startPasswordEdit()}>
            <Feather name='edit' size={20} />
          </TouchableOpacity>
        </View>
      )}
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
  editContainer: {
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
  notEditingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: '100%'
  },
  textContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '60%'
  },
  textStyle: {
    fontSize: 16
  },
  editIcon: {
    position: 'absolute',
    right: 40
  },
  editRow: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center'
  },
  input: {
    width: 292,
    backgroundColor: '#e6e0e9',
    paddingRight: 32,
    borderBottomColor: 'black',
    borderBottomWidth: 0.8
  },
  clearIcon: {
    position: 'absolute',
    right: Platform.OS === 'ios' ? 4 : 3.5
  },
})

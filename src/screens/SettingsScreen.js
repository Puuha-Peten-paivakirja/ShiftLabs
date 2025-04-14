import react, { useState, useEffect } from 'react'
import { View, StyleSheet, Image, Text, TouchableOpacity, Platform, Alert } from 'react-native'
import Navbar from '../components/Navbar'
import Feather from '@expo/vector-icons/Feather'
import { TextInput } from 'react-native-paper'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useUser } from '../context/useUser'
import { firestore, USERS, doc, updateDoc, onSnapshot, getDocs, collection, GROUPS, EmailAuthProvider, reauthenticateWithCredential, updatePassword, GROUPUSERS, query, where } from '../firebase/config.js'
import isStrongPassword from 'validator/lib/isStrongPassword'
import styles from '../styles/Settings.js'

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
    currentEmail: '',
    currentPassword: '',
  })
  const [editInfo, setEditInfo] = useState({
    firstName: '',
    lastName: '',
    newEmail: '',
    newPassword: '',
    confirmedNewPassword: ''
  })

  useEffect(() => {
    if(!user) return
    
    const unsubscribe = onSnapshot(userRef, (document) => {
      setUserInfo({
        firstName: document.data().firstName,
        lastName: document.data().lastName,
        currentEmail: document.data().email
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
      newEmail: '',
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
      setUserInfo({...userInfo, currentPassword: ''})
      setEditInfo({...editInfo, newPassword: '', confirmedNewPassword: ''})
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
        console.log(error)
        Alert.alert('Error', 'Error while changing password', [
          {
            onPress: () => setIsDisabled(false)
          }
        ])
      }
    }
  }

  const checkNameInput = () => {
    if (editInfo.firstName.length > 35 || editInfo.lastName.length > 35) {
      Alert.alert('Error', 'Maximum length for first/last name is 35 characters', [
        {
          onPress: () => setIsDisabled(false)
        }
      ])
      return false
    }
    else if (!editInfo.firstName || editInfo.firstName.trim().length === 0) {
      Alert.alert('Error', 'Firstname is required', [
        {
          onPress: () => setIsDisabled(false)
        }
      ])
      return false
    }
    else if (!editInfo.lastName || editInfo.lastName.trim().length === 0) {
      Alert.alert('Error', 'Lastname is required', [
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

    await Promise.all(groupIds.map(async (groupId) => {
      const groupUsersRef = collection(firestore, GROUPS, groupId, GROUPUSERS)
      const q = query(groupUsersRef, where('email', '==', user.email))
      const groupUserDocument = await getDocs(q)

      if (!groupUserDocument.empty) {
        const documentId = groupUserDocument.docs[0].id
        const groupRef = doc(firestore, GROUPS, groupId, GROUPUSERS, documentId)

        await updateDoc(groupRef, {
          firstName: editInfo.firstName,
          lastName: editInfo.lastName
        })
      }
    }))
  }

  const updateName = async () => {
    setIsDisabled(true)

    if (!checkNameInput()) {
      return
    }

    try {
      await Promise.all([updateNameInUsersCollection(), updateNameInGroupUsersSubCollection()])
      setEditingName(false)
      Alert.alert('Name changed', 'Name changed successfully', [
        {
          onPress: () => setIsDisabled(false)
        }
      ])
    }
    catch (error) {
      console.log(error)
      Alert.alert('Error', 'Error while changing name', [
        {
          onPress: () => setIsDisabled(false)
        }
      ])
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
              value={userInfo.currentEmail}
              numberOfLines={1}
              disabled={true}
            />
          </View>

          <View style={styles.editRow}>
            <TextInput
              style={styles.input}
              label='New email address'
              value={editInfo.newEmail}
              onChangeText={text => setEditInfo({...editInfo, newEmail: text})}
              keyboardType='email-address'
              numberOfLines={1}
              autoCapitalize='none'
              autoCorrect={false}
            />
            <TouchableOpacity style={styles.clearIcon} onPress={() => setEditInfo({...editInfo, newEmail: ''})}>
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
              // onPress not implemented yet
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
            <Text style={styles.textStyle} numberOfLines={1}>{userInfo.currentEmail}</Text>
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

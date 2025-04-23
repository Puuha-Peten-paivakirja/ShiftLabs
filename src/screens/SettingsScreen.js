import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import Navbar from '../components/Navbar'
import Feather from '@expo/vector-icons/Feather'
import { TextInput } from 'react-native-paper'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useUser } from '../context/useUser'
import { HOURS, USERGROUPS, firestore, USERS, doc, updateDoc, onSnapshot, getDocs, collection, GROUPS, EmailAuthProvider, reauthenticateWithCredential, updatePassword, GROUPUSERS, verifyBeforeUpdateEmail, getDoc, deleteUser, CALENDARENTRIES, deleteDoc, SHIFTS } from '../firebase/config.js'
import isStrongPassword from 'validator/lib/isStrongPassword'
import styles from '../styles/Settings.js'
import isEmail from 'validator/lib/isEmail'
import { useTranslation } from 'react-i18next'
import { Dropdown } from 'react-native-element-dropdown'
import Entypo from '@expo/vector-icons/Entypo'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation, CommonActions } from '@react-navigation/native'

export default function SettingsScreen() {
  const { user } = useUser()
  const { t, i18n } = useTranslation()
  const navigation = useNavigation()
  const userDocRef = user ? doc(firestore, USERS, user.uid) : null
  const userGroupsRef = user ? collection(firestore, USERS, user.uid, USERGROUPS) : null
  const [isDisabled, setIsDisabled] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [editingEmail, setEditingEmail] = useState(false)
  const [deletingAccount, setDeletingAccount] = useState(false)
  const [editingPassword, setEditingPassword] = useState(false)
  const [joinedGroups, setJoinedGroups] = useState([])
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
  const languageOptions = [
    { label: t('english'), value: 'en' },
    { label: t('finnish'), value: 'fi' },
  ]
  
  useEffect(() => {
    if(!user) return
    
    const usersInformation = onSnapshot(userDocRef, (document) => {
      setUserInfo({
        firstName: document.data().firstName,
        lastName: document.data().lastName,
        currentEmail: user.email
      })
      setEditInfo({
        firstName: document.data().firstName,
        lastName: document.data().lastName
      })
    })

    const usersGroups = onSnapshot(userGroupsRef, (querySnapshot) => {
      const tempGroups = querySnapshot.docs.map((doc) => (
        doc.data().groupId
      ))
      setJoinedGroups(tempGroups)
    })

    return () => {
      usersInformation()
      usersGroups()
    }
  }, [])

  const startNameEdit = () => {
    setEditingEmail(false)
    setEditingPassword(false)
    setDeletingAccount(false)
    setEditingName(true)
  }

  const startEmailEdit = () => {
    setEditingName(false)
    setEditingPassword(false)
    setDeletingAccount(false)
    setEditingEmail(true)
  }

  const startPasswordEdit = () => {
    setEditingEmail(false)
    setEditingName(false)
    setDeletingAccount(false)
    setEditingPassword(true)
  }

  const startDeletingAccount = () => {
    setEditingEmail(false)
    setEditingName(false)
    setEditingPassword(false)
    setDeletingAccount(true)
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
    setDeletingAccount(false)
  }

  const checkPasswordInputs = () => {
    if (!editInfo.newPassword || editInfo.newPassword.length > 30 || !isStrongPassword(editInfo.newPassword, {minLength: 8, minLowercase:1 , minUppercase: 1, minNumbers: 1, minSymbols: 0})) {
      Alert.alert(t('error'), t('password-requirements'), [
        {
          onPress: () => setIsDisabled(false)
        }
      ])
      return false
    }
    else if (!editInfo.confirmedNewPassword || editInfo.confirmedNewPassword !== editInfo.newPassword) {
      Alert.alert(t('error'), t('confirmed-and-new-password-do-not-match'), [
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
      Alert.alert(t('password-changed'), t('password-changed-successfully'), [
        {
          onPress: () => setIsDisabled(false)
        }
      ])
    }
    catch (error) {
      if (error.code === 'auth/missing-password') {
        Alert.alert(t('error'), t('password-is-missing'), [
          {
            onPress: () => setIsDisabled(false)
          }
        ])
      }
      else if (error.code === 'auth/invalid-credential') {
        Alert.alert(t('error'), t('current-password-is-invalid'), [
          {
            onPress: () => setIsDisabled(false)
          }
        ])
      }
      else {
        console.log(error)
        Alert.alert(t('error'), t('error-while-changing-password'), [
          {
            onPress: () => setIsDisabled(false)
          }
        ])
      }
    }
  }

  const checkNameInput = () => {
    if (editInfo.firstName.length > 35 || editInfo.lastName.length > 35) {
      Alert.alert(t('error'), t('first-and-last-name-length'), [
        {
          onPress: () => setIsDisabled(false)
        }
      ])
      return false
    }
    else if (!editInfo.firstName || editInfo.firstName.trim().length === 0) {
      Alert.alert(t('error'), t('first-name-is-required'), [
        {
          onPress: () => setIsDisabled(false)
        }
      ])
      return false
    }
    else if (!editInfo.lastName || editInfo.lastName.trim().length === 0) {
      Alert.alert(t('error'), t('last-name-is-required'), [
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
    await updateDoc(userDocRef, {
      firstName: editInfo.firstName,
      lastName: editInfo.lastName
    })
  }

  const updateNameInGroupUsersSubCollection = async () => {
    await Promise.all(joinedGroups.map(async (joinedGroupId) => {
      const groupUsersDocRef = doc(firestore, GROUPS, joinedGroupId, GROUPUSERS, user.uid)

      await updateDoc(groupUsersDocRef, {
        firstName: editInfo.firstName,
        lastName: editInfo.lastName
      })
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
      Alert.alert(t('name-changed'), t('name-changed-successfully'), [
        {
          onPress: () => setIsDisabled(false)
        }
      ])
    }
    catch (error) {
      console.log(error)
      Alert.alert(t('error'), t('error-while-changing-name'), [
        {
          onPress: () => setIsDisabled(false)
        }
      ])
    }
  }

  const checkEmailInput = () => {
    if (!editInfo.newEmail || editInfo.newEmail.trim().length === 0) {
      Alert.alert(t('error'), t('email-is-required'), [
        {
          onPress: () => setIsDisabled(false)
        }
      ])
      return false
    }
    else if (!isEmail(editInfo.newEmail)) {
      Alert.alert(t('error'), t('email-is-not-valid'), [
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

  const updateUserEmail = async () => {
    setIsDisabled(true)

    if (!checkEmailInput()) {
      return
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, userInfo.currentPassword)
      await reauthenticateWithCredential(user, credential)
      await verifyBeforeUpdateEmail(user, editInfo.newEmail)
      setEditingEmail(false)
      setUserInfo({...userInfo, currentPassword: ''})
      setEditInfo({...editInfo, newEmail: ''})
      Alert.alert(t('email-sent'), t('email-change-email'), [
        {
          onPress: () => setIsDisabled(false)
        }
      ])
    }
    catch (error) {
      if (error.code === 'auth/missing-password') {
        Alert.alert(t('error'), t('password-is-missing'), [
          {
            onPress: () => setIsDisabled(false)
          }
        ])
      }
      else if (error.code === 'auth/invalid-credential') {
        Alert.alert(t('error'), t('current-password-is-invalid'), [
          {
            onPress: () => setIsDisabled(false)
          }
        ])
      }
      else {
        console.log(error)
        Alert.alert(t('error'), t('error-while-changing-email'), [
          {
            onPress: () => setIsDisabled(false)
          }
        ])
      }
    }
  }

  const changeAppLanguage = async (value) => {
    i18n.changeLanguage(value)

    try {
      await AsyncStorage.setItem('appLanguage', value)
    } 
    catch (error) {
      console.log(error)
    }
  }

  const navigateToWelcomeScreen = () => {
    setIsDisabled(false)
    navigation.dispatch( // Clear the navigation stack and redirect the user to the welcome page
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Welcome' }]
      })
    )
  }

  const deleteCalendarEntries = async () => {
    const calendarEntriesRef = collection(firestore, USERS, user.uid, CALENDARENTRIES)
    const allCalendarEntries = await getDocs(calendarEntriesRef)
    const calendarEntriesIds = allCalendarEntries.docs.map((doc) => doc.id)

    await Promise.all(calendarEntriesIds.map(async (calendarEntriesId) => {
      const calendarEntriesDocRef = doc(firestore, USERS, user.uid, CALENDARENTRIES, calendarEntriesId)
      await deleteDoc(calendarEntriesDocRef)
    }))
  }

  const deleteShiftEntries = async () => {
    const shiftsRef = collection(firestore, USERS, user.uid, SHIFTS)
    const allShifts = await getDocs(shiftsRef)
    const shiftsIds = allShifts.docs.map((doc) => doc.id)

    await Promise.all(shiftsIds.map(async (shiftId) => {
      const shiftsDocRef = doc(firestore, USERS, user.uid, SHIFTS, shiftId)
      await deleteDoc(shiftsDocRef)
    }))
  }

  const deleteUserGroupsEntries = async () => {
    await Promise.all(joinedGroups.map(async (joinedGroupId) => {
      const userGroupsDocRef = doc(firestore, USERS, user.uid, USERGROUPS, joinedGroupId)
      await deleteDoc(userGroupsDocRef)
    }))
  }

  const deleteHoursFromGroupUsers = async () => {
    await Promise.all(joinedGroups.map(async (joinedGroupId) => {
      const hoursRef = collection(firestore, GROUPS, joinedGroupId, GROUPUSERS, user.uid, HOURS)
      const allHours = await getDocs(hoursRef)
      const hoursIds = allHours.docs.map((doc) => doc.id)

      await Promise.all(hoursIds.map(async (hourId) => {
        const hoursDocRef = doc(firestore, GROUPS, joinedGroupId, GROUPUSERS, user.uid, HOURS, hourId)
        await deleteDoc(hoursDocRef)
      }))
    }))
  }

  const deleteShiftsFromGroupUsers = async () => {
    await Promise.all(joinedGroups.map(async (joinedGroupId) => {
      const shiftsRef = collection(firestore, GROUPS, joinedGroupId, GROUPUSERS, user.uid, SHIFTS)
      const allShifts = await getDocs(shiftsRef)
      const shiftsIds = allShifts.docs.map((doc) => doc.id)

      await Promise.all(shiftsIds.map(async (shiftId) => {
        const shiftsDocRef = doc(firestore, GROUPS, joinedGroupId, GROUPUSERS, user.uid, SHIFTS, shiftId)
        await deleteDoc(shiftsDocRef)
      }))
    }))
  }

  const deleteUserFromGroupUsers = async () => {
    await Promise.all(joinedGroups.map(async (joinedGroupId) => {
      const groupUsersDocRef = doc(firestore, GROUPS, joinedGroupId, GROUPUSERS, user.uid)
      await deleteDoc(groupUsersDocRef)
    }))
  }

  const userDeleteAccount = async () => {
    setIsDisabled(true)

    try {
      const credential = EmailAuthProvider.credential(user.email, userInfo.currentPassword)
      await reauthenticateWithCredential(user, credential)
      await Promise.all([
        deleteCalendarEntries(),
        deleteShiftEntries(),
        deleteUserGroupsEntries(),
        deleteHoursFromGroupUsers(),
        deleteShiftsFromGroupUsers(),
        deleteUserFromGroupUsers()
      ])
      await deleteUser(user)
      setUserInfo({...userInfo, currentPassword: ''})
      Alert.alert(t('account-deleted'), t('account-deleted-successfully'), [
        {
          onPress: () => navigateToWelcomeScreen()
        }
      ])
    }
    catch (error) {
      if (error.code === 'auth/missing-password') {
        Alert.alert(t('error'), t('password-is-missing'), [
          {
            onPress: () => setIsDisabled(false)
          }
        ])
      }
      else if (error.code === 'auth/invalid-credential') {
        Alert.alert(t('error'), t('current-password-is-invalid'), [
          {
            onPress: () => setIsDisabled(false)
          }
        ])
      }
      else {
        console.log(error)
        Alert.alert(t('error'), t('error-while-deleting-account'), [
          {
            onPress: () => setIsDisabled(false)
          }
        ])
      }
    }
  }

  return (
    <View style={styles.container}>
      <Navbar />

      <View style={styles.content}>
        {user && editingName &&
          <View style={styles.editContainer}>
            <Text style={styles.textStyle}>{t('name')}:</Text>
            <View style={styles.editNameRow}>
              <View style={styles.editNameHalf}>
                <TextInput 
                  style={styles.nameInput}
                  label={t('first-name')}
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
                  label={t('last-name')}
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
                <Text style={styles.buttonText}>{t('confirm')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                activeOpacity={0.75}
                onPress={() => cancelEdit()}
                disabled={isDisabled}
              >
                <Text style={styles.buttonText}>{t('cancel')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        }

        {user && !editingName &&
          <View style={styles.notEditingContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.textStyle}>{t('name')}:</Text>
              <Text style={styles.textStyle} numberOfLines={1}>{userInfo.firstName} {userInfo.lastName}</Text>
            </View>
            <TouchableOpacity style={styles.editIcon} onPress={() => startNameEdit()}>
              <Feather name='edit' size={20} />
            </TouchableOpacity>
          </View>
        }
        
        {user && editingEmail &&
          <View style={styles.editContainer}>
            <Text style={styles.textStyle}>{t('email-address')}:</Text>

            <View style={styles.editRow}>
              <TextInput
                style={styles.input}
                label={t('current-email-address')}
                value={userInfo.currentEmail}
                numberOfLines={1}
                disabled={true}
              />
            </View>

            <View style={styles.editRow}>
              <TextInput
                style={styles.input}
                label={t('new-email-address')}
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
                label={t('password')}
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
                onPress={() => updateUserEmail()}
                disabled={isDisabled}
              >
                <Text style={styles.buttonText}>{t('confirm')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                activeOpacity={0.75}
                onPress={() => cancelEdit()}
                disabled={isDisabled}
              >
                <Text style={styles.buttonText}>{t('cancel')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        }

        {user && !editingEmail &&
          <View style={styles.notEditingContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.textStyle}>{t('email-address')}:</Text>
              <Text style={styles.textStyle} numberOfLines={1}>{userInfo.currentEmail}</Text>
            </View>
            <TouchableOpacity style={styles.editIcon} onPress={() => startEmailEdit()}>
              <Feather name='edit' size={20} />
            </TouchableOpacity>
          </View>
        }

        {user && editingPassword &&
          <View style={styles.editContainer}>
            <Text style={styles.textStyle}>{t('change-password')}:</Text>

            <View style={styles.editRow}>
              <TextInput
                style={styles.input}
                label={t('current-password')}
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
                label={t('new-password')}
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
                label={t('confirm-new-password')}
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
                <Text style={styles.buttonText}>{t('confirm')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                activeOpacity={0.75}
                onPress={() => cancelEdit()}
                disabled={isDisabled}
              >
                <Text style={styles.buttonText}>{t('cancel')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        }

        {user && !editingPassword &&
          <View style={styles.notEditingContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.textStyle}>{t('change-password')}:</Text>
              <Text style={styles.textStyle} numberOfLines={1}>* * * * * * * *</Text>
            </View>
            <TouchableOpacity style={styles.editIcon} onPress={() => startPasswordEdit()}>
              <Feather name='edit' size={20} />
            </TouchableOpacity>
          </View>
        }

        <View style={styles.languageContainer}>
          <Dropdown
            style={styles.dropdown}
            data={languageOptions}
            labelField='label'
            valueField='value'
            value={i18n.language}
            onChange={item => changeAppLanguage(item.value)}
            selectedTextStyle={styles.dropdownText}
            renderLeftIcon={() => (
              <MaterialIcons name='language' size={20} style={styles.dropdownIconLeft} />
            )}
            renderRightIcon={() => (
              <Entypo name='chevron-right' size={20} style={styles.dropdownIconRight} />
            )}
          />
        </View>
        
        {user && deletingAccount &&
          <View style={styles.editContainer}>
            <Text style={styles.textStyle}>{t('delete-account')}:</Text>
            <View style={styles.editRow}>
              <TextInput
                style={styles.input}
                label={t('password')}
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
                onPress={() => userDeleteAccount()}
                disabled={isDisabled}
              >
                <Text style={styles.buttonText}>{t('confirm')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                activeOpacity={0.75}
                onPress={() => cancelEdit()}
                disabled={isDisabled}
              >
                <Text style={styles.buttonText}>{t('cancel')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        }

        {user && !deletingAccount &&
          <View style={styles.notEditingContainer}>
            <TouchableOpacity style={styles.deleteAccount} onPress={() => startDeletingAccount()}>
              <Text style={styles.textStyle}>{t('delete-account')}</Text>
            </TouchableOpacity>
          </View>
        }
      </View>
    </View>
  )
}

import react, { useState, useEffect } from 'react'
import { View, StyleSheet, Image, Text, TouchableOpacity, Platform, Alert } from 'react-native'
import Navbar from '../components/Navbar'
import Feather from '@expo/vector-icons/Feather'
import { TextInput } from 'react-native-paper'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useUser } from '../context/useUser'
import { firestore, USERS, doc, updateDoc, onSnapshot, getDocs, collection, GROUPS } from '../firebase/config.js' 

export default function SettingsScreen() {
  const { user } = useUser()
  const userRef = user ? doc(firestore, USERS, user.uid) : null
  const [editingName, setEditingName] = useState(false)
  const [editingEmail, setEditingEmail] = useState(false)
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
    newPassword: ''
  })

  useEffect(() => {
    if(!user) return
    
    const unsubscribe = onSnapshot(userRef, (document) => {
      setUserInfo({
        firstName: document.data().firstName,
        lastName: document.data().lastName,
        email: document.data().email,
        currentPassword: '',
      })
      setEditInfo({
        firstName: document.data().firstName,
        lastName: document.data().lastName,
        email: document.data().email,
        newPassword: ''
      })
    })
    return () => {
      unsubscribe()
    }
  }, [])

  const startNameEdit = () => {
    setEditingEmail(false)
    setEditingName(true)
  }

  const startEmailEdit = () => {
    setEditingName(false)
    setEditingEmail(true)
  }

  const cancelEdit = () => {
    setEditInfo({
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.emailName,
      newPassword: ''
    })
    setUserInfo({...userInfo, currentPassword: ''})
    setEditingName(false)
    setEditingEmail(false)
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
    else if (editInfo.firstName.trim().length === 0) {
      Alert.alert(('Error', 'Firstname is required'))
      return
    }
    else if (editInfo.lastName.trim().length === 0) {
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
        <View style={styles.editNameContainer}>
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
            >
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
            <Text style={styles.textStyle} numberOfLines={1}>{userInfo.firstName} {userInfo.lastName}</Text>
          </View>
          <TouchableOpacity style={styles.editNameIcon} onPress={() => startNameEdit()}>
            <Feather name='edit' size={20} />
          </TouchableOpacity>
        </View>
      )}

      {editingEmail ? (
        <View style={styles.editEmailContainer}>
          <Text style={styles.textStyle}>Email address:</Text>

          <View style={styles.editEmailRow}>
            <TextInput
              style={styles.emailInput}
              label='Current email address'
              value={userInfo.email}
              numberOfLines={1}
              disabled={true}
            />
          </View>

          <View style={styles.editEmailRow}>
            <TextInput
              style={styles.emailInput}
              label='New email address'
              value={editInfo.email}
              onChangeText={text => setEditInfo({...editInfo, email: text})}
              numberOfLines={1}
              autoCapitalize='none'
              autoCorrect={false}
            />
            <TouchableOpacity style={styles.clearEmailIcon} onPress={() => setEditInfo({...editInfo, email: ''})}>
              <Ionicons name='close-circle' size={20} />
            </TouchableOpacity>
          </View>

          <View style={styles.passwordRow}>
            <TextInput
              style={styles.passwordInput}
              label='Password'
              value={userInfo.currentPassword}
              onChangeText={text => setUserInfo({...userInfo, currentPassword: text})}
              secureTextEntry={true}
              numberOfLines={1}
              autoCapitalize='none'
              autoCorrect={false}
            />
            <TouchableOpacity style={styles.clearPasswordIcon} onPress={() => setUserInfo({...userInfo, currentPassword: ''})}>
              <Ionicons name='close-circle' size={20} />
            </TouchableOpacity>
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
        <View style={styles.emailContainer}>
          <View style={styles.emailTextContainer}>
            <Text style={styles.textStyle}>Email address:</Text>
            <Text style={styles.textStyle} numberOfLines={1}>{userInfo.email}</Text>
          </View>
          <TouchableOpacity style={styles.editEmailIcon} onPress={() => startEmailEdit()}>
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
  editEmailContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  editEmailRow: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center'
  },
  emailInput: {
    width: 292,
    backgroundColor: '#e6e0e9',
    paddingRight: 32,
    borderBottomColor: 'black',
    borderBottomWidth: 0.8
  },
  clearEmailIcon: {
    position: 'absolute',
    right: Platform.OS === 'ios' ? 4 : 3.5
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
  passwordRow: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center'
  },
  passwordInput: {
    width: 292,
    backgroundColor: '#e6e0e9',
    paddingRight: 32,
    borderBottomColor: 'black',
    borderBottomWidth: 0.8
  },
  clearPasswordIcon: {
    position: 'absolute',
    right: Platform.OS === 'ios' ? 4 : 3.5
  },
})

import React, { useEffect, useState, useCallback  } from "react";
import { View, Image, Text,TouchableOpacity, Modal, ActivityIndicator, Alert } from "react-native";
import Navbar from "../components/Navbar";
import { TextInput, Checkbox  } from "react-native-paper";
import Ionicons from '@expo/vector-icons/Ionicons'
import { addDoc, setDoc, collection, firestore, GROUPS, GROUPUSERS, serverTimestamp, USERS, query, where, getDoc, USERGROUPS, onSnapshot, doc } from "../firebase/config.js";
import { useUser } from "../context/useUser";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import filter from "lodash.filter";
import { useNavigation } from '@react-navigation/native';
import styles from "../styles/Group.js";
import { useTranslation } from "react-i18next";



export default function GroupScreen() {

  // Get the current authenticated user from the custom useUser hook
  const { user } = useUser()
  const { t } = useTranslation();
  const [listOfUsers, setUsersList] = useState([]);
  const [newGroup, setNewGroup] = useState({
    groupName: '',
    groupDesc: '',
  })
  const [ joinedGroups, setJoinedGroups ] = useState([])
  const [ searchQuery , setSearchQuery ] = useState('')
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [checkedUsers, setCheckedUsers] = useState([]);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);



  useEffect(() => {
    // Only proceed if user is logged in
    if (!user) return;
    // Queruy to get groups that user is part of
    const q = query(collection(firestore,USERS,user.uid, USERGROUPS))
    // Listen for changes to the user's groups in real-time
      const groupsUserIn = onSnapshot(q,(querySnapshot) => {
        const tempGroups = querySnapshot.docs.map((doc) => ({
          id: doc.data().groupId,
          groupName: doc.data().groupName, 
          groupDesc: doc.data().groupDesc,
        }))
        // Update the groups that user is joined into a list
        setJoinedGroups(tempGroups)
    })
    // Listen for changes to the users collection in real-time
    const usersQuery = query(collection(firestore, USERS))
    const usersListener = onSnapshot(usersQuery, (querySnapshot) => {
      const usersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        firstName: doc.data().firstName,
        lastName: doc.data().lastName,
        email: doc.data().email,
    })).filter((u) => u.id !== user.uid);// Exclude the logged-in user from the list
    // Update users list
    setUsersList(usersList);
    // Update the filtered users list (used for searching)
    setFilteredUsers(usersList);
    // Set loading to false to show page
    setIsLoading(false)

    });


    // Cleanup listener when component is unmounted or user changes
    return () => {
      groupsUserIn()
      usersListener()
    }
  }, [user])

  // Handles the search query input, filters the list of users, and updates the filtered results
  const handleSearch =  (query) => {
    setSearchQuery(query)
    const formattedQuery = query.toLowerCase()
    const filteredData = filter(listOfUsers, (user) => {
      return contains (user, formattedQuery);
    })
    setFilteredUsers(filteredData)
  }
  // Helper function to check if a user's first or last name contains the search query
  const contains = ({firstName, lastName}, query) =>  {
    const firstNameMatch = firstName.toLowerCase().includes(query);
    const lastNameMatch = lastName.toLowerCase().includes(query);  
    return firstNameMatch || lastNameMatch;
  }

  // Adds or removes user from setCheckedUsers based on user input
  const toggleUser = (selectedUser) => {
    setCheckedUsers((prev) => {
      const exists = prev.find((u) => u.id === selectedUser.id);
      if (exists) {
        return prev.filter((u) => u.id !== selectedUser.id);
      } else {
        return [...prev, { id: selectedUser.id, firstName: selectedUser.firstName, lastName: selectedUser.lastName, email: selectedUser.email }];
      }
    });
  };

  // Creates new group to firebase
  const createGroup = async (group) => {
    const docRef = await addDoc(collection(firestore, GROUPS), {
      groupName: group.groupName,
      description: group.groupDesc,
      created: serverTimestamp()
    });
    console.log('New group saved');
    return docRef;
  };
  
  // Query to find the maching user info to current user
  const getUserName = async () => {
    // User does not contain users first or last name
    // Fetches the info maching the current user from User collection
    try {
      const docRef = doc(firestore, USERS, user.uid);
      const docSnap = await getDoc(docRef);
      if(docSnap.exists()) { 
        const userData = docSnap.data();
        console.log("User fetched succesfully")
        return { firstName: userData.firstName, lastName: userData.lastName }
      } else {
          console.log("User was not found");
      }
  } catch (error) {
      console.error("Error finding the user:", error);
  }
};

// Adds user into the group's "GroupUser" subcollection
const addUserToGroup = async (groupId, userId, userInfo, role) => {
  const { firstName, lastName } = userInfo;
  await setDoc(doc(firestore, GROUPS, groupId, GROUPUSERS, userId), {
    firstName,
    lastName,
    joined: serverTimestamp(),
    role
  });
  console.log(`${role} added to group`);
};

// Add group info to the user's "UserGroups" subcollection
const addGroupToUser = async (userId, groupId, group) => {
  // This is a shortcut reference to the group for quicker lookups
  // It avoids needing to query the entire Groups/GroupUsers structure
  await setDoc(doc(firestore, USERS, userId, USERGROUPS, groupId), {
    groupId,
    groupName: group.groupName,
    groupDesc: group.groupDesc,
    joined: serverTimestamp()
  });
  console.log("Group added to user subcollection");
};


  const save = async () => {
    // Only proceed if user is logged in
    if (user === null) {
      console.log("You must log in first");
      return;
    }
  
    // Groups name can not be empty
    if (newGroup.groupName === '') {
      console.log("Group name empty");
      Alert.alert(t("missing-group-name-alert"), t("missing-group-name-message"));
      return false;
    }
    // Start the saving animation
    setIsSaving(true);

        try{
          // Create a new group document in the "Groups" collection
          const docRef = await createGroup(newGroup);
          // Reset the new group
          setNewGroup({ groupDesc:'', groupName:''})


          // Fetch full name of the current user using email
          const userName = await getUserName();
          // Add the current user to the group's "GroupUsers" subcollection as an admin
          await addUserToGroup(docRef.id, user.uid, userName, "admin");
          // Add the group to current user
          await addGroupToUser(user.uid, docRef.id, newGroup);

          // Add all selected users to "GroupUsers" as members
          // Map to get all users into "GroupUsers"
          await Promise.all(checkedUsers.map(member => addUserToGroup(docRef.id, member.id, member, "member")));


          // Add group info to all selected users
          await Promise.all(checkedUsers.map(member => addGroupToUser(member.id, docRef.id, newGroup)));

          // Reset the togglet users
          setCheckedUsers([])
          console.log("Group and members successfully added!");
          setIsSaving(false);
          return true;

        }catch (error) {
          console.log("Error saving group or adding user:", error)
          setIsSaving(false);
          return false;
        }
  }
  
// Navigation to groups info
  const navigateToGroup = useCallback((groupId) => {
      console.log("Navigating to specific group:", groupId);
      navigation.navigate('SpesificGroup', { groupId });
  }, [user]);


  return (
    <View style={styles.container}>
      <Navbar />

      {isLoading ?(
        <View style={{flex:1, alignItems: 'center',justifyContent:'center'}}>
          <ActivityIndicator size="large" color="#4B3F72" />
        </View>

      ):(
      <View style={{flex:1,}}>
      {user ? (
      <View style={{flex:1, alignItems: 'center',}}>
        <Text style={[styles.headings, {marginTop: 20}]}>{t("my-groups")}</Text>

        {joinedGroups.length > 0 ? (
          <ScrollView style={styles.scrollviewGroups}>
          {
              joinedGroups.map((joinedGroup)=>(
                <View key={joinedGroup.id} style={styles.groupViewItem}>
                  <Text style={styles.groupNameText}>{joinedGroup.groupName}</Text>
                  
                  <Text
                    style={[styles.groupDescText, { textAlign: 'center' }]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {joinedGroup.groupDesc || '-'}
                  </Text>

                  <TouchableOpacity 
                    style={styles.groupInfoButton} 
                    onPress={() => navigateToGroup(joinedGroup.id)}
                  >
                    <Ionicons name='add-outline' size={30} />
                  </TouchableOpacity>
                </View>
              ))
            }
          </ScrollView>):(
            <View >
              <Text style={{fontSize: 18}}>{t("create-or-join-group")}</Text>
            </View>
          )}

        {/*------------------------------------*/}
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={()=>setModalVisible(true)}>
              <Ionicons name='create-outline' size={30} />
              <Text style={styles.createButtonText}>{t("new-group")}</Text>
          </TouchableOpacity>
          
          
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}>
            <View style={styles.modalCreateContainer}>
              <View style={styles.modalCreateView}>
                  <View style={styles.modalTextView}>
                    <Text style={styles.headings}>{t("create-new-group")}</Text>
                  </View>
                  <View style={styles.nameInputHalf}>
                    <TextInput
                      style={styles.nameInput}
                      placeholder={t("group-name")}
                      value={newGroup.groupName}
                      maxLength={25}
                      onChangeText={text => setNewGroup({...newGroup, groupName:text})}
                      numberOfLines={1}
                    />
                    <TouchableOpacity 
                      style={styles.clearNameIcon} 
                      onPress={() => setNewGroup({...newGroup, groupName:''})}
                    >
                      <Ionicons name='close-circle' size={20} />
                    </TouchableOpacity>
                  </View> 

                  <View style={styles.nameInputHalf}>
                    <TextInput
                      style={styles.nameInput}
                      multiline
                      maxLength={50}
                      placeholder={t("group-description")}
                      value={newGroup.groupDesc}
                      onChangeText={text => setNewGroup({...newGroup, groupDesc:text})}
                      numberOfLines={3}
                    />
                    <TouchableOpacity 
                      style={styles.clearNameIcon} 
                      onPress={() => setNewGroup({...newGroup, groupDesc:''})}
                    >
                      <Ionicons name='close-circle' size={20} />
                    </TouchableOpacity>
                  </View> 

                  <View style={styles.serachContainer}>
                    <TextInput 
                      placeholder={t("search-for-people")}
                      autoCapitalize="none" 
                      autoCorrect={false}
                      value={searchQuery}
                      onChangeText={(query) => handleSearch(query)}
                    />
                  </View>

    
                  <FlatList
                      data={filteredUsers}
                      keyExtractor={(item) => item.id}
                      style={styles.scrollviewUser}
                      renderItem={({ item }) => (
                      <View>
                        <View style={styles.userViewItem}>
                          <Text style={styles.userText}>{item.firstName} {item.lastName}</Text>
                          <Checkbox
                            style={styles.checkbox}
                            status={checkedUsers.find(u => u.id === item.id) ? 'checked' : 'unchecked'}
                            onPress={() => toggleUser(item)}
                            />
                          </View>
                        <View style={styles.userSeparator} />
                      </View>
                    )}
                  />
                  
                  <View style={styles.modalButtonView}>
                    <TouchableOpacity
                        style={styles.createGroupButton}
                        onPress={() => setModalVisible(!modalVisible)}>
                        <Text style={styles.createButtonText}>{t("cancel")}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.createGroupButton} 
                      disabled={isSaving}
                      onPress={async () => {
                        const wasSaved = await save();
                        if (wasSaved) {
                          setModalVisible(false);
                        }
                      }}>
                      <Text style={styles.createButtonText}>{t("create")}</Text>
                    </TouchableOpacity>
                  </View>
                  {isSaving && (
                    <View style={styles.loadingOverlay}>
                      <ActivityIndicator size="large" color="#fff" />
                      <Text style={{ color: "#fff", marginTop: 10 }}>{t("creating-group")}</Text>
                    </View>
                  )}
                </View>
              </View>
          </Modal>

      </View>
    ) :(
      <View style={styles.loginContainer}>
        <Text style={styles.loginMessage}>{t("sign-in-to-access-groups")}</Text>
        <Image 
          source={require('../../assets/login-image.png')}
          style={styles.image}
          />
        </View>
      )}
    </View>
    )}
      
    </View>
  );
}

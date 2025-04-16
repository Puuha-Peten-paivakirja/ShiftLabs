import React, { useEffect, useState, useCallback  } from "react";
import { View, Image, Text,TouchableOpacity } from "react-native";
import Navbar from "../components/Navbar";
import { TextInput, Checkbox  } from "react-native-paper";
import Ionicons from '@expo/vector-icons/Ionicons'
import { addDoc, setDoc, collection, firestore, GROUPS, GROUPUSERS, serverTimestamp, USERS, query, where, getDocs, USERGROUPS, onSnapshot, doc } from "../firebase/config.js";
import { useUser } from "../context/useUser";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import filter from "lodash.filter";
import { useNavigation } from '@react-navigation/native';
import styles from "../styles/Group.js";



export default function GroupScreen() {

  // Get the current authenticated user from the custom useUser hook
  const { user } = useUser()
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
  
  const getUserName = async (userEmail) => {
    try {
      // Query to find the maching user info
      const q = query(
        collection(firestore, USERS), 
        where("email", "==", userEmail)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) { 
        const docSnap = querySnapshot.docs[0];       // First matching document
        const userData = docSnap.data();              // The data
        const userId = docSnap.id;
        return { firstName: userData.firstName, lastName: userData.lastName, id: userId }
      } else {
          console.log("Käyttäjää ei löytynyt.");
      }
  } catch (error) {
      console.error("Virhe käyttäjän hakemisessa:", error);
  }
};


  const save = async () => {
    // Only proceed if user is logged in
    if (user !== null) {
      const email = user.email

      if(newGroup.groupName !== ''){
        try{
          // Create a new group document in the "Groups" collection
          const docRef = await addDoc(collection(firestore, GROUPS),{
            groupName: newGroup.groupName,
            description: newGroup.groupDesc,
            created: serverTimestamp()
          })
          // Reset the new group
          setNewGroup({ groupDesc:'', groupName:''})
          console.log('New group saved')
          // Fetch full name of the current user using email
          const userName = await getUserName(email);
          
          // Add the current user to the group's "GroupUsers" subcollection as an admin
          await setDoc(doc(firestore, GROUPS, docRef.id, GROUPUSERS, userName.id ), {
            firstName: userName.firstName,
            lastName: userName.lastName,
            email: email,
            joined: serverTimestamp(),
            role: "admin",
          })
          console.log('Admin added to gruop')
            // Add group info to the user's "UserGroups" subcollection
            // This is a shortcut reference to the group for quicker lookups
            // It avoids needing to query the entire Groups/GroupUsers structure
          await setDoc(doc(firestore, USERS, user.uid, USERGROUPS, docRef.id), {
            groupId: docRef.id,
            groupName: newGroup.groupName,
            groupDesc: newGroup.groupDesc,
            joined: serverTimestamp(),
          });
          console.log("Group added to user subcollection");

          // Add all selected users to "GroupUsers" as members
          
          // Map to get all users into "GroupUsers"
          const addMembers = checkedUsers.map((member) => {
              const { firstName, lastName, email, id} = member;
              return setDoc(doc(firestore, GROUPS, docRef.id, GROUPUSERS, id), {
                firstName,
                lastName,
                email,
                joined: serverTimestamp(),
                role: "member",
              })
            })
            await Promise.all(addMembers)
            console.log("All members added!");

          // Add group info to all selected users
          const addGroupsToUsers = checkedUsers.map((member) => {
              const { id } = member;
              return setDoc(doc(firestore, USERS, id, USERGROUPS, docRef.id),{
                groupId: docRef.id,
                groupName: newGroup.groupName,
                groupDesc: newGroup.groupDesc,
                joined: serverTimestamp(),
              })
          })
          await Promise.all(addGroupsToUsers)
          console.log("Group added to all members")
          setCheckedUsers([''])



        }catch (error) {
          console.log("Error saving group or adding user:", error)
        }
      }
      else{
        console.log("Group name empty")
        alert("Ryhmän nimi ei voi olla tyhjä!")
      }
    }
    else{
      console.log("You must log in first")
    }
  }

  const navigateToGroup = useCallback((groupId) => {
      console.log("Navigating to specific group:", groupId);
      navigation.navigate('SpesificGroup', { groupId });
  }, [navigation]);


  return (
    <View style={styles.container}>
      <Navbar />
      {user ? (
      <ScrollView>
      <View style={styles.groupView}>
        <Text style={styles.headings}>Omat ryhmät:</Text>

        <ScrollView style={styles.scrollviewGroups} nestedScrollEnabled={true}>
        {
            joinedGroups.map((joinedGroup)=>(
              <View key={joinedGroup.id} style={styles.groupViewItem}>
                <Text style={styles.groupText}>{joinedGroup.groupName}</Text>

                <TouchableOpacity 
                  style={styles.groupInfoButton} 
                  onPress={() => navigateToGroup(joinedGroup.id)}
                >
                  <Ionicons name='add-outline' size={30} />
                </TouchableOpacity>
              </View>
            ))
          }
        </ScrollView>

        <View style={styles.separator} />

        {/*------------------------------------*/}
        <Text style={styles.headings}>Luo uusi ryhmä:</Text>

        <View style={styles.nameInputHalf}>
          <TextInput
            style={styles.nameInput}
            placeholder="Ryhmän nimi..."
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
            placeholder="Ryhmän kuvaus..."
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
            placeholder="Etsi henkilöitä..." 
            autoCapitalize="none" 
            autoCorrect={false}
            value={searchQuery}
            onChangeText={(query) => handleSearch(query)}
          />
        </View>

        <ScrollView style={styles.scrollviewUser} nestedScrollEnabled={true}>
          {filteredUsers.map((item) => (
            <View key={item.id}>
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
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.createGroupButton} onPress={save}>
          <Text style={styles.createButtonText}>Luo</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    ) :(
      <View style={styles.loginContainer}>
        <Text style={styles.loginMessage}>Kirjaudu sisään käyttääksesi ryhmiä!</Text>
        <Image 
          source={require('../../assets/login-image.png')}
          style={styles.image}
          />
        </View>
      )}
    </View>
  );
}

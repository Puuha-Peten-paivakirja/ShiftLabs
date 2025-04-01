import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, Text,TouchableOpacity } from "react-native";
import Navbar from "../components/Navbar";
import { TextInput } from "react-native-paper";
import Ionicons from '@expo/vector-icons/Ionicons'
import { addDoc, collection, firestore, GROUPS, GROUPUSERS, serverTimestamp, USERS, query, where, getDocs, USERGROUPS, onSnapshot } from "../firebase/config.js";
import { useUser } from "../context/useUser";
import { ScrollView } from "react-native-gesture-handler";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


export default function GroupScreen() {

  const { user } = useUser()
  const [ userFullName, setFullName ] = useState({
    firstName: '',
    lastName: ''
  })
  const [newGroup, setNewGroup] = useState({
    groupName: '',
    groupDesc: '',
  })
  const [ joinedGroups, setJoinedGroups ] = useState([])

  useEffect(() => {
    if (!user) return;
    
    const q = query(collection(firestore,USERS,user.uid, USERGROUPS))
      const groupsUserIn = onSnapshot(q,(querySnapshot) => {
        const tempGroups = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          groupName: doc.data().groupName, 
        }))
        setJoinedGroups(tempGroups)
      })
      return () => {
        groupsUserIn()
      }
  }, [user])


  const getUserName = async (userEmail) => {
    try {

      const q = query(
        collection(firestore, USERS), 
        where("email", "==", userEmail));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) { 
          querySnapshot.forEach((doc) => {
            setFullName({...userFullName, firstName: doc.data().firstName, lastName:doc.data().lastName})
          })
      } else {
          console.log("Käyttäjää ei löytynyt.");
      }
  } catch (error) {
      console.error("Virhe käyttäjän hakemisessa:", error);
  }
};


  const save = async () => {
    console.log("Saving group:", newGroup);

    if (user !== null) {
      const email = user.email

      if(newGroup.groupName !== ''){
        try{
          const docRef = await addDoc(collection(firestore, GROUPS),{
            groupName: newGroup.groupName,
            description: newGroup.groupDesc,
            created: serverTimestamp()
          })
          setNewGroup({ groupDesc:'', groupName:''})
          console.log('New group saved')
          await getUserName(email)
          
          await addDoc(collection(firestore, GROUPS, docRef.id, GROUPUSERS), {
            firstName: userFullName.firstName,
            lastName: userFullName.lastName,
            email: email,
            joined: serverTimestamp(),
            role: "admin",
          })
          console.log('Admin added to gruop')

          await addDoc(collection(firestore, USERS, user.uid, USERGROUPS), {
            groupId: docRef.id,
            groupName: newGroup.groupName,
            groupDesc: newGroup.groupDesc,
            joined: serverTimestamp(),
          });
          console.log("Group added to user subcollection");

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

  return (
    <View style={styles.container}>
      <Navbar />
      {user ? (
      <View style={styles.group}>
        <Text style={styles.headings}>Omat ryhmät:</Text>

        <ScrollView style={styles.srollwiew} >
          {
            joinedGroups.map((joinedGroup)=>(
              <View key={joinedGroup.id} style={styles.groupItem}>
                <Text style={styles.groupText}>{joinedGroup.groupName}</Text>

                <TouchableOpacity style={styles.groupInfo} onPress={() => alert('Button Pressed!')}>
                  <Ionicons name='add-outline' size={30} />
                </TouchableOpacity>
              </View>
            ))
          }
        </ScrollView>

        <View style={styles.separator} />
        <Text style={styles.headings}>Luo uusi ryhmä:</Text>


        <View style={styles.nameInputHalf}>
          <TextInput
            style={styles.nameInput}
            placeholder="Ryhmän nimi..."
            value={newGroup.groupName}
            onChangeText={text => setNewGroup({...newGroup, groupName:text})}
            numberOfLines={1}
          />
          <TouchableOpacity style={styles.clearNameIcon} onPress={() => setNewGroup({...newGroup, groupName:''})}>
            <Ionicons name='close-circle' size={20} />
          </TouchableOpacity>
        </View> 


        <View style={styles.nameInputHalf}>
          <TextInput
            style={styles.nameInput}
            placeholder="Ryhmän kuvaus..."
            value={newGroup.groupDesc}
            onChangeText={text => setNewGroup({...newGroup, groupDesc:text})}
            numberOfLines={1}
          />
          <TouchableOpacity style={styles.clearNameIcon} onPress={() => setNewGroup({...newGroup, groupDesc:''})}>
            <Ionicons name='close-circle' size={20} />
          </TouchableOpacity>
        </View> 


          <TouchableOpacity style={styles.createGroup} onPress={save}>
            <Text style={styles.createButton}>Luo</Text>
          </TouchableOpacity>


        
      </View>) :(
      <View style={styles.loginContainer}>
        <Text style={styles.loginMessage}>Kirjaudu sisään käyttääksesi ryhmiä!</Text>
        <Image 
          source={require('C:/tyot/Projekti24Kevat/ShiftLabs/assets/login-image.png')}
          style={styles.image}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  group:{
    flex:1,
    alignItems: 'center',
    marginTop: 20,
  },
  headings:{
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom:5,
  },
  separator: {
    height: 1, 
    backgroundColor: 'darkgrey',
    marginVertical: 10,
    width: '90%',
    marginTop: 20,
  },
  nameInput: {
    width: 280,
    backgroundColor: '#e6e0e9', 
    borderBottomColor: 'black',
    borderBottomWidth: 0.8,
  },

  clearNameIcon: {
    position: 'absolute',
    right: 10,
    
  },
  nameInputHalf: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  groupItem: {
    paddingVertical: 15,  
    paddingHorizontal: 20,
    marginVertical: 5,    
    borderColor: '#ccc', 
    backgroundColor: '#F3EDF7',
    width: '100%',         
    alignSelf: 'center', 
    flexDirection: 'row',  
    justifyContent: 'flex-start', 
    alignItems: 'center', 
    },
  groupText: {
    fontSize: 18,
    textAlign: "left",
    flex: 1,
  },
  srollwiew: {
    maxHeight: 200,
    width: "90%",
  },
  groupInfo: {
    justifyContent: 'center',
    alignItems: 'center', 
    padding: 4,
    borderRadius: 5,
    backgroundColor: '#d8bcfc'
  },
  createGroup: {
    backgroundColor: '#68548c',
    borderRadius: 30,
    padding: 15,
    paddingRight: 40,
    paddingLeft: 40,

  },
  createButton:{
    fontSize: 20,
    color: '#FFFFFF',
  },
  loginMessage:{
    textAlign: 'center',
    marginBottom: 30, 
    fontSize: 20,
  },
  image:{
    resizeMode:"contain",
    width: '100%', 
    height: 200, 
  },
  loginContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50, 
  },
});

import React, { useState } from "react";
import { View, Button, StyleSheet, Text,TouchableOpacity } from "react-native";
import Navbar from "../components/Navbar";
import { TextInput } from "react-native-paper";
import Ionicons from '@expo/vector-icons/Ionicons'
import { addDoc, collection, firestore, GROUPS, GROUPUSERS, serverTimestamp, auth, USERS } from "../firebase/config.js";

export default function GroupScreen() {
  const [newGroup, setNewGroup] = useState({
    groupName: '',
    groupDesc: '',
  })

  const save = async () => {
    console.log("Saving group:", newGroup);

    const nowUser = auth.currentUser
    if (nowUser !== null) {
      const email = nowUser.email;

      
        
      try{
        const docRef = await addDoc(collection(firestore, GROUPS),{
          groupName: newGroup.groupName,
          description: newGroup.groupDesc,
          created: serverTimestamp()
        })
        setNewGroup({ groupDesc:'', groupName:''})
        console.log('New group saved')
        
        await addDoc(collection(firestore, GROUPS, docRef.id, GROUPUSERS), {
          userId: nowUser.uid,
          firstName: '',
          email: email,
          joined: serverTimestamp(),
          role: "admin",
        })
        console.log('User added to gruop')

      }catch (error) {
        console.log("Error saving group or adding user:", error)
      }

  }
  else{
    console.log("You must log in first")
  }}

  return (
    <View style={styles.container}>
      <Navbar />

      <View style={styles.group}>
        <Text style={styles.headings}>Omat ryhmät:</Text>

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

        <Button 
          title='Luo'
          onPress={save}
        />


        
      </View>
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
  },
  nameInput: {
    width: 280,
    backgroundColor: '#e6e0e9', //change color!!!
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
});

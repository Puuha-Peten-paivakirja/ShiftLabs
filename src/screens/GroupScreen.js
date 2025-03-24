import React, { useState } from "react";
import { View, StyleSheet, Text,TouchableOpacity } from "react-native";
import Navbar from "../components/Navbar";
import { TextInput } from "react-native-paper";
import Ionicons from '@expo/vector-icons/Ionicons'

export default function GroupScreen() {
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')


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
            value={newName}
            onChangeText={text => setNewName(text)}
            numberOfLines={1}
          />
          <TouchableOpacity style={styles.clearNameIcon} onPress={() => setNewName('')}>
            <Ionicons name='close-circle' size={20} />
          </TouchableOpacity>
        </View> 


        <View style={styles.nameInputHalf}>
          <TextInput
            style={styles.nameInput}
            placeholder="Ryhmän kuvaus..."
            value={newDesc}
            onChangeText={text => setNewDesc(text)}
            numberOfLines={1}
          />
          <TouchableOpacity style={styles.clearNameIcon} onPress={() => setNewDesc('')}>
            <Ionicons name='close-circle' size={20} />
          </TouchableOpacity>
        </View> 


        
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
    backgroundColor: '#FAF5FF', //change color!!!
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

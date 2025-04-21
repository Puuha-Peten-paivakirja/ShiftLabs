// src/styles/Group.js
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  // Containers
    container: {
      flex: 1,
      backgroundColor: "#ffffff",
    },
    groupView:{
      flex:1,
      alignItems: 'center',
      marginTop: 15,
    },
    groupViewItem: {
      paddingVertical: 10,  
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
    loginContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 50, 
    },
    userViewItem: {
      paddingVertical: 10,  
      paddingHorizontal: 20,
      borderColor: '#ccc', 
      backgroundColor: '#F3EDF7',
      width: '100%',         
      alignSelf: 'center', 
      flexDirection: 'row',  
      justifyContent: 'flex-start', 
      alignItems: 'center', 
      justifyContent: 'space-between',
    },
    serachContainer:{
      width: '73%',
      maxHeight: 150,
    },

  // Scrollviews
      scrollviewGroups: {
        maxHeight: 250,
        width: "90%",
      },
      scrollviewUser:{
        maxHeight: 200,
        width: "73%",
      },
      scrollviewGroupsUsers:{
        maxHeight: 150,
        width: "73%",
      },

  // Text
    headings:{
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom:5,
    },
    groupText: {
      fontSize: 18,
      textAlign: "left",
      flex: 1,
    },
    createButtonText:{
      fontSize: 20,
      color: '#FFFFFF',
    },
    loginMessage:{
      textAlign: 'center',
      marginBottom: 30, 
      fontSize: 20,
    },

  // Separatorlines
    separator: {
      height: 1, 
      backgroundColor: 'darkgrey',
      marginVertical: 10,
      width: '90%',
      marginTop: 30,
      marginBottom: 30,
    },
    userSeparator: {
      height: 1,
      backgroundColor: '#ccc',
    },
    
  // Image
    image:{
      resizeMode:"contain",
      width: '100%', 
      height: 200, 
    },


  // Inputs
    nameInput: {
      width: 280,
      backgroundColor: '#e6e0e9', 
      borderBottomColor: 'black',
      borderBottomWidth: 0.8,
    },
    nameInputHalf: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },


  // Icons
    clearNameIcon: {
      position: 'absolute',
      right: 10,
    },
    checkbox:{
      position: 'absolute',
      right: 10,
    },
    removeIcon:{
      position: 'absolute',
      right: 10,
    },


  // Buttons
    groupInfoButton: {
      justifyContent: 'center',
      alignItems: 'center', 
      padding: 4,
      borderRadius: 5,
      backgroundColor: '#d8bcfc'
    },
    createGroupButton: {
      backgroundColor: '#68548c',
      borderRadius: 30,
      padding: 15,
      paddingRight: 40,
      paddingLeft: 40,
      marginTop: 20,
      marginBottom: 20,
    },
  
  });
  
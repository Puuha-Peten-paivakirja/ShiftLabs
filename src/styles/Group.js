// src/styles/Group.js
import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#ffffff",
    },
    group:{
      flex:1,
      alignItems: 'center',
      marginTop: 15,
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
      marginTop: 30,
      marginBottom: 30,
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
    groupText: {
      fontSize: 18,
      textAlign: "left",
      flex: 1,
    },
    srollwiew: {
      maxHeight: 250,
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
      marginTop: 20,
      marginBottom: 20,
  
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
    scrollviewUser:{
      maxHeight: 200,
      width: "73%",
    },
    userItem: {
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
      userInfo: {
        justifyContent: 'center',
        alignItems: 'center', 
        padding: 4,
        borderRadius: 5,
        backgroundColor: '#d8bcfc'
      },
      userSeparator: {
        height: 1,
        backgroundColor: '#ccc',
      },
      serachContainer:{
        width: '73%',
        maxHeight: 150,
      },
      checkbox:{
  
        position: 'absolute',
        right: 10,
      },
  
  });
  
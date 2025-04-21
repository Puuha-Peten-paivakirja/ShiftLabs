// src/styles/Group.js
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  // Containers
    container: {
      flex: 1,
      backgroundColor: "#ffffff",
    },
    groupViewItem: {
      paddingVertical: 10,  
      paddingHorizontal: 20,
      borderRadius: 5,
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
      width: '80%',
      maxHeight: 150,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalView: {
      margin: 20,
      borderRadius: 20,
      height: '70%',
      width: '80%',
      alignItems: 'center',
      shadowColor: 'black',
      elevation: 20,
      backgroundColor: '#e6e0e9', 
    },
    modalTextView:{
      marginTop: 20,
      marginLeft: 8,
      marginRight: 8,
    },
    modalCreateContainer: {
      height: '100%',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
    modalCreateView: {
      margin: 20,
      borderRadius: 20,
      alignItems: 'center',
      elevation: 20,
      shadowColor: 'black',
      backgroundColor: '#ffffff',
      width: '90%', 
    },
    modalButtonView: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignSelf: 'center',
      width: "80%",
      paddingBottom: 20,
      gap: 10,
    },

    
    

  // Scrollviews
      scrollviewGroups: {
        width: "90%",
        maxHeight: '80%',
      },
      scrollviewUser:{
        maxHeight: 200,
        width: "80%",
        marginBottom: 20,
      },
      scrollviewGroupsUsers:{
        maxHeight: 150,
        width: "73%",
      },

  // Text
    headings:{
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    groupText: {
      fontSize: 18,
      textAlign: "left",
      flex: 1,
    },
    createButtonText:{
      fontSize: 20,
      color: '#68548c',
    },
    loginMessage:{
      textAlign: 'center',
      marginBottom: 30, 
      fontSize: 20,
    },
    groupSettingsText: {
      fontSize: 15,
      color: '#68548c',
      textAlignVertical: 'center',
    },
    groupDeleteText: {
      fontSize: 15,
      color: 'darkred',
      textAlignVertical: 'center',
    },
    modalHeader:{
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    modalText: {
      marginBottom: 20,
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
      borderRadius: 30,
      paddingVertical: 12,
      paddingHorizontal: 20,
    },
    groupSettingsButton: {
      backgroundColor: '#e6e0e9',
      borderRadius: 15,
      paddingVertical: 10,
      paddingHorizontal: 15,
      marginTop: 10,
      marginBottom: 10,
      flexDirection: "row",
      justifyContent: 'center',
      alignItems: 'center', 
      width: 280,
      gap: 5
    },
    groupDeleteButton: {
      backgroundColor: '#e6e0e9',
      borderRadius: 15,
      paddingVertical: 10,
      paddingHorizontal: 15,
      marginTop: 10,
      marginBottom: 10,
      flexDirection: "row",
      justifyContent: 'center',
      alignItems: 'center', 
      width: 280,
      gap: 5,
    },
    modalButton: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      backgroundColor: 'transparent',

    },
    floatingButton: {
      position: 'absolute',
      flexDirection: "row",
      justifyContent: 'center',
      right: 20,
      bottom: 30,
      backgroundColor: '#e6e0e9',
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 30,
      elevation: 5,
      gap: 5,
    },
  
  });
  
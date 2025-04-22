import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, Alert } from "react-native";
import Navbar from "../components/Navbar";
import { useNavigation } from '@react-navigation/native';
import styles from "../styles/Group.js";
import Ionicons from '@expo/vector-icons/Ionicons'
import { TextInput, Checkbox } from "react-native-paper";
import { FlatList } from "react-native-gesture-handler";
import { updateDoc, doc, collection, firestore, GROUPS, GROUPUSERS, USERS, HOURS, query, getDocs, USERGROUPS, onSnapshot, deleteDoc } from "../firebase/config.js";
import { useTranslation } from "react-i18next";


export default function SpesificGroupScreen({ route }) {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const [ newName, setNewName] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const {groupUsersAndHours, groupId } = route.params;
    
    const [selectedUser, setSelectedUser] = useState(null);

    const newGroupName = async () => {
            try{
                await updateDoc(doc(firestore,GROUPS,groupId),{
                    groupName:newName,
                })
                const userUpdateGroup = groupUsersAndHours.map(async (user) => {
                    const { id } = user
                    const userRef = doc(firestore, USERS, id, USERGROUPS, groupId)
                    await updateDoc(userRef, { groupName: newName})
                })
                await Promise.all(userUpdateGroup);
                console.log("Group Name changed succheesefully")
                setNewName('')
                Alert.alert(t('group-name-change-alert'), t('group-name-change-success'))
                
            }catch(e){
                console.log("Error in setting the newGroup name:", e)
            }
        }
        const toggleUser = (user) => {
            if (user.id === selectedUser?.id) {
                setSelectedUser(null);
            } else {
                setSelectedUser(user);
            }
        };
    
        const changeAdmin = async () => {
            try{
                console.log("Changing admin to:", selectedUser);
    
            }catch(e){
                console.log(e)
            }
        }
        const deleteGroup = async () => {
            console.log(groupId)
            try{
                console.log('Delete group function started');
        
        // Reference the group document
        const groupRef = doc(firestore, GROUPS, groupId);
        console.log('Group reference created:', groupRef.path);

        // 1. Delete GROUPUSER subcollection
        console.log('Deleting GROUPUSER subcollection...');
        const groupUserCollectionRef = collection(groupRef, 'GROUPUSER'); // Reference to the GROUPUSER subcollection
        const groupUserSnapshot = await getDocs(groupUserCollectionRef);
        
        // Log the size of the snapshot to confirm if there are documents
        console.log('GroupUser Snapshot retrieved:', groupUserSnapshot.size);

        if (groupUserSnapshot.size > 0) {
            // If there are documents in GROUPUSER, delete them
            const deleteUserPromises = groupUserSnapshot.docs.map(doc => {
                console.log('Deleting user in GROUPUSER with id:', doc.id);
                return doc.ref.delete();
            });

            await Promise.all(deleteUserPromises); // Wait for all deletes to complete
            console.log('All users in GROUPUSER have been deleted.');
        } else {
            console.log('No users found in GROUPUSER to delete.');
        }

        // 2. Delete HOURS subcollection
        console.log('Deleting HOURS subcollection...');
        const hoursCollectionRef = collection(groupRef, 'HOURS'); // Reference to the HOURS subcollection
        const hoursSnapshot = await getDocs(hoursCollectionRef);

        // Log the size of the snapshot to confirm if there are documents
        console.log('Hours Snapshot retrieved:', hoursSnapshot.size);

        if (hoursSnapshot.size > 0) {
            // If there are documents in HOURS, delete them
            const deleteHoursPromises = hoursSnapshot.docs.map(doc => {
                console.log('Deleting hour entry with id:', doc.id);
                return doc.ref.delete();
            });

            await Promise.all(deleteHoursPromises); // Wait for all deletes to complete
            console.log('All hours in HOURS have been deleted.');
        } else {
            console.log('No hours found in HOURS to delete.');
        }

        // 3. Delete the GROUP document itself
        console.log('Deleting group document...');
        await deleteDoc(groupRef); // Delete the group document
        console.log('Group with id', groupId, 'and all its subcollections were deleted successfully.');


                // After deletion, navigate to the 'Group' screen
                navigation.navigate('Group')

            }catch(e){
                console.log("Error deleting group: ",e)
            }
    
        }
    


return (
    <View style={styles.container}>
        <Navbar />
        <TouchableOpacity  
            style={styles.backButton}
            onPress={() => {navigation.navigate('Group')}}>
            <Ionicons name='arrow-back-outline' size={25} />
            <Text style={{fontSize:15, fontWeight: 'bold'}} >{t('return')}</Text>
        </TouchableOpacity>
        <View style={{flex:1, alignItems: 'center',justifyContent: 'center', }}>

            <Text style={styles.headings}>{t('settings')}</Text>
            <View style={styles.nameInputHalf}>
                <TextInput
                    style={styles.nameInput}
                    maxLength={25}
                    value={newName}
                    placeholder={t('change-group-name')}
                    onChangeText={text => setNewName(text)}
                />
                <TouchableOpacity 
                    style={styles.clearNameIcon} 
                    onPress={() => newGroupName()}
                >
                    <Ionicons name='checkmark-outline' size={30} />
                </TouchableOpacity>
            </View> 

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={styles.modalTextView}>
                            <Text style={styles.modalHeader}>{t('owner-change')}</Text>
                            <Text style={styles.modalText}>{t('choose-new-owner')}</Text>
                        </View>
                        <FlatList
                            data={groupUsersAndHours}
                            keyExtractor={(item) => item.id}
                            extraData={selectedUser}
                            style={styles.scrollviewGroupsUsersChange}
                            renderItem={({ item }) => (
                            <View>
                                <View style={styles.userViewItem}>
                                  <Text style={styles.userText}>{item.firstName} {item.lastName}</Text>
                                  <Checkbox
                                    status={selectedUser?.id === item.id ? 'checked' : 'unchecked'}
                                    onPress={() => toggleUser(item)}
                                    color="green"
                                  />
                                </View>
                                <View style={styles.userSeparator} />
                              </View>
                            )}
                        />
                        <View style={{justifyContent: 'space-between',flexDirection: "row", paddingTop: 15, gap: 10, paddingBottom: 15}}>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => setModalVisible(!modalVisible)}>
                                <Text style={{color: '#68548c'}}>{t('cancel')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => changeAdmin()}>
                                <Text style={{color: '#68548c'}}>{t('confirm')}</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </Modal>

            <TouchableOpacity
                style={styles.groupSettingsButton}
                onPress={() => {
                    setModalVisible2(false);
                    setModalVisible(true);
                  }}>
                <Ionicons name='pencil-outline' size={25} />
                <Text style={styles.groupSettingsText}>{t('edit-admin-rights')}</Text>
            </TouchableOpacity>


            <TouchableOpacity style={styles.groupDeleteButton} 
                onPress={() => {
                    setModalVisible(false);
                    setModalVisible2(true);
                  }}
                  
            >
                <Ionicons name='trash-sharp' size={30} color="darkred"/>
                <Text style={styles.groupDeleteText }>{t('delete-group')}</Text>
            </TouchableOpacity>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible2}
                onRequestClose={() => {
                    setModalVisible2(!modalVisible2);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalViewDelete}>
                        <View style={styles.modalTextView}>
                            <Text style={styles.modalHeader}>{t('are-you-sure')}</Text>
                            <Text style={styles.modalText}>{t('delete-group-message')}</Text>

                        </View>
                        <TouchableOpacity style={styles.groupDeleteModalButton} 
                            onPress={() => deleteGroup()}>
                            <Text style={styles.groupDeleteText }>{t('i-am-sure-delete-group')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.groupDeleteModalButton} 
                            onPress={() => setModalVisible2(!modalVisible2)}>
                            <Text style={styles.groupDeleteText }>{t('cancel')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>


        </View>

    </View>

)}
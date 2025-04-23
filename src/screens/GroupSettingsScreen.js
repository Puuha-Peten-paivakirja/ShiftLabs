import React, { useState,useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, Modal, Alert, ActivityIndicator,ScrollView, Keyboard, TouchableWithoutFeedback } from "react-native";
import Navbar from "../components/Navbar";
import { useNavigation } from '@react-navigation/native';
import styles from "../styles/Group.js";
import Ionicons from '@expo/vector-icons/Ionicons'
import { TextInput, Checkbox } from "react-native-paper";
import { FlatList } from "react-native-gesture-handler";
import { updateDoc, doc, collection, firestore,setDoc, GROUPS, GROUPUSERS, USERS, HOURS, query, getDocs,getDoc,serverTimestamp, USERGROUPS, onSnapshot, deleteDoc, SHIFTS } from "../firebase/config.js";
import { useTranslation } from "react-i18next";
import { useUser } from "../context/useUser";
import  { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import filter from "lodash.filter";

export default function SpesificGroupScreen({ route }) {
    const { t } = useTranslation();
    const { user } = useUser()
    const navigation = useNavigation();
    const [ newName, setNewName] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const {groupUsersAndHours, groupId } = route.params;
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [checkedUsers, setCheckedUsers] = useState([]);    
    const [selectedUser, setSelectedUser] = useState(null);
    const [listOfUsers, setUsersList] = useState([]);


    useEffect(() => {
        // Get all users for user adding
        const usersQuery = query(collection(firestore, USERS));
        const unsubscribe = onSnapshot(usersQuery, (querySnapshot) => {
            const usersList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                firstName: doc.data().firstName,
                lastName: doc.data().lastName,
            })).filter((u) => 
                u.id !== user.uid && // Exclude logged-in user
                !groupUsersAndHours.some(g => g.id === u.id)); // Exclude logged-in user
    
            setUsersList(usersList);
            setFilteredUsers(usersList);


        });
    
        return () => unsubscribe();
    }, [user ]);

    const handleSearch = (query) => {
        setSearchQuery(query)
            const formattedQuery = query.toLowerCase()
            const filteredData = filter(listOfUsers, (user) => {
              return contains (user, formattedQuery);
            })
            setFilteredUsers(filteredData)
        }
    const contains = ({firstName, lastName}, query) =>  {
        const firstNameMatch = firstName.toLowerCase().includes(query);
        const lastNameMatch = lastName.toLowerCase().includes(query);  
        return firstNameMatch || lastNameMatch;
        }

    const toggleUsers = (selectedUsers) => {
        setCheckedUsers(prev => {
            const exists = prev.find(u => u.id === selectedUsers.id);
            return exists
                ? prev.filter(u => u.id !== selectedUsers.id)
                : [...prev, { id: selectedUsers.id, firstName: selectedUsers.firstName, lastName: selectedUsers.lastName, email: selectedUsers.email }];
        });
    };
    
    const handleAddUsers = async () => {
        try {
            const groupDoc = await getDoc(doc(firestore, GROUPS, groupId));
            const groupName = groupDoc.data().groupName
            const groupDesc = groupDoc.data().description

            await Promise.all(checkedUsers.map(member =>
                addUserToGroup(groupId, member.id, member, "member")
            ));

            await Promise.all(checkedUsers.map(member =>
                addGroupToUser(member.id, groupId, groupName, groupDesc)
            ));
            Alert.alert("Success", "Users added to group!");
            setCheckedUsers([]);
            navigation.navigate('SpecificGroup', { groupId });
            
        } catch (error) {
            console.error("Error adding users:", error);
            Alert.alert("Error", "Failed to add users.");
        }
    };
    const addUserToGroup = async (groupId, userId, userInfo, role) => {
      const { firstName, lastName } = userInfo;
      await setDoc(doc(firestore, GROUPS, groupId, GROUPUSERS, userId), {
        firstName,
        lastName,
        joined: serverTimestamp(),
        role
      });
    };

    const addGroupToUser = async (userId, groupId, groupName, groupDesc) => {
        await setDoc(doc(firestore, USERS, userId, USERGROUPS, groupId), {
            groupId,
            groupName,
            groupDesc,
            joined: serverTimestamp()
          });
    };


    // change the group name
    const newGroupName = async () => {
        if(!newName){
            console.log("New name empty")
            Alert.alert(t("missing-group-name-alert"), t("missing-group-name-message"));
            return;
        }
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



        // Admin change function
        const changeAdmin = async () => {
            if (!selectedUser){
                console.log("No selected user");
                Alert.alert(t('no-new-admin'), t('no-new-admin-message'))
                return false;
            }
            setIsSaving(true);
            try{
                console.log("Changing admin to:", selectedUser);

                const adminRef = doc(firestore, GROUPS, groupId, GROUPUSERS, selectedUser.id);
                const memberRef = doc(firestore, GROUPS, groupId, GROUPUSERS, user.uid);

                // Set selected user as admin
                await updateDoc(adminRef, { role: "admin" });

                // Set current user as member
                await updateDoc(memberRef, { role: "member" });

                setIsSaving(false)
                console.log("Admin change ready")
                navigateToGroup(groupId);
                return true;
    
            }catch(e){
                console.log("Error while changin the admin: ",e)
            }
        }
        // Navigation back to the group info
        const navigateToGroup = useCallback((groupId) => {
            console.log("Navigating to specific group:", groupId);
            navigation.navigate('SpesificGroup', { groupId });
        }, [user]);


        // Deleting the group and its subcollections
        const deleteGroup = async () => {
            console.log(groupId)
            try{
                setIsDeleting(true)
                console.log('Delete group function started');
        
                const groupRef = doc(firestore, GROUPS, groupId)
                const groupUserCollectionRef = collection(groupRef, GROUPUSERS)
                const groupUserSnapshot = await getDocs(groupUserCollectionRef)
                

                const deleteUserPromises = groupUserSnapshot.docs.map(async (userDoc) => {        
                    const hoursCollectionRef = collection(userDoc.ref, HOURS)
                    const hoursSnapshot = await getDocs(hoursCollectionRef)
                    
                    // Delete HOURS for each user if it exists
                    if (hoursSnapshot.size > 0) {
                        const deleteHoursPromises = hoursSnapshot.docs.map(hourDoc => {
                            return hourDoc.ref.delete();
                        });
                        await Promise.all(deleteHoursPromises); // Wait for all HOURS deletes
                    } 
        
                    // After deleting the HOURS subcollection, delete the user document
                    const userDocRef = doc(firestore, GROUPS, groupId, GROUPUSERS, userDoc.id);
                    await deleteDoc(userDocRef); // Delete user in GROUPUSERS
                    console.log('User', userDoc.id, 'deleted');

                    // Now delete the matching USERGROUPS document in USERS/{userId}/USERGROUPS/{groupId}
                    const userId = userDoc.id; 
                    const userGroupRef = doc(firestore, USERS, userId, USERGROUPS, groupId);

                    // Delete the USERGROUPS document for this user
                    await deleteDoc(userGroupRef);
                    
                    // Delete the matching SHIFTS documents in USERS/{userId}/SHIFTS where 'groupId' = groupId
                    const shiftsCollectionRef = collection(firestore, USERS, userId, SHIFTS);
                    const shiftsSnapshot = await getDocs(shiftsCollectionRef);
                    
                    const deleteShiftsPromises = shiftsSnapshot.docs.map(async (shiftDoc) => {
                        const shiftData = shiftDoc.data();
                        if (shiftData.groupId === groupId) {
                            return deleteDoc(shiftDoc.ref); // Delete the shift document
                        }
                    });

                    await Promise.all(deleteShiftsPromises); // Wait for all SHIFTS deletions
                
                });
        
                await Promise.all(deleteUserPromises); // Wait for all user deletions
                console.log('All users in GROUPUSERS have been deleted.');
        
                // Delete the GROUP document itself
                console.log('Deleting group document...');
                await deleteDoc(groupRef); // Delete the group document
                console.log('Group with id', groupId, 'and all its subcollections were deleted successfully.');
                
                // After deletion, navigate to the 'Group' screen
                setIsDeleting(false)
                navigation.navigate('Group')


            }catch(e){
                console.log("Error deleting group: ",e)
                setIsDeleting(false)
            }
    
        }
    


return (
    <KeyboardAwareScrollView style={styles.container}>
        <Navbar />
        <TouchableOpacity  
            style={styles.backButton}
            onPress={() => {navigation.navigate('SpecificGroup', { groupId })}}>
            <Ionicons name='arrow-back-outline' size={25} />
            <Text style={{fontSize:15, fontWeight: 'bold'}} >{t('return')}</Text>
        </TouchableOpacity>

        <View style={{flex:1, alignItems: 'center' }}>
            <Text style={styles.headings}>{t('add-users')}</Text>


            <View style={styles.serachContainer}>
                <TextInput 
                    placeholder={t("search-for-people")}
                    autoCapitalize="none" 
                    autoCorrect={false}
                    value={searchQuery}
                    onChangeText={(query) => handleSearch(query)}
                />
            </View>

            <ScrollView style={styles.scrollviewUser}>
                {filteredUsers.map((item) => (
                    <View key={item.id}>
                    <View style={styles.userViewItem}>
                        <Text style={styles.userText}>
                        {item.firstName} {item.lastName}
                        </Text>
                        <Checkbox
                        status={checkedUsers.find(u => u.id === item.id) ? 'checked' : 'unchecked'}
                        onPress={() => toggleUsers(item)}
                        />
                    </View>
                    <View style={styles.userSeparator} />
                    </View>
                ))}
                </ScrollView>

            <TouchableOpacity
                onPress={handleAddUsers}
                style={{ padding: 10, backgroundColor: '#68548c', borderRadius: 10, marginVertical: 10 }}
            >
                <Text style={{ color: '#fff', textAlign: 'center' }}>{t('add-users-button')}</Text>
            </TouchableOpacity>

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
                            data={groupUsersAndHours.filter(item => item.id !== user.uid)}
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
                                disabled={isSaving}
                                onPress={async() => {
                                    const wasSaved = await changeAdmin();
                                    if(wasSaved) {
                                        setModalVisible(!modalVisible)
                                    }
                                    }}>
                                <Text style={{color: '#68548c'}}>{t('confirm')}</Text>
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
                            disabled={isDeleting}
                            onPress={async () => {
                                const wasSaved = await deleteGroup();
                                if (wasSaved) {
                                  setModalVisible2(!modalVisible2);
                                }
                              }}>
                            <Text style={styles.groupDeleteText }>{t('i-am-sure-delete-group')}</Text>
                        </TouchableOpacity>


                        <TouchableOpacity style={styles.groupDeleteModalButton} 
                            onPress={() => setModalVisible2(!modalVisible2)}>
                            <Text style={styles.groupDeleteText }>{t('cancel')}</Text>
                        </TouchableOpacity>
                        {isDeleting  && (
                            <View style={styles.loadingOverlay}>
                                <ActivityIndicator size="large" color="#fff" />
                                <Text style={{ color: "#fff", marginTop: 10 }}>Poistetaan ryhmää..</Text>
                            </View>
                            )}
                    </View>
                </View>
            </Modal>


        </View>
    </KeyboardAwareScrollView>
        
    );
}
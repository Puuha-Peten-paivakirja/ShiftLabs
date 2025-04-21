import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, } from "react-native";
import Navbar from "../components/Navbar";
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native';
import styles from "../styles/Group.js";
import { useUser } from "../context/useUser";
import { updateDoc, doc, collection, firestore, GROUPS, GROUPUSERS, USERS, query, getDocs, USERGROUPS, onSnapshot, deleteDoc } from "../firebase/config.js";
import { FlatList } from "react-native-gesture-handler";
import { TextInput, Checkbox  } from "react-native-paper";

export default function SpesificGroupScreen({ route }) {
    const navigation = useNavigation();
    const { groupId } = route.params;
    const { user } = useUser()
    const [ groupUsers, setGroupUsers ] = useState([]);
    const [ userHours, setUserHours ] = useState([]);
    const [admin, setAdmin] = useState(false);
    const [ newName, setNewName] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [checkedUser, setCheckedUser] = useState([]);

 useEffect(() => {
    if (!user) return;
    const q = query(collection(firestore,GROUPS,groupId, GROUPUSERS))
        const unsubscribe = onSnapshot(q,(querySnapshot) => {
            const tempGroupUsers = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                firstName: doc.data().firstName,
                lastName: doc.data().lastName,
                role: doc.data().role,
            }))
            const sortedGroupUsers = tempGroupUsers.sort((a, b) => {
                if (a.role === 'admin' && b.role !== 'admin') {
                    return -1; // 'admin' comes first
                } else if (a.role !== 'admin' && b.role === 'admin') {
                    return 1;  // 'admin' comes first
                }
                return 0; // Keep the order unchanged for non-admin users
            });
            setGroupUsers(sortedGroupUsers);

            const findCurrentUserStatus = sortedGroupUsers.find(person => person.id === user.uid);
    
            if (findCurrentUserStatus) {
                if (findCurrentUserStatus.role === 'admin') {
                    setAdmin(true);
                    console.log("User is admin");
                } else {
                    console.log("User is member");
                }
            } else {
                console.log("User not found in group");
            }  
    
    
    })


    return () => {
        unsubscribe()
        
        }
 },[])
    
    const removeMember = async (id) => {
        try{
            await deleteDoc(doc(firestore,GROUPS,groupId, GROUPUSERS, id ));
            await deleteDoc(doc(firestore,USERS, id, USERGROUPS, groupId))
        }catch(e){
            console.log("Error while removing user from group: ", e)
        }
    }

    const newGroupName = async () => {
        try{
            await updateDoc(doc(firestore,GROUPS,groupId),{
                groupName:newName,
            })
            const userUpdateGroup = groupUsers.map(async (user) => {
                const { id } = user
                const userRef = doc(firestore, USERS, id, USERGROUPS, groupId)
                await updateDoc(userRef, { groupName: newName})
            })
            await Promise.all(userUpdateGroup);
            console.log("Group Name changed succheesefully")
            setNewName('')
            alert("SuccCheeseFull")
            
        }catch(e){
            console.log("Error in setting the newGroup name:", e)
        }
    }

    const toggleUser = (selectedUser) => {
        setCheckedUser((prev) => {
            const exists = prev.find((u) => u.id === selectedUser.id);
            if (exists) {
            return prev.filter((u) => u.id !== selectedUser.id);
            } else {
            return [...prev, { id: selectedUser.id, firstName: selectedUser.firstName, lastName: selectedUser.lastName, email: selectedUser.email }];
            }
        });
    };

    const changeAdmin = async () => {
        try{

        }catch(e){
            console.log(e)
        }
    }
    const deleteGroup = async () => {
        try{

        }catch(e){
            console.log(e)
        }

    }
    return (
        <View style={styles.container}>
            <Navbar />
                
                <TouchableOpacity  
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
                    onPress={() => {navigation.navigate('Group')}}>
                    <Ionicons name='arrow-back-outline' size={25} />
                    <Text style={{fontSize:15, fontWeight: 'bold'}} >Takaisin</Text>
                </TouchableOpacity>

                <View style={{flex:1, alignItems: 'center',}}>
                        
                    <View>
                        <Text style={styles.headings}>Ryhmän työtunnit:</Text>
                    </View>
                    <View style={styles.separator} />
                    {/*------------------------------------*/}

                    
                    <Text style={styles.headings}>Henkilöt:</Text>

                        <FlatList
                            data={groupUsers}
                            keyExtractor={(item) => item.id}
                            style={styles.scrollviewGroupsUsers}
                            renderItem={({ item }) => (
                            <View>
                                {admin?(
                                <View style={styles.userViewItem}>
                                    <Text style={styles.userText}>{item.firstName} {item.lastName}</Text>
                                    {item.role !== 'admin' && (
                                    <TouchableOpacity 
                                        style={styles.removeIcon} 
                                        onPress={() => removeMember(item.id)}
                                    >
                                        <Ionicons name='trash-outline' size={25} />
                                    </TouchableOpacity>)}
                                </View>
                                ):(
                                <View style={styles.userViewItem}>
                                    <Text style={styles.userText}>{item.firstName} {item.lastName}</Text>
                                </View>

                                )}

                                <View style={styles.userSeparator} />
                            </View> 
                            )}
                        />

                    
                    {admin === true && (
                        <View style={{flex:1, alignItems: 'center',}}>

                            <Text style={styles.headings}>Asetukset:</Text>
                            <View style={styles.nameInputHalf}>
                                <TextInput
                                    style={styles.nameInput}
                                    maxLength={25}
                                    value={newName}
                                    placeholder="Vaihda ryhmän nimeä..."
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
                                            <Text style={styles.modalHeader}>Ryhmän omistajan vaihtaminen:</Text>
                                            <Text style={styles.modalText}>Valitse yksi ryhmä henkilöistä sen uudeksi omistajaksi</Text>
                                        </View>
                                        <FlatList
                                            data={groupUsers}
                                            keyExtractor={(item) => item.id}
                                            style={styles.scrollviewGroupsUsers}
                                            renderItem={({ item }) => (
                                            <View>
                                                <View style={styles.userViewItem}>
                                                    <Text style={styles.userText}>{item.firstName} {item.lastName}</Text>
                                                    
                                                </View>
                                            <View style={styles.userSeparator} />
                                            </View> 
                                            )}
                                        />
                                        <TouchableOpacity
                                            style={styles.modalButton}
                                            onPress={() => setModalVisible(!modalVisible)}>
                                            <Text style={{color: '#68548c'}}>Peruuta</Text>
                                        </TouchableOpacity>

                                    </View>
                                </View>
                            </Modal>

                            <TouchableOpacity
                                style={styles.groupSettingsButton}
                                onPress={() => setModalVisible(true)}>
                                <Ionicons name='pencil-outline' size={25} />
                                <Text style={styles.groupSettingsText}>Muokkaa hallintaoikeuksia</Text>
                            </TouchableOpacity>


                            <TouchableOpacity style={styles.groupDeleteButton} onPress={deleteGroup}>
                                <Ionicons name='trash-sharp' size={30} color="darkred"/>
                                <Text style={styles.groupDeleteText }>Poista Ryhmä</Text>
                            </TouchableOpacity>

                        </View>

                    )}
                    
                
                </View>

        </View>
    )
}

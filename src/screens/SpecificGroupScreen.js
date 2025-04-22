import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Navbar from "../components/Navbar.js";
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native';
import styles from "../styles/Group.js";
import { useUser } from "../context/useUser.js";
import { addDoc, updateDoc, doc, collection, firestore, GROUPS, GROUPUSERS, serverTimestamp, USERS, query, where, getDocs, USERGROUPS, onSnapshot, deleteDoc } from "../firebase/config.js";
import { FlatList } from "react-native-gesture-handler";
import { TextInput  } from "react-native-paper";




export default function SpecificGroupScreen({ route }) {
    const navigation = useNavigation();
    const { groupId } = route.params;
    const { user } = useUser()
    const [ groupUsers, setGroupUsers ] = useState([]);
    const [ userHours, setUserHours ] = useState([]);
    const [admin, setAdmin] = useState(false);
    const [ newName, setNewName] = useState('');


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
    const changeAdmin = async () => {
        console.log("hih")
    }
    const deleteGroup = async () => {
        console.log("heh")

    }
    return (
        <View style={styles.container}>
            <Navbar />
                <TouchableOpacity  
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
                    onPress={() => {navigation.navigate('Group')}}>
                    <Ionicons name='arrow-back-outline' size={30} />
                    <Text style={{fontSize:15, fontWeight: 'bold'}} >Takaisin</Text>
                </TouchableOpacity>
                <View style={{flex:1, alignItems: 'center',}}>
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
                    <View style={styles.separator} />
                    {/*------------------------------------*/}

                    <View>
                        <Text style={styles.headings}>Ryhmän työtunnit:</Text>


                    </View>
                    {admin == true && (
                        <View>
                            <Text style={styles.headings}>Asetukset:</Text>
                            <View style={styles.nameInputHalf}>
                            <TextInput
                                style={styles.nameInput}
                                maxLength={50}
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


                        </View>

                    )}
                    
                
                </View>

        </View>
    )
}

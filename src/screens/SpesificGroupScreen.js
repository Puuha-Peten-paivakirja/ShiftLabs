import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, } from "react-native";
import Navbar from "../components/Navbar";
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native';
import styles from "../styles/Group.js";
import { useUser } from "../context/useUser";
import { doc, collection, firestore, GROUPS, GROUPUSERS, USERS, HOURS, query, getDocs, USERGROUPS, onSnapshot, deleteDoc } from "../firebase/config.js";
import { FlatList } from "react-native-gesture-handler";
import CircularSegments from '../components/GroupTimeCircle.js'

export default function SpesificGroupScreen({ route }) {
    const navigation = useNavigation();
    const { groupId } = route.params;
    const { user } = useUser()
    const [ groupUsersAndHours, setGroupUsersAndHours ] = useState([]);
    const [admin, setAdmin] = useState(false);
        
    



 useEffect(() => {
    if (!user) return;
    const q = query(collection(firestore,GROUPS,groupId, GROUPUSERS))
        const unsubscribe = onSnapshot(q, async(querySnapshot) => {
            try {
                const tempGroupUsers = await Promise.all(
                  querySnapshot.docs.map(async (doc) => {
                    const userData = doc.data();
                    const userId = doc.id;
          
                    // Fetch from subcollection 'hours'
                    const hoursRef = collection(
                        firestore,
                        GROUPS,
                        groupId,
                        GROUPUSERS,
                        userId,
                        HOURS
                      );
            
                    const hoursSnapshot = await getDocs(hoursRef);
          
                    let hours = null;
                    if (hoursSnapshot.docs.length > 0) {
                        const firstDocData = hoursSnapshot.docs[0].data();

                        hours = firstDocData.hours || null;
                    }

                    return {
                      id: userId,
                      firstName: userData.firstName,
                      lastName: userData.lastName,
                      role: userData.role,
                      hours: hours,
                    };
                  })
                );

            const sortedGroupUsers = tempGroupUsers.sort((a, b) => {
                if (a.role === 'admin' && b.role !== 'admin') {
                    return -1; // 'admin' comes first
                } else if (a.role !== 'admin' && b.role === 'admin') {
                    return 1;  // 'admin' comes first
                }
                return 0; // Keep the order unchanged for non-admin users
            });
            setGroupUsersAndHours(sortedGroupUsers);
            

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
            }catch(e) {
                console.log('Error fetching groups users and their hours: ', e)
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

    
    return (
        <View style={styles.container}>
            <Navbar />
                <View style={{flexDirection: 'row',justifyContent: 'space-between', width: '100%' }}>
                    <TouchableOpacity  
                        style={styles.backButton}
                        onPress={() => {navigation.navigate('Group')}}>
                        <Ionicons name='arrow-back-outline' size={25} />
                        <Text style={{fontSize:15, fontWeight: 'bold'}} >Takaisin</Text>
                    </TouchableOpacity>

                    {admin === true &&(
                    <TouchableOpacity  
                        style={styles.settingsButton}
                        onPress={() => {navigation.navigate('GroupSettingsScreen', {groupUsersAndHours, groupId})}}>
                        <Ionicons name='settings-outline' size={30} />
                    </TouchableOpacity>
                    )}
                </View>

                <View style={{flex:1, alignItems: 'center',}}>
                
                    <Text style={styles.headings}>Ryhmän työtunnit:</Text>
                    <CircularSegments data={groupUsersAndHours} />

                    

                    <View style={styles.separator} />
                    {/*------------------------------------*/}

                
                    <Text style={styles.headings}>Henkilöt:</Text>
                    <FlatList
                        data={groupUsersAndHours}
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
                    
                
                </View>

        </View>
    )
}

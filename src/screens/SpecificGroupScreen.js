import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import Navbar from "../components/Navbar";
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native';
import styles from "../styles/Group.js";
import { useUser } from "../context/useUser";
import { doc, collection, firestore, GROUPS, GROUPUSERS, USERS, HOURS, query, getDocs, USERGROUPS, onSnapshot, deleteDoc, SHIFTS } from "../firebase/config.js";
import { FlatList } from "react-native-gesture-handler";
import CircularSegments from '../components/GroupTimeCircle.js'
import { useTranslation } from 'react-i18next'

export default function SpecificGroupScreen({ route }) {
    const navigation = useNavigation();
    const { groupId } = route.params;
    const { user } = useUser()
    const [ groupUsersAndHours, setGroupUsersAndHours ] = useState([]);
    const [admin, setAdmin] = useState(false);
    const { t } = useTranslation()
    const [isLoading, setIsLoading] = useState(true)
    


 useEffect(() => {
    if (!user) return;
    // Get userdata and users hours from database
    const q = query(collection(firestore,GROUPS,groupId, GROUPUSERS))
        const unsubscribe = onSnapshot(q, async(querySnapshot) => {
            try {
                const tempGroupUsers = await Promise.all(
                  querySnapshot.docs.map(async (doc) => {
                    const userData = doc.data();
                    const userId = doc.id;
          
                    
                    const hoursRef = collection(
                        firestore,
                        GROUPS,
                        groupId,
                        GROUPUSERS,
                        userId,
                        HOURS
                      );
                    // Fetch from subcollection 'hours'
                    const hoursSnapshot = await getDocs(hoursRef);
          
                    // Save the hours from users subcollection 'hours'
                    let hours = null;
                    if (hoursSnapshot.docs.length > 0) {
                        const firstDocData = hoursSnapshot.docs[0].data();

                        hours = firstDocData.hours || null;
                    }
                    // Returns the user data and users hours
                    return {
                      id: userId,
                      firstName: userData.firstName,
                      lastName: userData.lastName,
                      role: userData.role,
                      hours: hours,
                    };
                  })
                );
            
            // Sorter to get user as first in list
            // This is done to make the view look nicer
            const sortedGroupUsers = tempGroupUsers.sort((a, b) => {
                if (a.role === 'admin' && b.role !== 'admin') {
                    return -1; // 'admin' comes first
                } else if (a.role !== 'admin' && b.role === 'admin') {
                    return 1;  // 'admin' comes first
                }
                return 0; // Keep the order unchanged for non-admin users
            });
            setGroupUsersAndHours(sortedGroupUsers);
            
            // Find the corresponding info to the current user from groups user Info
            const findCurrentUserStatus = sortedGroupUsers.find(person => person.id === user.uid);
    
            // If current user is groups admin it puts setAdmin = true
            if (findCurrentUserStatus) {
                if (findCurrentUserStatus.role === 'admin') {
                    setAdmin(true);
                    setIsLoading(false)
                    console.log("User is admin");
                } else {
                    console.log("User is member");
                    setIsLoading(false)
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
 },[groupId, user])

    // Remove member from group    
    const removeMember = async (id) => {
        try{
            // Remove hours of the user
            const hoursSnapshot = await getDocs(collection(firestore, GROUPS, groupId, GROUPUSERS, id, HOURS));
            const deleteHoursPromises = hoursSnapshot.docs.map(doc => deleteDoc(doc.ref));
            await Promise.all(deleteHoursPromises)
            console.log('Hours with group deleted from user')
            // Remove user from Group
            await deleteDoc(doc(firestore,GROUPS,groupId, GROUPUSERS, id ));
            console.log("User removed from group")
            // Remove group from members 'user-Groups' subcollection
            await deleteDoc(doc(firestore,USERS, id, USERGROUPS, groupId))
            console.log("Group removed from user")
            // Delete the matching SHIFTS documents in 'USERS/{userId}/SHIFTS' where 'groupId' = groupId
            const shiftsSnapshot = await getDocs(collection(firestore, USERS, id, SHIFTS));
            
            const deleteShiftsPromises = shiftsSnapshot.docs.map(async (shiftDoc) => {
                const shiftData = shiftDoc.data();
                if (shiftData.groupId === groupId) {
                    return deleteDoc(shiftDoc.ref); // Delete the shift document
                }
            });
            await Promise.all(deleteShiftsPromises); // Wait for all SHIFTS deletions
            console.log("All users group shifts removed")

            console.log("member removed succesfully")
        }catch(e){
            console.log("Error while removing user from group: ", e)
        }
    }

    
    return (
        <View style={styles.container}>
            <Navbar />
            {isLoading ?(
                    <View style={{flex:1, alignItems: 'center',justifyContent:'center'}}>
                      <ActivityIndicator size="large" color="#4B3F72" />
                    </View>
            
                  ):(
                <View style={{flex: 1}}>
                    <View style={{flexDirection: 'row',justifyContent: 'space-between', width: '100%' }}>
                        <TouchableOpacity  
                            style={styles.backButton}
                            onPress={() => {navigation.navigate('Group')}}>
                            <Ionicons name='arrow-back-outline' size={25} />
                            <Text style={{fontSize:15, fontWeight: 'bold'}} >{t('return')}</Text>
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
                        <Text style={styles.headings}>{t('groups-working-hours')}</Text>
                        <CircularSegments 
                            data={groupUsersAndHours}
                            message={t("no-working-hours")}
                            />

                        

                        <View style={styles.separator} />
                        {/*------------------------------------*/}

                    
                        <Text style={styles.headings}>{t('members')}:</Text>
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
                
            </View>)}



        </View>
    )
}

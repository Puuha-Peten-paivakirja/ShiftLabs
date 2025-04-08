import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Navbar from "../components/Navbar";
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native';
import styles from "../styles/Group.js";
import { useUser } from "../context/useUser";
import { addDoc, collection, firestore, GROUPS, GROUPUSERS, serverTimestamp, USERS, query, where, getDocs, USERGROUPS, onSnapshot } from "../firebase/config.js";
import { FlatList } from "react-native-gesture-handler";



export default function SpesificGroupScreen({ route }) {
    const navigation = useNavigation();
    const { groupId } = route.params;
    const { user } = useUser()
    const [ groupUsers, setGroupUsers ] = useState([]);
    const [ userHours, setUserHours ] = useState([])
    let admin = false;


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
            setGroupUsers(tempGroupUsers)
        })
    
    

    return () => {
        unsubscribe()
        
        }
 })
    
 

    return (
        <View style={styles.container}>
            <Navbar />
            <TouchableOpacity  
                style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
                onPress={() => {navigation.navigate('Group')}}>
                <Ionicons name='arrow-back-outline' size={30} />
                <Text style={{fontSize:15, fontWeight: 'bold'}} >Takaisin</Text>
            </TouchableOpacity>

            <View style={styles.group}>
                    <Text style={styles.headings}>Henkilöt:</Text>
                    <FlatList
                        data={groupUsers}
                        keyExtractor={(item) => item.id}
                        style={styles.scrollviewUser}
                        renderItem={({ item }) => (
                        <View>
                            <View style={styles.userItem}>
                                <Text style={styles.userText}>{item.firstName} {item.lastName}</Text>
                            </View>
                           <View style={styles.userSeparator} />
                        </View> 
                        )}
                    />

                <View>
                    <Text style={styles.headings}>Ryhmän työtunnit:</Text>
                </View>

                <View>
                    <Text style={styles.headings}>Asetukset:</Text>
                </View>
            
            </View>

        </View>
    )
}

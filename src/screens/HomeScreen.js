import React, { useState, useEffect }  from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Navbar from "../components/Navbar";
import styles from "../styles/Home";
import CircularSegments from '../components/GroupTimeCircle.js'
import { collection, firestore, getDocs, SHIFTS, USERS, doc, GROUPS,} from "../firebase/config.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from 'react-i18next'
import { useUser } from "../context/useUser";


export default function HomeScreen() {
  const navigation = useNavigation();
  const [groupsAndHours, setGroupsAndHours] = useState([]);
  const { user } = useUser();
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(true)

  

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        // Get locally saved shifts
        const savedShifts = await AsyncStorage.getItem("shifts");
        const parsedShifts = savedShifts ? JSON.parse(savedShifts) : [];

        // Query for firebase shifts
        let firebaseShifts = [];
        if (user) {
          const userShiftsRef = collection(firestore, USERS, user.uid, SHIFTS);
          const querySnapshot = await getDocs(userShiftsRef);
          firebaseShifts = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        }
        const groupNames = {};
        const allShifts = [...parsedShifts];
        for (let fbShift of firebaseShifts) {
          // Get the group name from the shift's groupId
          let groupName = fbShift.name || "Omat työvuorot"; // Use the shift name if available

          if (!groupName && fbShift.groupId) {
            // If the shift does not have a name, fetch the group name based on groupId
            if (!groupNames[fbShift.groupId]) {
              const groupRef = doc(firestore, GROUPS, fbShift.groupId);
              const groupDoc = await getDoc(groupRef);
              groupName = groupDoc.exists() ? groupDoc.data().groupName : "Unknown Group";
              groupNames[fbShift.groupId] = groupName; // Cache the result for future use
            } else {
              groupName = groupNames[fbShift.groupId];
            }
          }

          // Ensure that we add only unique shifts (by ID)
          if (!allShifts.some((s) => s.id === fbShift.id)) {
            allShifts.push({
              ...fbShift,
              name: groupName,
            });
          }
        }

        const groupMap = {};

        // Take only the hours and minutes into a count from duration
        allShifts.forEach((shift) => {
          const groupName = shift.name || "Omat työvuorot";
          const duration = shift.duration || "00:00:00";
          const [hh, mm, ss] = duration.split(":").map(Number);
          
          const totalHours = hh + mm / 60;

          if (!groupMap[groupName]) {
            groupMap[groupName] = 0;
          }

          groupMap[groupName] += totalHours;
        });

        // Convert groupMap to array and round hours
        const formattedGroups = Object.keys(groupMap).map((group) => ({
          firstName: group,
          hours: parseFloat(groupMap[group].toFixed(2)),
        }));

        
        // Now we got list of groups and hours there are total in them
        setGroupsAndHours(formattedGroups);
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading shifts:", error);
      }
    };

    fetchShifts();

  }, [user]);

  return (
    <View style={styles.container}>
      <Navbar />
      {isLoading ?(
              <View style={{flex:1, alignItems: 'center',justifyContent:'center'}}>
                <ActivityIndicator size="large" color="#4B3F72" />
              </View>
      ):(
        <View style={styles.profileContainer}>
          <View style={styles.progressCircle}>
            <CircularSegments 
              data={groupsAndHours}
              message={t("user-has-no-hours")}
              />
          </View>
          <TouchableOpacity style={styles.floatingButton}
            onPress={() => {navigation.navigate('AddShift')}}>
            <MaterialIcons name="add" size={40} color="#4B3F72" />

          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

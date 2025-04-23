import React, { useState, useEffect }  from "react";
import { View, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Navbar from "../components/Navbar";
import styles from "../styles/Home";
import CircularSegments from '../components/GroupTimeCircle.js'
import { collection, firestore, getDocs, SHIFTS, USERS, doc, GROUPS,} from "../firebase/config.js";
import AsyncStorage from "@react-native-async-storage/async-storage";


import { useUser } from "../context/useUser";


export default function HomeScreen() {
  const navigation = useNavigation();
  const [groupsAndHours, setGroupsAndHours] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const savedShifts = await AsyncStorage.getItem("shifts");
        const parsedShifts = savedShifts ? JSON.parse(savedShifts) : [];

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

        

        setGroupsAndHours(formattedGroups);
        console.log("Groups and Hours:", formattedGroups)
      } catch (error) {
        console.error("Error loading shifts:", error);
      }
    };

    fetchShifts();
  }, [user]);

  return (
    <View style={styles.container}>
      <Navbar />

      {/* Circular Profile Image */}
      <View style={styles.profileContainer}>
        <View style={styles.progressCircle}>
          
          <CircularSegments data={groupsAndHours} />

        </View>
      </View>

      {/* Work Hours Section */}


      {/* Floating Edit Button */}
      <TouchableOpacity style={styles.floatingButton}>
        <MaterialIcons name="edit" size={24} color="#4B3F72" />
      </TouchableOpacity>
    </View>
  );
}

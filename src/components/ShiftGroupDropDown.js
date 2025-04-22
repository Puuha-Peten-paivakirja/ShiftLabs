import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { collection, getDocs } from "firebase/firestore";
import { firestore, auth } from "../firebase/config";
import styles from "../styles/AddShift";
import { TextInput } from "react-native-paper";
import { useUser } from "../context/useUser";

const ShiftGroupDropDown = ({ shiftName, setShiftName }) => {
    const [inputDropDownVisible, setInputDropDownVisible] = useState(false);
    const [groupOptions, setGroupOptions] = useState([]);
    const { user } = useUser();


    const toggleDropdown = () => {
        setInputDropDownVisible(!inputDropDownVisible);
    };

    const selectGroupName = (name) => {
        setShiftName(name == "Ei ryhmää" ? "" : name);
        setInputDropDownVisible(false);
    };

    const fetchUserGroups = async () => {
        try {
                if (user) {
                    console.log("Fetching groups for user:", user.uid);
                const userGroupsRef = collection(firestore, "users", user.uid, "user-groups");
                const querySnapshot = await getDocs(userGroupsRef);
                console.log("Found groups:", groupOptions);
                const groups = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setGroupOptions([{ id: "default", groupName: "Ei valittua ryhmää" }, ...groups]);
            }
        } catch (error) {
            console.error("Error fetching user groups:", error);
        }
    };

    useEffect(() => {
        fetchUserGroups();
    }, []);

    if (!user) {
        return (
            <View style={styles.shiftDataDropDownContainer}>
            </View>
        );
    }
    return (
        <View style={styles.shiftDataDropDownContainer}>
            <TouchableOpacity style={styles.dropdownButton} onPress={toggleDropdown}>
                <Text style={styles.dropdownButtonText}>{shiftName || "Ei ryhmää"}</Text>
                <Ionicons name={inputDropDownVisible ? "chevron-up" : "chevron-down"} size={20} />
            </TouchableOpacity>

            {inputDropDownVisible && (
                <View style={styles.dropdown}>
                    <FlatList
                        data={groupOptions}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.dropdownItem} onPress={() => selectGroupName(item.groupName)}>
                                <Text style={styles.dropdownItemText}>{item.groupName}</Text>
                            </TouchableOpacity>
                        )}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            )}
        </View>
    );
};

export default ShiftGroupDropDown;
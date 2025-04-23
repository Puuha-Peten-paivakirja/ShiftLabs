import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebase/config";
import styles from "../styles/AddShift";
import { TextInput } from "react-native-paper";
import { useUser } from "../context/useUser";
import { useTranslation } from "react-i18next"; // Import useTranslation

const ShiftGroupDropDown = ({ shiftName, setShiftName }) => {
    const [inputDropDownVisible, setInputDropDownVisible] = useState(false);
    const [groupOptions, setGroupOptions] = useState([]);
    const { user } = useUser();
    const { t } = useTranslation(); // Initialize translation function

    const toggleDropdown = () => {
        setInputDropDownVisible(!inputDropDownVisible);
    };

    const selectGroupName = (name) => {
        // Use a more robust way to handle "no group" logic
        setShiftName(name === "" ? "" : name); // Treat empty string as "no group"
        setInputDropDownVisible(false);
    };

    const fetchUserGroups = async () => {
        try {
            if (user) {
                console.log("Fetching groups for user:", user.uid);
                const userGroupsRef = collection(firestore, "users", user.uid, "user-groups");
                const querySnapshot = await getDocs(userGroupsRef);
                const groups = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                // Add a default "no group" option
                setGroupOptions([{ id: "default", groupName: "" }, ...groups]);
            }
        } catch (error) {
            console.error("Error fetching user groups:", error);
        }
    };

    useEffect(() => {
        fetchUserGroups();
    }, []);

    if (!user) {
        return <View style={styles.shiftDataDropDownContainer}></View>;
    }

    return (
        <View style={styles.shiftDataDropDownContainer}>
            <TouchableOpacity style={styles.dropdownButton} onPress={toggleDropdown}>
                {/* Localize "no group" here */}
                <Text style={styles.dropdownButtonText}>{shiftName || t("no-group")}</Text>
                <Ionicons name={inputDropDownVisible ? "chevron-up" : "chevron-down"} size={20} />
            </TouchableOpacity>

            {inputDropDownVisible && (
                <View style={styles.dropdown}>
                    <FlatList
                        data={groupOptions}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.dropdownItem}
                                onPress={() => selectGroupName(item.groupName)}
                            >
                                {/* Localize "no group" here */}
                                <Text style={styles.dropdownItemText}>
                                    {item.groupName || t("no-group")}
                                </Text>
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
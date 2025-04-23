import React, { useState, useEffect} from "react";
import { View, Text, FlatList, TouchableOpacity,} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Navbar from "../components/Navbar";
import styles from "../styles/AllShifts";
import { useTranslation } from "react-i18next";
import { useUser } from "../context/useUser";
import { firestore } from "../firebase/config";
import { collection, deleteDoc, doc, getDocs, } from "firebase/firestore";

export default function AllShiftsScreen() {
    const [shifts, setSavedShifts] = useState([]);
    const [groupedShifts, setGroupedShifts] = useState({});
    const [selectedShiftName, setSelectedShiftName] = useState(null);
    const { user } = useUser();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchShifts = async () => {
            try {
                // Fetch shifts from AsyncStorage
                const savedShifts = await AsyncStorage.getItem("shifts");
                const parsedShifts = savedShifts ? JSON.parse(savedShifts) : [];

                // Fetch shifts from Firebase
                let firebaseShifts = [];
                if (user) {
                    const userShiftsRef = collection(firestore, "users", user.uid, "shifts");
                    const querySnapshot = await getDocs(userShiftsRef);
                    firebaseShifts = querySnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    console.log("Fetched shifts from Firebase:", firebaseShifts);
                }

                // Merge local and Firebase shifts, avoiding duplicates
                const allShifts = [...parsedShifts];
                firebaseShifts.forEach((firebaseShift) => {
                    if (!allShifts.some((shift) => shift.id === firebaseShift.id)) {
                        allShifts.push(firebaseShift);
                    }
                });

                // Group shifts by name
                const grouped = allShifts.reduce((acc, shift) => {
                    const name = shift.name || "Omat työvuorot";
                    if (!acc[name]) acc[name] = [];
                    acc[name].push(shift);
                    return acc;
                }, {});

                // Ensure "Omat työvuorot" is always present, even if empty
                if (!grouped["Omat työvuorot"]) {
                    grouped["Omat työvuorot"] = [];
                }

                // Sort groups alphabetically (special characters first)
                const sortedGrouped = Object.keys(grouped)
                    .sort((a, b) => a.localeCompare(b))
                    .reduce((acc, key) => {
                        acc[key] = grouped[key];
                        return acc;
                    }, {});

                setGroupedShifts(sortedGrouped);
                setSavedShifts(allShifts);
            } catch (error) {
                console.error("Error loading shifts:", error);
            }
        };

        fetchShifts();
    }, [user]);

    const deleteShift = async (destroyShift) => {
        console.log("Deleting shift:", destroyShift);
        try {
            // Remove the shift locally
            const updatedShifts = shifts.filter((shift) => shift.id !== destroyShift.id);
            setSavedShifts(updatedShifts);

            // Update grouped shifts
            const updatedGrouped = { ...groupedShifts };
            const groupName = destroyShift.name || "Omat työvuorot";

            if (updatedGrouped[groupName]) {
                updatedGrouped[groupName] = updatedGrouped[groupName].filter((shift) => shift.id !== destroyShift.id);
                if (updatedGrouped[groupName].length === 0) {
                    delete updatedGrouped[groupName];

                    // Reset selectedShiftName if the deleted group was selected
                    if (selectedShiftName === groupName) {
                        setSelectedShiftName(null);
                    }
                }
            } else {
                console.warn(`Group "${groupName}" does not exist in groupedShifts.`);
            }

            setGroupedShifts(updatedGrouped);

            await AsyncStorage.setItem("shifts", JSON.stringify(updatedShifts));
            console.log("Shift deleted locally:", destroyShift.id);

            // Remove the shift from Firebase
            if (user && destroyShift.id) {
                const userShiftsRef = collection(firestore, "users", user.uid, "shifts");
                const shiftDocRef = doc(userShiftsRef, destroyShift.id);
                await deleteDoc(shiftDocRef);
                console.log("Shift deleted from Firebase:", destroyShift.id);
            } else {
                console.error("Shift ID is undefined or user is not authenticated.");
            }
        } catch (error) {
            console.error("Error deleting shift:", error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = ("0" + date.getDate()).slice(-2);
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const formatDuration = (duration) => {
        if (typeof duration === "string" && duration.includes(":")) {
            const [hours, minutes, seconds] = duration.split(":").map(Number);
            return `${("0" + hours).slice(-2)}:${("0" + minutes).slice(-2)}:${("0" + seconds).slice(-2)}`;
        }
        return "00:00:00"; // Fallback for invalid values
    };

    const formatTime = (timeString) => {
        if (!timeString) return "00:00";
        const date = new Date(timeString);
        const hours = ("0" + date.getHours()).slice(-2);
        const minutes = ("0" + date.getMinutes()).slice(-2);
        return `${hours}.${minutes}`;
    };

    return (
        <View style={styles.container}>
            <Navbar />
            <View style={styles.container}>
                <Text style={styles.header}> {t('previous-shifts')}</Text>
                {Object.keys(groupedShifts).length === 0 ? (
                    <Text style={styles.noDataText}>{t('no-recorded-shifts')}Ei nauhotettuja työvuoroja</Text>
                ) : selectedShiftName ? (
                    // Show entries for the selected shift
                    <View>
                        <TouchableOpacity onPress={() => setSelectedShiftName(null)} style={styles.backButton}>
                            <Text style={styles.backButtonText}>{t('shift-return')} </Text>
                        </TouchableOpacity>
                        <FlatList
                            data={groupedShifts[selectedShiftName].sort(
                                (a, b) => new Date(b.startTime) - new Date(a.startTime)
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.shiftItem}>
                                    <Text style={styles.shiftText}>
                                        {formatTime(item.startTime)} - {formatTime(item.endTime)}
                                    </Text>
                                    <Text>{t('shift-date')} {formatDate(item.date)}</Text>
                                    <Text>{t('shift-duration')} {formatDuration(item.duration)}</Text>
                                    <Text>{t('shift-breaks')} {formatDuration(item.breakDuration)}</Text>
                                    <Text>{t('shift-description')}: {item.description || "Ei kuvausta"}</Text>
                                    <TouchableOpacity
                                        onPress={() => deleteShift(item)}
                                        style={styles.deleteShiftButton}
                                    >
                                        <Text style={styles.deleteShiftButtonText}>❌</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                    </View>
                ) : (
                    // Show grouped shifts by name
                    <FlatList
                        data={Object.keys(groupedShifts)}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => setSelectedShiftName(item)} style={styles.shiftLabel}>
                                <Text style={styles.shiftText}>
                                    {groupedShifts[item].length} {t('shifts')}
                                </Text>
                                <Text style={styles.input}>{item}</Text>
                            </TouchableOpacity>
                        )}
                    />
                )}
            </View>
        </View>
    );
}


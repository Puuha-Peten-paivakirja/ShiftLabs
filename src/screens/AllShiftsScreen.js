import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Pressable, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Navbar from "../components/Navbar";
import styles from "../styles/AllShifts";

export default function AllShiftsScreen() {
    const [shifts, setSavedShifts] = useState([]);

    useEffect(() => {
        const fetchShifts = async () => {
            try {
                const savedShifts = await AsyncStorage.getItem("shifts");
                if (savedShifts) {
                    setSavedShifts(JSON.parse(savedShifts));
                }
            } catch (error) {
                console.error("Error loading shifts:", error);
            }
        };

        fetchShifts();
    }, []);

    const deleteShift = async (destroyShift) => {
        try {
            const updatedShifts = shifts.filter((shift) => shift !== destroyShift);
            setSavedShifts(updatedShifts);
            await AsyncStorage.setItem("shifts", JSON.stringify(updatedShifts));
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
    
    return (
        <View style={styles.container}>
            <Navbar />
            <View style={shifts.container}>
            <Text style={styles.header}>Aiemmat työvuorot</Text>
            {shifts.length === 0 ? (
                <Text style={styles.noDataText}>Ei nauhotettuja työvuoroja</Text>
            ) : (
                <FlatList
                    data={shifts}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.shiftItem}>
                            <Text style={styles.shiftText}>
                                {formatDate(item.startDate)} - {formatDate(item.endDate)}
                            </Text>
                            <Text>Pvm: {formatDate(item.date)}</Text>
                            <Text>Kesto: {formatDuration(item.duration)}</Text>
                            <Text>Tauot: {formatDuration(item.breakDuration)}</Text>

                            <TouchableOpacity onPress={() => deleteShift(item)} style={styles.deleteShiftButton}>
                                <Text style={styles.deleteShiftButtonText}>❌</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
            </View>
        </View>
    );
}


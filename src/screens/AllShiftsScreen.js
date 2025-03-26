import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Navbar from "../components/Navbar";

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
                                {item.startDate} - {item.endDate}
                            </Text>
                            <Text>Pvm: {item.date}</Text>
                            <Text>Kesto: {item.duration} min</Text>
                            <Text>Tauot: {item.breakDuration} min</Text>
                        </View>
                    )}
                />
            )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 10,
    },
    noDataText: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 16,
        color: "gray",
    },
    shiftItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    shiftText: {
        fontSize: 16,
        fontWeight: "bold",
    },
});

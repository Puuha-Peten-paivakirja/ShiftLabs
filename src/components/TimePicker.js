import React, { useRef, useState } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { Modal } from "react-native-paper";

const { height } = Dimensions.get("window");

const TimePicker = ({onTimeSelected}) => {
    const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
    const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

    const itemHeight = 60;
    const pickerHeight = itemHeight * 5;

    const [selectedHour, setSelectedHour] = useState("12");
    const [selectedMinute, setSelectedMinute] = useState("00");

    const hourRef = useRef(null);
    const minuteRef = useRef(null);

    const handleConfirm = () => {
        const time = `${selectedHour}:${selectedMinute}`;
        console.log("Selected Time:", time);
        if (onTimeSelected) {
            onTimeSelected(time);
        }
    };

    const onScrollEnd = (event, type) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const index = Math.round(offsetY / itemHeight);
        const value = type === "hour" ? hours[index] : minutes[index];
        type === "hour" ? setSelectedHour(value) : setSelectedMinute(value);
    };

    const renderItem = ({ item }) => (
        <View style={[styles.item, { height: itemHeight }]}>
            <Text style={styles.itemText}>{item}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Valitse Aika</Text>
            <View style={styles.pickerWrapper}>
                {/* Hour Picker */}
                <FlatList
                    data={hours}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => setSelectedHour(item)}>
                            <Text style={styles.itemText}>{item}</Text>
                        </TouchableOpacity>
                    )}
                />
                <Text style={styles.colon}>:</Text>
                {/* Minute Picker */}
                <FlatList
                    data={minutes}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => setSelectedMinute(item)}>
                            <Text style={styles.itemText}>{item}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
            <TouchableOpacity style={styles.modalButton} onPress={handleConfirm}>
                <Text style={styles.modalButtonText}>Tallenna</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingTop: 50,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    pickerWrapper: {
        flexDirection: "row",
        height: 300,
    },
    item: {
        justifyContent: "center",
        alignItems: "center",
        width: 80,
    },
    itemText: {
        fontSize: 24,
    },
    colon: {
        fontSize: 30,
        paddingHorizontal: 10,
        paddingTop: 120,
    },
    selectedTime: {
        marginTop: 20,
        fontSize: 20,
        fontWeight: "bold",
    },
});

export default TimePicker;

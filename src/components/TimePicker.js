import React, { useRef, useState } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions } from "react-native";
import { Modal } from "react-native-paper";

const { height } = Dimensions.get("window");

const TimePicker = () => {
    const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
    const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

    const itemHeight = 60;
    const pickerHeight = itemHeight * 5;

    const [selectedHour, setSelectedHour] = useState("12");
    const [selectedMinute, setSelectedMinute] = useState("00");

    const hourRef = useRef(null);
    const minuteRef = useRef(null);

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
            <Modal>
            <Text style={styles.title}>Select Time</Text>
            <View style={styles.pickerWrapper}>
                {/* Hours */}
                <FlatList
                    ref={hourRef}
                    data={hours}
                    keyExtractor={(item) => item}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={itemHeight}
                    decelerationRate="fast"
                    onMomentumScrollEnd={(e) => onScrollEnd(e, "hour")}
                    contentContainerStyle={{ paddingVertical: pickerHeight / 2 - itemHeight / 2 }}
                />
                <Text style={styles.colon}>:</Text>
                {/* Minutes */}
                <FlatList
                    ref={minuteRef}
                    data={minutes}
                    keyExtractor={(item) => item}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={itemHeight}
                    decelerationRate="fast"
                    onMomentumScrollEnd={(e) => onScrollEnd(e, "minute")}
                    contentContainerStyle={{ paddingVertical: pickerHeight / 2 - itemHeight / 2 }}
                />
            </View>
            <Text style={styles.selectedTime}>Selected: {selectedHour}:{selectedMinute}</Text>
            </Modal>
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

import React, { useState, useRef } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity } from "react-native";

const DatePicker = ({ onDateSelected }) => {
    const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const years = Array.from({ length: 101 }, (_, i) => String(2025 + i)); // Years from 1900 to 2000

    const itemHeight = 40; // Height of each item
    const pickerHeight = itemHeight * 5; // Visible area height (5 items visible)

    const [selectedDay, setSelectedDay] = useState(days[0]);
    const [selectedMonth, setSelectedMonth] = useState(months[0]);
    const [selectedYear, setSelectedYear] = useState(years[0]);

    const dayRef = useRef(null);
    const monthRef = useRef(null);
    const yearRef = useRef(null);

    const scrollToIndex = (ref, index) => {
        ref.current?.scrollToOffset({
            offset: index * itemHeight,
            animated: true,
        });
    };

    const handleScrollEnd = (event, type) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const index = Math.round(offsetY / itemHeight);

        if (type === "day") {
            setSelectedDay(days[index % days.length]);
        } else if (type === "month") {
            setSelectedMonth(months[index % months.length]);
        } else if (type === "year") {
            setSelectedYear(years[index % years.length]);
        }
    };

    const handleConfirm = () => {
        const monthIndex = months.indexOf(selectedMonth) + 1; // Convert month name to index
        const formattedDate = `${selectedDay}-${String(monthIndex).padStart(2, "0")}-${selectedYear}`;
        if (onDateSelected) {
            onDateSelected(formattedDate); // Pass the selected date to the parent
        }
    };

    const renderItem = ({ item, type }) => (
        <View style={[styles.item, { height: itemHeight }]}>
            <Text style={styles.itemText}>{item}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Valitse Päivämäärä</Text>
            <View style={[styles.pickerWrapper, { height: pickerHeight }]}>
                {/* Day Picker */}
                <FlatList
                    ref={dayRef}
                    data={Array(100).fill(days).flat()} // Simulate infinite scrolling
                    keyExtractor={(item, index) => `${item}-${index}`}
                    renderItem={({ item }) => renderItem({ item, type: "day" })}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={itemHeight}
                    decelerationRate="fast"
                    onMomentumScrollEnd={(event) => handleScrollEnd(event, "day")}
                    contentContainerStyle={{
                        paddingVertical: pickerHeight / 2 - itemHeight / 2,
                    }}
                />
                {/* Month Picker */}
                <FlatList
                    ref={monthRef}
                    data={Array(100).fill(months).flat()} // Simulate infinite scrolling
                    keyExtractor={(item, index) => `${item}-${index}`}
                    renderItem={({ item }) => renderItem({ item, type: "month" })}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={itemHeight}
                    decelerationRate="fast"
                    onMomentumScrollEnd={(event) => handleScrollEnd(event, "month")}
                    contentContainerStyle={{
                        paddingVertical: pickerHeight / 2 - itemHeight / 2,
                    }}
                />
                {/* Year Picker */}
                <FlatList
                    ref={yearRef}
                    data={Array(100).fill(years).flat()} // Simulate infinite scrolling
                    keyExtractor={(item, index) => `${item}-${index}`}
                    renderItem={({ item }) => renderItem({ item, type: "year" })}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={itemHeight}
                    decelerationRate="fast"
                    onMomentumScrollEnd={(event) => handleScrollEnd(event, "year")}
                    contentContainerStyle={{
                        paddingVertical: pickerHeight / 2 - itemHeight / 2,
                    }}
                />
            </View>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                <Text style={styles.confirmButtonText}>Tallenna</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    pickerWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    item: {
        justifyContent: "center",
        alignItems: "center",
    },
    itemText: {
        fontSize: 16,
        color: "#333",
    },
    confirmButton: {
        marginTop: 20,
        backgroundColor: "#6A4BA6",
        padding: 10,
        borderRadius: 5,
    },
    confirmButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default DatePicker;
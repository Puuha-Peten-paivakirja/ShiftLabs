import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ShiftTimerContext } from "../context/ShiftTimerContext";
import styles from "../styles/AddShift";

const AddShiftManually = () => {
    const { saveShift, setShiftName, setShiftDescription, shiftName, shiftDescription } = useContext(ShiftTimerContext);

    // State for managing the date and time pickers
    const [isStartDatePickerVisible, setIsStartDatePickerVisible] = useState(false);
    const [isStartTimePickerVisible, setIsStartTimePickerVisible] = useState(false);
    const [selectedStartDate, setSelectedStartDate] = useState(new Date());

    const [isEndDatePickerVisible, setIsEndDatePickerVisible] = useState(false);
    const [isEndTimePickerVisible, setIsEndTimePickerVisible] = useState(false);
    const [selectedEndDate, setSelectedEndDate] = useState(new Date());

    const [duration, setDuration] = useState("");
    const [breakDuration, setBreakDuration] = useState("");

    // Show and hide handlers for the date and time pickers
    const showStartDatePicker = () => setIsStartDatePickerVisible(true);
    const hideStartDatePicker = () => setIsStartDatePickerVisible(false);
    const showStartTimePicker = () => setIsStartTimePickerVisible(true);
    const hideStartTimePicker = () => setIsStartTimePickerVisible(false);

    const showEndDatePicker = () => setIsEndDatePickerVisible(true);
    const hideEndDatePicker = () => setIsEndDatePickerVisible(false);
    const showEndTimePicker = () => setIsEndTimePickerVisible(true);
    const hideEndTimePicker = () => setIsEndTimePickerVisible(false);

    // Handle date and time selection
    const handleStartDateChange = (event, date) => {
        if (!date) {
            hideStartDatePicker();
            return;
        }
        setSelectedStartDate(date);
        hideStartDatePicker();
        showStartTimePicker();
    };

    const handleStartTimeChange = (event, time) => {
        if (!time) {
            hideStartTimePicker();
            return;
        }
        const updatedDate = new Date(
            selectedStartDate.getFullYear(),
            selectedStartDate.getMonth(),
            selectedStartDate.getDate(),
            time.getHours(),
            time.getMinutes()
        );
        setSelectedStartDate(updatedDate);
        hideStartTimePicker();
    };

    const handleEndDateChange = (event, date) => {
        if (!date) {
            hideEndDatePicker();
            return;
        }
        setSelectedEndDate(date);
        hideEndDatePicker();
        showEndTimePicker();
    };

    const handleEndTimeChange = (event, time) => {
        if (!time) {
            hideEndTimePicker();
            return;
        }
        const updatedDate = new Date(
            selectedEndDate.getFullYear(),
            selectedEndDate.getMonth(),
            selectedEndDate.getDate(),
            time.getHours(),
            time.getMinutes()
        );
        setSelectedEndDate(updatedDate);
        hideEndTimePicker();
    };

    const formatDateTime = (date) => {
        if (!date) return "Valitse aika";
        const options = { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" };
        return date.toLocaleString("fi-FI", options);
    };

    return (
        <View style={styles.container}>
            {/* Shift Name */}
            <TextInput
                style={styles.input}
                placeholder="Vuoron nimi"
                value={shiftName}
                onChangeText={setShiftName}
            />

            {/* Shift Description */}
            <TextInput
                style={styles.input}
                placeholder="Kuvaus"
                value={shiftDescription}
                onChangeText={setShiftDescription}
                multiline
            />

            {/* Start Time Section */}
            <View style={styles.shiftDataInputRow}>
                <Text style={styles.shiftDataLabel}>Aloitusaika</Text>
                <TouchableOpacity style={styles.inputbutton} onPress={showStartDatePicker}>
                    <Text style={styles.buttonText}>{formatDateTime(selectedStartDate)}</Text>
                </TouchableOpacity>
            </View>

            {isStartDatePickerVisible && (
                <DateTimePicker
                    value={selectedStartDate}
                    mode="date"
                    display="spinner"
                    onChange={handleStartDateChange}
                />
            )}

            {isStartTimePickerVisible && (
                <DateTimePicker
                    value={selectedStartDate}
                    mode="time"
                    display="spinner"
                    onChange={handleStartTimeChange}
                />
            )}

            {/* End Time Section */}
            <View style={styles.shiftDataInputRow}>
                <Text style={styles.shiftDataLabel}>Lopetusaika</Text>
                <TouchableOpacity style={styles.inputbutton} onPress={showEndDatePicker}>
                    <Text style={styles.buttonText}>{formatDateTime(selectedEndDate)}</Text>
                </TouchableOpacity>
            </View>

            {isEndDatePickerVisible && (
                <DateTimePicker
                    value={selectedEndDate}
                    mode="date"
                    display="spinner"
                    onChange={handleEndDateChange}
                />
            )}

            {isEndTimePickerVisible && (
                <DateTimePicker
                    value={selectedEndDate}
                    mode="time"
                    display="spinner"
                    onChange={handleEndTimeChange}
                />
            )}

            {/* Duration Field */}
            <View style={styles.shiftDataInputRow}>
                <Text style={styles.shiftDataLabel}>Kesto</Text>
                <TextInput
                    style={styles.inputField}
                    placeholder="hh:mm"
                    value={duration}
                    onChangeText={setDuration}
                    keyboardType="numeric"
                />
            </View>

            {/* Break Duration Field */}
            <View style={styles.shiftDataInputRow}>
                <Text style={styles.shiftDataLabel}>Tauon kesto</Text>
                <TextInput
                    style={styles.inputField}
                    placeholder="hh:mm"
                    value={breakDuration}
                    onChangeText={setBreakDuration}
                    keyboardType="numeric"
                />
            </View>

            {/* Save Button */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    console.log("Manual save triggered");
                    saveShift();
                }}
            >
                <Text style={styles.buttonText}>Tallenna</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AddShiftManually;
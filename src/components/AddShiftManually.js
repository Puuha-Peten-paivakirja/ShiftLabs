import React, { useState, useContext, useEffect } from "react";
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

    const [calculatedDuration, setCalculatedDuration] = useState(""); // Automatically calculated duration
    const [breakDuration, setBreakDuration] = useState(0); // Manually entered break duration
    const [totalDuration, setTotalDuration] = useState(""); // Total duration after subtracting breaks

    const [isBreakPickerVisible, setIsBreakPickerVisible] = useState(false);
    const [selectedBreakTime, setSelectedBreakTime] = useState(new Date());
    

    // Show and hide handlers for the date and time pickers
    const showStartDatePicker = () => setIsStartDatePickerVisible(true);
    const hideStartDatePicker = () => setIsStartDatePickerVisible(false);
    const showStartTimePicker = () => setIsStartTimePickerVisible(true);
    const hideStartTimePicker = () => setIsStartTimePickerVisible(false);

    const showEndDatePicker = () => setIsEndDatePickerVisible(true);
    const hideEndDatePicker = () => setIsEndDatePickerVisible(false);
    const showEndTimePicker = () => setIsEndTimePickerVisible(true);
    const hideEndTimePicker = () => setIsEndTimePickerVisible(false);

    const showBreakPicker = () => setIsBreakPickerVisible(true);
    const hideBreakPicker = () => setIsBreakPickerVisible(false);

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

    // Calculate the duration whenever start or end time changes
    useEffect(() => {
        if (selectedStartDate && selectedEndDate) {
            const diffInMs = selectedEndDate - selectedStartDate; // Difference in milliseconds
            if (diffInMs > 0) {
                const hours = Math.floor(diffInMs / (1000 * 60 * 60));
                const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
                setCalculatedDuration(`${hours}h ${minutes}m`);
            } else {
                setCalculatedDuration("0h 0m"); // Handle invalid duration
            }
        }
    }, [selectedStartDate, selectedEndDate]);

    // Calculate the total duration whenever calculatedDuration or breakDuration changes
    useEffect(() => {
        const [shiftHours, shiftMinutes] = calculatedDuration.split(" ").map((value) => parseInt(value) || 0);
    
        const totalShiftMinutes = shiftHours * 60 + shiftMinutes;
    
        if (totalShiftMinutes > breakDuration) {
            const remainingMinutes = totalShiftMinutes - breakDuration;
            const totalHours = Math.floor(remainingMinutes / 60);
            const totalMinutes = remainingMinutes % 60;
            setTotalDuration(`${totalHours}h ${totalMinutes}m`);
        } else {
            setTotalDuration("0h 0m"); // Handle invalid total duration
        }
    }, [calculatedDuration, breakDuration]);

    const formatDateTime = (date) => {
        if (!date) return "Valitse aika";
        const options = { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" };
        return date.toLocaleString("fi-FI", options);
    };

    const handleSave = () => {
        console.log("Calculated Duration Before Save:", calculatedDuration);
        console.log("Break Duration Before Save:", breakDuration);

        const breakHours = Math.floor(breakDuration / 60);
        const breakMinutes = breakDuration % 60;
        const formattedBreakDuration = `${breakHours.toString().padStart(2, "0")}:${breakMinutes
            .toString()
            .padStart(2, "0")}:00`;

        const [shiftHours, shiftMinutes] = calculatedDuration
            .split(/[h m]/)
            .filter(Boolean)
            .map((value) => parseInt(value) || 0);
        const formattedCalculatedDuration = `${shiftHours.toString().padStart(2, "0")}:${shiftMinutes
            .toString()
            .padStart(2, "0")}:00`;

        saveShift({
            name: shiftName,
            description: shiftDescription,
            startTime: selectedStartDate.toISOString(),
            endTime: selectedEndDate.toISOString(),
            duration: formattedCalculatedDuration, // Save in hh:mm:ss format
            breakDuration: formattedBreakDuration, // Save in hh:mm:ss format
        });

            // Reset all fields after saving
        setShiftName("");
        setShiftDescription("");
        setSelectedStartDate(new Date());
        setSelectedEndDate(new Date());
        setBreakDuration(0);
        setCalculatedDuration("0h 0m");
        setTotalDuration("0h 0m");

        console.log("Shift data reset after saving.");
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
                    is24Hour={true}
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
                    is24Hour={true}
                    onChange={handleEndTimeChange}
                />
            )}

            {/* Calculated Duration */}
            <View style={styles.shiftDataInputRow}>
                <Text style={styles.shiftDataLabel}>Kesto</Text>
                <Text style={styles.calculatedDurationText}>{calculatedDuration}</Text>
            </View>

            {/* Break Duration Field */}
            <TouchableOpacity
                style={styles.button}
                onPress={showBreakPicker}
            >
                <Text style={styles.breakButtonText}>+</Text>
            </TouchableOpacity>
            <Text style={styles.breakDurationText}>
                {Math.floor(breakDuration / 60)}h {breakDuration % 60}m
            </Text>

            {isBreakPickerVisible && (
                <DateTimePicker
                    value={selectedBreakTime}
                    mode="time"
                    display="spinner"
                    is24Hour={true}
                    onChange={(event, time) => {
                        if (!time) {
                            hideBreakPicker();
                            return;
                        }
                        const breakMinutes = time.getHours() * 60 + time.getMinutes();
                        setBreakDuration((prev) => prev + breakMinutes); // Add the new break duration
                        hideBreakPicker();
                    }}
                />
            )}

            {/* Total Duration */}
            <View style={styles.shiftDataInputRow}>
                <Text style={styles.shiftDataLabel}>Yhteensä</Text>
                <Text style={styles.calculatedDurationText}>{totalDuration}</Text>
            </View>

            {/* Save Button */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    handleSave();
                }}
            >
                <Text style={styles.buttonText}>Tallenna</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AddShiftManually;
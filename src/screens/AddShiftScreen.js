import React, { useState, useEffect, useRef, useContext } from "react";
import { View, Text, Modal, TouchableOpacity, Animated, Easing, TextInput, FlatList, Alert, Touchable, Dimensions } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Navbar from "../components/Navbar";
import styles from "../styles/AddShift";
import { ShiftTimerContext } from "../context/ShiftTimerContext";
import ShiftGroupDropDown  from "../components/ShiftGroupDropDown";
import DateTimePicker from "@react-native-community/datetimepicker";

const RADIUS = 45;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const AddShiftScreen = () => {
    const { setBreakDuration, breakDuration, saveShift, elapsedTime, running, paused, startShift, pauseShift, resumeShift, stopShift, setIsModalVisible, isModalVisible, openModal, formatTime, setShiftDescription, setShiftName, shiftName, shiftDescription } = useContext(ShiftTimerContext);

    const [isRecordMode, setIsRecordMode] = useState(true);
    const [inputDropDownVisible, setInputDropDownVisible] = useState(false);

    //Shift and break duration states
    const [duration, setDuration ] = useState("");


    const toggleMode = () => {
        setIsRecordMode(!isRecordMode);
        console.log("Mode toggled to:", isRecordMode ? "Input" : "Record");
    };

    const animatedValue = useRef(new Animated.Value(0)).current;

useEffect(() => {
    if (running && !paused) {
        animatedValue.setValue(0); // Reset the animation
        Animated.timing(animatedValue, {
          toValue: 1, // Full circle (end of timer)
          duration: 1000, // Duration for a full circle (1 second per unit of time)
          easing: Easing.linear,
          useNativeDriver: false, // Make sure to use this if not using native driver
        }).start();
      }
    }, [elapsedTime, running, paused]); // Re-trigger when elapsedTime changes
  
    const strokeDashoffset = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [CIRCUMFERENCE, 0],
    });

    // State for managing the date and time pickers
const [isStartDatePickerVisible, setIsStartDatePickerVisible] = useState(false);
const [isStartTimePickerVisible, setIsStartTimePickerVisible] = useState(false);
const [selectedStartDate, setSelectedStartDate] = useState(new Date());

// Show and hide handlers for the date and time pickers
const showStartDatePicker = () => setIsStartDatePickerVisible(true);
const hideStartDatePicker = () => setIsStartDatePickerVisible(false);
const showStartTimePicker = () => setIsStartTimePickerVisible(true);
const hideStartTimePicker = () => setIsStartTimePickerVisible(false);

// Handle date selection
const handleStartDateChange = (event, date) => {
    if (!date) {
        hideStartDatePicker(); // Close the picker if dismissed
        return;
    }
    setSelectedStartDate(date); // Update the selected date
    hideStartDatePicker(); // Hide the date picker
    showStartTimePicker(); // Show the time picker
};

// Handle time selection
const handleStartTimeChange = (event, time) => {
    if (!time) {
        hideStartTimePicker(); // Close the picker if dismissed
        return;
    }
    // Combine the selected date and time into a single Date object
    const updatedDate = new Date(
        selectedStartDate.getFullYear(),
        selectedStartDate.getMonth(),
        selectedStartDate.getDate(),
        time.getHours(),
        time.getMinutes()
    );
    setSelectedStartDate(updatedDate); // Update the selected start date with time
    hideStartTimePicker(); // Hide the time picker
};

// Format the selected date and time for display
const formatDateTime = (date) => {
    if (!date) return "Valitse aika"; // Fallback text if no date is provided
    const options = { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" };
    return date.toLocaleString("fi-FI", options); // Format for Finnish locale
};

    // State for managing the end date and time pickers
const [isEndDatePickerVisible, setIsEndDatePickerVisible] = useState(false);
const [isEndTimePickerVisible, setIsEndTimePickerVisible] = useState(false);
const [selectedEndDate, setSelectedEndDate] = useState(new Date());

// Show and hide handlers for the end date and time pickers
const showEndDatePicker = () => setIsEndDatePickerVisible(true);
const hideEndDatePicker = () => setIsEndDatePickerVisible(false);
const showEndTimePicker = () => setIsEndTimePickerVisible(true);
const hideEndTimePicker = () => setIsEndTimePickerVisible(false);

// Handle end date selection
const handleEndDateChange = (event, date) => {
    if (!date) {
        hideEndDatePicker(); // Close the picker if dismissed
        return;
    }
    setSelectedEndDate(date); // Update the selected end date
    hideEndDatePicker(); // Hide the date picker
    showEndTimePicker(); // Show the time picker
};

// Handle end time selection
const handleEndTimeChange = (event, time) => {
    if (!time) {
        hideEndTimePicker(); // Close the picker if dismissed
        return;
    }
    // Combine the selected date and time into a single Date object
    const updatedDate = new Date(
        selectedEndDate.getFullYear(),
        selectedEndDate.getMonth(),
        selectedEndDate.getDate(),
        time.getHours(),
        time.getMinutes()
    );
    setSelectedEndDate(updatedDate); // Update the selected end date with time
    hideEndTimePicker(); // Hide the time picker
};

    return (
        <View style={styles.wrapper}>
            <Navbar />
            <View style={[styles.container, isRecordMode ? styles.recordMode : styles.inputMode]}>
                <TouchableOpacity style={styles.button}onPress={toggleMode}>
                    <Text style={styles.buttonText}>{isRecordMode ? "Vaihda syöttötilaan" : "Vaihda tallennustilaan"}</Text>
                </TouchableOpacity>

                <ShiftGroupDropDown shiftName={shiftName} setShiftName={setShiftName} />

                {/* Conditionally render content based on recordmode status */}
                {isRecordMode ? (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Vuoron nimi"
                        value={shiftName}
                        onChangeText={setShiftName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Kuvaus"
                        value={shiftDescription}
                        onChangeText={setShiftDescription}
                        multiline
                    />
                    
                    <View style={[styles.circleContainer, isRecordMode ? styles.recordMode : styles.inputMode]}>
                        <Svg height="150" width="150" viewBox="0 0 100 100">
                            <Circle cx="50" cy="50" r={RADIUS} stroke="#D8C5E5" strokeWidth="4" fill="none" />
                            <AnimatedCircle
                                cx="50"
                                cy="50"
                                r={RADIUS}
                                stroke="#6A4BA6"
                                strokeWidth="4"
                                fill="none"
                                strokeDasharray={CIRCUMFERENCE}
                                strokeDashoffset={strokeDashoffset}
                            />
                        </Svg>
                        <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        {!running && !paused ? (
                            <TouchableOpacity style={styles.button} onPress={startShift}>
                                <Text style={styles.buttonText}>Aloita</Text>
                            </TouchableOpacity>
                        ) : (
                            <>
                                {running && (
                                    <TouchableOpacity style={styles.button} onPress={pauseShift}>
                                        <Text style={styles.buttonText}>Tauko</Text>
                                    </TouchableOpacity>
                                )}
                                {paused && (
                                    <TouchableOpacity style={styles.button} onPress={resumeShift}>
                                        <Text style={styles.buttonText}>Jatka</Text>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity style={styles.button} onPress={openModal}>
                                    <Text style={styles.buttonText}>Lopeta</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>

                    <Modal animationType="slide" transparent={true} visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalText}>Pysäytetäänkö, ja tallennetaanko vuoro?</Text>
                                <TouchableOpacity style={styles.modalButton} onPress={stopShift}>
                                    <Text style={styles.modalButtonText}>Kyllä</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalButton} onPress={() => setIsModalVisible(false)}>
                                    <Text style={styles.modalButtonText}>Ei</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </>
            ) : (
                
                <View style={styles.container}>
                    
                    {/*Input View! */}
                    {/* Nimi, kuvaus, aloitusaika, lopetusaika, tauko, päivämäärä */}

                    <View style={styles.shiftDataInputRow}>
            <Text style={styles.shiftDataLabel}>Aloitusaika</Text>
            <TouchableOpacity style={styles.inputbutton} onPress={showStartDatePicker}>
                <Text style={styles.buttonText}>{formatDateTime(selectedStartDate)}</Text>
            </TouchableOpacity>
        </View>

        {/* Start Date Picker */}
        {isStartDatePickerVisible && (
            <DateTimePicker
                value={selectedStartDate}
                mode="date" // Show only the date picker
                display="spinner"
                onChange={handleStartDateChange}
            />
        )}

        {/* Start Time Picker */}
        {isStartTimePickerVisible && (
            <DateTimePicker
                value={selectedStartDate}
                mode="time" // Show only the time picker
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

        {/* End Date Picker */}
        {isEndDatePickerVisible && (
            <DateTimePicker
                value={selectedEndDate}
                mode="date" // Show only the date picker
                display="spinner"
                onChange={handleEndDateChange}
            />
        )}

        {/* End Time Picker */}
        {isEndTimePickerVisible && (
            <DateTimePicker
                value={selectedEndDate}
                mode="time" // Show only the time picker
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
            <TouchableOpacity style={styles.button}
            onPress={()=> {
                console.log("Manual save triggered");
                saveShift();
            }}>
                <Text style={styles.buttonText}>Tallenna</Text>
            </TouchableOpacity>

            </View>
        
            )}
            </View>
        </View>
    );
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default AddShiftScreen;

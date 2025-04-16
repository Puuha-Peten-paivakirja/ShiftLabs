import React, { useState, useEffect, useRef, useContext } from "react";
import { View, Text, Modal, TouchableOpacity, Animated, Easing, TextInput, FlatList, Alert, Touchable, Dimensions } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Navbar from "../components/Navbar";
import styles from "../styles/AddShift";
import { ShiftTimerContext } from "../context/ShiftTimerContext";
import TimePicker from "../components/TimePicker";
import DatePicker from "../components/DatePicker";
import ShiftGroupDropDown  from "../components/ShiftGroupDropDown";

const RADIUS = 45;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const AddShiftScreen = () => {
    const { setBreakDuration, breakDuration, saveShift, elapsedTime, running, paused, startShift, pauseShift, resumeShift, stopShift, setIsModalVisible, isModalVisible, openModal, formatTime, setShiftDescription, setShiftName, shiftName, shiftDescription } = useContext(ShiftTimerContext);

    const [isRecordMode, setIsRecordMode] = useState(true);
    const [inputDropDownVisible, setInputDropDownVisible] = useState(false);
    const [timePickerVisible, setTimePickerVisible] = useState(false);
    const [selectedTime, setSelectedTime] = useState("");
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");

    const [endTimePickerVisible, setEndTimePickerVisible] = useState(false);
    const [selectedEndTime, setSelectedEndTime] = useState("");
    const [endDatePickerVisible, setEndDatePickerVisible] = useState(false);
    const [selectedEndDate, setSelectedEndDate] = useState("");

    const toggleMode = () => {
        setIsRecordMode(!isRecordMode);
        console.log("Mode toggled to:", isRecordMode ? "Input" : "Record");
    };

    const openTimePicker = () => {
        setTimePickerVisible(true);
    };

    const closeTimePicker = () => {
        setTimePickerVisible(false);
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
        closeTimePicker();
    };

    const openDatePicker = () => {
        setDatePickerVisible(true);
    };

    const closeDatePicker = () => {
        setDatePickerVisible(false);
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        closeDatePicker();
    };

    //Handlers for end time and date pickers
    const openEndTimePicker = () => setEndTimePickerVisible(true);
    const closeEndTimePicker = () => setEndTimePickerVisible(false);
    const handleEndTimeSelect = (time) => {
        setSelectedEndTime(time);
        closeEndTimePicker();
    };

    const openEndDatePicker = () => setEndDatePickerVisible(true);
    const closeEndDatePicker = () => setEndDatePickerVisible(false);
    const handleEndDateSelect = (date) => {
        setSelectedEndDate(date);
        closeEndDatePicker();
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

    // Record and input modes:
    // Record mode: User can start, pause, and stop the timer and save it. [Completed]
    // Input mode: User can input the shiftdata and save it manually[WIP]



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

                    {/* Shift Description Section */}
                    <View style={styles.shiftDataInputRow}>
                        <Text style={styles.shiftDataLabel}>
                            Aloitusaika
                        </Text>
                        <View style={styles.row}>
                        <TouchableOpacity style={styles.inputbutton} onPress={openTimePicker}>
                            <Text style={styles.buttonText}>{selectedTime || "Valitse Aika"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.inputbutton} onPress={openDatePicker}>
                            <Text style={styles.buttonText}>{selectedDate || "Valitse pvm"}</Text>
                        </TouchableOpacity>
                        </View>
                    </View>

                    {/* TimePicker Modal for start times */}
                    <Modal
                            animationType="slide"
                            transparent={true}
                            visible={timePickerVisible}
                            onRequestClose={closeTimePicker}
                        >
                            <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                    <TimePicker onTimeSelected={handleTimeSelect} />
                                    <TouchableOpacity style={styles.modalButton} onPress={closeTimePicker}>
                                        <Text style={styles.modalButtonText}>Peruuta</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>

                    {/* DatePicker Modal for end times*/}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={datePickerVisible}
                    onRequestClose={closeDatePicker}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <DatePicker onDateSelected={handleDateSelect} />
                            <TouchableOpacity style={styles.modalButton} onPress={closeDatePicker}>
                                <Text style={styles.modalButtonText}>Peruuta</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>



                    {/* End Time Section */}
                    <View style={styles.shiftDataInputRow}>
                        <Text style={styles.shiftDataLabel}>Lopetusaika</Text>
                        <View style={styles.row}>
                            <TouchableOpacity style={styles.inputbutton} onPress={openEndTimePicker}>
                                <Text style={styles.buttonText}>{selectedEndTime || "Valitse Aika"}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.inputbutton} onPress={openEndDatePicker}>
                                <Text style={styles.buttonText}>{selectedEndDate || "Valitse pvm"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* TimePicker Modal for End Time */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={endTimePickerVisible}
                onRequestClose={closeEndTimePicker}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TimePicker onTimeSelected={handleEndTimeSelect} />
                        <TouchableOpacity style={styles.modalButton} onPress={closeEndTimePicker}>
                            <Text style={styles.modalButtonText}>Peruuta</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* DatePicker Modal for End Date */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={endDatePickerVisible}
                onRequestClose={closeEndDatePicker}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <DatePicker onDateSelected={handleEndDateSelect} />
                        <TouchableOpacity style={styles.modalButton} onPress={closeEndDatePicker}>
                            <Text style={styles.modalButtonText}>Peruuta</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

                    {/* Duration Section */}
                    <View style={styles.shiftDataInputRow}>
                        <Text style={styles.shiftDataLabel}>Kesto</Text>
                        <View style={styles.row}>
                            <TextInput 
                            style={styles.shiftDataInputField}
                            placeholder="Kesto"
                            value={breakDuration}
                            onChangeText={setBreakDuration}
                            keyboardType="numeric"
                            >
                            </TextInput>
                        </View>
                    </View>

                    {/* Break Section */}
                    <View style={styles.shiftDataInputRow}>
                        <Text style={styles.shiftDataLabel}>Tauko</Text>
                        <View style={styles.row}>
                        </View>
                        <Text style={styles.shiftDataInputField}>
                            Tauon kesto: {}
                        </Text>
                    </View>

                    
                    
                    <TouchableOpacity style={styles.saveshiftbtn} onPress={stopShift}>
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

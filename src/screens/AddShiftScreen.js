import React, { useState, useEffect, useRef, useContext } from "react";
import { View, Text, Modal, TouchableOpacity, Animated, Easing, TextInput, Alert, Touchable, Dimensions } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Navbar from "../components/Navbar";
import styles from "../styles/AddShift";
import { ShiftTimerContext } from "../context/ShiftTimerContext";
import TimePicker from "../components/TimePicker";
import DatePicker from "../components/DatePicker";


const RADIUS = 45;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const AddShiftScreen = () => {
    const { saveShift, elapsedTime, running, paused, startShift, pauseShift, resumeShift, stopShift, setIsModalVisible, isModalVisible, openModal, formatTime, setShiftDescription, setShiftName, shiftName, shiftDescription } = useContext(ShiftTimerContext);

    const [isRecordMode, setIsRecordMode] = useState(true);

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
                    {/* <TimePicker></TimePicker> */}
                    {/* Nimi, kuvaus, aloitusaika, lopetusaika, tauko, päivämäärä */}
                    <View style={styles.rowWrapper}>
                    <Text style={styles.startLabel}>
                        Aloitusaika
                    </Text>
                    <View style={styles.startRow}>
                    <TouchableOpacity style={styles.button} onPress={TimePicker}>
                        <Text style={styles.buttonText}>%time%</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={DatePicker}>
                        <Text style={styles.buttonText}>%date%</Text>
                    </TouchableOpacity>
                    </View>
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

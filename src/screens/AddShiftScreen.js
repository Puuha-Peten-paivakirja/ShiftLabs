import React, { useState, useEffect, useRef, useContext } from "react";
import { View, Text, Modal, TouchableOpacity, Animated, Easing, TextInput, FlatList, Alert, Touchable, Dimensions } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Navbar from "../components/Navbar";
import styles from "../styles/AddShift";
import { ShiftTimerContext } from "../context/ShiftTimerContext";
import ShiftGroupDropDown from "../components/ShiftGroupDropDown";
import AddShiftManually from "../components/AddShiftManually";

const RADIUS = 45;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const AddShiftScreen = () => {
    const { setShiftName, setShiftDescription, shiftName, shiftDescription, elapsedTime, running, paused, startShift, pauseShift, resumeShift, stopShift, isModalVisible, setIsModalVisible, formatTime } = useContext(ShiftTimerContext);

    const [isRecordMode, setIsRecordMode] = useState(true);

    const toggleMode = () => {
        setIsRecordMode(!isRecordMode);
        console.log("Mode toggled to:", isRecordMode ? "Input" : "Record");
    };

    const recordModeData = [
        {
            label: "Vuoron nimi",
            type: "input",
            value: shiftName,
            onChange: setShiftName,
            placeholder: "Vuoron nimi",
        },
        {
            label: "Kuvaus",
            type: "input",
            value: shiftDescription,
            onChange: setShiftDescription,
            placeholder: "Kuvaus",
            multiline: true,
        },
        {
            label: "Ajastin",
            type: "timer",
        },
        {
            label: "Toiminnot",
            type: "actions",
        },
    ];

    return (
        <View style={styles.wrapper}>
            <Navbar />

            {/* Mode Toggle Button */}
            <TouchableOpacity style={styles.modeToggleButton} onPress={toggleMode}>
                <Text style={styles.buttonText}>
                    {isRecordMode ? "Vaihda syöttötilaan" : "Vaihda tallennustilaan"}
                </Text>
            </TouchableOpacity>

            

            <View style={[styles.container, isRecordMode ? styles.recordMode : styles.inputMode]}>
            <ShiftGroupDropDown shiftName={shiftName} setShiftName={setShiftName} />
                {/* FlatList for Record Mode */}
                {isRecordMode && (
                    <FlatList
                        data={recordModeData}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.row}>
                                <Text style={styles.label}>{item.label}</Text>
                                {item.type === "input" ? (
                                    <TextInput
                                        style={styles.input}
                                        value={item.value}
                                        onChangeText={item.onChange}
                                        placeholder={item.placeholder}
                                        multiline={item.multiline || false}
                                    />
                                ) : item.type === "timer" ? (
                                    <View style={styles.circleContainer}>
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
                                                strokeDashoffset={elapsedTime}
                                            />
                                        </Svg>
                                        <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
                                    </View>
                                ) : item.type === "actions" ? (
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
                                                <TouchableOpacity style={styles.button} onPress={stopShift}>
                                                    <Text style={styles.buttonText}>Lopeta</Text>
                                                </TouchableOpacity>
                                            </>
                                        )}
                                    </View>
                                ) : null}
                            </View>
                        )}
                    />
                )}

                {/* AddShiftManually Component */}
                {!isRecordMode && (
                    <View style={styles.container}>
                        <AddShiftManually />
                    </View>
                )}
            </View>

            {/* Modal for Stopping Shift */}
            {isRecordMode && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={() => setIsModalVisible(false)}
                >
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
            )}
        </View>
    );
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default AddShiftScreen;

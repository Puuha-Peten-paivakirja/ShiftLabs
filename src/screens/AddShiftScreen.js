import React, { useState, useEffect, useRef } from "react";
import { View, Text, Modal, TouchableOpacity, Animated, Easing} from "react-native";
import Svg, { Circle } from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Navbar from "../components/Navbar";
import styles from "../styles/AddShift";

const RADIUS = 45;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const AddShiftScreen = () => {
    const [elapsedTime, setElapsedTime] = useState(0);
    const [elapsedBreak, setElapsedBreak] = useState(0);
    const [running, setRunning] = useState(false);
    const [paused, setPaused] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const animatedValue = useRef(new Animated.Value(0)).current;
    const timerRef = useRef(null);


    useEffect(() => {
      if (running && !paused) {
          timerRef.current = setInterval(() => {
              setElapsedTime((prev) => prev + 1);
          }, 1000);
      } else if (paused) {
          timerRef.current = setInterval(() => {
              setElapsedBreak((prev) => prev + 1);
          }, 1000);
      } else {
          clearInterval(timerRef.current);
      }
  
      return () => clearInterval(timerRef.current);
  }, [running, paused]);
  

    useEffect(() => {
        if (running && !paused) {
            animatedValue.setValue(0);
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: false,
            }).start();
        }
    }, [elapsedTime]);

    const strokeDashoffset = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [CIRCUMFERENCE, 0],
    });

    const startTimer = () => {
        setRunning(true);
        setPaused(false);
        if (!startTime) {
            setStartTime(new Date());
        }
    };

    const pauseTimer = () => {
        setPaused(true);
        setRunning(false);
    };

    const resumeTimer = () => {
      setPaused(false);
      setRunning(true);
  };
  
    const stopTimer = () => {
        setIsModalVisible(true);
    };

    const endShift = async () => {
        setRunning(false);
        setPaused(false);
        setIsModalVisible(false);

        const currentTime = new Date();
        const formattedDuration = formatTime(elapsedTime);
        const formattedBreakDuration = formatTime(elapsedBreak);
        const shiftData = {
            startTime: startTime ? startTime.toISOString() : currentTime.toISOString(),
            endTime: currentTime.toISOString(),
            duration: formattedDuration,
            breakDuration: formattedBreakDuration,
            date: currentTime.toISOString(),
        };

        try {
            const savedShifts = await AsyncStorage.getItem("shifts");
            const shifts = savedShifts ? JSON.parse(savedShifts) : [];
            shifts.push(shiftData);
            await AsyncStorage.setItem("shifts", JSON.stringify(shifts));
            console.log("Shift data:", shiftData);
        } catch (error) {
            console.error("Failed to save shift:", error);
        }

        setStartTime(null);
        setElapsedTime(0);
        setElapsedBreak(0);
    };

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${("0" + hrs).slice(-2)}:${("0" + mins).slice(-2)}:${("0" + secs).slice(-2)}`;
    };

    return (
        <View style={styles.wrapper}>
            <Navbar />
            <View style={styles.container}>
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
                            strokeDashoffset={strokeDashoffset}
                        />
                    </Svg>
                    <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
                </View>

                <View style={styles.buttonContainer}>
                    {!running && !paused ? (
                        <TouchableOpacity style={styles.button} onPress={startTimer}>
                            <Text style={styles.buttonText}>Aloita</Text>
                        </TouchableOpacity>
                    ) : (
                        <>
                            {running && (
                                <TouchableOpacity style={styles.button} onPress={pauseTimer}>
                                    <Text style={styles.buttonText}>Tauko</Text>
                                </TouchableOpacity>
                            )}
                            {paused && (
                                <TouchableOpacity style={styles.button} onPress={resumeTimer}>
                                    <Text style={styles.buttonText}>Jatka</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity style={styles.button} onPress={stopTimer}>
                                <Text style={styles.buttonText}>Lopeta</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                <Modal animationType="slide" transparent={true} visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>Haluatko varmasti lopettaa vuoron?</Text>
                            <TouchableOpacity style={styles.modalButton} onPress={endShift}>
                                <Text style={styles.modalButtonText}>Kyllä</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButton} onPress={() => setIsModalVisible(false)}>
                                <Text style={styles.modalButtonText}>Ei</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    );
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default AddShiftScreen;

import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Animated, Easing } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Navbar from "../components/Navbar";
import styles from "../styles/AddShift";
//this screen should have buttons for starting, pausing and stopping the timer
//the timer should be displayed as a circle, that would have a stopwatch effect
//the timer does not have a set "max" time, since users should be able to record how long they worked


const TIMER_DURATION = 10; // Timer in seconds
const RADIUS = 45;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const AddShiftScreen = () => {
    const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
    const [running, setRunning] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [shiftDuration, setShiftDuration] = useState(0);
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        let interval;
        if (running) {
            interval = setInterval(() => {
                setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [running]);

    useEffect(() => {
        if (running) {
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: TIMER_DURATION * 1000,
                easing: Easing.linear,
                useNativeDriver: false,
            }).start();
        } else {
            animatedValue.stopAnimation();
        }
    }, [running]);

    const strokeDashoffset = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [CIRCUMFERENCE, 0], // Decreases stroke
    });

    const startTimer=()=>{
        setRunning(true);
        const currentDate = new Date();
        setStartTime(currentDate);
    };
    
    const stopTimer=()=>{
        setRunning(false);
        const currentDate = new Date();
        setEndTime(currentDate);
        if (startTime) {
            const duration = (currentDate - startTime) / 1000;
            setShiftDuration(duration);
        }
    };

    //this should save the shift duration and end time and end date locally. If user is signed in, then it saves on the database too
    const saveShift = async () => {
        const currentTime = new Date();
        const duration = (currentTime - startTime) / 1000;
        
        // if (startTime && endTime) {
        const shiftData = {
            startTime: startTime ? startTime.toISOString() : currentTime.toISOString(),
            endTime: currentTime.toISOString(),
            duration: shiftDuration,
            date: new Date().toISOString(),
        };

            try {
                const savedShifts = await AsyncStorage.getItem('shifts');
                const shifts = savedShifts ? JSON.parse(savedShifts) : [];
                shifts.push(shiftData);

                await AsyncStorage.setItem('shifts', JSON.stringify(shifts));
                
            } catch (error) {
                console.error('Failed to save shift:', error);
            }
    
            // // Example of saving to a database (Firebase or another service)
            // if (isUserLoggedIn) {
            //     saveToDatabase(shiftData);  // Save to database
            // }
    
            console.log('Shift saved:', shiftData);
        }

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };
    
    return (
        <View style={styles.wrapper}>
            <Navbar />
            <View style={styles.container}>
                <View style={styles.circleContainer}>
                    <Svg height="150" width="150" viewBox="0 0 100 100">
                        {/* Background Circle */}
                        <Circle
                            cx="50"
                            cy="50"
                            r={RADIUS}
                            stroke="#D8C5E5"
                            strokeWidth="4"
                            fill="none"
                        />
                        {/* Animated Progress Circle */}
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
                    <Text style={styles.timerText}>{timeLeft}s</Text>
                </View>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    <Pressable style={[styles.button, running && styles.disabled]} onPress={startTimer}>
                        <Text style={styles.buttonText}>{running ? "Lopeta": "Aloita"}</Text>
                    </Pressable>
                    <Pressable style={[styles.button, !running && styles.disabled]} onPress={stopTimer}>
                        <Text style={styles.buttonText}>{running ? "Tauko":"Jatka"}</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={saveShift}>
                        <Text style={styles.buttonText}>Tallenna</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

// Animated SVG Circle Component
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default AddShiftScreen;

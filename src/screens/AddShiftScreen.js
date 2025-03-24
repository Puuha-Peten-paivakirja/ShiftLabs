import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Animated, Easing } from "react-native";
import Navbar from "../components/Navbar";
import styles from "../styles/AddShift";

const TIMER_DURATION = 60; // Timer in seconds
const RADIUS = 45;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const AddShiftScreen = () => {
    const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
    const [running, setRunning] = useState(false);
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

    const startTimer = () => {
        setRunning(true);
    };

    const stopTimer = () => {
        setRunning(false);
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
                    <Pressable style={[styles.button, running && styles.disabled]} onPress={startTimer} disabled={running}>
                        <Text style={styles.buttonText}>Aloita</Text>
                    </Pressable>
                    <Pressable style={[styles.button, !running && styles.disabled]} onPress={stopTimer} disabled={!running}>
                        <Text style={styles.buttonText}>Tauko</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

// Animated SVG Circle Component
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default AddShiftScreen;

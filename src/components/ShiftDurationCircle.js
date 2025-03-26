// circle that visually shows the shift duration

import Svg, { Circle } from "react-native-svg";
import { Animated, Easing } from "react-native";
import React, { useEffect, useRef } from "react";

const ShiftDurationCircle = ({ running }) => {
    const RADIUS = 45;
    const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
    const animatedValue = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        if (running) {
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 1000 * 60 * 60, // 1 hour in milliseconds
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
    return (
        <Svg height="100" width="100" style={{ position: "absolute" }}>
            <Circle
                stroke="#0f0"
                fill="none"
                strokeWidth="10"
                cx="50"
                cy="50"
                r={RADIUS}
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={strokeDashoffset}
            />
        </Svg>
    );
}
export default ShiftDurationCircle;
import React, { createContext, useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ShiftTimerContext = createContext();

export const ShiftTimerProvider = ({ children }) => {
    const [elapsedTime, setElapsedTime] = useState(0);
    const [elapsedBreak, setElapsedBreak] = useState(0);
    const [running, setRunning] = useState(false);
    const [paused, setPaused] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const timerRef = useRef(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [shiftName, setShiftName] = useState("");
    const [shiftDescription, setShiftDescription] = useState("");

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

    const startShift = () => {
        setRunning(true);
        setPaused(false);
        if (!startTime) {
            setStartTime(new Date());
        }
    };

    const pauseShift = () => {
        setPaused(true);
        setRunning(false);
    };

    const resumeShift = () => {
        setPaused(false);
        setRunning(true);
    };

    const openModal = () => {
        setIsModalVisible(true);
    };

    const stopShift = async () => {
            setRunning(false);
            setPaused(false);
            setIsModalVisible(false);
    
            const currentTime = new Date();
            const formattedDuration = formatTime(elapsedTime);
            const formattedBreakDuration = formatTime(elapsedBreak);
            const shiftData = {
                name: shiftName,
                description: shiftDescription,
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
            } catch (error) {
                console.error("Failed to save shift:", error);
            }
    
            setStartTime(null);
            setElapsedTime(0);
            setElapsedBreak(0);
            setShiftName("");
            setShiftDescription("");
            console.log("Shift saved:", shiftData);
        };

        const formatTime = (seconds) => {
                const hrs = Math.floor(seconds / 3600);
                const mins = Math.floor((seconds % 3600) / 60);
                const secs = seconds % 60;
                return `${("0" + hrs).slice(-2)}:${("0" + mins).slice(-2)}:${("0" + secs).slice(-2)}`;
            };
        
        
    return (
        <ShiftTimerContext.Provider value={{ 
            elapsedTime, elapsedBreak, running, paused, shiftDescription, shiftName, isModalVisible, startShift, pauseShift, resumeShift, stopShift, formatTime, openModal, setShiftDescription, setShiftName, 
        }}>
            {children}
        </ShiftTimerContext.Provider>
    );
};

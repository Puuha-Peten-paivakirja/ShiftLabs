import React, { createContext, useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import SecureStore from 'expo-secure-store';
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { firestore, USERS} from "../firebase/config";
import { addDoc, collection } from "firebase/firestore";

const BACKGROUND_TIMER_TASK = "BACKGROUND_TIMER_TASK";


// Ensure notification handler is set
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

TaskManager.defineTask(BACKGROUND_TIMER_TASK, async () => {
    console.log("Background task executed");

    const startTimeString = await AsyncStorage.getItem("shiftStartTime");
    if (startTimeString) {
        const startTime = new Date(startTimeString);
        const elapsed = Math.floor((new Date() - startTime) / 1000);
        await AsyncStorage.setItem("elapsedTime", elapsed.toString());

        // Send a notification when running in the background
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Shift Still Running",
                body: `Elapsed time: ${elapsed} seconds`,
            },
            trigger: { seconds: 5 },
        });

        return BackgroundFetch.Result.NewData;
    }

    return BackgroundFetch.Result.NoData;
});

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
    const {user} = useAuth();

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
        const restoreElapsedTime = async () => {
            const savedElapsed = await AsyncStorage.getItem("elapsedTime");
            if (savedElapsed) {
                setElapsedTime(parseInt(savedElapsed, 10));
            }
        };
    
        restoreElapsedTime();
    }, []);

    useEffect(() => {
        if (!user || !user.groups) {
            setShiftName("");
    }
    }, [user]);


    
    const saveShift = async (manualShiftData = null) => {
        console.log("Saving shift...");
    
        // Use manualShiftData if provided, otherwise fall back to context state
        const formattedDuration = manualShiftData?.duration || formatTime(elapsedTime);
        const formattedBreakDuration = manualShiftData?.breakDuration || formatTime(elapsedBreak);
        const currentTime = new Date();
        const shiftData = {
            name: manualShiftData?.name || shiftName,
            description: manualShiftData?.description || shiftDescription,
            startTime: manualShiftData?.startTime || (startTime ? startTime.toISOString() : currentTime.toISOString()),
            endTime: manualShiftData?.endTime || currentTime.toISOString(),
            duration: formattedDuration,
            breakDuration: formattedBreakDuration,
            date: new Date().toISOString(),
        };
    
        try {
            const savedShifts = await AsyncStorage.getItem("shifts");
            const shifts = savedShifts ? JSON.parse(savedShifts) : [];
            shifts.push(shiftData);
    
            await AsyncStorage.setItem("shifts", JSON.stringify(shifts));
    
            // Sync to Firebase if the user is authenticated
            if (user) {
                console.log("User ID:", user.uid);
    
                const userShiftsRef = collection(firestore, USERS, user.uid, "shifts");
                console.log("User shifts reference:", userShiftsRef);
    
                await addDoc(userShiftsRef, shiftData);
                console.log("Shift saved to Firebase:", shiftData);
            } else {
                console.log("User not authenticated, shift not saved to Firebase");
            }
        } catch (error) {
            console.error("Failed to save shift:", error);
        }
    
        console.log("Shift saved:", shiftData);
    
        // Reset context state if this is not a manual save
        if (!manualShiftData) {
            setRunning(false);
            setElapsedTime(0);
            setElapsedBreak(0);
        }
    };


    const startShift = async () => {
        setElapsedTime(0);
        setRunning(true);
        setPaused(false);
        const now = new Date();
        setStartTime(now);
    
        await AsyncStorage.setItem("shiftStartTime", now.toISOString());
    
        // Request notification permission
        const { status } = await Notifications.requestPermissionsAsync();
        if (status === "granted") {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Shift Running",
                    body: "Your shift is still running in the background.",
                },
                trigger: { seconds: 900 }, // 15 minutes
            });
        }

        // Check if task is already registered
        const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_TIMER_TASK);
        if (!isRegistered) {
            await BackgroundFetch.registerTaskAsync(BACKGROUND_TIMER_TASK, {
                minimumInterval: 1,
                stopOnTerminate: false,
                startOnBoot: true,
            });
            console.log("Background task registered");
        } else {
            console.log("Background task already registered");
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
    
    
        setStartTime(null);
        setElapsedTime(0);
        setElapsedBreak(0);
        setShiftName("");
        setShiftDescription("");
        saveShift();
        await AsyncStorage.removeItem("shiftStartTime");
        await AsyncStorage.removeItem("elapsedTime");
        await AsyncStorage.removeItem("elapsedBreak");
        await BackgroundFetch.unregisterTaskAsync(BACKGROUND_TIMER_TASK)
        .then(() => {
            console.log("Background task unregistered")
            .catch((error) => {
                console.error("Error unregistering background task:", error);
            });
        })
    };

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${("0" + hrs).slice(-2)}:${("0" + mins).slice(-2)}:${("0" + secs).slice(-2)}`;
    };
    

    return (
        <ShiftTimerContext.Provider value={{
            elapsedTime, elapsedBreak, running, paused, shiftDescription, shiftName, isModalVisible, saveShift, startShift, pauseShift, resumeShift, stopShift, formatTime, openModal, setShiftDescription, setShiftName, setIsModalVisible, 
        }}>
            {children}
        </ShiftTimerContext.Provider>
    );
};

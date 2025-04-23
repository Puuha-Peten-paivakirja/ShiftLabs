import React, { createContext, useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import SecureStore from 'expo-secure-store';
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { firestore, USERS} from "../firebase/config";
import { doc, addDoc, collection, getDocs, setDoc, getDoc } from "firebase/firestore";
import { useUser } from "./useUser";
import uuid from "react-native-uuid"


const BACKGROUND_TIMER_TASK = "BACKGROUND_TIMER_TASK";


// // Ensure notification handler is set
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

TaskManager.defineTask(BACKGROUND_TIMER_TASK, async () => {
    console.log("Background task executed");

    const startTimeString = await AsyncStorage.getItem("shiftStartTime");
    if (startTimeString) {
        const startTime = new Date(startTimeString);
        const elapsed = Math.floor((new Date() - startTime) / 1000);
        await AsyncStorage.setItem("elapsedTime", elapsed.toString());

        // // Send a notification when running in the background
        // await Notifications.scheduleNotificationAsync({
        //     content: {
        //         title: "Shift Still Running",
        //         body: `Elapsed time: ${elapsed} seconds`,
        //     },
        //     trigger: { seconds: 5 },
        // });

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
    const {user} = useUser();
    const [groups, setGroups] = useState([]);
    const [groupId, setGroupId] = useState(null);

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

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                if (user) {
                    const userGroupsRef = collection(firestore, "users", user.uid, "user-groups");
                    const querySnapshot = await getDocs(userGroupsRef);
                    const fetchedGroups = querySnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setGroups(fetchedGroups);
                    console.log("Fetched groups:", fetchedGroups);
                }
            } catch (error) {
                console.error("Failed to fetch groups:", error);
            }
        };

        fetchGroups();
    }, [user]);
    
    const saveShift = async (manualShiftData = null) => {
        console.log("Saving shift...");

        try {
            const shiftId = uuid.v4(); // Generate a unique ID
            console.log("Generated UUID:", shiftId);

            const formattedDuration = manualShiftData?.duration || formatTime(elapsedTime);
            const formattedBreakDuration = manualShiftData?.breakDuration || formatTime(elapsedBreak);
            const currentTime = new Date();

            // Use the groupId from the context state
            if (!groupId) {
                console.warn("No groupId found. Hours will not be updated.");
            }

            const shiftData = {
                id: shiftId, // Add the unique ID
                name: manualShiftData?.name || shiftName,
                description: manualShiftData?.description || shiftDescription,
                groupId: groupId, // Use the groupId from the context state
                startTime: manualShiftData?.startTime || (startTime ? startTime.toISOString() : currentTime.toISOString()),
                endTime: manualShiftData?.endTime || currentTime.toISOString(),
                duration: formattedDuration,
                breakDuration: formattedBreakDuration,
                date: new Date().toISOString(),
            };

            console.log("Shift data to save:", shiftData);

            // Save the shift data to AsyncStorage
            const savedShifts = await AsyncStorage.getItem("shifts");
            const shifts = savedShifts ? JSON.parse(savedShifts) : [];
            shifts.push(shiftData);
            await AsyncStorage.setItem("shifts", JSON.stringify(shifts));
            console.log("Shift saved to AsyncStorage");

            // Sync to Firebase if the user is authenticated
            if (user) {
                console.log("User ID:", user.uid);

                const userShiftsRef = collection(firestore, "users", user.uid, "shifts");
                await setDoc(doc(userShiftsRef, shiftId), shiftData); // Use shiftId as the document ID
                console.log("Shift saved to Firebase:", shiftData);

                // Save hours to the subcollection in groups/groupId/group-users/userId/hours
                if (groupId) {
                    const hoursDocRef = doc(firestore, "groups", groupId, "group-users", user.uid, "hours", "hours");

                    // Check if the hours document already exists
                    const hoursDocSnapshot = await getDoc(hoursDocRef);

                    const durationInHours = parseTime(formattedDuration); // Convert duration to hours

                    if (hoursDocSnapshot.exists()) {
                        // Update the existing hours document
                        const existingHours = hoursDocSnapshot.data().hours || 0; // Ensure it's a number
                        const updatedHours = existingHours + durationInHours;
                        await setDoc(hoursDocRef, { hours: updatedHours });
                        console.log(`Updated hours for groupId ${groupId} in Firebase subcollection:`, updatedHours);
                    } else {
                        // Create a new hours document
                        await setDoc(hoursDocRef, { hours: durationInHours });
                        console.log(`Hours saved for groupId ${groupId} in Firebase subcollection:`, durationInHours);
                    }
                } else {
                    console.warn("No groupId found. Hours not saved to Firebase.");
                }
            }
        } catch (error) {
            console.error("Failed to save shift:", error);
        } finally {
            setGroupId(null); // Reset groupId after saving
        }
    };


    const startShift = async () => {
        setElapsedTime(0);
        setRunning(true);
        setPaused(false);
        const now = new Date();
        setStartTime(now);
    
        await AsyncStorage.setItem("shiftStartTime", now.toISOString());
    
        // // Request notification permission
        // const { status } = await Notifications.requestPermissionsAsync();
        // if (status === "granted") {
        //     await Notifications.scheduleNotificationAsync({
        //         content: {
        //             title: "Shift Running",
        //             body: "Your shift is still running in the background.",
        //         },
        //         trigger: { seconds: 900 }, // 15 minutes
        //     });
        // }

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

    const parseTime = (timeString) => {
        const [hours, minutes, seconds] = timeString.split(":").map(Number);
        //return only the hours
        return hours;
    };
    

    return (
        <ShiftTimerContext.Provider value={{
            setGroupId, elapsedTime, elapsedBreak, running, paused, shiftDescription, shiftName, isModalVisible, saveShift, startShift, pauseShift, resumeShift, stopShift, formatTime, openModal, setShiftDescription, setShiftName, setIsModalVisible, 
        }}>
            {children}
        </ShiftTimerContext.Provider>
    );
};

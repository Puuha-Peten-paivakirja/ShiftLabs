import react, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Navbar from "../components/Navbar";
import styles from '../styles/ShiftScreens'

export default function SettingsScreen() {
    const [testGroupInformation, setTestGroupInformation] = useState(
        [
            {
                id: 0,
                groupName: 'Ryhmä1',
                userShifts: [
                    {
                        id: 0,
                        userId: 0,
                        startingTime: '2025-03-25T12:35:00Z',
                        endingTime: '2025-03-25T14:43:00Z',
                        description: 'DescriptionText'
                    },
                    {
                        id: 1,
                        userId: 0,
                        startingTime: '2025-03-25T12:35:00Z',
                        endingTime: '2025-03-25T14:43:00Z',
                        description: 'DescriptionText2'
                    },
                    {
                        id: 2,
                        userId: 0,
                        startingTime: '2025-03-25T12:35:00Z',
                        endingTime: '2025-03-25T14:43:00Z',
                        description: 'DescriptionText3'
                    }
                ]
            },
            {
                id: 1,
                groupName: 'Ryhmä2',
                userShifts: [
                    {
                        id: 0,
                        userId: 0,
                        startingTime: '2025-03-25T12:35:00Z',
                        endingTime: '2025-03-25T14:43:00Z',
                        description: 'DescriptionText'
                    },
                    {
                        id: 1,
                        userId: 0,
                        startingTime: '2025-03-25T12:35:00Z',
                        endingTime: '2025-03-25T14:43:00Z',
                        description: 'DescriptionText2'
                    },
                    {
                        id: 2,
                        userId: 0,
                        startingTime: '2025-03-25T12:35:00Z',
                        endingTime: '2025-03-25T14:43:00Z',
                        description: 'DescriptionText3'
                    }
                ]
            },
            {
                id: 3,
                groupName: 'Ryhmä3',
                userShifts: [
                    {
                        id: 0,
                        userId: 0,
                        startingTime: '2025-03-25T12:35:00Z',
                        endingTime: '2025-03-25T14:43:00Z',
                        description: 'DescriptionText'
                    },
                    {
                        id: 1,
                        userId: 0,
                        startingTime: '2025-03-25T12:35:00Z',
                        endingTime: '2025-03-25T14:43:00Z',
                        description: 'DescriptionText2'
                    },
                    {
                        id: 2,
                        userId: 0,
                        startingTime: '2025-03-25T12:35:00Z',
                        endingTime: '2025-03-25T14:43:00Z',
                        description: 'DescriptionText3'
                    },
                    {
                        id: 3,
                        userId: 0,
                        startingTime: '2025-03-25T12:35:00Z',
                        endingTime: '2025-03-25T14:43:00Z',
                        description: 'DescriptionText'
                    },
                    {
                        id: 4,
                        userId: 0,
                        startingTime: '2025-03-25T12:35:00Z',
                        endingTime: '2025-03-25T14:43:00Z',
                        description: 'DescriptionText2'
                    },
                    {
                        id: 5,
                        userId: 0,
                        startingTime: '2025-03-25T12:35:00Z',
                        endingTime: '2025-03-25T14:43:00Z',
                        description: 'DescriptionText3'
                    }
                ]
            }
        ]
    )

    const GroupBox = (item) => {
        return (
            <>
                <View style={styles.groupBox}>
                    <Text style={styles.boldText}>{item.item.groupName}</Text>
                    <View style={styles.hr}/>
                    <FlatList 
                        data = {item.item.userShifts}
                        keyExtractor={(item) => item.id}
                        renderItem={({item}) => {
                            let startingDate = new Date(item.startingTime)
                            let stoppingDate = new Date(item.endingTime)
                            let timeDifference = Math.round((stoppingDate.getTime() - startingDate.getTime()) / (1000 * 60 * 60))
                            //Get the current day for the text
                            const days = ["Sunnuntai", "Maanantai", "Tiistai", "Keskiviikko", "Torstai", "Perjantai", "Lauantai"]
                            let weekDayName = days[startingDate.getDay()]
                            return(
                                <View style={styles.shiftInfo} key={item.id}>
                                    <View style={styles.datetimeRow}>
                                        <Text>{weekDayName} {startingDate.getDate()}.{startingDate.getMonth()}.{startingDate.getFullYear()}</Text>
                                        <Text style={styles.rightSideText}>{timeDifference}h</Text>
                                    </View>
                                    <Text style={styles.grayedOutText}>{startingDate.getHours()}.{startingDate.getMinutes()}-{stoppingDate.getHours()}.{stoppingDate.getMinutes()}</Text>
                                </View>
                            )
                        }}
                        style={styles.shiftsFlatList}
                    />
                </View>
          </>
        )
    }

    return (
        <View style={styles.container}>
        <Navbar />
        <FlatList
            data = {testGroupInformation}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => (
                <GroupBox 
                    item={item}
                />
            )}
            style = {styles.groupList}
        />
        </View>
    );
    }

import react, { useEffect, useState } from "react";
import moment from 'moment/min/moment-with-locales';
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from '@expo/vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid'
import { Topbar } from '../components/Topbar.js'
import styles from '../styles/SingleCalendarEvent'
import { Button, TextInput } from "react-native-paper";

export default function AddCalendarEvent({ route }) {
  //Variables
  const navigation = useNavigation()

  //For input fields
  const [date, setDate] = useState()
  const [startTime, setStartTime] = useState()
  const [endTime, setEndTime] = useState()
  const [note, setNote] = useState()
  const [allEvents, setAllEvents] = useState(route.params.allEvents)

  const saveInformation = () => {
    //Save info and navigate to calendar

    //Errors-variable for info validation
    let errors = []

    //Correctly format date
    let newDate = ''
    let startTimeArr = ''
    let endTimeArr = ''
    if(date !== undefined  && date.length !== 0) {
      const dateArr = date.split(".")
      if(dateArr.length !== 3) {
        errors.push("Päivämäärä ei ole oikeassa muodossa.")
      }
      newDate = new Date(dateArr[2] + "-" + dateArr[1] + "-" + dateArr[0])
    } else {
      errors.push("Päivämäärää ei ole määritelty.")
    }
    
    //Get times and format them. Then add them to the start and end dates
    if (startTime !== undefined && startTime.length !== 0) {
      startTimeArr = startTime.split(".")
      if(startTimeArr.length !== 2) {
        errors.push("Aloitusaika ei ole oikeassa muodossa.")
      }
    } else {
      errors.push("Aloitusaikaa ei ole määritelty.")
    }

    if (endTime !== undefined && endTime.length !== 0) {
      endTimeArr = endTime.split(".")
      if(endTimeArr.length !== 2) {
        errors.push("Lopetusaika ei ole oikeassa muodossa.")
      }
    } else {
      errors.push("Lopetusaikaa ei ole määritelty.")
    }

    //See if there is a value given to description field
    if (note !== undefined && note.length !== 0) {
      //Note is fine as is, nothing happens in this case
    } else {
      errors.push("Kuvausta ei ole määritelty.")
    }

    //Proceed to format and save the data if no errors are present
    if (errors.length === 0) {
      let startTimeStamp = new Date(newDate.setHours(startTimeArr[0], startTimeArr[1]))
      let endTimeStamp = new Date(newDate.setHours(endTimeArr[0], endTimeArr[1]))
      addEventToAllEvents(startTimeStamp, endTimeStamp, note)
    } else {
      for (let i = 0; i < errors.length; i++) {
        console.log(errors[i])
      }
    }

  }

  //Add event to AllEvents-variable
  const addEventToAllEvents = async(start, end, note) => {
    try {
      const newEvent = {
        id: uuid.v4(),
        start: start,
        end: end,
        note: note
      }
      const tempData = [...allEvents, newEvent]
      setAllEvents(tempData)
      saveEventsLocally(tempData)
    } catch (e) {
      console.log(e)
    }
  }

  //Save all events locally
  const saveEventsLocally = async(value) => {
    try {
      const json = JSON.stringify(value)
      await AsyncStorage.setItem("calendarEvents", json)
      navigation.navigate("Calendar")
    } catch (e) {
      console.log(e)
    }
  }

    return (
      <View style={styles.container}>
        <Topbar title='Luo kalenteritapahtuma' />
        <View style={styles.pageContent}>
          <View style={styles.textInputContainer}>
            <TextInput 
              label="Päivämäärä"
              placeholder="DD.MM.YYYY"
              value={date}
              onChangeText={text => setDate(text)}
              style={styles.textInput}
              keyboardType='decimal-pad'
            />
          </View>
          <View style={styles.textInputContainer}>
            <TextInput 
              label="Aloitusaika"
              placeholder="hh.mm"
              value={startTime}
              onChangeText={text => setStartTime(text)}
              style={styles.textInput}
              keyboardType='decimal-pad'
            />
          </View>
          <View style={styles.textInputContainer}>
            <TextInput 
              label="Lopetusaika"
              placeholder="hh.mm"
              value={endTime}
              onChangeText={text => setEndTime(text)}
              style={styles.textInput}
              keyboardType='decimal-pad'
            />
          </View>
          <View style={styles.textInputContainer}>
            <TextInput 
              label="Kuvaus"
              style={styles.textInput}
              value={note}
              onChangeText={text => setNote(text)}
              multiline={true}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button 
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              Peruuta
            </Button>

            <Button 
              style={styles.saveButton}
              onPress={saveInformation}
              labelStyle={{color: "white"}}
            >
              Tallenna
            </Button>
          </View>
          
        </View>
      </View>
    );
}

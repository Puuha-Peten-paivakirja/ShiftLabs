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
import { query, addDoc, collection, firestore, serverTimestamp, auth, USERS, CALENDARENTRIES } from "../firebase/config.js";
import { useTranslation } from 'react-i18next'

export default function AddCalendarEvent({ route }) {
  //Variables
  const navigation = useNavigation()
  const { t } = useTranslation()

  //For input fields
  const [date, setDate] = useState()
  const [startTime, setStartTime] = useState()
  const [endTime, setEndTime] = useState()
  const [note, setNote] = useState()
  //In this case allEvents variable refers to all LOCAL events. All firebase events are not needed on this page.
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
    if (auth.currentUser !== null) {
      //If user is logged in, save information to firebase and navigate back.
      try {
        await addDoc(collection(firestore, USERS, auth.currentUser.uid, CALENDARENTRIES), {
          start: start,
          end: end,
          note: note
        })
        console.log("Entry added to firebase.")
        navigation.navigate("Calendar")
      } catch (e) {
        console.log(e)
      }
    } else {
      try {
        const newEvent = {
          id: uuid.v4(),
          start: start,
          end: end,
          note: note
        }
        const tempData = [...allEvents, newEvent]
  
        let sortedArray = sortEventArray(tempData)
  
        setAllEvents(sortedArray)
        saveEventsLocally(sortedArray)
      } catch (e) {
        console.log(e)
      }
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

  const sortEventArray = (values) => {
    values.sort((a, b) => new Date(a.start) - new Date(b.start))
    return values
  }

    return (
      <View style={styles.container}>
        <Topbar title={t('create-event')} />
        <View style={styles.pageContent}>
          <View style={styles.textInputContainer}>
            <TextInput 
              label={t('date')}
              placeholder="DD.MM.YYYY"
              value={date}
              onChangeText={text => setDate(text)}
              style={styles.textInput}
              keyboardType='decimal-pad'
            />
          </View>
          <View style={styles.textInputContainer}>
            <TextInput 
              label={t('start-time')}
              placeholder="hh.mm"
              value={startTime}
              onChangeText={text => setStartTime(text)}
              style={styles.textInput}
              keyboardType='decimal-pad'
            />
          </View>
          <View style={styles.textInputContainer}>
            <TextInput 
              label={t('end-time')}
              placeholder="hh.mm"
              value={endTime}
              onChangeText={text => setEndTime(text)}
              style={styles.textInput}
              keyboardType='decimal-pad'
            />
          </View>
          <View style={styles.textInputContainer}>
            <TextInput 
              label={t('description')}
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
              {t('cancel')}
            </Button>

            <Button 
              style={styles.saveButton}
              onPress={saveInformation}
              labelStyle={{color: "white"}}
            >
              {t('save')}
            </Button>
          </View>
          
        </View>
      </View>
    );
}

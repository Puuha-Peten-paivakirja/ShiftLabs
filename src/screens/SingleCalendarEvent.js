import react, { useEffect, useState } from "react";
import moment from 'moment/min/moment-with-locales';
import { View, Text, TouchableWithoutFeedback, Keyboard, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from '@expo/vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Topbar } from '../components/Topbar.js'
import styles from '../styles/SingleCalendarEvent'
import { Button, TextInput } from "react-native-paper";
import { query, addDoc, collection, firestore, serverTimestamp, auth, USERS, CALENDARENTRIES, setDoc, doc, deleteDoc } from "../firebase/config.js";
import { useTranslation } from 'react-i18next'

export default function SingleCalendarEvent({ route }) {
  //Muuttujia
  const { t } = useTranslation()
  const navigation = useNavigation()
  const [event, setEvent] = useState(route.params.event)
  //In this case allEvents variable refers to all LOCAL events. All firebase events are not needed on this page.
  const [allEvents, setAllEvents] = useState(route.params.allEvents)

  //Tapahtuman päivämäärää varten
  const eventDate = new Date(event.start)
  const displayedDate = eventDate.getDate().toString() + '.' + (eventDate.getMonth() + 1).toString() + '.' + eventDate.getFullYear()

  //Inputteihin
  const [date, setDate] = useState(displayedDate)
  const [startTime, setStartTime] = useState(moment(event.start).format('LT').toString())
  const [endTime, setEndTime] = useState(moment(event.end).format('LT').toString())
  const [note, setNote] = useState(event.note)

  const saveInformation = () => {
    console.log("Save Info")
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
    //Check if event is saved locally
    if (allEvents.includes(event)) {
      const newArray = allEvents.map(item => {
        if (item.id === event.id) {
          return {
            ...item,
            start: start,
            end: end,
            note: note
          }
        } else {
          return item
        }
      });
      let sortedArray = sortEventArray(newArray)
      setAllEvents(sortedArray)
      saveEventsLocally(sortedArray)
    } else {
      //Event is in firebase. Check if user is logged in and edit information
      if(auth.currentUser !== null) {
        try {
          setDoc(doc(firestore, USERS, auth.currentUser.uid, CALENDARENTRIES, event.id), {
            start: start,
            end: end,
            note: note
          })
          navigation.navigate("Calendar")
        } catch (e) {
          console.log(e)
        }
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

  const deleteInformation = () => {
    console.log("Delete Info")
    //Check if event is local or not
    if(allEvents.includes(event)) {
      //Delete info and navigate to calendar
      let newArray = [...allEvents] 
      
      //Go through all the calendar events and remove the specified event from the array
      for (let i = 0; i < newArray.length; i++) {
        if (newArray[i].id === event.id) {
          newArray.splice(i, 1)
        }
      }

      //Save the new array, which doesn't have the removed value
      let sortedArray = sortEventArray(newArray)
      saveEventsLocally(sortedArray)
    } else {
      //Delete from firebase if user is logged in
      if(auth.currentUser !== null) {
        try {
          deleteDoc(doc(firestore, USERS, auth.currentUser.uid, CALENDARENTRIES, event.id))
          navigation.navigate("Calendar")
        } catch (e) {
          console.log(e)
        }
      }
    }
    
  }

  const sortEventArray = (values) => {
    values.sort((a, b) => new Date(a.start) - new Date(b.start))
    return values
  } 

    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <Topbar title={t('edit-event')} />
          <View style={styles.pageContent}>
            <View style={styles.textInputContainer}>
              <TextInput 
                label={t('date')}
                style={styles.textInput}
                placeholder="DD.MM.YYYY"
                value={date}
                onChangeText={text => setDate(text)}
                keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'decimal-pad'}
              />
            </View>
            <View style={styles.textInputContainer}>
              <TextInput 
                label={t('start-time')}
                style={styles.textInput}
                value={startTime}
                onChangeText={text => setStartTime(text)}
                placeholder="hh.mm"
                keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'decimal-pad'}
              />
            </View>
            <View style={styles.textInputContainer}>
              <TextInput 
                label={t('end-time')}
                style={styles.textInput}
                value={endTime}
                onChangeText={text => setEndTime(text)}
                placeholder="hh.mm"
                keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'decimal-pad'}
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
                style={styles.deleteButton}
                onPress={deleteInformation}
                labelStyle={{color: "white"}}
              >
                <Ionicons name="trash-outline" size={20} />
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
      </TouchableWithoutFeedback>
    );
}

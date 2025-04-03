import react, { useEffect, useState } from "react";
import moment from 'moment/min/moment-with-locales';
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from '@expo/vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Topbar } from '../components/Topbar.js'
import styles from '../styles/SingleCalendarEvent'
import { Button, TextInput } from "react-native-paper";

export default function SingleCalendarEvent({ route }) {
  //Muuttujia
  const navigation = useNavigation()
  const [event, setEvent] = useState(route.params.event)
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
    setAllEvents(newArray)
    saveEventsLocally(newArray)
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
    //Delete info and navigate to calendar
    let newArray = [...allEvents] 
    
    //Go through all the calendar events and remove the specified event from the array
    /*for (let i = 0; i < newArray.length; i++) {
      if (newArray[i].id === event.id) {
        newArray.splice(i, 1)
      }
    }*/

    //Save the new array, which doesn't have the removed value
    let sortedArray = sortEventArray(newArray)
    console.log(sortedArray)
  }

  const sortEventArray = (values) => {
    values.sort((a, b) => new Date(a.start) - new Date(b.start))
    return values
  } 

    return (
      <View style={styles.container}>
        <Topbar title='Muokkaa tapahtumaa' />
        <View style={styles.pageContent}>
          <View style={styles.textInputContainer}>
            <TextInput 
              label="Päivämäärä"
              style={styles.textInput}
              placeholder="DD.MM.YYYY"
              value={date}
              onChangeText={text => setDate(text)}
              keyboardType='decimal-pad'
            />
          </View>
          <View style={styles.textInputContainer}>
            <TextInput 
              label="Aloitusaika"
              style={styles.textInput}
              value={startTime}
              onChangeText={text => setStartTime(text)}
              placeholder="hh.mm"
              keyboardType='decimal-pad'
            />
          </View>
          <View style={styles.textInputContainer}>
            <TextInput 
              label="Lopetusaika"
              style={styles.textInput}
              value={endTime}
              onChangeText={text => setEndTime(text)}
              placeholder="hh.mm"
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
              Tallenna
            </Button>
          </View>
          
        </View>
      </View>
    );
}

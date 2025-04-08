import React, { useEffect, useState } from 'react';
import moment, { locale } from 'moment/min/moment-with-locales';
import { Text, View, Pressable, TouchableOpacity } from 'react-native';
import WeeklyCalendar from 'react-native-weekly-calendar';
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from "../components/Navbar";
import styles from '../styles/Calendar'
import { query, addDoc, collection, firestore, serverTimestamp, auth, USERS, CALENDARENTRIES } from "../firebase/config.js";
import { onSnapshot, orderBy } from 'firebase/firestore';

export default function CalendarScreen() {
  //Defaultprops-error tulee itse kirjastosta
  //Tämän saa pois, jos poistaa react-native-weekly-calendar-kirjaston indes.js-tiedoston lopusta koko Weeklycalendar.defaultprops-osan.
  //Koodi on tehty niin, että kirjasto toimii vaikka tämän poistaa.

  const navigation = useNavigation()
  const [localEvents, setLocalEvents] = useState([])
  const [firebaseEvents, setFirebaseEvents] = useState([])
  const [loaded, setLoaded] = useState(false)

  //Get all events
  useEffect(() => {
    getAllLocalEvents()
    getFirebaseEvents()
  }, [])

  const getAllLocalEvents = async() => {
    try {
      const value = await AsyncStorage.getItem("calendarEvents")
      const json = JSON.parse(value)
      if (json === null) {
        json = []
      }
      setLocalEvents(json)
      if(auth.currentUser === null) {
        setFirebaseEvents([])
        setLoaded(true)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const getFirebaseEvents = async() => {
    //Check if user is logged in
    if (auth.currentUser !== null) {
      //Get users firebase events
      try {
        const q = query(collection(firestore, USERS, auth.currentUser.uid, CALENDARENTRIES), orderBy('start', 'desc'))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const tempEventList = []
          querySnapshot.forEach((doc) => {
            tempEventList.push({id: doc.id, note: doc.data().note, start: new Date(doc.data().start.seconds * 1000), end:  new Date(doc.data().end.seconds * 1000)})
          })

          //Save info to variables
          setFirebaseEvents(tempEventList)
          setLoaded(true)
        })
        return () => {
          unsubscribe()
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
 
  return (
    <View style={styles.container}>
      <Navbar />
      {(firebaseEvents !== undefined && localEvents !== undefined && loaded === true) &&
        <WeeklyCalendar 
        selected = {moment()}
        startWeekday = {7}
        titleFormat = {undefined}
        weekdayFormat = 'ddd'
        locale = 'fi'
        events = {localEvents.concat(firebaseEvents)}
        renderEvent={(event, j) => {
          moment.locale('fi')
          let startTime = moment(event.start).format('LT').toString()
          let endTime = moment(event.end).format('LT').toString()
          return (
            <Pressable key={j} onPress={() => navigation.navigate('SingleCalendarEvent', {
              event: event,
              allEvents: localEvents
            }
            )}>
              <View style={styles.event}>
                <View style={styles.eventDuration}>
                  <View style={styles.durationContainer}>
                    <View style={styles.durationDot} />
                    <Text style={styles.durationText}>{startTime}</Text>
                  </View>
                  <View style={{ paddingTop: 10 }} />
                  <View style={styles.durationContainer}>
                    <View style={styles.durationDot} />
                    <Text style={styles.durationText}>{endTime}</Text>
                  </View>
                  <View style={styles.durationDotConnector} />
                </View>
                <View style={styles.eventNote}>
                  <Text style={styles.eventText}>{event.note}</Text>
                </View>
              </View>
              <View style={styles.lineSeparator} />
            </Pressable>
          )
        }}
        renderFirstEvent = {undefined}
        renderLastEvent = {undefined}
        renderDay={(eventViews, weekdayToAdd, i) => (
          <View key={i.toString()} style={styles.day}>
            <View style={styles.dayLabel}>
              <Text style={styles.monthDateText}>{weekdayToAdd.format('D.M').toString()}</Text>
              <Text style={styles.dayText}>{weekdayToAdd.format('ddd').toString()}</Text>
            </View>
            <View style={[styles.allEvents, eventViews.length === 0 ? { width: '100%', backgroundColor: '#f8ecf4' } : {}]}>
              {eventViews}
            </View>
          </View>
        )}
        renderFirstDay = {undefined}
        renderLastDay = {undefined}
        onDayPress = {undefined}
        themeColor = '#68548c'
        style = {styles.calendar}
        titleStyle = {{color: '#68548c'}}
        dayLabelStyle = {{color: '#68548c'}}
      />
      }
      <TouchableOpacity style={styles.floatingButton} onPress={() => navigation.navigate('AddCalendarEvent', {allEvents: localEvents})}>
        <Ionicons name="add" size={30} />
      </TouchableOpacity>
    </View>
  );
}

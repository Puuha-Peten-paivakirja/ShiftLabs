import React, { useEffect, useState } from 'react';
import moment from 'moment/min/moment-with-locales';
import { Text, View, Pressable, TouchableOpacity } from 'react-native';
import WeeklyCalendar from 'react-native-weekly-calendar';
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from "../components/Navbar";
import styles from '../styles/Calendar'

export default function CalendarScreen() {
  //Defaultprops-error tulee itse kirjastosta
  //Tämän saa pois, jos poistaa react-native-weekly-calendar-kirjaston indes.js-tiedoston lopusta koko Weeklycalendar.defaultprops-osan.
  //Koodi on tehty niin, että kirjasto toimii vaikka tämän poistaa.

  const navigation = useNavigation()
  const [allEvents, setAllEvents] = useState([])

  //Get all events
  useEffect(() => {
    getAllLocalEvents()
  }, [])

  const getAllLocalEvents = async() => {
    try {
      const value = await AsyncStorage.getItem("calendarEvents")
      const json = JSON.parse(value)
      if (json === null) {
        json = []
      }
      setAllEvents(json)
    } catch (e) {
      console.log(e)
    }
  }
 
  return (
    <View style={styles.container}>
      <Navbar />
      {(allEvents !== undefined && allEvents.length !== 0) &&
        <WeeklyCalendar 
        selected = {moment()}
        startWeekday = {7}
        titleFormat = {undefined}
        weekdayFormat = 'ddd'
        locale = 'fi'
        events = {allEvents}
        renderEvent={(event, j) => {
          moment.locale('fi')
          let startTime = moment(event.start).format('LT').toString()
          let endTime = moment(event.end).format('LT').toString()
          return (
            <Pressable key={j} onPress={() => navigation.navigate('SingleCalendarEvent', {
              event: event,
              allEvents: allEvents
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
              <Text style={styles.monthDateText}>{weekdayToAdd.format('M/D').toString()}</Text>
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
      <TouchableOpacity style={styles.floatingButton} onPress={() => navigation.navigate('AddCalendarEvent', {allEvents: allEvents})}>
        <Ionicons name="add" size={30} />
      </TouchableOpacity>
    </View>
  );
}

import { StyleSheet } from "react-native";
import {Dimensions} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FAF5FF",
  },
  calendar: {
    maxHeight: (Dimensions.get('window').height - 50)
  },
  eventText: {
    color: '#68548c',
  },
  floatingButton: {
    position: "absolute",
    bottom: 40,
    right: 20,
    backgroundColor: "#E6D6FF",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  calendarModeView: {
    flex: 1,
    alignItems: "center",
    justifyContent: 'center',
    flexDirection: 'row',
    height: '100%',
    width: '100%',
  },
  calendarModeViewVisibleBox: {
    backgroundColor: "white",
    width: '60%',
    height: '50%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 5,
    opacity: 1,
    shadowColor: 'black',
    elevation: 20,
  },
  calendarModalTitle: {
    color: '#68548c',
    fontSize: 16
  },
  calendarModeAcceptButton: {
    backgroundColor: '#68548c',
    margin: 16,
    position: 'absolute',
    bottom: 0,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    margin: 8,
  },
  calendarModalTouchableOpacity:  {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  calendarRadioButton: {
    position: 'absolute',
    right: 0
  },
  //Styles from library, colors edited
  day: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderTopColor: 'grey',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  dayLabel: {
    width: '20%',
    alignItems: 'center',
    padding: 10,
    borderRightColor: 'grey',
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  monthDateText: {
      fontSize: 20,
      color: '#68548c'
  },
  dayText: {
      color: '#68548c'
  },
  allEvents: {
      width: '80%',
  },
  event: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
  },
  eventDuration: {
      width: '30%',
      justifyContent: 'center'
  },
  durationContainer: {
      flexDirection: 'row',
      alignItems: 'center'
  },
  durationDot: {
      width: 4,
      height: 4,
      backgroundColor: '#68548c',
      marginRight: 5,
      alignSelf: 'center',
      borderRadius: 4/2,
  },
  durationDotConnector: {
      height: 20,
      borderLeftColor: '##68548c',
      borderLeftWidth: StyleSheet.hairlineWidth,
      position: 'absolute',
      left: 2
  },
  durationText: {
      color: '#68548c',
      fontSize: 12
  },
  eventNote: {
  },
  lineSeparator: {
      width: '100%',
      borderBottomColor: 'lightgrey',
      borderBottomWidth: StyleSheet.hairlineWidth,
  },
})
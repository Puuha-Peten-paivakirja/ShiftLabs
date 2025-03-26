//Styles for AllShiftsScreen, 
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FAF5FF",
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
  groupBox: {
    flex: 1,
    borderColor: '#d1d1d1',
    borderWidth: 1,
    borderRadius: 3,
    marginTop: 16,
    padding: 16,
  },
  groupList: {
    width: '90%',
    margin: 16,
    alignContent: 'center'
  },
  hr: {
    borderBottomColor: '#d1d1d1',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
    paddingBottom: 8,
  },
  shiftInfo: {
    marginTop: 16,
  },
  datetimeRow: {
    flexDirection: 'row',
  },
  rightSideText: {
    position: 'absolute',
    paddingRight: 8,
    right: 0
  },
  grayedOutText: {
    color: 'gray',
  },
  boldText: {
    fontWeight: 'bold',
  },
  shiftsFlatList: {
  }
});

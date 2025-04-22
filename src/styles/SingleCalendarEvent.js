import { StyleSheet } from "react-native";
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF5FF",
  },
  pageContent: {
    alignItems: "center",
    margin: 8,
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  textInputContainer: {
    flexDirection: 'row',
    margin: 8,
  },
  textInput: {
    width: 280,
  },
  buttonContainer: {
    flexDirection: 'row',
    margin: 8,
    position: "absolute",
    bottom: 0,
  },
  saveButton: {
    backgroundColor: '#68548c',
    marginRight: 16,
    marginLeft: 16,
  },
  cancelButton: {
    borderColor: '#68548c',
    borderWidth: 1,
    marginRight: 16,
    marginLeft: 16,
  },
  deleteButton: {
    marginRight: 16,
    marginLeft: 16,
    backgroundColor: '#b03e3e',
    alignSelf: 'fl'
  }
})
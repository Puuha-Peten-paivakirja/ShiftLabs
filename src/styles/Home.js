// src/styles/Home.js
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  profileContainer: {
    flex: 1,
    alignItems: 'center',
  },
  progressCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  workHoursContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  workHoursItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  workHoursText: {
    fontSize: 16,
  },
  totalHoursText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  floatingButton: {
    position: "absolute",
    bottom: 40,
    right: 30,
    backgroundColor: "#E6D6FF",
    width: 100,
    height: 100,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});

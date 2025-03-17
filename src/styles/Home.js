// src/styles/Home.js
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FAF5FF",
  },
  profileContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  progressCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: "#4B3F72",
    justifyContent: "center",
    alignItems: "center",
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
});

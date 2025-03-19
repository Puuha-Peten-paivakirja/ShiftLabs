import react from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Navbar from "../components/Navbar";
import Styles from "../styles/AddShift";

const AddShiftScreen = () => {
    return (
      <View style={styles.wrapper}>
        {/* Navbar (separate from container) */}
        <Navbar />
  
        {/* Main content */}
        <View style={styles.container}>
          {/* Circular Timer Display */}
          <View style={styles.circleContainer}>
            <Svg height="150" width="150" viewBox="0 0 100 100">
              <Circle cx="50" cy="50" r="45" stroke="#D8C5E5" strokeWidth="4" fill="none" />
            </Svg>
            <Text style={styles.timerText}>00:00</Text>
          </View>
  
          {/* Start Shift Button */}
          <Pressable style={styles.button} onPress={() => console.log("Start shift")}>
            <Text style={styles.buttonText}>Aloita työpäivä</Text>
          </Pressable>
        </View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: "#fff",
    },
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff",
    },
    circleContainer: {
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      marginBottom: 30,
    },
    timerText: {
      position: "absolute",
      fontSize: 24,
      fontWeight: "bold",
      color: "#000",
    },
    button: {
      backgroundColor: "#6A4BA6",
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 25,
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
  });
  
  export default AddShiftScreen;
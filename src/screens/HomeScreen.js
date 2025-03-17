import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Navbar from "../components/Navbar";
import styles from "../styles/Home";

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Navbar />

      {/* Circular Profile Image */}
      <View style={styles.profileContainer}>
        <View style={styles.progressCircle}>
          <Image
            source={{ uri: "https://via.placeholder.com/100" }} // Replace with actual user image
            style={styles.profileImage}
          />
        </View>
      </View>

      {/* Work Hours Section */}
      <View style={styles.workHoursContainer}>
        <View style={styles.workHoursItem}>
          <View style={[styles.colorIndicator, { backgroundColor: "#4B3F72" }]} />
          <Text style={styles.workHoursText}>Koulutyöt 18h</Text>
        </View>
        <View style={styles.workHoursItem}>
          <View style={[styles.colorIndicator, { backgroundColor: "#CDB4DB" }]} />
          <Text style={styles.workHoursText}>Työpaikka 20h</Text>
        </View>
        <Text style={styles.totalHoursText}>Yht. 38h</Text>
      </View>

      {/* Floating Edit Button */}
      <TouchableOpacity style={styles.floatingButton}>
        <MaterialIcons name="edit" size={24} color="#4B3F72" />
      </TouchableOpacity>
    </View>
  );
}

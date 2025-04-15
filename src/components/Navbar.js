import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
//lets import user for the name in navbar
import { UserContext } from "../context/UserContext";
import { useUser } from "../context/useUser";
import BurgerMenu from "./BurgerMenu";

export default function Navbar() {
  const navigation = useNavigation();
  const [menuOpen, setMenuOpen] = useState(false);

  const { user } = useUser() // Access user from UserContext

  return (
    <>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => setMenuOpen(true)}>
          <MaterialIcons name="menu" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          Hei {user?.displayName ?? user?.email?.split('@')[0] ?? "Vieras"}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <MaterialIcons name="settings" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Overlay for closing menu when tapping outside */}
      {menuOpen && (
        <TouchableOpacity style={styles.overlay} onPress={() => setMenuOpen(false)} />
      )}

      {/* Burger Menu */}
      <BurgerMenu isOpen={menuOpen} closeMenu={() => setMenuOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  topBar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: "#F8ECF4",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
// import { auth } from "../firebase/Config";
// import { signOut } from "firebase/auth";

export default function HomeScreen() {
  const navigation = useNavigation();
//   const user = auth.currentUser;

//   const handleLogout = async () => {
//     await signOut(auth);
//     navigation.replace("Login");
//   };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Tervetuloa</Text>
      <Button title="Kirjaa työaika" onPress={() => navigation.navigate("WorkEntry")} />
      <Button title="Ryhmät" onPress={() => navigation.navigate("Groups")} />
      <Button title="Asetukset" onPress={() => navigation.navigate("Settings")} />
      {/* <Button title="Kirjaudu ulos" onPress={handleLogout} color="red" /> */}
      <Button title="Kirjaudu ulos"color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

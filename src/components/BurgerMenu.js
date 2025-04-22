import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Alert } from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { auth, signOut } from "../firebase/config";
import { useUser } from "../context/useUser";
import { useTranslation } from "react-i18next";

export default function BurgerMenu({ isOpen, closeMenu }) {
  const navigation = useNavigation();
  const slideAnim = useRef(new Animated.Value(-250)).current; // Off-screen left
  const [menuVisible, setMenuVisible] = useState(isOpen); // Controls mounting
  const { user } = useUser()
  const { t } = useTranslation()

  useEffect(() => {
    if (isOpen) {
      setMenuVisible(true); // Ensure it's visible before animating in
      Animated.timing(slideAnim, {
        toValue: 0, // Slide in
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -250, // Slide out
        duration: 300,
        useNativeDriver: true,
      }).start(() => setMenuVisible(false)); // Hide after animation
    }
  }, [isOpen]);

  const confirmSignOut = () => {
    Alert.alert(t("sign-out"), t("sign-out-text"),[
      {
        text: t("sign-out"),
        onPress: () => userSignOut(),
      },
      {
        text: t("cancel"),
        style: "cancel"
      }
    ])
  }

  const userSignOut = () => {
    signOut(auth)
      .then(() =>{
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Welcome' }]
          })
        )
      })
      .catch((error) => {
         Alert.alert(t("error"), error.message)
      })
  }

  const confirmReturnToWelcomeScreen = () => {
    Alert.alert(t("Exit"), t("exit-text"),[
      {
        text: t("Exit"),
        onPress: () => returnToWelcomeScreen(),
      },
      {
        text: t("cancel"),
        style: "cancel"
      }
    ])
  }

  const returnToWelcomeScreen = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Welcome'}]
      })
    )
  }

  if (!menuVisible) return null; // Unmount only AFTER animation completes

  return (
    <View style={styles.overlay}>
      {/* Close menu when tapping outside */}
      <TouchableOpacity style={styles.overlayTouchable} onPress={closeMenu} />

      {/* Animated Menu */}
      <Animated.View style={[styles.menuContainer, { transform: [{ translateX: slideAnim }] }]}>
        <TouchableOpacity onPress={closeMenu} style={styles.closeButton}>
          <Text style={styles.closeText}>✖</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.menuItem}>
          <Text style={styles.menuText}>{t("home")}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Group")} style={styles.menuItem}>
          <Text style={styles.menuText}>{t("groups")}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Calendar")} style={styles.menuItem}>
            <Text style={styles.menuText}>{t("calendar")}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("AddShift")} style={styles.menuItem}>
            <Text style={styles.menuText}>{t("add-shift")}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("AllShifts")} style={styles.menuItem}>
            <Text style={styles.menuText}>{t("all-shifts")}</Text>
        </TouchableOpacity>
        {user ? (
          <TouchableOpacity onPress={() => confirmSignOut()} style={styles.menuItem}>
              <Text style={[styles.menuText, {color: "red"}]}>{t("sign-out")}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => confirmReturnToWelcomeScreen()} style={styles.menuItem}>
              <Text style={[styles.menuText, {color: "red"}]}>{t("exit")}</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dim background
    zIndex: 10,
    justifyContent: "flex-start",
  },
  overlayTouchable: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  menuContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 250,
    height: "100%",
    backgroundColor: "#f8ecf4",
    paddingTop: 40,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 5,
    elevation: 5,
    zIndex: 11,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 10,
  },
  closeText: {
    fontSize: 18,
  },
  menuItem: {
    paddingVertical: 15,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

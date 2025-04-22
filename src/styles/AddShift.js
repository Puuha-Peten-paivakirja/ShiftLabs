import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
    modeToggleButton: {
        backgroundColor: "#6A4BA6",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        alignSelf: "center", // Center the button horizontally
        marginVertical: 10, // Add spacing below the Navbar
    },
    row: {
        flexDirection: "row", // Align items horizontally
        justifyContent: "space-between", // Space between text and button
        alignItems: "center", // Align items vertically in the center
        paddingVertical: 10, // Add vertical padding for spacing
        paddingHorizontal: 15, // Add horizontal padding for spacing
        borderBottomWidth: 1, // Optional: Add a bottom border for separation
        borderBottomColor: "#ccc", // Optional: Border color
    },    
    item:{
        fontsize: 18,
        backgroundColor: "#6A4BA6",
        color: "#fff",
        margin: 5,
        padding: 10,
        height: 20,
    },
    wrapper: {
        flex: 1,
        backgroundColor: "#fff",
    },
    container: {
        paddingTop: 20,
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
        marginTop: 20,
    },
    saveshiftbtn: {
        backgroundColor: "#6A4BA6",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginTop: "60%",
    },
    disabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
    //modalStyles
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        width: 300,
        alignItems: "center",
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
    },
    modalButtonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    modalButton: {
        padding: 10,
        backgroundColor: "#6A4BA6",
        borderRadius: 5,
        width: "45%",
        alignItems: "center",
    },
    shiftDataLabel: {
        fontSize: 18,
        fontWeight: '600',
        marginRight: 12,
        marginTop: "5%",
    },
    shiftDataDropDown: {
        marginTop: 20,
        width: 200,
        backgroundColor: '#e6e0e9',
        borderBottomColor: 'black',
        borderBottomWidth: 0.8,
    },
    shiftDataDropDownContainer: {
        marginTop: 20,
        position: 'relative',
        zIndex: 9,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 8,
        flex: 1, // Allow the input to take up available space
        marginLeft: 10, // Add spacing between the label and input
    },
    shiftDataInputRow: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      },
    clearInputIcon: {
        position: 'absolute',
        right: Platform.OS === 'ios' ? 35 : 45
      },
      shiftDataInput: {
        width: 328,
        backgroundColor: '#e6e0e9',
        paddingRight: 32,
        borderBottomColor: 'black',
        borderBottomWidth: 0.8
      },
    inputbutton: {
        backgroundColor: "#6A4BA6",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    dropdownButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        backgroundColor: "#f9f9f9",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        width: "50%",
    },
    dropdownButtonText: {
        fontSize: 16,
        color: "#333",
    },
    dropdown: {
        position: "absolute", // Makes the dropdown overlay the rest of the screen
        top: "100%", // Positions the dropdown directly below the button
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        maxHeight: 120, // Limits the dropdown height to show 3 items (assuming ~40px per item)
        overflow: "hidden", // Ensures content doesn't overflow the dropdown
        elevation: 5, // Adds shadow for Android
        shadowColor: "#000", // Adds shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    dropdownItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    dropdownItemText: {
        fontSize: 16,
        color: "#333",
    },
});
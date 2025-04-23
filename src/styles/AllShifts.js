import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 10,
    },
    shiftLabel: {
        fontSize: 18,
        fontWeight: '600',
        marginRight: 12,
        marginTop: "5%",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 8,
        flex: 1, // Allow the input to take up available space
        marginLeft: 10, // Add spacing between the label and input
        width: "100%", // Set width to 100% of the parent container
    },
    noDataText: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 16,
        color: "gray",
    },
    shiftItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    shiftText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    deleteShiftButton: {
        backgroundColor: "#ff4444",
        borderRadius: '2%',
        padding: '3%',
        justifyContent: "center",
        alignItems: "center",
    },
    shiftName: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    
    }

});
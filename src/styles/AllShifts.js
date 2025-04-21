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
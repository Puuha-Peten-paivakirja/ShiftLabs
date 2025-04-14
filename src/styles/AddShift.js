import { StyleSheet } from "react-native";

export default StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: "#fff",
    },
    container: {
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
    buttonContainer: {
        flexDirection: "row",
        gap: 20,
        marginTop: 20,
    },
    button: {
        backgroundColor: "#6A4BA6",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    disabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
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
});
import { StyleSheet } from "react-native";

export default StyleSheet.create({
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
});
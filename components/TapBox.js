import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import {
  MaterialIcons,
  Ionicons,
  FontAwesome,
  FontAwesome5,
} from "@expo/vector-icons";
import React from "react";

const TapBox = ({ handlePress, time, activeButton, gameOver }) => {
  const parts = time.split(":");
  const mainTime = parts.slice(0, 2).join(":");
  const milliTime = parts[2];
  return (
    <View style={styles.container}>
      {gameOver ? (
        <View style={{ ...styles.tabBox, backgroundColor: "#9a3737" }}>
          <Ionicons name="flag-outline" size={96} color="white" />
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => {
            handlePress(); // For timer functionality
          }}
          style={{
            ...styles.tabBox,
            backgroundColor: activeButton ? "#D0C88E" : "#A7A284",
          }}
        >
          <View style={styles.timeContainer}>
            <Text style={styles.mainTime}>{mainTime}</Text>
            <Text style={styles.milliTime}>:{milliTime}</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  tabBox: {
    width: "100%",
    height: 100,
    borderRadius: 5,
    backgroundColor: "#A7A284",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  mainTime: {
    fontSize: 72, // Larger font size for minutes and seconds
    color: "#333333",
  },
  milliTime: {
    fontSize: 36, // Smaller font size for milliseconds
    color: "#888787",
  },
});

export default TapBox;

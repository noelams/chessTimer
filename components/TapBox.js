import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import React from "react";

const TapBox = ({ handlePress, time, activeButton }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handlePress}
        style={{
          ...styles.tabBox,
          backgroundColor: activeButton ? "#D0C88E" : "#A7A284",
        }}
      >
        <Text style={styles.time}>{time}</Text>
      </TouchableOpacity>
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
  time: {
    fontSize: 96,
  },
});

export default TapBox;

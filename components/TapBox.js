import { View, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";

const TapBox = ({ handlePress, time }) => {
  return (
    <View>
      <TouchableOpacity onPress={handlePress} style={styles.tabBox}>
        {time}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBox: {
    width: 100,
    height: 100,
    borderRadius: 5,
    s,
  },
});

export default TapBox;

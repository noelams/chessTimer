import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  MaterialIcons,
  Ionicons,
  FontAwesome,
  FontAwesome5,
} from "@expo/vector-icons";
import TapBox from "./components/TapBox";
import { useState, useRef, useEffect } from "react";

export default function App() {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [activeButton, setActiveButton] = useState(null);

  const intervalRef = useRef(null);

  const countdown = () => {
    setTime((prevTime) => prevTime + 1);
  };

  const handlePressA = () => {
    if (activeButton === null) {
      // First move: if A is pressed, start B's timer
      setActiveButton("B");
    } else if (activeButton === "A") {
      // Only process press if A is the active clock
      // (if you want to allow a press on the active clock to switch, then)
      setActiveButton("B");
    }
  };
  const handlePressB = () => {
    if (activeButton === null) {
      // First move: if A is pressed, start B's timer
      setActiveButton("A");
    } else if (activeButton === "B") {
      // Only process press if A is the active clock
      // (if you want to allow a press on the active clock to switch, then)
      setActiveButton("A");
    }
  };

  const resetTimer = () => {
    setActiveButton(null);
  };

  // const handlePress = () => {
  //   setIsActive(!isActive);
  //   if (isActive) {
  //   }
  //   const countInterval = setInterval(countdown, 1000);
  //   console.log("button press", countInterval);
  //   if (time > 10) {
  //     clearInterval(countInterval);
  //   }
  //   clearInterval(countInterval);
  // };
  return (
    <View style={styles.container}>
      <TapBox
        handlePress={handlePressA}
        time={time}
        activeButton={activeButton === "A"}
      />
      <View style={styles.optionsSection}>
        <TouchableOpacity>
          <Ionicons
            name={isActive ? "play" : "pause"}
            size={36}
            color={"#EDEEC0"}
          />
        </TouchableOpacity>
        <TouchableOpacity disabled={isActive} onPress={resetTimer}>
          <MaterialIcons name="autorenew" size={36} color={"#EDEEC0"} />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name="gear" size={36} color={"#EDEEC0"} />
        </TouchableOpacity>
      </View>
      <TapBox
        handlePress={handlePressB}
        time={time}
        activeButton={activeButton === "B"}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#433E0E",
    alignItems: "center",
    justifyContent: "center",
  },
  optionsSection: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  activeButton: {
    backgroundColor: "#D0C88E",
  },
});

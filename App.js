import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  Modal,
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
import { Picker } from "@react-native-picker/picker";
import TapBox from "./components/TapBox";
import { useState, useRef, useEffect } from "react";

export default function App() {
  const [timeA, setTimeA] = useState(300);
  const [timeB, setTimeB] = useState(300);
  const [isActive, setIsActive] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [ModalIsVisible, setModalIsVisible] = useState(false);
  const [time, setTime] = useState(300);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setpaused] = useState(false);
  const [movesCount, setmovesCount] = useState(0);
  const setTimer = [15, 30, 45, 60, 120, 180, 300, 600];

  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  const startTimer = (player) => {
    setIsActive(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setActiveButton(player);
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - startTimeRef.current) / 1000);

      if (player === "A" && !gameOver) {
        setTimeA((prev) => {
          const newTime = prev - elapsedSeconds;
          if (newTime <= 0) {
            clearInterval(intervalRef.current);
            setGameOver(true);
            return 0;
          }
          return newTime;
        });
      } else if (player === "B" && !gameOver) {
        setTimeB((prev) => {
          const newTime = prev - elapsedSeconds;
          if (newTime <= 0) {
            clearInterval(intervalRef.current);
            setGameOver(true);
            return 0;
          }
          return newTime;
        });
      }
      startTimeRef.current = now; // Reset the timer base
    }, 1000);
  };

  const handlePressA = () => {
    if (activeButton === null) {
      setmovesCount((prev) => prev + 1);
      // First move: if A is pressed, start B's timer
      setActiveButton("B");
      startTimer("B");
      // startTimer(player);
    } else if (activeButton === "A") {
      // Only process press if A is the active clock
      // (if you want to allow a press on the active clock to switch, then)
      setActiveButton("B");
      startTimer("B");
      setmovesCount((prev) => prev + 1);
    }
  };
  const handlePressB = () => {
    if (activeButton === null) {
      setmovesCount((prev) => prev + 1);
      // First move: if A is pressed, start B's timer
      setActiveButton("A");
      startTimer("A");
    } else if (activeButton === "B") {
      // Only process press if A is the active clock
      // (if you want to allow a press on the active clock to switch, then)
      setmovesCount((prev) => prev + 1);
      setActiveButton("A");
      startTimer("A");
    }
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current); // stop setinterval function
    setTimeA(time); //reset timer A
    setTimeB(time); //reset timer B
    setActiveButton(null);
    setIsActive(false);
    setGameOver(false);
    setmovesCount(0);
  };

  const pauseTimer = () => {
    setpaused(true);
    setActiveButton(null);
    console.log("paused Time");
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null; // Optional: helps to track that the timer is paused
    }
  };

  const resumeTimer = () => {
    console.log("time resumed");
    setpaused(false);

    if (!isActive) {
      setIsActive(true);

      // Reset the start time to now so the elapsed calculation is correct
      startTimeRef.current = Date.now();
      // Restart the interval
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - startTimeRef.current) / 1000);

        if (activeButton === "A") {
          setTimeA((prev) => prev - elapsedSeconds);
        } else if (activeButton === "B") {
          setTimeB((prev) => prev - elapsedSeconds);
        }

        startTimeRef.current = now;
      }, 1000);
    }
  };

  const fullMoves = Math.floor(movesCount / 2);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        visible={ModalIsVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalIsVisible(false)}
        style={styles.modal}
      >
        <View style={styles.pickerContainer}>
          <Picker
            style={styles.picker}
            selectedValue={time}
            onValueChange={(itemValue) => {
              setTimeA(itemValue);
              setTimeB(itemValue);
              setTime(itemValue);
            }}
          >
            {setTimer.map((t) => (
              <Picker.Item key={t} label={t.toString()} value={t} />
            ))}
          </Picker>
          <Button
            title="close"
            onPress={() => setModalIsVisible(false)}
            style={{ backgroundColor: "#333" }}
          />
        </View>
      </Modal>
      <TapBox
        handlePress={handlePressA}
        time={timeA}
        activeButton={activeButton === "A"}
        gameOver={timeA ? false : gameOver} // once timeA reaches 0, gameOver is true
      />
      <View style={styles.optionsSection}>
        <TouchableOpacity>
          <Ionicons
            name={isActive ? "pause" : "play"}
            size={36}
            color={"#EDEEC0"}
            onPress={isActive ? pauseTimer : resumeTimer}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={resetTimer}>
          <MaterialIcons name="autorenew" size={36} color={"#EDEEC0"} />
        </TouchableOpacity>
        <TouchableOpacity
          disabled={isActive}
          onPress={() => setModalIsVisible(true)}
        >
          <FontAwesome name="gear" size={36} color={"#EDEEC0"} />
        </TouchableOpacity>
        <Text style={styles.movesCount}>{fullMoves}</Text>
      </View>
      <TapBox
        handlePress={handlePressB}
        time={timeB}
        activeButton={activeButton === "B"}
        gameOver={timeB ? false : gameOver}
        paused={paused}
      />
      <StatusBar style="auto" />
    </SafeAreaView>
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
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#D0C88E",
  },
  pickerContainer: {
    flex: 1,
    backgroundColor: "#433e0e83",
  },
  picker: {
    backgroundColor: "#fff",
  },
  movesCount: {
    fontSize: 36,
    color: "#EDEEC0",
  },
});

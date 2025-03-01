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
import { Audio } from "expo-av";
// import { useAudioPlayer } from "expo-audio";

export default function App() {
  const initialTime = 300;
  const [timeA, setTimeA] = useState(initialTime * 1000);
  const [timeB, setTimeB] = useState(initialTime * 1000);
  const [isActive, setIsActive] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [ModalIsVisible, setModalIsVisible] = useState(false);
  const [time, setTime] = useState(timeA);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setpaused] = useState(false);
  const [movesCount, setmovesCount] = useState(0);
  // const [sound, setSound] = useState();
  const setTimer = [15, 30, 45, 60, 120, 180, 300, 600];

  const convertToMinutes = (seconds) => {
    if (seconds > 59) {
      return `${Math.floor(seconds / 60)} min`;
    } else {
      return `${seconds} sec`;
    }
  };

  const soundRef = useRef(null);

  useEffect(() => {
    async function loadSound() {
      const { sound } = await Audio.Sound.createAsync(
        require("./assets/fingerSnap.wav")
      );
      soundRef.current = sound;
    }

    loadSound();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  async function playSound() {
    if (soundRef.current) {
      console.log("tapped");
      await soundRef.current.replayAsync();
    } else {
      console.log("Sound not loaded yet");
    }
  }

  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = ms % 100;
    return (
      minutes.toString().padStart(2, "0") +
      ":" +
      seconds.toString().padStart(2, "0") +
      ":" +
      milliseconds.toString().padStart(2, "0")
    );
  };

  const startTimer = (player) => {
    setIsActive(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setActiveButton(player);
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsedMs = now - startTimeRef.current;

      if (player === "A" && !gameOver) {
        setTimeA((prev) => {
          const newTime = prev - elapsedMs;
          if (newTime <= 0) {
            clearInterval(intervalRef.current);
            setGameOver(true);
            return 0;
          }
          return newTime;
        });
      } else if (player === "B" && !gameOver) {
        setTimeB((prev) => {
          const newTime = prev - elapsedMs;
          if (newTime <= 0) {
            clearInterval(intervalRef.current);
            setGameOver(true);
            return 0;
          }
          return newTime;
        });
      }
      startTimeRef.current = now; // Reset the timer base
    }, 50);
  };

  const handlePressA = () => {
    if (activeButton === null) {
      setmovesCount((prev) => prev + 1);
      playSound();
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
      playSound();
    }
  };
  const handlePressB = () => {
    if (activeButton === null) {
      setmovesCount((prev) => prev + 1);
      // First move: if A is pressed, start B's timer
      setActiveButton("A");
      startTimer("A");
      playSound();
    } else if (activeButton === "B") {
      // Only process press if A is the active clock
      // (if you want to allow a press on the active clock to switch, then)
      setmovesCount((prev) => prev + 1);
      setActiveButton("A");
      startTimer("A");
      playSound();
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
        const elapsedMs = now - startTimeRef.current;

        if (activeButton === "A") {
          setTimeA((prev) => prev - elapsedMs);
        } else if (activeButton === "B") {
          setTimeB((prev) => prev - elapsedMs);
        }

        startTimeRef.current = now;
      }, 50);
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
              <Picker.Item key={t} label={convertToMinutes(t)} value={t} />
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
        time={formatTime(timeA)}
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
        time={formatTime(timeB)}
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

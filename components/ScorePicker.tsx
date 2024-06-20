import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  View,
  useColorScheme,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Colors } from "@/constants/Colors";
import ScrollPicker from "react-native-wheel-scrollview-picker";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { ref, set } from "firebase/database";
import { auth, db } from "@/firebaseConfig";

type Predictions = {
    Home: number;
    Away: number;
}
export default function ScorePicker({ isVisible, onClose, match }: any) {
    const colorScheme = useColorScheme() ?? 'light';
    const scoreSource = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const [prediction, setPrediction] = useState<Predictions>({Home: 0, Away: 0});
    const handleHomePrediction = (data:number) => {
        const tmp: Predictions = prediction;
        tmp.Home = data;
        setPrediction(tmp);
    }
    const handleAwayPrediction = (data:number) => {
        const tmp: Predictions = prediction;
        tmp.Away = data;
        setPrediction(tmp);
    }
    const submitPrediction = () => {
        set(ref(db, "typer/" + auth.currentUser?.displayName + "/" + match.id), {
            Home: prediction.Home,
            Away: prediction.Away
        })
    }
    useEffect(() => {
        return () => {
            const tmp: Predictions = {Home: 0, Away: 0};
            setPrediction(tmp);
        }
    }, []);
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <Pressable
        onPress={() => {
          onClose();
        }}
        style={{
          height: "100%",
          width: "100%",
          position: "absolute",
          backgroundColor: colorScheme==='light' ? '#0006' : "#000c",
          justifyContent: "center",
        }}
      ></Pressable>
      <View style={[styles.container, {backgroundColor: colorScheme==='light' ? Colors.grey : Colors.darkgrey}]}>
        <ThemedText type="title" numberOfLines={1}>Wytypuj wynik</ThemedText>
        <View style={{ flexDirection: "row", flex: 1, alignItems: 'center' }}>
          <View style={{flex: 1, alignItems: 'center'}}>
            <ThemedText type="subtitle" numberOfLines={1}>{match?.Home}</ThemedText>
            <View style={{ height: "60%", width: 100, alignSelf: 'center' }}>
              <ScrollPicker
                dataSource={scoreSource}
                selectedIndex={prediction.Home}
                renderItem={(data, index) => (
                  <ThemedText
                    type="boldNumber"
                    style={{ fontSize: 42, width: 100, textAlign: "center" }}
                  >
                    {data}
                  </ThemedText>
                )}
                onValueChange={(data, selectedIndex) => {
                  handleHomePrediction(data);
                }}
                wrapperHeight={240}
                itemHeight={70}
                wrapperBackground={colorScheme==='light' ? Colors.grey : Colors.darkgrey}
                highlightColor="#777"
                highlightBorderWidth={2}
              />
            </View>
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <ThemedText type="subtitle" numberOfLines={1}>{match?.Away}</ThemedText>
            <View style={{ height: "60%", width: 100, alignSelf: 'center' }}>
              <ScrollPicker
                dataSource={scoreSource}
                selectedIndex={prediction.Away}
                renderItem={(data, index) => (
                  <ThemedText
                    type="boldNumber"
                    style={{ fontSize: 42, width: 100, textAlign: "center" }}
                  >
                    {data}
                  </ThemedText>
                )}
                onValueChange={(data, selectedIndex) => {
                  handleAwayPrediction(data);
                }}
                wrapperHeight={240}
                wrapperBackground={colorScheme==='light' ? Colors.grey : Colors.darkgrey}
                itemHeight={70}
                highlightColor="#777"
                highlightBorderWidth={2}
              />
            </View>
          </View>
        </View>
        <TouchableNativeFeedback onPress={() => {submitPrediction(), onClose()}}>
                <ThemedView style={{borderRadius: 10, padding: 10}} darkColor='#555' lightColor='#ccc'>
                <ThemedText type="subtitle">Zapisz wynik</ThemedText>
                </ThemedView>
            </TouchableNativeFeedback>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: "auto",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: "80%",
    height: "80%",
    borderRadius: 10,
    padding: 20
  },
});

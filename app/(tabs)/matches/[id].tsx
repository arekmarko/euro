import {
  BackHandler,
  Image,
  ImageBackground,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
  useColorScheme,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { onValue, ref, set } from "firebase/database";
import { auth, db } from "@/firebaseConfig";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Colors } from "@/constants/Colors";
import ScrollPicker from "react-native-wheel-scrollview-picker";
import ScorePicker from "@/components/ScorePicker";
import { Flag } from "@/constants/Flags";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedSeparator } from "@/components/ThemedSeparator";
import { Collapsible } from "@/components/Collapsible";
import { Ionicons } from "@expo/vector-icons";

type Match = {
  id: number;
  Home: string;
  Away: string;
  Date: string;
  Hour: string;
  Matchday: number;
  Phase: string;
  Stadium: string;
  HomeGoals: number;
  AwayGoals: number;
};

type Predictions = {
  Home: number;
  Away: number;
};

type Squad = {
  name: string;
  surname: string;
  kitNumber: number;
};
export default function matchDetails() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme() ?? "light";
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isHelpVisible, setIsHelpVisible] = useState(false);
  const [prediction, setPrediction] = useState<Predictions>();
  const [HomeSquad, setHomeSquad] = useState<Squad[]>([]);
  const [AwaySquad, setAwaySquad] = useState<Squad[]>([]);
  const today = new Date();
  const [squad, setSquad] = useState<Squad[]>([
    { kitNumber: 1, name: "Manuel", surname: "Neuer" },
    { kitNumber: 2, name: "Antonio", surname: "Rudiger" },
    { kitNumber: 3, name: "David", surname: "Raum" },
    { kitNumber: 4, name: "Jonathan", surname: "Tah" },
    { kitNumber: 5, name: "Pascal", surname: "Gross" },
    { kitNumber: 6, name: "Joshua", surname: "Kimmich" },
    { kitNumber: 7, name: "Kai", surname: "Havertz" },
    { kitNumber: 8, name: "Toni", surname: "Kross" },
    { kitNumber: 9, name: "Niclas", surname: "Fullkrug" },
    { kitNumber: 10, name: "Jamal", surname: "Musiala" },
    { kitNumber: 11, name: "Chris", surname: "Fuhrich" },
    { kitNumber: 12, name: "Oliver", surname: "Baumann" },
    { kitNumber: 13, name: "Thomas", surname: "Muller" },
    { kitNumber: 14, name: "Maximilian", surname: "Beier" },
    { kitNumber: 15, name: "Nico", surname: "Schlotterbeck" },
    { kitNumber: 16, name: "Waldemar", surname: "Anton" },
    { kitNumber: 17, name: "Florian", surname: "Wirtz" },
    { kitNumber: 18, name: "Maximilian", surname: "Mittelstadt" },
    { kitNumber: 19, name: "Leroy", surname: "Sane" },
    { kitNumber: 20, name: "Benjamin", surname: "Henrichs" },
    { kitNumber: 21, name: "Ilkay", surname: "Gundogan" },
    { kitNumber: 22, name: "Marc-Andre", surname: "ter Stegen" },
    { kitNumber: 23, name: "Robert", surname: "Andrich" },
    { kitNumber: 24, name: "Robin", surname: "Koch" },
    { kitNumber: 26, name: "Undav", surname: "Deniz" },
  ]);
  const onModalOpen = () => {
    setIsModalVisible(true);
  };
  const onModalClose = () => {
    setIsModalVisible(false);
  };
  const onHelpOpen = () => {
    setIsHelpVisible(true);
  };
  const onHelpClose = () => {
    setIsHelpVisible(false);
  };
  const [match, setMatch] = useState<Match>();
  //const addSquad = () => {set(ref(db, 'nations/Niemcy/'), {squad})};
  useEffect(() => {
    onValue(ref(db, "matches/" + [id]), (snapshot) => {
      const data = snapshot.val();
      setMatch(data);
      onValue(ref(db, "nations/" + data.Home + "/squad"), (snapshot) => {
        const data = snapshot.val();
        setHomeSquad(data);
      });
      onValue(ref(db, "nations/" + data.Away + "/squad"), (snapshot) => {
        const data = snapshot.val();
        setAwaySquad(data);
      });
    });
    onValue(
      ref(db, "typer/" + auth.currentUser?.displayName + "/" + [id]),
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setPrediction(data);
        }
      }
    );
  }, []);
  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        darkLeft: Colors.darkgrey,
        darkRight: Colors.darkgrey,
        lightLeft: "#ddd",
        lightRight: "#ddd",
      }}
      headerImage={
        <View style={{ margin: 20, marginTop: "10%", alignItems: "center" }}>
          <ThemedText>
            {match?.Date} {match?.Hour}
          </ThemedText>
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  height: "60%",
                  width: "70%",
                  borderRadius: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={
                    Flag[match?.Home as string]
                      ? Flag[match?.Home as string]
                      : require("../../../assets/images/flags/polska.png")
                  }
                  resizeMode="center"
                  style={{ height: "90%", width: "80%" }}
                />
              </View>
              <ThemedText
                style={{
                  textAlign: "left",
                  fontWeight:
                    match && match?.HomeGoals > match?.AwayGoals
                      ? "bold"
                      : "normal",
                }}
                type="subtitle"
              >
                {match?.Home}
              </ThemedText>
            </View>
            <View style={{ paddingTop: "8%" }}>
              <ThemedText type="title">
                <Text
                  style={{
                    fontWeight:
                      match && match?.HomeGoals > match?.AwayGoals
                        ? "bold"
                        : "normal",
                  }}
                >
                  {match?.HomeGoals}
                </Text>{" "}
                -{" "}
                <Text
                  style={{
                    fontWeight:
                      match && match?.AwayGoals > match?.HomeGoals
                        ? "bold"
                        : "normal",
                  }}
                >
                  {match?.AwayGoals}
                </Text>
              </ThemedText>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  height: "60%",
                  width: "70%",
                  borderRadius: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={
                    Flag[match?.Home as string]
                      ? Flag[match?.Away as string]
                      : require("../../../assets/images/flags/polska.png")
                  }
                  resizeMode="center"
                  style={{ height: "90%", width: "80%" }}
                />
              </View>
              <ThemedText
                style={{
                  textAlign: "right",
                  fontWeight:
                    match && match?.AwayGoals > match?.HomeGoals
                      ? "bold"
                      : "normal",
                }}
                type="subtitle"
              >
                {match?.Away}
              </ThemedText>
            </View>
          </View>
        </View>
      }
    >
      <View style={styles.container}>
        <ThemedView style={{ gap: 20 }}>
          <Collapsible title="Twój typ">
            <View style={{ alignItems: "center" }}>
              <TouchableNativeFeedback
                style={{ margin: 0 }}
                onPress={() => onHelpOpen()}
              >
                <View
                  style={{
                    backgroundColor: Colors.darkgrey,
                    width: "10%",
                    aspectRatio: 1 / 1,
                    borderRadius: 20,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ThemedText>?</ThemedText>
                </View>
              </TouchableNativeFeedback>
              <ThemedText type="title" style={{ margin: 20, fontSize: 48 }}>
                {prediction ? prediction.Home : "-"} :{" "}
                {prediction ? prediction.Away : "-"}
              </ThemedText>
            </View>
            {(parseInt(match?.Date.split(".")[0] as string) > today.getDate() &&
              parseInt(match?.Date.split(".")[1] as string) >=
                today.getMonth() + 1) ||
            (parseInt(match?.Date.split(".")[0] as string) == today.getDate() &&
              parseInt(match?.Date.split(".")[1] as string) ==
                today.getMonth() + 1 &&
              parseInt(match?.Hour.split(":")[0] as string) >
                today.getHours()) ? (
              <TouchableNativeFeedback
                onPress={() => {
                  onModalOpen();
                }}
              >
                <ThemedView
                  style={{
                    borderRadius: 10,
                    padding: 10,
                    width: "50%",
                    alignItems: "center",
                    alignSelf: "center",
                  }}
                  darkColor={Colors.darkgrey}
                  lightColor={Colors.grey}
                >
                  <ThemedText>
                    {prediction ? "Zmień wynik" : "Obstaw wynik"}
                  </ThemedText>
                </ThemedView>
              </TouchableNativeFeedback>
            ) : (
              <View style={{ alignItems: "center" }}>
                {prediction && prediction?.Home == match?.HomeGoals &&
                prediction?.Away == match?.AwayGoals ? (
                  <ThemedText type="light">Dokładny wynik +1</ThemedText>
                ) : (
                  <></>
                )}
                {prediction &&
                match &&
                prediction?.Home > prediction?.Away ==
                  match?.HomeGoals > match?.AwayGoals ? (
                  <ThemedText type="light">Poprawny zwycięzca +1</ThemedText>
                ) : (
                  <></>
                )}
                {prediction &&
                match &&
                prediction?.Home - prediction?.Away ==
                  match?.HomeGoals - match?.AwayGoals ? (
                  <ThemedText type="light">Różnica bramek +1</ThemedText>
                ) : (
                  <></>
                )}
                {prediction ? <></> : <ThemedText style={{textAlign: 'center'}}>Nie można obstawić wyniku, ponieważ ten mecz już się odbył.</ThemedText>}
              </View>
            )}
          </Collapsible>

          <Collapsible title="Składy">
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 10,
              }}
            >
              <View style={{ flex: 1 }}>
                {HomeSquad ? (
                  HomeSquad.map((item, index) => (
                    <View key={index}>
                      <View
                        style={{
                          flexDirection: "row",
                          gap: 10,
                          justifyContent: "flex-start",
                        }}
                      >
                        <ImageBackground
                          source={Flag[match?.Home as string]}
                          resizeMode="center"
                          imageStyle={{}}
                          style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <LinearGradient
                            colors={["#000", "#0000"]}
                            style={{ width: "100%" }}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 1 }}
                          >
                            <ThemedText
                              style={{
                                textAlign: "right",
                                transform: [{ translateX: -25 }],
                              }}
                            >
                              {item.kitNumber}
                            </ThemedText>
                          </LinearGradient>
                        </ImageBackground>
                        <ThemedText style={{ textAlign: "left", flex: 5 }}>
                          {item.name[0]}. {item.surname}
                        </ThemedText>
                      </View>
                      <ThemedSeparator
                        style={{ margin: 3 }}
                        darkColor={Colors.darkgrey}
                      />
                    </View>
                  ))
                ) : (
                  <ThemedText>Brak danych</ThemedText>
                )}
              </View>
              <View style={{ flex: 1 }}>
                {AwaySquad ? (
                  AwaySquad.map((item, index) => (
                    <View key={index}>
                      <View
                        style={{
                          flexDirection: "row",
                          gap: 10,
                          justifyContent: "flex-end",
                        }}
                      >
                        <ThemedText style={{ textAlign: "right", flex: 5 }}>
                          {item.name[0]}. {item.surname}
                        </ThemedText>
                        {/* <Image source={Flag[match?.Home as string]} resizeMode="center"  style={{width: '10%', height: '100%'}} /> */}
                        <ImageBackground
                          source={Flag[match?.Away as string]}
                          resizeMode="center"
                          imageStyle={{}}
                          style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <LinearGradient
                            colors={["#000", "#0000"]}
                            style={{ width: "100%" }}
                            start={{ x: 1, y: 1 }}
                            end={{ x: 0, y: 1 }}
                          >
                            <ThemedText
                              style={{
                                textAlign: "left",
                                transform: [{ translateX: 25 }],
                              }}
                            >
                              {item.kitNumber}
                            </ThemedText>
                          </LinearGradient>
                        </ImageBackground>
                      </View>
                      <ThemedSeparator
                        style={{ margin: 3 }}
                        darkColor={Colors.darkgrey}
                      />
                    </View>
                  ))
                ) : (
                  <ThemedText style={{ textAlign: "right" }}>
                    Brak danych
                  </ThemedText>
                )}
              </View>
            </View>
          </Collapsible>

          {/* <TouchableNativeFeedback onPress={addSquad}>
          <ThemedView style={{borderRadius: 10, padding: 10}} darkColor={Colors.darkgrey} lightColor={Colors.grey}>
                <ThemedText>Dodaj składy</ThemedText>
                </ThemedView>
          </TouchableNativeFeedback> */}
        </ThemedView>
      </View>

      <ScorePicker
        isVisible={isModalVisible}
        onClose={onModalClose}
        match={match}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={isHelpVisible}
        onRequestClose={onHelpClose}
      >
        <Pressable
          onPress={() => {
            onHelpClose();
          }}
          style={{
            height: "100%",
            width: "100%",
            position: "absolute",
            backgroundColor: colorScheme === "light" ? "#0004" : "#000d",
            justifyContent: "center",
          }}
        ></Pressable>
        <View style={{flex: 1, justifyContent: 'center'}}>

        <View
          style={{
            margin: 'auto',
            padding: 20,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            width: "70%",
            position: "absolute",
            backgroundColor:
            colorScheme === "light" ? Colors.grey : Colors.darkgrey,
            gap: 15
          }}
          >
          <ThemedText type="subtitle">Informacje</ThemedText>
          <ThemedText type="default" style={{textAlign: 'center'}}>+1 punkt za wytypowanie idealnego wyniku.</ThemedText>
          <ThemedText type="default" style={{textAlign: 'center'}}>+1 punkt za wytypowanie zwycięzcy spotkania.</ThemedText>
          <ThemedText type="default" style={{textAlign: 'center'}}>+1 punkt za wytypowanie poprawnej różnicy bramek.</ThemedText>
        </View>
          </View>
      </Modal>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

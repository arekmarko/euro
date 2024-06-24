import {
  BackHandler,
  FlatList,
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
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { onValue, query, ref, set } from "firebase/database";
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
import { StackActions } from "@react-navigation/native";

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
  const [predictions, setPredictions] = useState<any[]>([]);
  const [HomeHistory, setHomeHistory] = useState<Match[]>([]);
  const [AwayHistory, setAwayHistory] = useState<Match[]>([]);
  const today = new Date();
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
  const route = useNavigation();
  function beforeMatch(date: any) {
    if (
      (parseInt(date?.Date.split(".")[0] as string) > today.getDate() &&
        parseInt(date?.Date.split(".")[1] as string) >= today.getMonth() + 1) ||
      parseInt(date?.Date.split(".")[1] as string) > today.getMonth() + 1 ||
      (parseInt(date?.Date.split(".")[0] as string) == today.getDate() &&
        parseInt(date?.Date.split(".")[1] as string) == today.getMonth() + 1 &&
        parseInt(date?.Hour.split(":")[0] as string) > today.getHours())
    ) {
      return true;
    } else {
      return false;
    }
  }
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
      onValue(ref(db, "matches/"), (snapshot) => {
        const newData = snapshot.val();
        newData.forEach((element: any) => {
          if (element.Home == data.Home || element.Away == data.Home) {
            HomeHistory.push(element);
          }
          if (element.Home == data.Away || element.Away == data.Away) {
            AwayHistory.push(element);
          }
        });
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
    onValue(ref(db, "typer/"), (snapshot) => {
      const playersData = snapshot.val();
      const playersList = [];
      for (const playerId in playersData) {
        const player = playersData[playerId];
        if (playersData[playerId][id as string]) {
          playersList.push({
            name: playerId,
            home: player[id as string].Home,
            away: player[id as string].Away,
            points: player[id as string].points,
          });
        }
      }
      setPredictions(playersList);
    });
    const backAction = () => {
      router.navigate("(tabs)");
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
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
                numberOfLines={1}
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
                numberOfLines={1}
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
                    backgroundColor:
                      colorScheme == "light" ? Colors.grey : Colors.darkgrey,
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
            {beforeMatch(match) ? (
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
                  {prediction ? (
                    <></>
                  ) : (
                    <View
                      style={{
                        transform: [{ translateX: 3 }, { translateY: -3 }],
                        width: 10,
                        height: 10,
                        borderRadius: 10,
                        backgroundColor: "red",
                        position: "absolute",
                        right: 0,
                      }}
                    ></View>
                  )}
                  <ThemedText style={{ textAlign: "center" }}>
                    {prediction ? "Zmień wynik" : "Obstaw wynik"}
                  </ThemedText>
                </ThemedView>
              </TouchableNativeFeedback>
            ) : (
              <View style={{ alignItems: "center" }}>
                {prediction &&
                match?.HomeGoals &&
                match.AwayGoals &&
                prediction?.Home == match?.HomeGoals &&
                prediction?.Away == match?.AwayGoals ? (
                  <ThemedText type="light">Dokładny wynik +1</ThemedText>
                ) : (
                  <></>
                )}
                {prediction &&
                match!.HomeGoals >= 0 &&
                match!.AwayGoals >= 0 &&
                ((prediction?.Home > prediction?.Away &&
                  match!.HomeGoals > match!.AwayGoals) ||
                  (prediction?.Home < prediction?.Away &&
                    match!.HomeGoals < match!.AwayGoals) ||
                  (prediction?.Home == prediction?.Away &&
                    match?.HomeGoals == match?.AwayGoals)) ? (
                  <ThemedText type="light">Poprawny zwycięzca +1</ThemedText>
                ) : (
                  <></>
                )}
                {prediction &&
                match!.HomeGoals >= 0 &&
                match!.AwayGoals >= 0 &&
                Math.abs(prediction?.Home - prediction?.Away) ===
                  Math.abs(match!.HomeGoals - match!.AwayGoals) ? (
                  <ThemedText type="light">Różnica bramek +1</ThemedText>
                ) : (
                  <></>
                )}
                {prediction ? (
                  <></>
                ) : (
                  <ThemedText style={{ textAlign: "center" }}>
                    Nie można obstawić wyniku, ponieważ ten mecz już się odbył.
                  </ThemedText>
                )}
              </View>
            )}
          </Collapsible>

          <Collapsible title="Typowania innych">
            {!beforeMatch(match) ? (
              predictions.length > 0 ? (
                predictions
                  .sort((a, b) => (a.points >= b.points ? -1 : 1))
                  .map((item: any, index: any) => (
                    <View key={index}>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <ThemedText type="default" style={{ flex: 1 }}>
                          {index + 1}. {item.name}
                        </ThemedText>
                        <ThemedText
                          type="default"
                          style={{ flex: 1, textAlign: "center" }}
                        >
                          {item.home} - {item.away}
                        </ThemedText>
                        {item.points >= 0 ? (
                          <ThemedText
                            type="default"
                            style={{ flex: 1, textAlign: "right" }}
                          >
                            +{item.points}{" "}
                            {item.points > 1
                              ? "punkty"
                              : item.points == 0
                              ? "punktów"
                              : "punkt"}
                          </ThemedText>
                        ) : (
                          <View style={{ flex: 1 }}></View>
                        )}
                      </View>
                      <ThemedSeparator
                        style={{ margin: 0 }}
                        lightColor={Colors.grey}
                        darkColor={Colors.darkgrey}
                      />
                    </View>
                  ))
              ) : (
                <ThemedText style={{ textAlign: "center" }}>
                  Nikt nie obstawiał tego meczu.
                </ThemedText>
              )
            ) : (
              <View>
                <ThemedText style={{ textAlign: "center", margin: 10 }}>
                  Wyniki innych będą dostępnę po rozpoczęciu meczu.
                </ThemedText>
                {predictions.length > 0 ? (
                  predictions
                    .sort((a, b) => (a.points > b.points ? -1 : 1))
                    .map((item: any, index: any) => (
                      <View key={index}>
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <ThemedText type="default" style={{ flex: 1 }}>
                            {index + 1}. {item.name}
                          </ThemedText>
                        </View>
                        <ThemedSeparator
                          style={{ margin: 0 }}
                          lightColor={Colors.grey}
                          darkColor={Colors.darkgrey}
                        />
                      </View>
                    ))
                ) : (
                  <></>
                )}
              </View>
            )}
          </Collapsible>

          <Collapsible title="Forma zespołów">
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1 }}>
                {HomeHistory.map((item, index) => (
                  <View key={index} style={{ margin: 5 }}>
                    {item.HomeGoals >= 0 && item.AwayGoals >= 0 ? (
                      <View
                        style={{
                          flexDirection: "row",
                          gap: 15,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <View
                          style={{
                            backgroundColor:
                              item.Home == match?.Home
                                ? item.HomeGoals > item.AwayGoals
                                  ? "green"
                                  : item.HomeGoals == item.AwayGoals
                                  ? "orange"
                                  : "red"
                                : item.AwayGoals > item.HomeGoals
                                ? "green"
                                : item.AwayGoals == item.HomeGoals
                                ? "orange"
                                : "red",
                            padding: 3,
                            borderRadius: 10,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <ThemedText lightColor={Colors.white}>
                            {item.Home == match?.Home
                              ? item.HomeGoals + " - " + item.AwayGoals
                              : item.AwayGoals + " - " + item.HomeGoals}
                          </ThemedText>
                        </View>
                        <ThemedText style={{ flex: 3 }} numberOfLines={1}>
                          vs {item.Home == match?.Home ? item.Away : item.Home}
                        </ThemedText>
                      </View>
                    ) : (
                      <></>
                    )}
                  </View>
                ))}
              </View>
              <View style={{ flex: 1 }}>

              {AwayHistory.map((item, index) => (
                  <View key={index} style={{ margin: 5 }}>
                    {item.HomeGoals >= 0 && item.AwayGoals >= 0 ? (
                      <View
                        style={{
                          flexDirection: "row",
                          gap: 15,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                                <ThemedText style={{ flex: 3, textAlign: 'right' }} numberOfLines={1}>
                                  {item.Away == match?.Away ? item.Home : item.Away} vs
                                </ThemedText>
                        <View
                          style={{
                            backgroundColor:
                              item.Away == match?.Away
                                ? item.AwayGoals > item.HomeGoals
                                  ? "green"
                                  : item.HomeGoals == item.AwayGoals
                                  ? "orange"
                                  : "red"
                                : item.HomeGoals > item.AwayGoals
                                ? "green"
                                : item.AwayGoals == item.HomeGoals
                                ? "orange"
                                : "red",
                            padding: 3,
                            borderRadius: 10,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <ThemedText lightColor={Colors.white}>
                            {item.Away == match?.Away
                              ? item.HomeGoals + " - " + item.AwayGoals
                              : item.AwayGoals + " - " + item.HomeGoals}
                          </ThemedText>
                        </View>
                      </View>
                    ) : (
                      <></>
                    )}
                  </View>
                ))}
            </View>
            </View>
          </Collapsible>

          <Collapsible title="Składy">
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 10,
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
                          resizeMode="stretch"
                          imageStyle={{}}
                          style={{
                            aspectRatio:
                              match?.Home == "Szwajcaria" ? 1 / 1 : 1.5 / 1,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <LinearGradient
                            colors={
                              colorScheme == "light"
                                ? ["#fff", "#fff5"]
                                : ["#111", "#1110"]
                            }
                            style={{ width: "100%" }}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 1 }}
                          >
                            <ThemedText
                              numberOfLines={1}
                              style={{
                                textAlign: "right",
                                transform: [{ translateX: -20 }],
                              }}
                            >
                              {item.kitNumber}
                            </ThemedText>
                          </LinearGradient>
                        </ImageBackground>
                        <ThemedText
                          numberOfLines={1}
                          style={{ textAlign: "left", flex: 5 }}
                        >
                          {item.name == "" ? "" : item.name[0] + ". "}
                          {item.surname}
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
                        <ThemedText
                          numberOfLines={1}
                          style={{ textAlign: "right", flex: 1 }}
                        >
                          {item.name == "" ? "" : item.name[0] + ". "}
                          {item.surname}
                        </ThemedText>
                        <ImageBackground
                          source={Flag[match?.Away as string]}
                          resizeMode="stretch"
                          imageStyle={{}}
                          style={{
                            aspectRatio:
                              match?.Away == "Szwajcaria" ? 1 / 1 : 1.5 / 1,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <LinearGradient
                            colors={
                              colorScheme == "light"
                                ? ["#fff", "#fff5"]
                                : ["#111", "#1110"]
                            }
                            style={{ width: "100%" }}
                            start={{ x: 1, y: 1 }}
                            end={{ x: 0, y: 1 }}
                          >
                            <ThemedText
                              numberOfLines={1}
                              style={{
                                textAlign: "left",
                                transform: [{ translateX: 20 }],
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
        <View style={{ flex: 1, justifyContent: "center" }}>
          <View
            style={{
              margin: "auto",
              padding: 20,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              width: "70%",
              position: "absolute",
              backgroundColor:
                colorScheme === "light" ? Colors.grey : Colors.darkgrey,
              gap: 15,
            }}
          >
            <ThemedText type="subtitle">Informacje</ThemedText>
            <ThemedText type="default" style={{ textAlign: "center" }}>
              +1 punkt za wytypowanie idealnego wyniku.
            </ThemedText>
            <ThemedText type="default" style={{ textAlign: "center" }}>
              +1 punkt za wytypowanie zwycięzcy spotkania.
            </ThemedText>
            <ThemedText type="default" style={{ textAlign: "center" }}>
              +1 punkt za wytypowanie poprawnej różnicy bramek.
            </ThemedText>
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

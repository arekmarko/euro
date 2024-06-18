import Ionicons from "@expo/vector-icons/Ionicons";
import {
  StyleSheet,
  Image,
  Platform,
  TouchableNativeFeedback,
  View,
  Switch,
  useColorScheme,
  Modal,
  TextInput,
  ScrollView,
  ToastAndroid,
} from "react-native";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { auth, db } from "@/firebaseConfig";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ThemedSeparator } from "@/components/ThemedSeparator";
import { ref, set, push, onValue, update, off } from "firebase/database";
import ScorePicker from "@/components/ScorePicker";
import ScrollPicker from "react-native-wheel-scrollview-picker";

type Match = {
  id: number;
  Home: string;
  Away: string;
  Date: string;
  Hour: string;
  Matchday: number;
  Phase: string;
  Stadium: string;
  HomeGoals: string;
  AwayGoals: string;
};

type Predictions = {
  Home: number;
  Away: number;
};

export default function Settings() {
  const colorScheme = useColorScheme() ?? "light";
  const [notifications, setNotifications] = useState(true);
  const [visibleSendMessage, setVisibleMessage] = useState(false);
  const [addResultVisible, setAddResultVisible] = useState(false);
  const [matchListVisible, setMatchVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [selectedMatch, setSelectedMatch] = useState(0);
  const [matches, setMatches] = useState<Match[]>([]);
  const [prediction, setPrediction] = useState<Predictions>({
    Home: 0,
    Away: 0,
  });
  const [playersPrediction, setPlayerPrediction] = useState<any[]>([]);
  const scoreSource = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  useEffect(() => {
    onValue(ref(db, "matches/"), (snapshot) => {
      const data = snapshot.val();
      const newData = Object.keys(data).map((key) => ({
        ...data[key],
      }));
      setMatches(newData);
    });
    onValue(ref(db, "users/"), (snapshot) => {
      const data = snapshot.val();
      const newData = Object.keys(data).map((key) => ({
        ...data[key],
      }));
      setUsers(data);
    });
  }, []);
  const handleMatchListVisible = () => {
    setMatchVisible((prev) => !prev);
  };
  const handleHomePrediction = (data: number) => {
    const tmp: Predictions = prediction;
    tmp.Home = data;
    setPrediction(tmp);
  };
  const handleAwayPrediction = (data: number) => {
    const tmp: Predictions = prediction;
    tmp.Away = data;
    setPrediction(tmp);
  };
  function sendMessage() {
    push(ref(db, "messages/" + auth.currentUser?.displayName + "/"), {
      message: message,
    });
  }
  function checkPoints(player: Predictions): number {
    var points = 0;
    //punkty za poprawnego zwycięzcę
    if (
      (player.Home > player.Away && prediction.Home > prediction.Away) ||
      (player.Home < player.Away && prediction.Home < prediction.Away) ||
      (player.Home == player.Away && prediction.Home == prediction.Away)
    ) {
      points++;
    }
    //punkty za różnicę bramek
    if (player.Home - player.Away === prediction.Home - prediction.Away) {
      //console.log(player.Home + ' - ' + player.Away + ' = ' + prediction.Home + ' - ' + prediction.Away)
      points++;
    }
    //punkty za dokładny wynik
    if (player.Home === prediction.Home && player.Away === prediction.Away) {
      points++;
    }
    return points;
  }
  function saveResult() {
    update(ref(db, "matches/" + (selectedMatch + 1) + "/"), {
      HomeGoals: prediction.Home,
      AwayGoals: prediction.Away,
    }).then(() => {
      onValue(ref(db, "typer/"), (snapshot) => {
        const playersData = snapshot.val();
        for (const playerId in playersData) {
          let tmpPoints = 0;
          if (playersData[playerId][selectedMatch + 1]) {
            const points = checkPoints(
              playersData[playerId][selectedMatch + 1]
            );
            set(ref(db, "typer/" + playerId + "/" + (selectedMatch + 1) + "/"),
              { ...playersData[playerId][selectedMatch + 1], points: points }
            ).then(() => {
              for (let i = 0; i <= selectedMatch + 1; i++) {
                if (playersData[playerId][i] != undefined) {
                  tmpPoints += playersData[playerId][i].points;
                }
              }
              console.log(playerId + ": " + tmpPoints);
              users[playerId as any].points = tmpPoints;
              update(ref(db, "users/" + playerId + "/"), { points: tmpPoints });
            });
          }
        }
        console.log("poza for");
        const newData = Object.keys(users).map((key: any) => ({
          ...users[key],
        }));
        newData
          .sort((a: any, b: any) => (a.points > b.points ? -1 : 1))
          .map((value: any, index: any) =>
            update(ref(db, "users/" + value.username + "/"), {
              ranking: index + 1,
            })
          );
        ToastAndroid.show(
          "Dodano wynik " + prediction.Home + "-" + prediction.Away,
          ToastAndroid.LONG
        );
        console.log("------------");
      });
    });
  }
  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        lightLeft: "#D0D0D0",
        lightRight: "#E0E0E0",
        darkLeft: "#353636",
        darkRight: "#656565",
      }}
      headerImage={
        <Ionicons size={310} name="cog" style={styles.headerImage} />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Ustawienia</ThemedText>
      </ThemedView>
      <ThemedSeparator />
      <ThemedText type="subtitle">{auth.currentUser?.displayName}</ThemedText>
      <ThemedText type="default">{auth.currentUser?.email}</ThemedText>
      <ThemedSeparator />

      {auth.currentUser?.email === "arekmarko8@gmail.com" ? (
        <TouchableNativeFeedback onPress={() => setAddResultVisible(true)}>
          <ThemedView
            lightColor={Colors.grey}
            darkColor={Colors.darkgrey}
            style={styles.logoutButton}
          >
            <ThemedText>Dodaj wynik</ThemedText>
          </ThemedView>
        </TouchableNativeFeedback>
      ) : (
        <></>
      )}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <ThemedText>Masz uwagi?</ThemedText>
        <TouchableNativeFeedback onPress={() => setVisibleMessage(true)}>
          <ThemedView
            lightColor={Colors.grey}
            darkColor={Colors.darkgrey}
            style={styles.button}
          >
            <ThemedText>Wyślij uwagi!</ThemedText>
          </ThemedView>
        </TouchableNativeFeedback>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visibleSendMessage}
        onRequestClose={() => setVisibleMessage(false)}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View
            style={{ flex: 1, backgroundColor: "#0004", position: "absolute" }}
          ></View>
          <ThemedView
            style={{
              width: "80%",
              backgroundColor: Colors.darkgrey,
              gap: 20,
              padding: 20,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ThemedText type="subtitle">Wyślij swoje uwagi</ThemedText>
            <TextInput
              value={message}
              onChangeText={setMessage}
              style={{
                backgroundColor: Colors.grey,
                width: "100%",
                textAlignVertical: "top",
                padding: 3,
              }}
              scrollEnabled={true}
              multiline={true}
              numberOfLines={10}
            />
            <TouchableNativeFeedback onPress={() => sendMessage()}>
              <ThemedView
                lightColor={Colors.grey}
                darkColor="#777"
                style={styles.button}
              >
                <ThemedText>Wyślij</ThemedText>
              </ThemedView>
            </TouchableNativeFeedback>
          </ThemedView>
        </View>
      </Modal>
      <TouchableNativeFeedback
        onPress={() => {
          auth.signOut(), router.dismissAll();
        }}
      >
        <ThemedView
          lightColor={Colors.grey}
          darkColor={Colors.darkgrey}
          style={styles.logoutButton}
        >
          <ThemedText type="subtitle">Wyloguj się</ThemedText>
        </ThemedView>
      </TouchableNativeFeedback>
      <Modal
        transparent={true}
        visible={addResultVisible}
        animationType="fade"
        onRequestClose={() => setAddResultVisible(false)}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ThemedView
            style={{
              width: "80%",
              height: "80%",
              padding: 20,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor:
                colorScheme == "light" ? Colors.grey : Colors.darkgrey,
            }}
          >
            <ThemedText type="subtitle">Dodaj wynik</ThemedText>
            <ThemedSeparator />
            <TouchableNativeFeedback onPress={handleMatchListVisible}>
              <ThemedView
                style={{
                  width: "100%",
                  height: 40,
                  borderRadius: 5,
                  borderBottomLeftRadius: matchListVisible ? 0 : 5,
                  borderBottomRightRadius: matchListVisible ? 0 : 5,
                  borderWidth: 1,
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: 10,
                  flexDirection: "row",
                }}
                lightColor={Colors.white}
                darkColor="#666"
              >
                {selectedMatch >= 0 ? (
                  <ThemedText>
                    {matches[selectedMatch]?.Home} -{" "}
                    {matches[selectedMatch]?.Away}
                  </ThemedText>
                ) : (
                  <></>
                )}
                <Ionicons
                  name="chevron-down"
                  style={{ textAlign: "right" }}
                  color={colorScheme === "light" ? Colors.black : Colors.white}
                  size={18}
                />
              </ThemedView>
            </TouchableNativeFeedback>
            {matchListVisible ? (
              <ThemedView style={{ width: "100%" }}>
                <ScrollView style={{ height: 200 }}>
                  {matches.map((value, index) => (
                    <TouchableNativeFeedback
                      key={index}
                      onPress={() => {
                        setSelectedMatch(index), setMatchVisible(false);
                      }}
                    >
                      <ThemedView
                        key={index}
                        style={{
                          backgroundColor:
                            colorScheme == "light"
                              ? Colors.grey
                              : Colors.darkgrey,
                        }}
                      >
                        <View style={{ flexDirection: "row" }}>
                          <ThemedText type="subtitle" style={{ flex: 1 }}>
                            {value?.Home}
                          </ThemedText>
                          <ThemedText type="subtitle">-</ThemedText>
                          <ThemedText
                            type="subtitle"
                            style={{ flex: 1, textAlign: "right" }}
                          >
                            {value?.Away}
                          </ThemedText>
                        </View>
                        <ThemedSeparator style={{ margin: 5 }} />
                      </ThemedView>
                    </TouchableNativeFeedback>
                  ))}
                </ScrollView>
              </ThemedView>
            ) : (
              <></>
            )}
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1, alignItems: "center" }}>
                <ThemedText type="subtitle" numberOfLines={1}>
                  Home
                </ThemedText>
                <View
                  style={{
                    height: "40%",
                    width: 100,
                    alignSelf: "center",
                  }}
                >
                  <ScrollPicker
                    dataSource={scoreSource}
                    selectedIndex={prediction.Home}
                    renderItem={(data, index) => (
                      <ThemedText
                        type="boldNumber"
                        style={{
                          fontSize: 42,
                          width: 100,
                          textAlign: "center",
                        }}
                      >
                        {data}
                      </ThemedText>
                    )}
                    onValueChange={(data, selectedIndex) => {
                      handleHomePrediction(data);
                    }}
                    wrapperHeight={160}
                    wrapperBackground={
                      colorScheme === "light" ? Colors.grey : Colors.darkgrey
                    }
                    itemHeight={70}
                    highlightColor="#777"
                    highlightBorderWidth={2}
                  />
                </View>
              </View>
              <View style={{ flex: 1, alignItems: "center" }}>
                <ThemedText type="subtitle" numberOfLines={1}>
                  Away
                </ThemedText>
                <View
                  style={{
                    height: "40%",
                    width: 100,
                    alignSelf: "center",
                  }}
                >
                  <ScrollPicker
                    dataSource={scoreSource}
                    selectedIndex={prediction.Away}
                    renderItem={(data, index) => (
                      <ThemedText
                        type="boldNumber"
                        style={{
                          fontSize: 42,
                          width: 100,
                          textAlign: "center",
                        }}
                      >
                        {data}
                      </ThemedText>
                    )}
                    onValueChange={(data, selectedIndex) => {
                      handleAwayPrediction(data);
                    }}
                    wrapperHeight={160}
                    wrapperBackground={
                      colorScheme === "light" ? Colors.grey : Colors.darkgrey
                    }
                    itemHeight={70}
                    highlightColor="#777"
                    highlightBorderWidth={2}
                  />
                </View>
              </View>
            </View>
            <TouchableNativeFeedback onPress={saveResult}>
              <ThemedView
                style={{
                  backgroundColor: colorScheme == "light" ? "#ccc" : "#777",
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <ThemedText>Zapisz</ThemedText>
              </ThemedView>
            </TouchableNativeFeedback>
          </ThemedView>
        </View>
      </Modal>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  logoutButton: {
    padding: 10,
    borderRadius: 10,
    alignSelf: "center",
    alignItems: "center",
    width: "50%",
    margin: 20,
  },
  button: {
    padding: 10,
    borderRadius: 10,
    minWidth: "30%",
    alignItems: "center",
  },
});

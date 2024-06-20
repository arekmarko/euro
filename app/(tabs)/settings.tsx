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
  const [squad, setSquad] = useState<Squad[]>(
    [
      { kitNumber: 1, name: "Yann", surname: "Sommer" },
      { kitNumber: 2, name: "Leonidas", surname: "Stergiou" },
      { kitNumber: 3, name: "Silvan", surname: "Widmer" },
      { kitNumber: 4, name: "Nico", surname: "Elvedi" },
      { kitNumber: 5, name: "Manuel", surname: "Akanji" },
      { kitNumber: 6, name: "Denis", surname: "Zakaria" },
      { kitNumber: 7, name: "Breel", surname: "Embolo" },
      { kitNumber: 8, name: "Remo", surname: "Freuler" },
      { kitNumber: 9, name: "Noah", surname: "Okafor" },
      { kitNumber: 10, name: "Granit", surname: "Xhaka" },
      { kitNumber: 11, name: "Renato", surname: "Steffen" },
      { kitNumber: 12, name: "Yvon", surname: "Mvogo" },
      { kitNumber: 13, name: "Ricardo", surname: "Rodriguez" },
      { kitNumber: 14, name: "Steven", surname: "Zuber" },
      { kitNumber: 15, name: "Cédric", surname: "Zesiger" },
      { kitNumber: 16, name: "Vincent", surname: "Sierro" },
      { kitNumber: 17, name: "Ruben", surname: "Vargas" },
      { kitNumber: 18, name: "Kwadwo", surname: "Duah" },
      { kitNumber: 19, name: "Dan", surname: "Ndoye" },
      { kitNumber: 20, name: "Michel", surname: "Aebischer" },
      { kitNumber: 21, name: "Gregor", surname: "Kobel" },
      { kitNumber: 22, name: "Fabian", surname: "Schär" },
      { kitNumber: 23, name: "Xherdan", surname: "Shaqiri" },
      { kitNumber: 24, name: "Ardon", surname: "Jashari" },
      { kitNumber: 25, name: "Zeki", surname: "Amdouni" },
      { kitNumber: 26, name: "Fabian", surname: "Rieder" }
  ]

);
  
  const scoreSource = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  useEffect(() => {
    //set(ref(db, 'nations/Szwajcaria/'), {squad});
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
    setVisibleMessage(false);
    ToastAndroid.show(
      "Wysłano wiadomość.",
      ToastAndroid.LONG
    );
  }
  function checkPoints(player: Predictions, match: any): number {
    var points = 0;
    //console.log(player.Home + '-' + player.Away + ' / wynik: ' + match.Home + ' ' + match.HomeGoals + '-' + match.AwayGoals + ' ' + match.Away)
    //punkty za poprawnego zwycięzcę
    if (
      (player.Home > player.Away && match.HomeGoals > match.AwayGoals) ||
      (player.Home < player.Away && match.HomeGoals < match.AwayGoals) ||
      (player.Home == player.Away && match.HomeGoals == match.AwayGoals)
    ) {
      //console.log('zwyciezca')
      points++;
    }
    //punkty za różnicę bramek
    if (player.Home - player.Away === match.HomeGoals - match.AwayGoals) {
      //console.log(player.Home + ' - ' + player.Away + ' = ' + prediction.Home + ' - ' + prediction.Away)
      //console.log('roznica bramek')
      points++;
    }
    //punkty za dokładny wynik
    if (player.Home === match.HomeGoals && player.Away === match.AwayGoals) {
      //console.log('dokladny wynik')
      points++;
    }
    return points;
  }
  function saveResult() {
    console.log(matches[selectedMatch].Home + ' ' + prediction.Home + ' - ' + prediction.Away + ' ' + matches[selectedMatch].Away)
    update(ref(db, "matches/" + (selectedMatch + 1) + "/"), {
      HomeGoals: prediction.Home,
      AwayGoals: prediction.Away,
    })
    onValue(ref(db, "typer/"), (snapshot) => {
      const playersData = snapshot.val();
      for (const playerId in playersData){
        let tmpPoints = 0;
        for (let i = 0; i <= selectedMatch + 1; i++) {
        if (playersData[playerId][i]) {
          if (i == selectedMatch + 1) {
            const tmpMatch = {HomeGoals: prediction.Home, AwayGoals: prediction.Away}
            const points = checkPoints(playersData[playerId][i], tmpMatch);
            playersData[playerId][i].points = points;
          } else {
            const points = checkPoints(playersData[playerId][i], matches[i-1]);
            playersData[playerId][i].points = points;
          }
        }
      }
        for (let i = 0; i <= selectedMatch + 1; i++) {
          if (playersData[playerId][i] != undefined) {
            tmpPoints = tmpPoints + playersData[playerId][i].points;
          }
        }
        users[playerId as any].points = tmpPoints;
      }
      Object.keys(users).map((key: any) => ({
        ...users[key],
      }))
        .sort((a: any, b: any) => (a.points > b.points ? -1 : 1))
        .map((value: any, index: any) =>
          users[value.username].ranking = index+1
        );
        set(ref(db, 'typer/'), {
          ...playersData
        })
        set(ref(db, 'users/'), {
          ...users
        })
        ToastAndroid.show(
          "Dodano wynik " + prediction.Home + "-" + prediction.Away,
          ToastAndroid.LONG
        );
    })
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
              backgroundColor: colorScheme == "light"
                    ? Colors.grey
                    : Colors.darkgrey,
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
                backgroundColor: Colors.white,
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
                lightColor='#ccc'
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
          <ThemedText type="subtitle" style={{textAlign: 'center'}}>Wyloguj się</ThemedText>
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
              height: "60%",
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
                    {selectedMatch+1 + '. '}
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
                          <ThemedText type="subtitle">{index+1}. </ThemedText>
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
    width: "70%",
    margin: 20,
  },
  button: {
    padding: 10,
    borderRadius: 10,
    minWidth: "30%",
    alignItems: "center",
  },
});

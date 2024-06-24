import {
  Image,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  useColorScheme,
  Pressable,
  Modal,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { onValue, orderByChild, query, ref } from "firebase/database";
import { auth, db } from "@/firebaseConfig";
import { ThemedSeparator } from "@/components/ThemedSeparator";
import { Colors } from "@/constants/Colors";
import { Flag } from "@/constants/Flags";
import { LinearGradient } from "expo-linear-gradient";

export default function standings() {
  const colorScheme = useColorScheme();
  const [rankingData, setRankingData] = useState<string[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [initIndex, setInitIndex] = useState(0);
  const [myTypes, setMyTypes] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [myStats, setMyStats] = useState({
    points: 0,
    anypoints: 0,
    streak3: 0,
    streak: 0,
    count3: 0,
    streak0: 0,
  });
  const [stats, setStats] = useState({
    points: 0,
    anypoints: 0,
    streak3: 0,
    streak: 0,
    count3: 0,
    streak0: 0,
  });
  const [userDetails, setUserDetails] = useState("");
  const today = new Date();
  function openDetails(username: string) {
    setDetailsVisible(true);
    onValue(ref(db, "typer/" + username + "/"), (snapshot) => {
      const data = snapshot.val();
      setUserDetails(username);
      let points: number = 0;
      let anypoints: number = 0;
      let streak3: number = 0;
      let tmpstreak3: number = 0;
      let streak: number = 0;
      let tmpstreak: number = 0;
      let count3: number = 0;
      let streak0: number = 0;
      let tmpstreak0: number = 0;
      if (data) {
        const newData = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        const newTypes: any[] = [];
        newData.forEach((element) => {
          if (element.points >= 0) {
            newTypes.push(element);
          }
        });
        setTypes(newTypes);
        newData.forEach((element: any) => {
          if (element.points >= 0) {
            points = points + element.points;
            if (element.points == 3) {
              count3 += 1;
              tmpstreak3 += 1;
              if (tmpstreak3 > streak3) {
                streak3 = tmpstreak3;
              }
            } else {
              tmpstreak3 = 0;
            }
            if (element.points > 0) {
              anypoints += 1;
              tmpstreak0 = 0;
              tmpstreak += 1;
              if (tmpstreak > streak) {
                streak = tmpstreak;
              }
            } else {
              tmpstreak = 0;
              tmpstreak0 += 1;
              if (tmpstreak0 > streak0) {
                streak0 = tmpstreak0;
              }
            }
          }
        });
      } else {
        setTypes([]);
      }
      const newStats = {
        points: points,
        anypoints: anypoints,
        streak3: streak3,
        streak: streak,
        count3: count3,
        streak0: streak0,
      };
      setStats(newStats);
    });
  }
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
    onValue(ref(db, "users"), (snapshot) => {
      const data = snapshot.val();
      const newData = Object.keys(data).map((key) => ({
        ...data[key],
      }));
      newData.sort((a, b) => (a.points > b.points ? -1 : 1));
      setRankingData(newData);
    });
    onValue(ref(db, "matches/"), (snapshot) => {
      const data = snapshot.val();
      setMatches(data);
      let tmp = true;
      data.forEach((element: any) => {
        if (beforeMatch(element) && tmp) {
          tmp = false;
          setInitIndex(element.id - 1);
        }
      });
    });
    onValue(
      ref(db, "typer/" + auth.currentUser?.displayName + "/"),
      (snapshot) => {
        const data = snapshot.val();
        const newData = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        const newTypes: any[] = [];
        newData.forEach((element) => {
          if (element.points >= 0) {
            newTypes.push(element);
          }
        });
        setMyTypes(newTypes);
        let points: number = 0;
        let anypoints: number = 0;
        let streak3: number = 0;
        let tmpstreak3: number = 0;
        let streak: number = 0;
        let tmpstreak: number = 0;
        let count3: number = 0;
        let streak0: number = 0;
        let tmpstreak0: number = 0;
        data.forEach((element: any) => {
          if (element.points >= 0) {
            points = points + element.points;
            if (element.points == 3) {
              count3 += 1;
              tmpstreak3 += 1;
              if (tmpstreak3 > streak3) {
                streak3 = tmpstreak3;
              }
            } else {
              tmpstreak3 = 0;
            }
            if (element.points > 0) {
              anypoints += 1;
              tmpstreak0 = 0;
              tmpstreak += 1;
              if (tmpstreak > streak) {
                streak = tmpstreak;
              }
            } else {
              tmpstreak = 0;
              tmpstreak0 += 1;
              if (tmpstreak0 > streak0) {
                streak0 = tmpstreak0;
              }
            }
          }
        });
        const newStats = {
          points: points,
          anypoints: anypoints,
          streak3: streak3,
          streak: streak,
          count3: count3,
          streak0: streak0,
        };
        setMyStats(newStats);
      }
    );
  }, []);
  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        lightLeft: "#4faf4f",
        lightRight: "#ff5151",
        darkLeft: "#348732",
        darkRight: "#ff3f3f",
      }}
      headerImage={
        <Image
          source={require("@/assets/images/ronaldo3.png")}
          resizeMode="contain"
          style={styles.parallaxLogo}
        />
      }
    >
      <ThemedText type="title">Statystyki</ThemedText>
      <View>
        <ThemedText type="default">
          <ThemedText type="boldNumber">{myStats.points}</ThemedText> - Punkty
        </ThemedText>
        <ThemedText type="default">
          <ThemedText type="boldNumber">{myStats.count3}</ThemedText> - Idealne
          wyniki
        </ThemedText>
        <ThemedText type="default">
          <ThemedText type="boldNumber">{myStats.streak}</ThemedText> - Seria
          punktowa
        </ThemedText>
        <ThemedText type="default">
          <ThemedText type="boldNumber">{myStats.streak0}</ThemedText> - Seria
          meczów bez żadnego punktu
        </ThemedText>
        <ThemedText type="default">
          <ThemedText type="boldNumber">
            {myTypes.length
              ? Math.floor((myStats.points / (myTypes.length * 3)) * 100)
              : 0}
            %
          </ThemedText>{" "}
          - Skuteczność
        </ThemedText>
      </View>

      <ThemedText type="title">Ranking</ThemedText>
      <ThemedView
        style={{ borderRadius: 20, padding: 20, paddingBottom: 30 }}
        darkColor={Colors.darkgrey}
        lightColor={Colors.grey}
      >
        <View style={{ flexDirection: "row" }}>
          <ThemedText
            style={{ flex: 1, textAlign: "left" }}
            type="subtitle"
            numberOfLines={1}
          >
            Lp.
          </ThemedText>
          <ThemedText
            style={{ flex: 1, textAlign: "center" }}
            type="subtitle"
            numberOfLines={1}
          >
            Gracz
          </ThemedText>
          <ThemedText
            style={{ flex: 1, textAlign: "right" }}
            type="subtitle"
            numberOfLines={1}
          >
            Punkty
          </ThemedText>
        </View>
        <ThemedSeparator />
        {rankingData.length > 0 ? (
          rankingData.map((g: any, index: any) => {
            return (
              <Pressable onPress={() => openDetails(g.username)} key={index}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <ThemedText
                    type="subtitle"
                    numberOfLines={1}
                    style={{
                      textAlign: "left",
                      fontWeight:
                        auth.currentUser?.displayName == g.username
                          ? "bold"
                          : "normal",
                    }}
                    darkColor={
                      index === 0
                        ? Colors.yellow
                        : index === 1
                        ? "#777"
                        : index === 2
                        ? Colors.orange
                        : Colors.white
                    }
                    lightColor={
                      index === 0
                        ? "gold"
                        : index === 1
                        ? "#aaa"
                        : index === 2
                        ? Colors.orange
                        : Colors.black
                    }
                  >
                    {index + 1}.
                  </ThemedText>
                  <ImageBackground
                    resizeMode="stretch"
                    source={Flag[g.favourite]}
                    style={{ flex: 1 }}
                  >
                    <LinearGradient
                      colors={
                        colorScheme == "light"
                          ? [Colors.grey, "#fffa", Colors.grey]
                          : [Colors.darkgrey, "#000a", Colors.darkgrey]
                      }
                      start={{ x: 0, y: 1 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <ThemedText
                        type="subtitle"
                        numberOfLines={1}
                        style={{
                          flex: 3,
                          textAlign: "center",
                          textAlignVertical: "center",
                          fontWeight:
                            auth.currentUser?.displayName == g.username
                              ? "bold"
                              : "normal",
                        }}
                      >
                        {g.username}
                      </ThemedText>
                    </LinearGradient>
                  </ImageBackground>
                  <ThemedText
                    type="subtitle"
                    numberOfLines={1}
                    style={{
                      textAlign: "right",
                      fontWeight:
                        auth.currentUser?.displayName == g.username
                          ? "bold"
                          : "normal",
                    }}
                    darkColor={
                      index === 0
                        ? Colors.yellow
                        : index === 1
                        ? "#777"
                        : index === 2
                        ? Colors.orange
                        : Colors.white
                    }
                    lightColor={
                      index === 0
                        ? "gold"
                        : index === 1
                        ? "#aaa"
                        : index === 2
                        ? Colors.orange
                        : Colors.black
                    }
                  >
                    {g.points}
                  </ThemedText>
                </View>
                <ThemedSeparator style={{ margin: 5 }} />
              </Pressable>
            );
          })
        ) : (
          <ActivityIndicator
            animating={true}
            color={Colors.darkblue}
            size={"large"}
          />
        )}
      </ThemedView>
      <Modal
        visible={detailsVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDetailsVisible(false)}
      >
        <Pressable
          onPress={() => {
            setDetailsVisible(false)
          }}
          style={{
            height: "100%",
            width: "100%",
            position: "absolute",
            backgroundColor: colorScheme === "light" ? "#0004" : "#000a",
            justifyContent: "center",
          }}
        ></Pressable>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ThemedView
            style={{
              height: "90%",
              width: "95%",
              borderRadius: 20,
              padding: 20,
              alignItems: "center",
            }}
            darkColor={Colors.darkgrey}
            lightColor={Colors.grey}
          >
            <ThemedText type="title">{userDetails}</ThemedText>
            <ThemedText type="subtitle">Statystyki</ThemedText>
            <View style={{width: '100%'}}>
              <ThemedText type="default">
                <ThemedText type="boldNumber">{stats.points}</ThemedText> -
                Punkty
              </ThemedText>
              <ThemedText type="default">
                <ThemedText type="boldNumber">{stats.count3}</ThemedText> -
                Idealne wyniki
              </ThemedText>
              <ThemedText type="default" numberOfLines={1}>
                <ThemedText type="boldNumber">{stats.streak}</ThemedText> -
                Zdobyte punkty pod rząd
              </ThemedText>
              <ThemedText type="default" numberOfLines={1}>
                <ThemedText type="boldNumber">{stats.streak0}</ThemedText> -
                Seria meczów bez żadnego punktu
              </ThemedText>
              <ThemedText type="default">
                <ThemedText type="boldNumber">
                  {types.length
                    ? Math.floor((stats.points / (types.length * 3)) * 100)
                    : 0}
                  %
                </ThemedText>{" "}
                - Skuteczność
              </ThemedText>
            </View>
            <ThemedText type="subtitle" style={{margin: 15}}>Typowania</ThemedText>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 5, flexDirection: 'row'}}>
                <ThemedText style={{flex: 1, textAlign: 'center'}} numberOfLines={1}>Gospodarz</ThemedText>
                <ThemedText style={{flex: 1, textAlign: 'center'}} numberOfLines={1}>Wynik</ThemedText>
                <ThemedText style={{flex: 1, textAlign: 'center'}} numberOfLines={1}>Gość</ThemedText>
              </View>
              <View>
                <ThemedText style={{textAlign: 'center'}} numberOfLines={1}>Typ</ThemedText>
              </View>
              <View style={{flex: 2}}>
                <ThemedText style={{textAlign: 'center'}} numberOfLines={1}>Punkty</ThemedText>
              </View>
            </View>
            <FlatList
              data={types}
              style={{ width: "100%", marginVertical: 10 }}
              renderItem={({ item, index }) => (
                <View>
                  {item.points >= 0 ? (
                    <View>
                      <View style={{ flexDirection: "row" }}>
                        <View style={{ flex: 5, flexDirection: "row" }}>
                          <ThemedText style={{ flex: 1, textAlign: "right" }} numberOfLines={1}>
                            {matches[item.id].Home}
                          </ThemedText>
                          <ThemedText style={{ flex: 1, textAlign: "center" }}>
                            {matches[item.id].HomeGoals} - {matches[item.id].AwayGoals}
                          </ThemedText>
                          <ThemedText style={{ flex: 1, textAlign: "left" }} numberOfLines={1}>
                            {matches[item.id].Away}
                          </ThemedText>
                        </View>
                        <View>
                          <ThemedText style={{textAlign: 'center', backgroundColor: Colors.darkblue, color: Colors.white, paddingHorizontal: 5, borderRadius: 5}}>{item.Home + ' - ' + item.Away}</ThemedText>
                        </View>
                        <View style={{ flex: 2 }}>
                          <ThemedText style={{ fontWeight: item.points>0 ? '700' : 'normal', textAlign: "right" }} numberOfLines={1}>
                            +{item.points} {item.points > 1
                              ? "punkty"
                              : item.points == 0
                              ? "punktów"
                              : "punkt"}
                          </ThemedText>
                        </View>
                      </View>
                      <ThemedSeparator />
                    </View>
                  ) : (
                    <></>
                  )}
                </View>
              )}
            />
          </ThemedView>
        </View>
      </Modal>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  parallaxLogo: {
    height: "130%",
    width: "130%",
    alignSelf: "center",
  },
});

import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  LogBox,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";
import { onValue, ref } from "firebase/database";
import { auth, db } from "@/firebaseConfig";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { ThemedSeparator } from "@/components/ThemedSeparator";
import { router, useLocalSearchParams } from "expo-router";
import { Flag } from "@/constants/Flags";
import { LinearGradient } from "expo-linear-gradient";

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

export default function matches() {
  const colorScheme = useColorScheme() ?? "light";
  const [coordinate, setCoordinate] = useState(3000);
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<any[]>([]);
  const today = new Date();
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
    onValue(ref(db, "matches/"), (snapshot) => {
      const data = snapshot.val();
      const newData = Object.keys(data).map((key) => ({
        ...data[key],
      }));
      setMatches(newData);
    });
    onValue(
      ref(db, "typer/" + auth.currentUser?.displayName + "/"),
      (snapshot) => {
        const data = snapshot.val();
        if (data){
          setPredictions(data);
        }
      }
    );
  }, []);
  return (
    <ParallaxScrollView
    //scrollPosition={coordinate}
      headerBackgroundColor={{
        lightLeft: Colors.yellow,
        lightRight: "red",
        darkLeft: "#111",
        darkRight: "#ff3f5f",
      }}
      headerImage={
        <Image
          source={require("@/assets/images/musiala.png")}
          resizeMode="contain"
          style={styles.parallaxLogo}
        />
      }
    >
      <ThemedView style={styles.container}>
        <ThemedText type="title">Spotkania</ThemedText>
        {matches.length > 0 ? (
          matches.map((item: any, index: any) => (
            <TouchableOpacity
              onLayout={(event) => {
                const layout = event.nativeEvent.layout;
                //coordinate[item.key] = layout.y;
                //console.log(layout.y);
              }}
              activeOpacity={0.7}
              key={index}
              onPress={() => {
                router.navigate("matches/" + (index + 1));
              }}
            >
              <ThemedView
                lightColor={
                  parseInt(item.HomeGoals) >= 0 && parseInt(item.AwayGoals) >= 0
                  ? "#bbb"
                  : Colors.grey
                }
                darkColor={
                  parseInt(item.HomeGoals) >= 0 && parseInt(item.AwayGoals) >= 0
                  ? "#212121"
                  : Colors.darkgrey
                }
                style={{
                  marginVertical: 10,
                  borderRadius: 20,
                  padding: 10,
                  opacity:
                  parseInt(item.HomeGoals) >= 0 &&
                  parseInt(item.AwayGoals) >= 0
                  ? 0.7
                  : 1,
                }}
                >
                {predictions[item.id] || !beforeMatch(item) ? <></> : <View style={{transform: [{translateX: 3}, {translateY: -3}], backgroundColor: 'red', height: 15, width: 15, borderRadius: 10, position: 'absolute', right: 0}}></View>}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <ThemedText type="default">{item.Phase}</ThemedText>
                  <ThemedText type="light">{item.Stadium}</ThemedText>
                </View>
                <ThemedSeparator style={{ width: "100%" }} />
                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 3 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View style={{ flex: 1, flexDirection: "row" }}>
                        <ImageBackground
                          source={Flag[item.Home as string]}
                          resizeMode={
                            item.Home == "Szwajcaria" ? "center" : "stretch"
                          }
                          imageStyle={{ height: "100%", width: "100%" }}
                          style={{
                            aspectRatio: 1.5/1,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <LinearGradient
                            colors={
                              colorScheme == "light"
                                ? parseInt(item.HomeGoals) >= 0 &&
                                  parseInt(item.AwayGoals) >= 0
                                  ? ["#bbb", "#bbb0"]
                                  : ["#eaeaea", "#eaeaea00"]
                                : parseInt(item.HomeGoals) >= 0 &&
                                  parseInt(item.AwayGoals) >= 0
                                ? ["#212121", "#21212100"]
                                : ["#333", "#3330"]
                            }
                            style={{ width: "100%" }}
                            start={{ x: 1, y: 1 }}
                            end={{ x: 0, y: 1 }}
                          >
                            <ThemedText type="subtitle"></ThemedText>
                          </LinearGradient>
                        </ImageBackground>
                        <ThemedText
                          type="subtitle"
                          numberOfLines={1}
                          style={{
                            flex:1,
                            fontWeight:
                              item.HomeGoals > item.AwayGoals
                                ? "bold"
                                : "normal",
                          }}
                        >
                          {item.Home}
                        </ThemedText>
                      </View>
                      <ThemedText
                        type="subtitle"
                        style={{
                          marginLeft: 5,
                          fontWeight:
                            item.HomeGoals > item.AwayGoals ? "bold" : "normal",
                        }}
                      >
                        {item.HomeGoals}
                      </ThemedText>
                    </View>
                    <ThemedSeparator darkColor="#555" lightColor="#dfdfdf" />

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View style={{ flex: 1, flexDirection: "row" }}>
                        <ImageBackground
                          source={Flag[item.Away as string]}
                          resizeMode={
                            item.Away == "Szwajcaria" ? "center" : "stretch"
                          }
                          imageStyle={{ height: "100%", width: "100%" }}
                          style={{
                            aspectRatio: 1.5/1,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <LinearGradient
                            colors={
                              colorScheme == "light"
                                ? parseInt(item.HomeGoals) >= 0 &&
                                  parseInt(item.AwayGoals) >= 0
                                  ? ["#bbb", "#bbb0"]
                                  : ["#eaeaea", "#eaeaea00"]
                                : parseInt(item.HomeGoals) >= 0 &&
                                  parseInt(item.AwayGoals) >= 0
                                ? ["#212121", "#21212100"]
                                : ["#333", "#3330"]
                            }
                            style={{ width: "100%" }}
                            start={{ x: 1, y: 1 }}
                            end={{ x: 0, y: 1 }}
                          >
                            <ThemedText type="subtitle"></ThemedText>
                          </LinearGradient>
                        </ImageBackground>
                        <ThemedText
                          type="subtitle"
                          numberOfLines={1}
                          style={{
                            flex:1,
                            fontWeight:
                              item.AwayGoals > item.HomeGoals
                                ? "bold"
                                : "normal",
                          }}
                        >
                          {item.Away}
                        </ThemedText>
                      </View>
                      <ThemedText
                        type="subtitle"
                        style={{
                          marginLeft: 5,
                          fontWeight:
                            item.AwayGoals > item.HomeGoals ? "bold" : "normal",
                        }}
                      >
                        {item.AwayGoals}
                      </ThemedText>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <ThemedText numberOfLines={1} type="default">
                      {item.Date}
                    </ThemedText>
                    <ThemedText type="default">{item.Hour}</ThemedText>
                  </View>
                </View>
                {predictions[item.id] ? (
                  <View>
                    <ThemedSeparator />
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <ThemedText style={{ fontSize: 14, flex: 1 }}>
                        Twój typ:
                      </ThemedText>
                      <View style={{ flex: 1, alignItems: "center" }}>
                        <ThemedText
                          style={{
                            color: Colors.white,
                            fontSize: 14,
                            backgroundColor: Colors.darkblue,
                            borderRadius: 10,
                            paddingHorizontal: 10,
                          }}
                        >
                          {predictions[item.id].Home} -{" "}
                          {predictions[item.id].Away}
                        </ThemedText>
                      </View>
                      {predictions[item.id].points >= 0 ? (
                        <ThemedText
                        numberOfLines={1}
                          style={{ fontSize: 14, flex: 1, textAlign: "right" }}
                        >
                          +{predictions[item.id].points}{" "}
                          {predictions[item.id].points > 1
                            ? "punkty"
                            : predictions[item.id].points == 0
                            ? "punktów"
                            : "punkt"}
                        </ThemedText>
                      ) : (
                        <View style={{ flex: 1 }}></View>
                      )}
                    </View>
                  </View>
                ) : (
                  <></>
                )}
              </ThemedView>
            </TouchableOpacity>
          ))
        ) : (
          <ActivityIndicator
            animating={true}
            color={Colors.darkblue}
            size={"large"}
          />
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  parallaxLogo: {
    height: "120%",
    width: "120%",
    alignSelf: "center",
  },
  container: {},
});

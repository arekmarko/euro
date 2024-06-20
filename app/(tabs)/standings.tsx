import { Image, View, Text, StyleSheet, ActivityIndicator, ImageBackground, useColorScheme } from "react-native";
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
  useEffect(() => {
    onValue(ref(db, "users"), (snapshot) => {
      const data = snapshot.val();
      const newData = Object.keys(data).map((key) => ({
        ...data[key],
      }));
      newData.sort((a, b) => (a.points > b.points ? -1 : 1));
      setRankingData(newData);
    });
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
        <ThemedText type="title">Ranking</ThemedText>
      <ThemedView style={{borderRadius: 20, padding: 20, paddingBottom: 30}} darkColor={Colors.darkgrey} lightColor={Colors.grey}>
        <View style={{flexDirection: 'row'}}>
        <ThemedText style={{flex: 1, textAlign: 'left'}} type="subtitle" numberOfLines={1}>Lp.</ThemedText>
        <ThemedText style={{flex: 1, textAlign: 'center'}} type="subtitle" numberOfLines={1}>Gracz</ThemedText>
        <ThemedText style={{flex: 1, textAlign: 'right'}} type="subtitle" numberOfLines={1}>Punkty</ThemedText>
        </View>
        <ThemedSeparator />
        {rankingData.length > 0 ? (
        rankingData.map((g: any, index: any) => {
          return (
            <View
              key={index}
            >
              <View style={{ flexDirection: "row", alignItems: 'center' }}>
                <ThemedText
                  type="subtitle"
                  numberOfLines={1}
                  style={{ textAlign: 'left', fontWeight: auth.currentUser?.displayName==g.username ? 'bold' : 'normal'}}
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
                <ImageBackground resizeMode="stretch" source={Flag[g.favourite]} style={{flex: 1}} >
                  <LinearGradient colors={colorScheme=='light' ? [Colors.grey, '#fffa', Colors.grey] : [Colors.darkgrey,  '#000a',  Colors.darkgrey]} start={{x: 0, y: 1}} end={{x: 1, y: 1}}>
                <ThemedText
                  type="subtitle"
                  numberOfLines={1}
                  style={{flex: 3, textAlign: 'center', textAlignVertical: 'center', fontWeight: auth.currentUser?.displayName==g.username ? 'bold' : 'normal'}}
                  
                    >
                  {g.username}
                </ThemedText>
                    </LinearGradient>
                  </ImageBackground>
                <ThemedText
                  type="subtitle"
                  numberOfLines={1}
                  style={{ textAlign: 'right', fontWeight: auth.currentUser?.displayName==g.username ? 'bold' : 'normal'}}
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
            </View>
          );
        })) : <ActivityIndicator animating={true} color={Colors.darkblue} size={"large"} />}
      </ThemedView>
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

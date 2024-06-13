import { Image, View, Text, StyleSheet, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { onValue, orderByChild, query, ref } from "firebase/database";
import { auth, db } from "@/firebaseConfig";
import { ThemedSeparator } from "@/components/ThemedSeparator";
import { Colors } from "@/constants/Colors";

export default function standings() {
  const [rankingData, setRankingData] = useState<string[]>([]);
  useEffect(() => {
    onValue(query(ref(db, "users"), orderByChild("points")), (snapshot) => {
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
        lightLeft: "#D0D0D0",
        lightRight: "#E0E0E0",
        darkLeft: "#353636",
        darkRight: "#656565",
      }}
      headerImage={
        <Image
          source={require("@/assets/images/muller.png")}
          resizeMode="contain"
          style={styles.parallaxLogo}
        />
      }
    >
        <ThemedText type="title">Ranking</ThemedText>
      <ThemedView style={{borderRadius: 20, padding: 20, paddingBottom: 30}} darkColor={Colors.darkgrey} lightColor={Colors.grey}>
        <View style={{flexDirection: 'row'}}>
        <ThemedText style={{flex: 1, textAlign: 'left'}} type="subtitle">Lp.</ThemedText>
        <ThemedText style={{flex: 1, textAlign: 'center'}} type="subtitle">Gracz</ThemedText>
        <ThemedText style={{flex: 1, textAlign: 'right'}} type="subtitle">Punkty</ThemedText>
        </View>
        <ThemedSeparator />
        {rankingData.length > 0 ? (
        rankingData.map((g: any, index: any) => {
          return (
            <View
              key={index}
            >
              <View style={{ flexDirection: "row" }}>
                <ThemedText
                  type="subtitle"
                  numberOfLines={1}
                  style={{flex: 1, textAlign: 'left'}}
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
                <ThemedText
                  type="subtitle"
                  numberOfLines={1}
                  style={{flex: 3, textAlign: 'center'}}
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
                  {g.username}
                </ThemedText>
                <ThemedText
                  type="subtitle"
                  numberOfLines={1}
                  style={{flex: 1, textAlign: 'right'}}
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
              <ThemedSeparator style={{ margin: 0 }} />
            </View>
          );
        })) : <ActivityIndicator animating={true} color={Colors.darkblue} size={"large"} />}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  parallaxLogo: {
    height: "150%",
    width: "150%",
    alignSelf: "center",
  },
});

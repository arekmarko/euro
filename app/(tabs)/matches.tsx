import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";
import { onValue, ref } from "firebase/database";
import { auth, db } from "@/firebaseConfig";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { ThemedSeparator } from "@/components/ThemedSeparator";

type Match = {
  Home: string;
  Away: string;
  Date: string;
  Hour: string;
  Matchday: number;
  Phase: string;
  Stadium: string;
};

export default function matches() {
  const [matches, setMatches] = useState<Match[]>([]);
  useEffect(() => {
    onValue(ref(db, "matches/"), (snapshot) => {
      const data = snapshot.val();
      const newData = Object.keys(data).map((key) => ({
        ...data[key],
      }));
      setMatches(newData);
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
          source={require("@/assets/images/ronaldo.png")}
          resizeMode="contain"
          style={styles.parallaxLogo}
        />
      }
    >
      <ThemedView style={styles.container}>
        <ThemedText type="title">Spotkania</ThemedText>
        {matches.length > 0 ? (
        matches.map((item, index) => (
          <ThemedView
            key={index}
            lightColor={Colors.grey}
            darkColor={Colors.darkgrey}
            style={{ marginVertical: 10, borderRadius: 20, padding: 10 }}
          >
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <ThemedText type="default">{item.Phase}</ThemedText>
            <ThemedText type="light">{item.Stadium}</ThemedText>
            </View>
            <ThemedSeparator style={{ width: "100%" }} />
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 3 }}>
                <ThemedText type="subtitle">{item.Home}</ThemedText>
                <ThemedSeparator darkColor="#555" lightColor='#dfdfdf' />
                <ThemedText type="subtitle">{item.Away}</ThemedText>
              </View>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ThemedText type="default">{item.Date}</ThemedText>
                <ThemedText type="default">{item.Hour}</ThemedText>
              </View>
            </View>
          </ThemedView>
        ))) :
        <ActivityIndicator animating={true} color={Colors.darkblue} size={"large"} />}
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
  container: {},
});

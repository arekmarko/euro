import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FlatList } from "react-native-gesture-handler";

export default function Tables() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: Colors.grey, dark: Colors.darkgrey }}
      headerImage={
        <Image
          source={require("@/assets/images/mbappe.png")}
          resizeMode="contain"
          style={styles.parallaxLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Tabele</ThemedText>
      </ThemedView>

      {groups.map((g: any) => {
        return (
          <View>
            <ThemedText type="subtitle">{g.name}</ThemedText>
            {g.teams.map((team: any) => {
                return (
                    <View style={{flexDirection: 'row'}}>
                        <ThemedText type="light">{team.name}</ThemedText>
                    </View>
                )
            })}
          </View>
        );
      })}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  parallaxLogo: {
    height: "200%",
    width: "200%",
    alignSelf: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});

const groups = [
  {
    name: "Grupa A",
    teams: [
      { name: "Germany", wins: 0 },
      { name: "Austria", wins: 0 },
      { name: "Szwajcaria", wins: 0 },
      { name: "Gruzja", wins: 0 },
    ],
  },
  {
    name: "Grupa B",
    teams: [
      { name: "Polska", wins: 0 },
      { name: "Francja", wins: 0 },
      { name: "Holandia", wins: 0 },
      { name: "Austria", wins: 0 },
    ],
  },
];

import {
  Image,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import React, { useEffect } from "react";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "./ThemedText";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedSeparator } from "./ThemedSeparator";
import { Flag } from "@/constants/Flags";

export default function Table({ g, index, style }: any) {
  const colorScheme = useColorScheme() ?? "light";
  const dimensions = useWindowDimensions();
  return (
    <LinearGradient
      style={[style, { borderRadius: 20, flex: 1 }]}
      colors={
        colorScheme === "light"
          ? [Colors.blue, Colors.yellow]
          : [Colors.blue, Colors.purple]
      }
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 1 }}
    >
      <View key={index} style={styles.tableGroup}>
        <View style={{ flexDirection: "row" }}>
          <ThemedText style={{ flex: 5 }} type="subtitle" numberOfLines={1}>
            {g.name}
          </ThemedText>
          <ThemedText style={styles.tableText} type="default">
            Z
          </ThemedText>
          <ThemedText style={styles.tableText} type="default">
            R
          </ThemedText>
          <ThemedText style={styles.tableText} type="default">
            P
          </ThemedText>
          <ThemedText
            style={{
              flex: 2,
              textAlign: "center",
              textAlignVertical: "center",
            }}
            type="default"
          >
            B
          </ThemedText>
          <ThemedText
            style={{
              flex: 1,
              textAlign: "center",
              textAlignVertical: "center",
            }}
            type="defaultSemiBold"
            numberOfLines={1}
          >
            PKT
          </ThemedText>
        </View>
        <ThemedSeparator style={{margin: 0}} darkColor={Colors.yellow} />
        {Object.keys(g.teams).map((key, index) => (
          <View key={key} style={styles.tableTeam}>
            <View style={{ flex: 5, flexDirection: "row" }}>
              <ThemedText type="default" numberOfLines={1} style={{flex: 3, textAlign: 'right'}} >
                {index + 1}.
              </ThemedText>
              <Image
                source={Flag[g.teams[key].name] ? Flag[g.teams[key].name] : require("../assets/images/flags/polska.png")}
                resizeMode="center"
                style={{flex:3, height: '100%', margin: 2, alignSelf: 'center' }}
              />
              <ThemedText type="defaultSemiBold" numberOfLines={1} style={{flex: 10}}>
                {g.teams[key].name}
              </ThemedText>
            </View>
            <ThemedText style={styles.tableText} type="default">
              {g.teams[key].wins >= 0 ? g.teams[key].wins : 0}
            </ThemedText>
            <ThemedText style={styles.tableText} type="default">
              {g.teams[key].draws >= 0 ? g.teams[key].draws : 0}
            </ThemedText>
            <ThemedText style={styles.tableText} type="default">
              {g.teams[key].loses >= 0 ? g.teams[key].loses : 0}
            </ThemedText>
            <ThemedText
              style={{ flex: 2, textAlign: "center" }}
              type="default"
              numberOfLines={1}
            >
              {g.teams[key].gs >= 0 || g.teams[key].gs >= 0
                ? g.teams[key].gs + ":" + g.teams[key].gc
                : "0:0"}
            </ThemedText>
            <ThemedText
              style={{ flex: 1, textAlign: "center" }}
              type="defaultSemiBold"
              numberOfLines={1}
            >
              {g.teams[key].wins >= 0 || g.teams[key].draws >= 0
                ? g.teams[key].wins * 3 + g.teams[key].draws
                : 0}
            </ThemedText>
          </View>
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  tableGroup: {
    borderRadius: 10,
    padding: 10,
    gap: 10,
  },
  tableTeam: {
    flexDirection: "row",
  },
  tableText: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
  },
});

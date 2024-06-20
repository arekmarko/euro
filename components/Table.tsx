import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "./ThemedText";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedSeparator } from "./ThemedSeparator";
import { Flag } from "@/constants/Flags";

export default function Table({ g, index, style }: any) {
  const colorScheme = useColorScheme() ?? "light";
  const [teams, setTeams] = useState<any[]>([]);
  const dimensions = useWindowDimensions();
  useEffect(() => {
    const newData = Object.keys(g.teams).map((key,value) => ({
      ...g.teams[key]
    }))
    newData.sort((a:any,b:any) => (a.gs > b.gs ? -1:1))
    newData.sort((a:any,b:any) => (a.wins*3+a.draws > b.wins*3+b.draws ? -1 : 1))
    setTeams(newData);
  }, []);
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
        {teams.map((item, index) => (
          <View key={index} style={styles.tableTeam}>
            <View style={{flex:5, flexDirection: 'row'}}>
            <ThemedText style={{flex:2, textAlign:'right'}}>{index+1}.</ThemedText>
            <Image
                source={Flag[item.name] ? Flag[item.name] : require("../assets/images/flags/polska.png")}
                resizeMode="center"
                style={{flex:2, height: '100%', margin: 2, alignSelf: 'center' }}
              />
              <ThemedText type="defaultSemiBold" numberOfLines={1} style={{flex: 10}}>
                {item.name}
              </ThemedText>
            </View>
            <ThemedText style={styles.tableText} type="default">
              {item.wins >= 0 ? item.wins : 0}
            </ThemedText>
            <ThemedText style={styles.tableText} type="default">
              {item.draws >= 0 ? item.draws : 0}
            </ThemedText>
            <ThemedText style={styles.tableText} type="default">
              {item.loses >= 0 ? item.loses : 0}
            </ThemedText>
            <ThemedText
              style={{ flex: 2, textAlign: "center" }}
              type="default"
              numberOfLines={1}
            >
              {item.gs >= 0 || item.gs >= 0
                ? item.gs + ":" + item.gc
                : "0:0"}
            </ThemedText>
            <ThemedText
              style={{ flex: 1, textAlign: "center" }}
              type="defaultSemiBold"
              numberOfLines={1}
            >
              {item.wins >= 0 || item.draws >= 0
                ? item.wins * 3 + item.draws
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

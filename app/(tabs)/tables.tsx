import { Image, StyleSheet, Text, View, useColorScheme } from "react-native";
import React, { useEffect, useState } from "react";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { onValue, ref } from "firebase/database";
import { db } from "../../firebaseConfig";

export default function Tables() {
    const colorScheme = useColorScheme() ?? 'light';
  const [table, setTable] = useState<string[]>([]);
  const [teams, setTeams] = useState<string[]>([]);

  useEffect(() => {
    const dbRef = ref(db, "groups/");
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      const newData = Object.keys(data).map((key) => ({
        ...data[key],
      }));
      newData.map(item => {
          const teams = Object.keys(item.teams).map((key) => ({
            ...item.teams[key]
          }))
          setTeams(teams);
      })
      setTable(newData);
    });
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ lightLeft: Colors.blue, lightRight: Colors.yellow, darkLeft: Colors.blue, darkRight: Colors.purple }}
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

      {
        table.length>0 ? 
    
    (table.map((g: any, index: any) => {
        return (
            <View key={index} style={[styles.tableGroup, {backgroundColor: colorScheme==='light' ? Colors.grey : Colors.darkgrey}]}>
                <View style={{flexDirection: 'row'}}>
            <ThemedText style={{flex: 6}} type="subtitle">{g.name}</ThemedText>
            <ThemedText style={styles.tableText} type="default">Z</ThemedText>
            <ThemedText style={styles.tableText} type="default">R</ThemedText>
            <ThemedText style={styles.tableText} type="default">P</ThemedText>
            <ThemedText style={styles.tableText} type="default">B</ThemedText>
            <ThemedText style={{flex:2, textAlign: 'center', textAlignVertical: 'center'}} type="defaultSemiBold">PKT</ThemedText>
                </View>
            {Object.keys(g.teams).map((key) => (
                <View key={key} style={styles.tableTeam}>
                    <ThemedText style={{flex: 6}} type="defaultSemiBold">{g.teams[key].name}</ThemedText>
                    <ThemedText style={styles.tableText} type="default">{g.teams[key].wins >= 0 ? g.teams[key].wins : 0}</ThemedText>
                    <ThemedText style={styles.tableText} type="default">{g.teams[key].draws >= 0 ? g.teams[key].draws : 0}</ThemedText>
                    <ThemedText style={styles.tableText} type="default">{g.teams[key].loses >= 0 ? g.teams[key].loses : 0}</ThemedText>
                    <ThemedText style={styles.tableText} type="default">{g.teams[key].gs >= 0 || g.teams[key].gs >= 0 ? g.teams[key].gs + ':' + g.teams[key].gc : '0:0'}</ThemedText>
                    <ThemedText style={{flex: 2, textAlign: 'center'}} type="defaultSemiBold">{(g.teams[key].wins >= 0 || g.teams[key].draws >= 0) ? g.teams[key].wins*3 + g.teams[key].draws : 0}</ThemedText>
                </View>
            ))}
          </View>
        );
    }))
    :
    (<></>)
}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  parallaxLogo: {
    height: "150%",
    width: "150%",
    alignSelf: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tableGroup: {
    borderRadius: 10,
    padding: 10,
    gap: 10
  },
  tableTeam: {
    flexDirection: 'row',
  },
  tableText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center'
  }
});

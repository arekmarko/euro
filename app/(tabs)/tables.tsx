import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View, useColorScheme } from "react-native";
import React, { useEffect, useState } from "react";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { onValue, ref } from "firebase/database";
import { db } from "../../firebaseConfig";
import Table from "@/components/Table";

export default function Tables() {
  const colorScheme = useColorScheme() ?? "light";
  const [table, setTable] = useState<string[]>([]);

  useEffect(() => {
    const dbRef = ref(db, "groups/");
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      const newData = Object.keys(data).map((key) => ({
        ...data[key],
      }));
      newData.map((item) => {
        const teams = Object.keys(item.teams).map((key) => ({
          ...item.teams[key],
        }));
      });
      setTable(newData);
    });
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        lightLeft: Colors.blue,
        lightRight: Colors.yellow,
        darkLeft: Colors.blue,
        darkRight: Colors.purple,
      }}
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

      {table.length > 0 ? (
        table.map((g: any, index: any) => {
          return <Table g={g} index={index} key={index} />;
        })
      ) : (
        <ActivityIndicator animating={true} color={Colors.darkblue} size={"large"} />
      )}
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

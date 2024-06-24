import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { View } from "react-native";
import { onValue, ref } from "firebase/database";
import { auth, db } from "@/firebaseConfig";
import { ThemedText } from "@/components/ThemedText";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [predictions, setPredictions] = useState([]);
  const [count, setCount] = useState(0);
  const [matches, setMatches] = useState<any[]>([]);
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
    let count = 0;
    matches.forEach((element) => {
      if (beforeMatch(element)) {
        if (!predictions[element.id]) {
          count++;
        }
      }
    });
    setCount(count);
  });
  useEffect(() => {
    onValue(
      ref(db, "typer/" + auth.currentUser?.displayName + "/"),
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setPredictions(data);
        }
      }
    );
    onValue(ref(db, "matches/"), (snapshot) => {
      const data = snapshot.val();
      const newData = Object.keys(data).map((key) => ({
        ...data[key],
      }));
      setMatches(newData);
    });
  }, []);
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="tables"
        options={{
          title: "Tabele",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "list" : "list"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          //unmountOnBlur:true,
          href:'matches/',
          title: "Mecze",
          tabBarIcon: ({ color, focused }) => (
            <View>
              <TabBarIcon
                name={focused ? "football" : "football-outline"}
                color={color}
              ></TabBarIcon>
              {/* {count > 0 ? (
                <View
                  style={{
                    backgroundColor: focused ? "red" : "#b11",
                    width: 10,
                    height: 10,
                    borderRadius: 10,
                    position: "absolute",
                    right: 0,
                  }}
                >
                  <ThemedText
                    style={{
                      color: focused? Colors.white : '#ddd',
                      fontSize: 8,
                      textAlign: "center",
                    }}
                  >
                    {count}
                  </ThemedText>
                </View>
              ) : (
                <></>
              )} */}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="standings"
        options={{
          title: "Ranking",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "trophy" : "trophy-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Ustawienia",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "cog" : "cog-outline"} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

import {
  Image,
  Text,
  StyleSheet,
  Platform,
  View,
  useColorScheme,
  BackHandler,
  ToastAndroid,
  ScrollView,
  useWindowDimensions,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { auth, db } from "@/firebaseConfig";
import { useEffect, useRef, useState } from "react";
import { router, useNavigation } from "expo-router";
import { limitToFirst, onValue, query, ref, set } from "firebase/database";
import Table from "@/components/Table";
import { ThemedSeparator } from "@/components/ThemedSeparator";
import { Ionicons } from "@expo/vector-icons";

type UserData = {
  email: string;
  username: string;
  points: number;
  ranking: number;
};

type Match = {
  id: number;
  Home: string;
  Away: string;
  Date: string;
  Hour: string;
  Matchday: number;
  Phase: string;
  Stadium: string;
  HomeGoals: number;
  AwayGoals: number;
};

export default function HomeScreen() {
  const theme = useColorScheme() ?? "light";
  const [table, setTable] = useState<string[]>([]);
  const [userData, setUserData] = useState<UserData>({
    email: "",
    username: "",
    points: 0,
    ranking: 0
  });
  const scrollRef = useRef<FlatList>(null);
  const [initIndex, setInitIndex] = useState(0);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const routers = useNavigation();
  const dimensions = useWindowDimensions();
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
    onValue(
      ref(db, "users/" + auth.currentUser?.displayName + "/"),
      (snapshot) => {
        const data = snapshot.val();
        setUserData(data);
      }
    );
    const dbRef = ref(db, "groups/");
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      const newData = Object.keys(data).map((key) => ({
        ...data[key],
      }));
      setTable(newData);
    });
    onValue(ref(db, "matches/"), (snapshot) => {
      const data = snapshot.val();
      const newData = Object.keys(data).map((key) => ({
        ...data[key],
      }));
      setMatches(newData);
      let tmp = true;
      newData.forEach(element => {
        if (beforeMatch(element) && tmp){
          tmp = false;
          setInitIndex(element.id-1)
        }
      });
    });
    onValue(
      ref(db, "typer/" + auth.currentUser?.displayName + "/"),
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setPredictions(data);
        }
      }
    );
    set(ref(db, "version/" + auth.currentUser?.displayName + '/'), {
      version: '1.0.1'
    });
    const backAction = () => {
      if (routers.getState().index != 0) {
        router.navigate("(tabs)");
        //router.back();
      } else {
        BackHandler.exitApp();
      }
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);
  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        lightLeft: Colors.yellow,
        lightRight: Colors.orange,
        darkLeft: Colors.purple,
        darkRight: Colors.orange,
      }}
      headerImage={
        <Image
          source={require("@/assets/images/modric.png")}
          resizeMode="contain"
          style={styles.parallaxLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Witaj!</ThemedText>
        <HelloWave />
      </ThemedView>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => router.navigate("standings")}
      >
        <View
          style={[
            styles.container,
            {
              backgroundColor:
                theme === "light" ? Colors.grey : Colors.darkgrey,
            },
          ]}
        >
          <Image
            source={require("@/assets/images/logo_big.png")}
            resizeMode="contain"
            style={styles.logo}
          />
          <View style={{ flex: 3 }}>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 4, paddingHorizontal: 10 }}>
                <ThemedText type="subtitle" numberOfLines={1}>
                  {auth.currentUser?.displayName}
                </ThemedText>
                <ThemedText type="light" numberOfLines={1}>
                  {auth.currentUser?.email}
                </ThemedText>
                <ThemedText
                  type="boldNumber"
                  lightColor={Colors.darkblue}
                  darkColor={Colors.darkblue}
                >
                  {userData ? userData?.points : 0}{" "}
                  <ThemedText type="default">- Twoje punkty</ThemedText>
                </ThemedText>
                <ThemedText
                  type="boldNumber"
                  lightColor={Colors.darkblue}
                  darkColor={Colors.darkblue}
                >
                  {userData ? userData?.ranking : '0'} <ThemedText type="default">- Miejsce w rankingu</ThemedText>
                </ThemedText>
              </View>
              <View style={{ flex: 1, justifyContent: "center" }}>
                <Image
                  source={require("@/assets/images/bellingham.png")}
                  resizeMode="contain"
                  style={{
                    alignSelf: "flex-start",
                    height: "150%",
                    width: "150%",
                    transform: [{ scaleX: -1 }, { translateY: -10 }],
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Mecze</ThemedText>
      </ThemedView>
      {matches.length > 0 ? (
        <FlatList
          ref={scrollRef}
          initialScrollIndex={initIndex}
          getItemLayout={(data, index) => (
            {length: 240, offset: 240 * index, index}
          )}
          data={matches}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          //ItemSeparatorComponent={() => <View style={{ width: 20 }}></View>}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {router.navigate(`matches/${item.id}`)}}
            >
              <ThemedView
                lightColor={Colors.grey}
                darkColor={Colors.darkgrey}
                style={{ width: 220, borderRadius: 20, padding: 10, paddingTop: 0, marginRight: 20,
                  opacity: beforeMatch(item) ? 1 : 0.6
                }}
              >
                  <View style={{ backgroundColor: predictions[item.id] ? Colors.darkblue : Colors.orange , paddingHorizontal: 15, borderBottomLeftRadius: 10, borderBottomRightRadius: 10,top:0, alignSelf:'center', justifyContent: 'center'}}>
                    <ThemedText style={{fontSize: 12, color: Colors.white}}>{predictions[item.id] ? predictions[item.id]?.Home + ' - ' + predictions[item.id]?.Away : 'Nie obstawiono'}{predictions[item.id]?.points>=0 ? ('   |   +' + predictions[item.id].points + ' ' + (predictions[item.id].points>1 ? 'punkty' : (predictions[item.id].points==1 ? 'punkt' : 'punktów'))) : ''}</ThemedText>
                  </View>
                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 1, paddingHorizontal: 3 }}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', gap: 10}}>
                    <ThemedText numberOfLines={1} type="default" style={{flex: 1,fontWeight: item.HomeGoals>item.AwayGoals ? 'bold' : 'normal'}}>{item.Home}</ThemedText>
                    <ThemedText type="default" style={{fontWeight: item.HomeGoals>item.AwayGoals ? 'bold' : 'normal'}}>{item.HomeGoals}</ThemedText>
                    </View>
                    <ThemedSeparator style={{ marginVertical: 2 }} />
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', gap: 10}}>
                    <ThemedText numberOfLines={1} type="default" style={{flex: 1,fontWeight: item.AwayGoals>item.HomeGoals ? 'bold' : 'normal'}}>{item.Away}</ThemedText>
                    <ThemedText type="default" style={{fontWeight: item.AwayGoals>item.HomeGoals ? 'bold' : 'normal'}}>{item.AwayGoals}</ThemedText>
                    </View>                  
                  </View>
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      paddingHorizontal: 5,
                    }}
                  >
                    <ThemedText>{item.Date}</ThemedText>
                    <ThemedText>{item.Hour}</ThemedText>
                  </View>
                  {/* <ThemedText style={{textAlignVertical: 'center'}}><Ionicons name="chevron-forward" size={14} /></ThemedText> */}
                </View>
              </ThemedView>
            </TouchableOpacity>
          )}
        />
      ) : (
        <ActivityIndicator
          animating={true}
          color={Colors.darkblue}
          size={"large"}
        />
      )}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Grupy</ThemedText>
      </ThemedView>
      {table.length > 0 ? (
        <FlatList
          data={table}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ width: 20 }}></View>}
          renderItem={({ item, index }) => (
            <Table
              g={item}
              index={index}
              style={{ width: dimensions.width * 0.7 }}
            />
          )}
        />
      ) : (
        <ActivityIndicator
          animating={true}
          color={Colors.darkblue}
          size={"large"}
        />
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  container: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    borderRadius: 20,
    padding: 15,
  },
  parallaxLogo: {
    height: "150%",
    width: "150%",
    alignSelf: "center",
  },
  logo: {
    height: "100%",
    flex: 1,
  },
});

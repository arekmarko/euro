import { BackHandler, Image, StyleSheet, Text, TouchableNativeFeedback, View } from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { onValue, ref } from "firebase/database";
import { auth, db } from "@/firebaseConfig";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Colors } from "@/constants/Colors";
import ScrollPicker from 'react-native-wheel-scrollview-picker'
import ScorePicker from "@/components/ScorePicker";

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

type Predictions = {
    Home: string;
    Away: string;
}

export default function matchDetails() {
  const { id } = useLocalSearchParams();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [prediction, setPrediction] = useState<Predictions>();
  const onModalOpen = () => {
    setIsModalVisible(true);
  };
  const onModalClose = () => {
    setIsModalVisible(false);
  };  const [match, setMatch] = useState<Match>();
  const dataSource = ["1", "2", "3", "4", "5", "6"]
  useEffect(() => {
    onValue(ref(db, "matches/" + [id]), (snapshot) => {
      const data = snapshot.val();
      setMatch(data);
    });
    onValue(ref(db, "typer/" + auth.currentUser?.displayName + "/" + [id]), (snapshot) => {
        const data = snapshot.val();
        console.log(data);
        if (data){
            setPrediction(data);
        }
    })
  }, []);
  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        darkLeft: Colors.darkgrey,
        darkRight: Colors.darkgrey,
        lightLeft: Colors.grey,
        lightRight: Colors.grey,
      }}
      headerImage={
          <View
          style={{  margin: 20, marginTop: '10%', alignItems: 'center'}}
          >
            <ThemedText>{match?.Date}   {match?.Hour}</ThemedText>
            <View style={{flexDirection: "row"}}>
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{height: '60%', width: '70%', borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#777'}}>
            <Image
              source={require("../../../assets/images/flags/poland.png")}
              resizeMode="center"
              style={{ height: "90%" }}
            />
            </View>
            <ThemedText style={{ textAlign: "left", fontWeight: match && match?.HomeGoals>match?.AwayGoals?'bold':'normal' }} type="subtitle">
              {match?.Home}
            </ThemedText>
          </View>
          <View style={{paddingTop: '8%'}}>
          <ThemedText type="title"><Text style={{fontWeight: match && match?.HomeGoals>match?.AwayGoals?'bold':'normal'}}>{match?.HomeGoals}</Text> - <Text style={{fontWeight: match && match?.AwayGoals>match?.HomeGoals?'bold':'normal'}}>{match?.AwayGoals}</Text></ThemedText>
          </View>
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <View style={{height: '60%', width: '70%', borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#777'}}>
            <Image
              source={require("../../../assets/images/flags/poland.png")}
              resizeMode="center"
              style={{ height: '90%'}}
              />
            </View>
            <ThemedText style={{ textAlign: "right", fontWeight: match && match?.AwayGoals>match?.HomeGoals?'bold':'normal' }} type="subtitle">
              {match?.Away}
            </ThemedText>
          </View>
        </View>
        </View>
      }
    >
      <View style={styles.container}>
        <ThemedView>
          <ThemedText type="title">Typer</ThemedText>
          <View style={{alignItems: 'center', gap: 50}}>
            <ThemedText type="title">{prediction ? prediction.Home : '-'} : {prediction ? prediction.Away : '-'}</ThemedText>
            <TouchableNativeFeedback style={{width: '50%'}} onPress={() => {onModalOpen()}}>
                <ThemedView style={{borderRadius: 10, padding: 10}} darkColor={Colors.darkgrey} lightColor={Colors.grey}>
                <ThemedText>{prediction ? 'Zmień wynik' : 'Obstaw wynik'}</ThemedText>
                </ThemedView>
            </TouchableNativeFeedback>
            
            

          </View>
        </ThemedView>
      </View>
      <ScorePicker isVisible={isModalVisible} onClose={onModalClose} match={match} />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

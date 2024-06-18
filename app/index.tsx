import LoginModal from "@/components/LoginModal";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { auth, db } from "@/firebaseConfig";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { ActivityIndicator, BackHandler, Image, Linking, Modal, StyleSheet, Text, TouchableNativeFeedback, TouchableOpacity, View, useColorScheme, useWindowDimensions } from "react-native";

type Version = {
  name: string;
  link: string;
}
export default function Index() {
  const dimensions = useWindowDimensions();
  const colorScheme = useColorScheme() ?? 'light';
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [update, setUpdate] = useState(false);
  const [loginActivity, setLoginActivity] = useState(true);
  const [version, setVersion] = useState<Version>({name: '1.0.1', link: ''});
  const currentVersion = '1.0.1';
  const onModalOpen = () => {
    setIsModalVisible(true);
  };
  const onModalClose = () => {
    setIsModalVisible(false);
  };
  useEffect(() => {
    let subscriber;
    onValue(ref(db, "version/"), (snapshot) => {
        const data = snapshot.val();
        setVersion(data);
        if (currentVersion != data.name){
          setUpdate(true);
        } else {
          subscriber = auth.onAuthStateChanged(onAuthStateChanged);
        }
        setLoginActivity(false);
      }
    );
    function onAuthStateChanged(user:any) {
      setLoginActivity(false);
      if (user) {
        router.navigate('(tabs)');
      }
    }
    return subscriber;
  }, []);
  return (
    <View style={[styles.container, {height: dimensions.height}]}>
      <Modal animationType="fade"
        transparent={true}
        visible={update}
        onRequestClose={() => BackHandler.exitApp()}
        >
          <View style={{
            height: "100%",
            width: "100%",
            position: "absolute",
            backgroundColor: colorScheme === "light" ? "#0004" : "#000d",
            justifyContent: "center",
          }}></View>
          <View style={{flex: 1, justifyContent: 'center'}}>
          <View style={{width: '80%', padding: 20, gap: 20, borderRadius: 20, backgroundColor:  colorScheme === "light" ? Colors.grey : Colors.darkgrey, alignSelf: 'center', alignItems: 'center'}}>
            <ThemedText type="subtitle">Aktualizacja</ThemedText>
            <ThemedText type="default">Dostępna jest nowsza wersja aplikacji.</ThemedText>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '80%'}}>
              <TouchableNativeFeedback onPress={() => BackHandler.exitApp()}>
              <ThemedView darkColor="#777" style={{padding: 10, borderRadius: 10}}><ThemedText>Wyjdź</ThemedText></ThemedView>
              </TouchableNativeFeedback>
              <TouchableNativeFeedback onPress={() => Linking.openURL(version.link)}>
              <ThemedView darkColor="#777" style={{padding: 10, borderRadius: 10}}><ThemedText>Pobierz</ThemedText></ThemedView>
              </TouchableNativeFeedback>
            </View>
          </View>
          </View>
      </Modal>
      <Image
        source={require("../assets/images/logo_small.png")}
        resizeMode="center"
        style={styles.image}
      />
      {loginActivity ? <View style={{flex: 1}}><LinearGradient
          style={[styles.btnBackground, {paddingHorizontal: '20%'}]}
          colors={[Colors.blue, Colors.purple]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
        ><ActivityIndicator animating={true} color={Colors.white} size={48} /></LinearGradient></View> :
      <TouchableOpacity
        onPress={() => {
          //router.navigate("(tabs)");
          onModalOpen();
        }}
        activeOpacity={0.85}
        style={{ flex: 1 }}
      >
        <LinearGradient
          style={styles.btnBackground}
          colors={[Colors.blue, Colors.purple]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
        >
          <ThemedText lightColor={Colors.white} type="title">
            Zaloguj się
          </ThemedText>
        </LinearGradient>
      </TouchableOpacity>}
      <ThemedView
        style={styles.greyBox}
        lightColor={Colors.grey}
        darkColor={Colors.darkgrey}
      >
        <Image
          source={require("../assets/images/lewandowski.png")}
          resizeMode="contain"
          style={{ width: "120%", height: "120%" }}
        />
      </ThemedView>
      <LoginModal isVisible={isModalVisible} onClose={onModalClose} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  image: {
    flex: 2,
    width: "80%",
  },
  btnBackground: {
    padding: 10,
    paddingHorizontal: "10%",
    borderRadius: 50,
  },
  greyBox: {
    flex: 3,
    width: "80%",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

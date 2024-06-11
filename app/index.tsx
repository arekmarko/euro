import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";


export default function Index() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/logo_small.png")}
        resizeMode="center"
        style={styles.image}
        />
      <TouchableOpacity
        onPress={() => {
          router.navigate('(tabs)')
        }}
        activeOpacity={0.85}
        style={{flex:1}}
      >
          <LinearGradient style={styles.btnBackground} colors={[Colors.blue, Colors.purple]} start={{x: 0, y:1}} end={{x:1, y:1}}>
          <ThemedText lightColor={Colors.white} type="title">Zaloguj się</ThemedText>

          </LinearGradient>
      </TouchableOpacity>
      <ThemedView style={styles.greyBox} lightColor={Colors.grey} darkColor={Colors.darkgrey}>
        <Image
          source={require("../assets/images/lewandowski.png")}
          resizeMode="contain"
          style={{ width: "140%", height: "140%" }}
          />
      
          </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  image: {
    flex: 2,
    width: "80%",
  },
  btnBackground: {
    padding: 10,
    paddingHorizontal: '10%',
    borderRadius: 50,
  },
  greyBox: {
    flex: 3,
    width: "80%",
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

import {
  Image,
  Text,
  StyleSheet,
  Platform,
  View,
  useColorScheme,
} from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const theme = useColorScheme() ?? "light";

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ lightLeft: Colors.yellow, lightRight: Colors.orange, darkLeft: Colors.purple, darkRight: Colors.orange }}
      headerImage={
        <Image
          source={require("@/assets/images/modric.png")}
          resizeMode="contain"
          style={styles.parallaxLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme === "light" ? Colors.grey : Colors.darkgrey,
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
              <ThemedText type="subtitle">Arkadiusz</ThemedText>
              <ThemedText type="boldNumber" lightColor={Colors.darkblue} darkColor={Colors.darkblue}>
                21 <ThemedText type="light">- Twoje punkty</ThemedText>
              </ThemedText>
              <ThemedText type="boldNumber" lightColor={Colors.darkblue} darkColor={Colors.darkblue}>
                2 <ThemedText type="light">- Miejsce w rankingu</ThemedText>
              </ThemedText>
            </View>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Image
                source={require("@/assets/images/bellingham.png")}
                resizeMode="contain"
                style={{
                  alignSelf: 'flex-start',
                  height: "150%",
                  width: "150%",
                  transform: [{ scaleX: -1 }, {translateY: -10}],
                }}
              />
            </View>
          </View>
        </View>
      </View>
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

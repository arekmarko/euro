import LoginModal from "@/components/LoginModal";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, useColorScheme, useWindowDimensions } from "react-native";

export default function Index() {
  const dimensions = useWindowDimensions();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const onModalOpen = () => {
    setIsModalVisible(true);
  };
  const onModalClose = () => {
    setIsModalVisible(false);
  };
  return (
    <View style={[styles.container, {height: dimensions.height}]}>
      <Image
        source={require("../assets/images/logo_small.png")}
        resizeMode="center"
        style={styles.image}
      />
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
      </TouchableOpacity>
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

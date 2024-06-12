import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  View,
  useColorScheme,
} from "react-native";
import React, { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig";

export default function LoginModal({ isVisible, onClose }: any) {
  const colorScheme = useColorScheme() ?? "light";
  const [errorCred, setErrorCred] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const resetInputs = () => {
    setLogin("");
    setPassword("");
  };
  const signInEmail = (login: string, password: string) => {
    signInWithEmailAndPassword(auth, login, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        resetInputs();
        onClose();
        router.navigate("(tabs)");
      })
      .catch(() => {
        setErrorCred(true);
      });
  };
  return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={onClose}
      >
        <View
          style={[
            styles.modalContainer,
            {
              backgroundColor:
                colorScheme === "light" ? Colors.grey : Colors.darkgrey,
            },
          ]}
        >
          <View style={styles.titleContainer}>
            <ThemedText type="subtitle">Zaloguj się</ThemedText>
            <Pressable onPress={onClose}>
              <MaterialIcons
                name="close"
                color={colorScheme === "light" ? Colors.darkgrey : Colors.white}
                size={22}
              />
            </Pressable>
          </View>
          <View
            style={[
              styles.separator,
              {
                backgroundColor:
                  colorScheme === "light" ? Colors.darkgrey : Colors.grey,
                margin: 0,
              },
            ]}
          ></View>
          <View style={styles.modalContent}>
            <ThemedText type="default">Email</ThemedText>
            <TextInput
              inputMode="email"
              value={login}
              onChangeText={setLogin}
              style={[
                styles.input,
                {
                  backgroundColor:
                    colorScheme === "light" ? Colors.light.background : "#666",
                  color: colorScheme === "light" ? Colors.black : Colors.white,
                },
              ]}
            />
            <ThemedText type="default">Hasło</ThemedText>
            <TextInput
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
              style={[
                styles.input,
                {
                  backgroundColor:
                    colorScheme === "light" ? Colors.light.background : "#666",
                  color: colorScheme === "light" ? Colors.black : Colors.white,
                },
              ]}
            />
            {errorCred ? (
              <ThemedText type="default" style={{ color: "#f11" }}>
                Nieprawidłowe dane logowania.
              </ThemedText>
            ) : (
              <></>
            )}
            <TouchableNativeFeedback
              onPress={() => {
                setErrorCred(false);
                signInEmail(login, password);
              }}
            >
              <View
                style={[
                  styles.button,
                  {
                    backgroundColor:
                      colorScheme === "light" ? "" : Colors.darkblue,
                  },
                ]}
              >
                <ThemedText type="subtitle">Zaloguj się</ThemedText>
              </View>
            </TouchableNativeFeedback>
            <View
              style={[
                styles.separator,
                {
                  backgroundColor:
                    colorScheme === "light" ? Colors.darkgrey : Colors.grey,
                },
              ]}
            ></View>
            <Pressable
              style={{ margin: 10 }}
              onPress={() => router.navigate('register')}
            >
              <ThemedText style={{ textAlign: "center" }} type="default">
                Nie masz konta?{" "}
                <ThemedText type="link">Zarejestruj się</ThemedText>
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    width: "100%",
    height: "100%",
    position: "absolute",
    backgroundColor: "#000a",
  },
  modalContainer: {
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "absolute",
    bottom: 0,
  },
  titleContainer: {
    padding: 15,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalContent: {
    flex: 1,
    padding: 25,
    gap: 10,
  },
  input: {
    borderRadius: 5,
    padding: 5,
  },
  separator: {
    width: "90%",
    height: 1,
    alignSelf: "center",
    margin: 10,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    margin: 30,
    alignItems: "center",
  },
});
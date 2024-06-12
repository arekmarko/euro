import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableNativeFeedback,
  View,
  useColorScheme,
} from "react-native";
import React, { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { auth } from "@/firebaseConfig";
import { createUserWithEmailAndPassword} from 'firebase/auth';
import { router } from "expo-router";

export default function register() {
  const colorScheme = useColorScheme() ?? "light";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const resetInputs = () => {
    setEmail("");
    setPassword("");
  };
  const register = (email: string, password: string) => {
    createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        resetInputs();
        router.navigate("(tabs)");
  }).catch((error) => console.log(error));
  }
  return (
    <View style={styles.container}>
      <ThemedText type="title">Zarejestruj się</ThemedText>
      <View
        style={[
          styles.separator,
          {
            backgroundColor:
              colorScheme === "light" ? Colors.darkgrey : Colors.grey,
          },
        ]}
      ></View>
      <View style={styles.modalContent}>
        <ThemedText type="default">Email</ThemedText>
        <TextInput
          inputMode="email"
          value={email}
          onChangeText={setEmail}
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
        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
        <TouchableNativeFeedback onPress={() => router.back()}>
            <View style={[styles.buttons, {backgroundColor: Colors.orange}]}>
            <ThemedText type="subtitle">Anuluj</ThemedText>
            </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback onPress={() => register(email, password)}>
            <View style={[styles.buttons, {backgroundColor: Colors.darkblue}]}>
            <ThemedText type="subtitle">Zarejestruj się</ThemedText>
            </View>
        </TouchableNativeFeedback>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  separator: {
    width: "90%",
    height: 1,
    alignSelf: "center",
    margin: 10,
  },
  input: {
    borderRadius: 5,
    padding: 5,
    width: '100%'
  },
  modalContent: {
    width: '100%',
    padding: 25,
    gap: 10,
  },
  buttons: {
    padding: 10, 
    borderRadius: 10
  }
});

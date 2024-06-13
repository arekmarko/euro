import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableNativeFeedback,
  View,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import React, { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { auth, db } from "@/firebaseConfig";
import {
  AuthErrorCodes,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { router } from "expo-router";
import { ThemedSeparator } from "@/components/ThemedSeparator";
import { onValue, push, ref, set } from "firebase/database";

export default function register() {
  const colorScheme = useColorScheme() ?? "light";
  const dimensions = useWindowDimensions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const resetInputs = () => {
    setEmail("");
    setPassword("");
    setUsername("");
  };
  const resetErrors = () => {
    setUsernameError("");
    setEmailError("");
    setPasswordError("");
  };
  const register = (username: string, email: string, password: string) => {
    resetErrors();
    if (username.length == 0) {
      setUsernameError("Pole nie może być puste.");
    }
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (format.test(username)) {
      setUsernameError(
        "Nazwa użytkownika nie może zawierać znaków specjalnych."
      );
    }
    if (email.length == 0) {
      setEmailError("Pole nie może być puste.");
    }
    if (password.length < 6) {
      setPasswordError("Hasło powinno zawierać conajmniej 6 znaków.");
    }
    const dbRef = ref(db, "users/");
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      const newData = Object.keys(data).map((key) => ({
        ...data[key],
      }));
      newData.forEach((value) => {
        if (value.displayName == username) {
          setUsernameError("Nazwa użytkownika jest już zajęta.");
        }
      });
    });
    if (
      usernameError.length == 0 &&
      emailError.length == 0 &&
      passwordError.length == 0
    ) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          updateProfile(userCredential.user, { displayName: username }).then(
            () => {
              const user = userCredential.user;
              resetInputs();
              resetErrors();
              set(ref(db, "users/" + username), {
                username: username,
                email: email,
                points: 0,
              }).then(() => {
                router.navigate("(tabs)");
                ToastAndroid.show(
                  "Zarejestrowano pomyślnie!",
                  ToastAndroid.SHORT
                );
              });
            }
          );
        })
        .catch((error) => {
          console.log(error);
          if (error.code == AuthErrorCodes.EMAIL_EXISTS) {
            setEmailError("Ten e-mail jest już zajęty.");
          }
          if (error.code == AuthErrorCodes.INVALID_EMAIL) {
            setEmailError("Email jest niepoprawny.");
          }
          if (error.code == "auth/missing-password") {
            setPasswordError("Pole nie może być puste.");
          }
          if (error.code == AuthErrorCodes.WEAK_PASSWORD) {
            setPasswordError("Hasło powinno zawierać conajmniej 6 znaków.");
          }
        });
    }
  };
  return (
    <ScrollView>
      <View
        style={[
          styles.container,
          {
            backgroundColor:
              colorScheme === "light" ? Colors.grey : Colors.darkgrey,
            height: dimensions.height,
          },
        ]}
      >
        <Image
          source={require("../assets/images/logo_small.png")}
          resizeMode="center"
          style={{ margin: 50, height: "20%", width: "80%" }}
        />
        <View style={{ flex: 1, width: "100%" }}>
          <ThemedText type="title" style={{ textAlign: "center" }}>
            Zarejestruj się
          </ThemedText>
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
            <ThemedText type="default">Nazwa użytkownika</ThemedText>
            <TextInput
              inputMode="text"
              value={username}
              onChangeText={setUsername}
              maxLength={16}
              textContentType="nickname"
              style={[
                styles.input,
                {
                  backgroundColor:
                    colorScheme === "light" ? Colors.light.background : "#666",
                  color: colorScheme === "light" ? Colors.black : Colors.white,
                  borderColor: "red",
                  borderWidth: usernameError.length > 0 ? 1 : 0,
                },
              ]}
            />
            {usernameError.length > 0 ? (
              <ThemedText type="error">{usernameError}</ThemedText>
            ) : (
              <></>
            )}
            <ThemedText type="default">Email</ThemedText>
            <TextInput
              inputMode="email"
              value={email}
              onChangeText={setEmail}
              autoComplete="email"
              autoCapitalize="none"
              maxLength={64}
              textContentType="emailAddress"
              style={[
                styles.input,
                {
                  backgroundColor:
                    colorScheme === "light" ? Colors.light.background : "#666",
                  color: colorScheme === "light" ? Colors.black : Colors.white,
                  borderColor: "red",
                  borderWidth: emailError.length > 0 ? 1 : 0,
                },
              ]}
            />
            {emailError.length > 0 ? (
              <ThemedText type="error">{emailError}</ThemedText>
            ) : (
              <></>
            )}
            <ThemedText type="default">Hasło</ThemedText>
            <TextInput
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
              maxLength={64}
              autoCapitalize="none"
              textContentType="newPassword"
              style={[
                styles.input,
                {
                  backgroundColor:
                    colorScheme === "light" ? Colors.light.background : "#666",
                  color: colorScheme === "light" ? Colors.black : Colors.white,
                  borderColor: "red",
                  borderWidth: passwordError.length > 0 ? 1 : 0,
                },
              ]}
            />
            {passwordError.length > 0 ? (
              <ThemedText type="error">{passwordError}</ThemedText>
            ) : (
              <></>
            )}
            <ThemedSeparator />
            <View style={{}}>
              <TouchableNativeFeedback
                onPress={() => {
                  register(username, email, password);
                }}
              >
                <View
                  style={[styles.buttons, { backgroundColor: Colors.darkblue }]}
                >
                  <ThemedText type="subtitle" style={{ color: Colors.white }}>
                    Zarejestruj się
                  </ThemedText>
                </View>
              </TouchableNativeFeedback>
              <TouchableNativeFeedback onPress={() => router.back()}>
                <View
                  style={[styles.buttons, { backgroundColor: Colors.orange }]}
                >
                  <ThemedText type="subtitle" lightColor={Colors.white}>
                    Anuluj
                  </ThemedText>
                </View>
              </TouchableNativeFeedback>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    paddingTop: "5%",
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
    width: "100%",
  },
  modalContent: {
    width: "100%",
    padding: 25,
    gap: 10,
  },
  buttons: {
    padding: 10,
    borderRadius: 10,
    margin: 10,
    alignItems: "center",
  },
});

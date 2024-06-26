import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
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
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { Flag } from "@/constants/Flags";
import ParallaxScrollView from "@/components/ParallaxScrollView";

export default function register() {
  const colorScheme = useColorScheme() ?? "light";
  const dimensions = useWindowDimensions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [favouriteError, setFavouriteError] = useState("");
  const [dropdown, setDropdown] = useState(false);
  const [favourite, setFavourite] = useState("");
  const [registerActivity, setRegisterActivity] = useState(false);
  const data = [
    "Albania",
    "Anglia",
    "Austria",
    "Belgia",
    "Chorwacja",
    "Czechy",
    "Dania",
    "Francja",
    "Gruzja",
    "Hiszpania",
    "Holandia",
    "Niemcy",
    "Polska",
    "Portugalia",
    "Rumunia",
    "Serbia",
    "Słowacja",
    "Słowenia",
    "Szkocja",
    "Szwajcaria",
    "Turcja",
    "Ukraina",
    "Węgry",
    "Włochy",
  ];
  const [userCount, setUserCount] = useState(0);
  useEffect(() => {
    const dbRef = ref(db, "users/");
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      const newData = Object.keys(data).map((key) => ({
        ...data[key],
      }));
      setUserCount(newData.length);
    });
  }, []);
  const handleDropdown = () => {
    setDropdown((prev) => !prev);
  };
  const resetInputs = () => {
    setEmail("");
    setPassword("");
    setUsername("");
  };
  const resetErrors = () => {
    setUsernameError("");
    setEmailError("");
    setPasswordError("");
    setFavouriteError("");
  };
  const register = (
    username: string,
    email: string,
    password: string,
    favourite: string
  ) => {
    setRegisterActivity(true);
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
    if (favourite.length == 0) {
      setFavouriteError("Pole nie może być puste.");
    }
    const dbRef = ref(db, "users/");
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      const newData = Object.keys(data).map((key) => ({
        ...data[key],
      }));
      newData.forEach((value, index) => {
        if (value.displayName == username) {
          setUsernameError("Nazwa użytkownika jest już zajęta.");
        }
      });
      setRegisterActivity(false);
    });
    if (
      usernameError.length == 0 &&
      emailError.length == 0 &&
      passwordError.length == 0 &&
      favouriteError.length == 0
    ) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          updateProfile(userCredential.user, { displayName: username }).then(
            () => {
              const user = userCredential.user;
              setRegisterActivity(false);
              resetInputs();
              resetErrors();
              set(ref(db, "users/" + username), {
                username: username,
                email: email,
                points: 0,
                favourite: favourite,
                ranking: userCount + 1,
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
          //console.log(error);
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
    <ScrollView nestedScrollEnabled={true} style={{ flex: 1 }}>
      <ThemedView style={[
          styles.container,
          {
            backgroundColor:
            colorScheme === "light" ? Colors.grey : Colors.darkgrey,
          },
        ]}>
        <View style={{ width: "80%", aspectRatio: 1 / 0.5 }}>
          <Image
            source={require("../assets/images/logo_small.png")}
            resizeMode="center"
            style={{ width: "100%", height: "100%" }}
          />
        </View>
        <View style={styles.container}>
          <ThemedText type="title" style={{textAlign: 'center'}}>Zarejestruj się</ThemedText>
          <ThemedSeparator />
          <ThemedText type="default" style={{margin: 5, marginTop: 10, textAlign: 'center'}}>Nazwa użytkownika</ThemedText>
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
          <ThemedText type="default" style={{margin: 5, marginTop: 10}}>Email</ThemedText>
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
          <ThemedText type="default" style={{margin: 5, marginTop: 10}}>Hasło</ThemedText>
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
          <ThemedText type="default" style={{marginTop: 10, textAlign: 'center'}}>Twój faworyt turnieju</ThemedText>
          <ThemedText type="light" style={{margin: 5, textAlign: 'center'}}>(Dodatkowe punkty za wytypowanie mistrza europy)</ThemedText>
            <TouchableNativeFeedback onPress={handleDropdown}>
              <ThemedView
                style={{
                  width: "100%",
                  height: 40,
                  borderRadius: 5,
                  borderBottomLeftRadius: dropdown ? 0 : 5,
                  borderBottomRightRadius: dropdown ? 0 : 5,
                  borderBottomColor: Colors.white,
                  borderColor: favouriteError ? "red" : Colors.darkblue,
                  borderWidth: 1,
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: 10,
                  flexDirection: "row",
                }}
                lightColor={Colors.white}
                darkColor="#666"
              >
                <ThemedText>{favourite}</ThemedText>
                <Ionicons
                  name="chevron-down"
                  color={colorScheme === "light" ? Colors.black : Colors.white}
                  size={18}
                />
              </ThemedView>
            </TouchableNativeFeedback>
            {dropdown ? (
              <ScrollView
              nestedScrollEnabled={true}
                style={{
                  padding: 5,
                  width: '100%',
                  height: 200,
                  backgroundColor:
                    colorScheme == "light" ? Colors.white : "#666",
                  borderBottomLeftRadius: 5,
                  borderBottomRightRadius: 5,
                }}
              >
                {data.map((item, index) => (
                  <View key={index}>
                    <TouchableOpacity
                      style={{ height: 40, justifyContent: "center" }}
                      onPress={() => {
                        setFavourite(item), handleDropdown();
                      }}
                    >
                      <View style={{ flexDirection: "row" }}>
                        <Image
                          source={Flag[item]}
                          resizeMode="center"
                          style={{ height: "90%", width: 30 }}
                        />
                        <ThemedText>{item}</ThemedText>
                      </View>
                    </TouchableOpacity>
                    <ThemedSeparator style={{ margin: 3 }} />
                  </View>
                ))}
              </ScrollView>
            ) : (
              <></>
            )}
            {favouriteError.length > 0 ? (
              <ThemedText type="error">{favouriteError}</ThemedText>
            ) : (
              <></>
            )}
          <ThemedSeparator style={{margin: 40}}/>
          <View>
            {registerActivity ? (
              <View
                style={[styles.buttons, { backgroundColor: Colors.darkblue }]}
              >
                <ThemedText type="subtitle" style={{ color: Colors.white }}>
                  <ActivityIndicator animating={true} color={Colors.white} />
                </ThemedText>
              </View>
            ) : (
              <TouchableNativeFeedback
                onPress={() => {
                  register(username, email, password, favourite);
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
            )}
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
      </ThemedView>
    </ScrollView>

    // <View
    //     style={[
    //       styles.container,
    //       {
    //         backgroundColor:
    //         colorScheme === "light" ? Colors.grey : Colors.darkgrey,
    //       },
    //     ]}
    //     >
    //     <Image
    //           source={require("../assets/images/logo_small.png")}
    //           resizeMode="center"
    //           style={{ alignSelf: 'center', height: "20%", width: "80%", margin: 'auto' }}
    //         />

    //     <View style={{  width: "100%" }}>
    //       <ThemedText type="title" style={{ textAlign: "center" }}>
    //         Zarejestruj się
    //       </ThemedText>
    //       <ThemedSeparator style={{width: '90%'}} />
    //       <View style={styles.modalContent}>
    //         <ThemedText type="default">Nazwa użytkownika</ThemedText>
    //         <TextInput
    //           inputMode="text"
    //           value={username}
    //           onChangeText={setUsername}
    //           maxLength={16}
    //           textContentType="nickname"
    //           style={[
    //             styles.input,
    //             {
    //               backgroundColor:
    //                 colorScheme === "light" ? Colors.light.background : "#666",
    //               color: colorScheme === "light" ? Colors.black : Colors.white,
    //               borderColor: "red",
    //               borderWidth: usernameError.length > 0 ? 1 : 0,
    //             },
    //           ]}
    //         />
    //         {usernameError.length > 0 ? (
    //           <ThemedText type="error">{usernameError}</ThemedText>
    //         ) : (
    //           <></>
    //         )}
    //         <ThemedText type="default">Email</ThemedText>
    //         <TextInput
    //           inputMode="email"
    //           value={email}
    //           onChangeText={setEmail}
    //           autoComplete="email"
    //           autoCapitalize="none"
    //           maxLength={64}
    //           textContentType="emailAddress"
    //           style={[
    //             styles.input,
    //             {
    //               backgroundColor:
    //                 colorScheme === "light" ? Colors.light.background : "#666",
    //               color: colorScheme === "light" ? Colors.black : Colors.white,
    //               borderColor: "red",
    //               borderWidth: emailError.length > 0 ? 1 : 0,
    //             },
    //           ]}
    //         />
    //         {emailError.length > 0 ? (
    //           <ThemedText type="error">{emailError}</ThemedText>
    //         ) : (
    //           <></>
    //         )}
    //         <ThemedText type="default">Hasło</ThemedText>
    //         <TextInput
    //           secureTextEntry={true}
    //           value={password}
    //           onChangeText={setPassword}
    //           maxLength={64}
    //           autoCapitalize="none"
    //           textContentType="newPassword"
    //           style={[
    //             styles.input,
    //             {
    //               backgroundColor:
    //                 colorScheme === "light" ? Colors.light.background : "#666",
    //               color: colorScheme === "light" ? Colors.black : Colors.white,
    //               borderColor: "red",
    //               borderWidth: passwordError.length > 0 ? 1 : 0,
    //             },
    //           ]}
    //         />
    //         {passwordError.length > 0 ? (
    //           <ThemedText type="error">{passwordError}</ThemedText>
    //         ) : (
    //           <></>
    //         )}
    //         <ThemedText type="default">Twój faworyt turnieju</ThemedText>
    //         <View>
    //           <TouchableNativeFeedback onPress={handleDropdown}>
    //             <ThemedView
    //               style={{
    //                 width: "100%",
    //                 height: 40,
    //                 borderRadius: 5,
    //                 borderBottomLeftRadius: dropdown ? 0 : 5,
    //                 borderBottomRightRadius: dropdown ? 0 : 5,
    //                 borderBottomColor: Colors.white,
    //                 borderColor: favouriteError ? "red" : Colors.darkblue,
    //                 borderWidth: 1,
    //                 justifyContent: "space-between",
    //                 alignItems: "center",
    //                 paddingHorizontal: 10,
    //                 flexDirection: "row",
    //               }}
    //               lightColor={Colors.white}
    //               darkColor="#666"
    //             >
    //               <ThemedText>{favourite}</ThemedText>
    //               <Ionicons
    //                 name="chevron-down"
    //                 color={
    //                   colorScheme === "light" ? Colors.black : Colors.white
    //                 }
    //                 size={18}
    //               />
    //             </ThemedView>
    //           </TouchableNativeFeedback>
    //           {dropdown ? (
    //             <ScrollView
    //               style={{
    //                 padding: 5,
    //                 height: 150,
    //                 backgroundColor: colorScheme=='light' ? Colors.white : "#666",
    //                 borderBottomLeftRadius: 5,
    //                 borderBottomRightRadius: 5,
    //               }}
    //             >
    //               {data.map((item, index) => (
    //                 <View key={index}>
    //                   <TouchableOpacity
    //                     style={{ height: 40, justifyContent: "center" }}
    //                     onPress={() => {
    //                       setFavourite(item), handleDropdown();
    //                     }}
    //                   >
    //                     <View style={{flexDirection: 'row'}}>

    //                     <Image
    //                       source={Flag[item]}
    //                       resizeMode="center"
    //                       style={{height: '90%', width: 30}}
    //                       />
    //                       <ThemedText>{item}</ThemedText>
    //                       </View>
    //                   </TouchableOpacity>
    //                   <ThemedSeparator style={{ margin: 3 }} />
    //                 </View>
    //               ))}
    //             </ScrollView>
    //           ) : (
    //             <></>
    //           )}
    //           {favouriteError.length > 0 ? (
    //             <ThemedText type="error">{favouriteError}</ThemedText>
    //           ) : (
    //             <></>
    //           )}
    //         </View>
    //         <ThemedSeparator />
    //         <View >
    //           {registerActivity ? <View
    //               style={[styles.buttons, { backgroundColor: Colors.darkblue }]}
    //             ><ThemedText type="subtitle" style={{ color: Colors.white }}>
    //           <ActivityIndicator animating={true} color={Colors.white} /></ThemedText></View> : <TouchableNativeFeedback
    //             onPress={() => {
    //               register(username, email, password, favourite);
    //             }}
    //           >
    //             <View
    //               style={[styles.buttons, { backgroundColor: Colors.darkblue }]}
    //             >
    //               <ThemedText type="subtitle" style={{ color: Colors.white }}>
    //                 Zarejestruj się
    //               </ThemedText>
    //             </View>
    //           </TouchableNativeFeedback>}
    //           <TouchableNativeFeedback onPress={() => router.back()}>
    //             <View
    //               style={[styles.buttons, { backgroundColor: Colors.orange }]}
    //             >
    //               <ThemedText type="subtitle" lightColor={Colors.white}>
    //                 Anuluj
    //               </ThemedText>
    //             </View>
    //           </TouchableNativeFeedback>
    //         </View>
    //       </View>
    //     </View>
    //   </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    paddingTop: "5%",
    paddingHorizontal: 10
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

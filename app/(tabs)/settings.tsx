import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, TouchableNativeFeedback, View, Switch, useColorScheme, Modal, TextInput } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { auth, db } from '@/firebaseConfig';
import { router } from 'expo-router';
import { useState } from 'react';
import { ThemedSeparator } from '@/components/ThemedSeparator';
import { ref, set, push } from 'firebase/database';

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [visibleSendMessage, setVisibleMessage] = useState(false);
  const [message, setMessage] = useState('');
  const handleVisibleSendMessage = () => {
    setVisibleMessage(prev => !prev);
  };
  function sendMessage() {
    push(ref(db, 'messages/' + auth.currentUser?.displayName + '/'), {
      message: message,
    });
  }
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ lightLeft: '#D0D0D0', lightRight: '#E0E0E0', darkLeft: '#353636', darkRight: '#656565' }}
      headerImage={<Ionicons size={310} name="cog" style={styles.headerImage} />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Ustawienia</ThemedText>
      </ThemedView>
      <ThemedSeparator />
      <ThemedText type='subtitle'>{auth.currentUser?.displayName}</ThemedText>
      <ThemedText type='default'>{auth.currentUser?.email}</ThemedText>
      <ThemedSeparator />
      
      {/* <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
        <ThemedText>Potrzebna zmiana hasła?</ThemedText>
        <TouchableNativeFeedback>
          <ThemedView lightColor={Colors.grey} darkColor={Colors.darkgrey} style={styles.button}>
          <ThemedText>Zmień hasło</ThemedText>
          </ThemedView>
        </TouchableNativeFeedback>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
        <ThemedText>Chcesz dostawać powiadomienia?</ThemedText>
        <Switch value={notifications} onValueChange={handleNotifications} trackColor={{false: Colors.darkgrey}} style={{transform: [{scale: 1.2}]}}/>
      </View> */}
      
      {auth.currentUser?.email==='arekmarko8@gmail.com' ? <TouchableNativeFeedback>
        <ThemedView lightColor={Colors.grey} darkColor={Colors.darkgrey} style={styles.logoutButton}>
          <ThemedText>Dodaj wynik</ThemedText>
        </ThemedView>
      </TouchableNativeFeedback> : <></>}
      
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
        <ThemedText>Masz uwagi?</ThemedText>
        <TouchableNativeFeedback onPress={() => setVisibleMessage(true)}>
          <ThemedView lightColor={Colors.grey} darkColor={Colors.darkgrey} style={styles.button}>
          <ThemedText>Wyślij uwagi!</ThemedText>
          </ThemedView>
        </TouchableNativeFeedback>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visibleSendMessage}
        onRequestClose={() => setVisibleMessage(false)}
      >
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View style={{flex: 1, backgroundColor: '#0004', position: 'absolute'}}></View>
          <ThemedView style={{width: '80%', backgroundColor: Colors.darkgrey, gap: 20, padding: 20, borderRadius: 20, justifyContent: 'center', alignItems: 'center'}}>
            <ThemedText type='subtitle'>Wyślij swoje uwagi</ThemedText>
            <TextInput value={message} onChangeText={setMessage} style={{backgroundColor: Colors.grey, width: '100%', textAlignVertical: 'top', padding: 3}} scrollEnabled={true} multiline={true} numberOfLines={10}/>
            <TouchableNativeFeedback onPress={() => sendMessage()}>
          <ThemedView lightColor={Colors.grey} darkColor='#777' style={styles.button}>
          <ThemedText>Wyślij</ThemedText>
          </ThemedView>
        </TouchableNativeFeedback>
          </ThemedView>
        </View>
        </Modal>
      <TouchableNativeFeedback onPress={() => {auth.signOut(), router.dismissAll()}}>
        <ThemedView lightColor={Colors.grey} darkColor={Colors.darkgrey} style={styles.logoutButton}>
          <ThemedText type='subtitle'>Wyloguj się</ThemedText>
        </ThemedView>
      </TouchableNativeFeedback>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  logoutButton: {
    padding: 10,
    borderRadius: 10,
    alignSelf: 'center',
    alignItems: 'center',
    width: '50%',
    margin: 20
  },
  button: {
    padding: 10,
    borderRadius: 10,
    minWidth: '30%',
    alignItems: 'center'
  }
});

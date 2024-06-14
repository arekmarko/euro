import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, TouchableNativeFeedback, View, Switch, useColorScheme } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { auth } from '@/firebaseConfig';
import { router } from 'expo-router';
import { useState } from 'react';
import { ThemedSeparator } from '@/components/ThemedSeparator';

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const handleNotifications = () => {
    setNotifications(prev => !prev);
  };
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
    padding: 5,
    borderRadius: 10,
    minWidth: '30%',
    alignItems: 'center'
  }
});

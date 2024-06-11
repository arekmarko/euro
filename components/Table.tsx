import { StyleSheet, Text, View, useColorScheme } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors';
import { ThemedText } from './ThemedText';
import { LinearGradient } from 'expo-linear-gradient';


export default function Table({g,index}:any) {
    const colorScheme = useColorScheme() ?? 'light';
  return (
    <LinearGradient style={{borderRadius: 20}} colors={colorScheme==='light' ? [Colors.blue, Colors.yellow] : [Colors.blue, Colors.purple]} start={{x: 0, y: 1}} end={{x: 1, y: 1}}>

    <View key={index} style={styles.tableGroup}>
                <View style={{flexDirection: 'row'}}>
            <ThemedText style={{flex: 6}} type="subtitle">{g.name}</ThemedText>
            <ThemedText style={styles.tableText} type="default">Z</ThemedText>
            <ThemedText style={styles.tableText} type="default">R</ThemedText>
            <ThemedText style={styles.tableText} type="default">P</ThemedText>
            <ThemedText style={styles.tableText} type="default">B</ThemedText>
            <ThemedText style={{flex:2, textAlign: 'center', textAlignVertical: 'center'}} type="defaultSemiBold">PKT</ThemedText>
                </View>
            {Object.keys(g.teams).map((key) => (
                <View key={key} style={styles.tableTeam}>
                    <ThemedText style={{flex: 6}} type="defaultSemiBold">{g.teams[key].name}</ThemedText>
                    <ThemedText style={styles.tableText} type="default">{g.teams[key].wins >= 0 ? g.teams[key].wins : 0}</ThemedText>
                    <ThemedText style={styles.tableText} type="default">{g.teams[key].draws >= 0 ? g.teams[key].draws : 0}</ThemedText>
                    <ThemedText style={styles.tableText} type="default">{g.teams[key].loses >= 0 ? g.teams[key].loses : 0}</ThemedText>
                    <ThemedText style={styles.tableText} type="default">{g.teams[key].gs >= 0 || g.teams[key].gs >= 0 ? g.teams[key].gs + ':' + g.teams[key].gc : '0:0'}</ThemedText>
                    <ThemedText style={{flex: 2, textAlign: 'center'}} type="defaultSemiBold">{(g.teams[key].wins >= 0 || g.teams[key].draws >= 0) ? g.teams[key].wins*3 + g.teams[key].draws : 0}</ThemedText>
                </View>
            ))}
          </View>
</LinearGradient>
  )
}

const styles = StyleSheet.create({
    tableGroup: {
        borderRadius: 10,
        padding: 10,
        gap: 10
      },
      tableTeam: {
        flexDirection: 'row',
      },
      tableText: {
        flex: 1,
        textAlign: 'center',
        textAlignVertical: 'center'
      }
})
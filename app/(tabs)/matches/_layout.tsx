import { View, Text } from 'react-native'
import React from 'react'
import { Stack, Tabs } from 'expo-router'

export default function _layout() {
  return (
    <Stack screenOptions={{headerShown: false, freezeOnBlur:true}} initialRouteName='index' >
        <Stack.Screen name="index" />
    </Stack>
  )
}
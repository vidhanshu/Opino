import { Tabs } from 'expo-router';
import React from 'react';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { BOTTOM_TAB_WIDTH } from '@/constants';
import { Text, View } from 'react-native';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#FFCC2E",
        tabBarInactiveTintColor: "#CDCDE0",
        tabBarStyle: {
          backgroundColor: "black",
          borderTopWidth: 1,
          borderTopColor: "#232533",
          height: BOTTOM_TAB_WIDTH,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View className="flex flex-col items-center gap-1">
              <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
              <Text className={`text-xs ${focused ? "text-primary" : "text-white"}`}>Home</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="create-quiz"
        options={{
          title: 'Create',
          tabBarIcon: ({ color, focused }) => (
            <View className="flex flex-col items-center gap-1">
              <AntDesign name={focused ? "pluscircle" : "pluscircleo"} size={24} color={color} />
              <Text className={`text-xs ${focused ? "text-primary" : "text-white"}`}>Create</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="quiz-list"
        options={{
          title: 'Quizes',
          tabBarIcon: ({ color, focused }) => (
            <View className="flex flex-col items-center gap-1">
              <AntDesign name={focused ? "questioncircle" : "questioncircleo"} size={24} color={color} />
              <Text className={`text-xs ${focused ? "text-primary" : "text-white"}`}>Quizes</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View className="flex flex-col items-center gap-1">
              <FontAwesome name={focused ? "user-circle" : "user-circle-o"} size={24} color={color} />
              <Text className={`text-xs ${focused ? "text-primary" : "text-white"}`}>Profile</Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
import { BOTTOM_TAB_WIDTH } from "@/constants";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { TouchableRipple } from "react-native-paper";

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
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TouchableRipple rippleColor="white">
              <View className="flex flex-col items-center gap-1">
                <Ionicons
                  name={focused ? "home" : "home-outline"}
                  size={24}
                  color={color}
                />
                <Text
                  className={`text-xs ${
                    focused ? "text-primary" : "text-white"
                  }`}
                >
                  Home
                </Text>
              </View>
            </TouchableRipple>
          ),
        }}
      />
      <Tabs.Screen
        name="create-quiz"
        options={{
          title: "Create",
          tabBarIcon: ({ color, focused }) => (
            <TouchableRipple rippleColor="white">
              <View className="flex flex-col items-center gap-1">
                <AntDesign
                  name={focused ? "pluscircle" : "pluscircleo"}
                  size={24}
                  color={color}
                />
                <Text
                  className={`text-xs ${
                    focused ? "text-primary" : "text-white"
                  }`}
                >
                  Create
                </Text>
              </View>
            </TouchableRipple>
          ),
        }}
      />
      <Tabs.Screen
        name="quiz-list"
        options={{
          title: "Quizes",
          tabBarIcon: ({ color, focused }) => (
            <TouchableRipple rippleColor="white">
              <View className="flex flex-col items-center gap-1">
                <AntDesign
                  name={focused ? "questioncircle" : "questioncircleo"}
                  size={24}
                  color={color}
                />
                <Text
                  className={`text-xs ${
                    focused ? "text-primary" : "text-white"
                  }`}
                >
                  Quizes
                </Text>
              </View>
            </TouchableRipple>
          ),
        }}
      />
    </Tabs>
  );
}

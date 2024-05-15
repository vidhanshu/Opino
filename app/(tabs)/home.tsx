import PageLayout from "@/components/layouts/page-layout";
import { auth } from "@/firebase";
import { Link, router } from "expo-router";
import { signOut } from "firebase/auth";
import React from "react";
import { Text, View } from "react-native";
import { Appbar, Button } from "react-native-paper";

export default function HomeScreen() {
  return (
    <PageLayout>
      <View></View>
    </PageLayout>
  );
}

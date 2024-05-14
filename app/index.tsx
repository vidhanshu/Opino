import PageLayout from "@/components/layouts/page-layout";
import { auth } from "@/firebase";
import { Link } from "expo-router";
import { signOut } from "firebase/auth";
import React from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";

export default function HomeScreen() {
  return (
    <PageLayout>
      <Link href="/sign-in">
        <Text className="text-primary">Sign in</Text>
        <Button onPress={() => signOut(auth)}>Sign out</Button>
      </Link>
    </PageLayout>
  );
}
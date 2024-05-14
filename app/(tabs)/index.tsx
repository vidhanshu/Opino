import PageLayout from "@/components/layouts/page-layout";
import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <PageLayout>
      <Link href="/sign-in">
        <Text className="text-primary">Sign in</Text>
      </Link>
    </PageLayout>
  );
}
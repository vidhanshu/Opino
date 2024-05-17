import PageLayout from "@/components/layouts/page-layout";
import { images } from "@/constants";
import { useGlobalContext } from "@/contexts/global";
import { Feather } from "@expo/vector-icons";
import { Link, Redirect } from "expo-router";
import React from "react";
import { Image, View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function HomeScreen() {
  const { loading, user } = useGlobalContext();

  if (!loading && user) return <Redirect href="/home" />;

  return (
    <PageLayout>
      <View className="flex flex-1 justify-center items-center gap-4 px-2">
        {!loading ? (
          <>
            <Image source={images.logo} className="h-32" resizeMode="contain" />
            <Text className="font-rblack text-center" variant="headlineLarge">
              Unleash Your Knowledge with Opino!
            </Text>
            <Text className="text-center text-gray-300" variant="bodySmall">
              Your Ultimate Platform for Dynamic and Engaging Quizzes
            </Text>
            <Link href="/sign-in">
              <Button rippleColor="white" icon="arrow-right" mode="contained">
                Get started
              </Button>
            </Link>
          </>
        ) : (
          <View className="flex flex-col items-center gap-4">
            <Feather
              name="loader"
              size={50}
              className="animate-spin"
              color="#FFCC2E"
            />
            <Text>Loading...</Text>
          </View>
        )}
      </View>
      <Text className="text-right mb-4 mr-4 text-gray-400" variant="bodySmall">
        - Created by Vidhanshu
      </Text>
    </PageLayout>
  );
}

import GenericDialog from "@/components/dialog/generic-dialog";
import PageLayout from "@/components/layouts/page-layout";
import { images } from "@/constants";
import { auth } from "@/firebase";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import React, { useState } from "react";
import { Image, ScrollView, View } from "react-native";
import { Button, IconButton, Text } from "react-native-paper";

export default function HomeScreen() {
  const [signOutDialog, setSignOutDialog] = useState({
    show: false,
    loading: false,
  });

  const handleSignOut = async () => {
    setSignOutDialog({ ...signOutDialog, loading: true });
    await signOut(auth);
    setSignOutDialog({ ...signOutDialog, loading: false, show: false });
    router.push("/sign-in");
  };

  return (
    <PageLayout>
      <ScrollView>
        <View className="bg-black h-[60px] border-b border-secondary-200 flex-row gap-x-4 justify-between items-center pr-2">
          <Image
            className="h-6 -translate-x-8"
            source={images.logo}
            resizeMode="contain"
          />
          <View className="flex-row items-center">
            <IconButton
              mode="contained"
              className="bg-secondary-200"
              icon="magnify"
              size={20}
              onPress={() => router.push("/quiz-list")}
            />
            <IconButton
              icon="login"
              size={20}
              mode="contained"
              className="bg-secondary-200"
              onPress={() => setSignOutDialog({ ...signOutDialog, show: true })}
            />
          </View>
        </View>
        <View className="w-full min-h-[70vh] px-4 my-6 space-y-4">
          <View>
            <Text className="font-rbold text-center" variant="headlineMedium">
              Welcome! to Opnio{" "}
            </Text>
            <Button>Get started!</Button>
          </View>
        </View>
      </ScrollView>
      <GenericDialog
        title="Are you sure?"
        subtitle="You'll be logged out of an application once signeout!"
        visible={signOutDialog.show}
        hideDialog={() => setSignOutDialog({ ...signOutDialog, show: false })}
      >
        <View className="pt-4">
          <Button
            mode="contained"
            className="bg-rose-500"
            loading={signOutDialog.loading}
            onPress={handleSignOut}
          >
            Sign Out
          </Button>
        </View>
      </GenericDialog>
    </PageLayout>
  );
}

import { View, Text } from "react-native";
import React, { PropsWithChildren } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const PageLayout = ({ children }: PropsWithChildren) => {
    return (
        <SafeAreaView className="bg-secondary-100 h-full flex-1">
            {children}
            <StatusBar backgroundColor="#161622" style="light" />
        </SafeAreaView>
    );
};

export default PageLayout;
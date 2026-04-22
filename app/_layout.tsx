import { setAudioModeAsync } from "expo-audio";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { FavoritesProvider } from "../src/context/FavoritesContext";
import { MealPlanProvider } from "../src/context/MealPlanContext";

export default function RootLayout() {
  useEffect(() => {
    async function setupAudio() {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
          shouldPlayInBackground: false,
          interruptionMode: "doNotMix",
        });
      } catch (e) {
        console.log("Error setting audio mode", e);
      }
    }
    setupAudio();
  }, []);

  return (
    <FavoritesProvider>
      <MealPlanProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: "#F9F6F0" },
              }}
            >
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="recipe/[id]"
                options={{ presentation: "modal" }}
              />
            </Stack>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </MealPlanProvider>
    </FavoritesProvider>
  );
}

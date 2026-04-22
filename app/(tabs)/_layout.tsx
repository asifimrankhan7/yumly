import React from "react";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../src/constants/theme";
import { useFavorites } from "../../src/context/FavoritesContext";

export default function TabsLayout() {
  const { favorites } = useFavorites();
  const favoritesCount = favorites.length;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          height: Platform.OS === "ios" ? 88 : 68,
          paddingBottom: Platform.OS === "ios" ? 30 : 10,
          paddingTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarBadge: favoritesCount > 0 ? favoritesCount : undefined,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "heart" : "heart-outline"} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mealplan"
        options={{
          title: "Meal Plan",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "restaurant" : "restaurant-outline"} size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

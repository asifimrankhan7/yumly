import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SPACING, FONTS, RADIUS } from "../../src/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useFavorites } from "../../src/context/FavoritesContext";
import { Recipe } from "../../src/types";
import recipesData from "../../src/data/recipes.json";
import RecipeListItem from "../../src/components/recipe/RecipeListItem";
import SwipeableRow from "../../src/components/recipe/SwipeableRow";
import EmptyState from "../../src/components/common/EmptyState";
import { useRouter } from "expo-router";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

const recipes = recipesData as Recipe[];

export default function FavoritesScreen() {
  const { favorites, toggleFavorite } = useFavorites();
  const router = useRouter();

  const favoriteRecipes = recipes.filter((recipe) =>
    favorites.includes(recipe.id)
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Animated.View
        entering={FadeIn.duration(500)}
        style={styles.header}
      >
        <View>
          <Text style={styles.headerLabel}>YOUR COLLECTION</Text>
          <Text style={styles.headerTitle}>Saved Recipes</Text>
        </View>
        {favoriteRecipes.length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{favoriteRecipes.length}</Text>
          </View>
        )}
      </Animated.View>

      {favoriteRecipes.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.list}>
            {favoriteRecipes.map((recipe, index) => (
              <Animated.View
                key={recipe.id}
                entering={FadeInDown.delay(index * 60).duration(400)}
              >
                <SwipeableRow
                  onDelete={() => toggleFavorite(recipe.id)}
                >
                  <RecipeListItem recipe={recipe} index={index} />
                </SwipeableRow>
              </Animated.View>
            ))}
          </View>
          <View style={styles.footerSpacer} />
        </ScrollView>
      ) : (
        <EmptyState
          icon="bookmark-outline"
          title="No Saved Recipes"
          description="Tap the heart icon on any recipe to save it here for quick access."
          actionLabel="Explore Recipes"
          onAction={() => router.push("/(tabs)")}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.m,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  headerLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.primary,
    letterSpacing: 2,
    marginBottom: 4,
    fontFamily: FONTS.mono,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text,
    fontFamily: FONTS.serif,
  },
  countBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
    marginBottom: 4,
  },
  countText: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.primary,
    fontFamily: FONTS.mono,
  },
  scrollContent: {
    paddingTop: SPACING.s,
    paddingHorizontal: SPACING.m,
  },
  list: {
    width: "100%",
  },
  footerSpacer: {
    height: 100,
  },
});

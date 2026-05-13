import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInRight } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "../../src/components/common/EmptyState";
import { RecipeImages } from "../../src/constants/recipe-images";
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from "../../src/constants/theme";
import { useMealPlan } from "../../src/context/MealPlanContext";
import recipesData from "../../src/data/recipes.json";
import { Recipe } from "../../src/types";

const recipes = recipesData as Recipe[];

export default function MealPlanScreen() {
  const { meals, removeFromMealPlan } = useMealPlan();
  const router = useRouter();

  const getRecipeById = (id: string) => recipes.find((r) => r.id === id);

  const totalCalories = meals.reduce((sum, meal) => {
    const recipe = getRecipeById(meal.recipeId);
    if (!recipe) return sum;
    const scale = meal.servings / recipe.metadata.servings;
    return sum + recipe.metadata.calories * scale;
  }, 0);

  const totalTime = meals.reduce((sum, meal) => {
    const recipe = getRecipeById(meal.recipeId);
    return sum + (recipe?.metadata.totalTimeMinutes || 0);
  }, 0);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Animated.View
        entering={FadeIn.duration(500)}
        style={styles.header}
      >
        <View>
          <Text style={styles.headerLabel}>YOUR KITCHEN</Text>
          <Text style={styles.headerTitle}>Meal Plan</Text>
        </View>
      </Animated.View>

      {meals.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Quick Stats */}
          <Animated.View
            entering={FadeInDown.delay(100).duration(500)}
            style={styles.statsRow}
          >
            <View style={styles.statCard}>
              <View style={styles.statIconWrap}>
                <Ionicons name="flame-outline" size={18} color={COLORS.primary} />
              </View>
              <Text style={styles.statValue}>{meals.length}</Text>
              <Text style={styles.statLabel}>Recipes</Text>
            </View>
            <View style={styles.statCard}>
              <View style={styles.statIconWrap}>
                <Ionicons name="nutrition-outline" size={18} color={COLORS.secondary} />
              </View>
              <Text style={styles.statValue}>{Math.round(totalCalories)}</Text>
              <Text style={styles.statLabel}>Total Cal</Text>
            </View>
            <View style={styles.statCard}>
              <View style={styles.statIconWrap}>
                <Ionicons name="time-outline" size={18} color={COLORS.accentCool} />
              </View>
              <Text style={styles.statValue}>{totalTime}m</Text>
              <Text style={styles.statLabel}>Cook Time</Text>
            </View>
          </Animated.View>

          <Text style={styles.sectionSubtitle}>UPCOMING MEALS</Text>
          
          {meals.map((meal, index) => {
            const recipe = getRecipeById(meal.recipeId);
            if (!recipe) return null;

            return (
              <Animated.View
                key={meal.id}
                entering={FadeInRight.delay(200 + index * 80).duration(500)}
                style={styles.mealCard}
              >
                <Link href={`/recipe/${meal.recipeId}`} asChild>
                  <Pressable style={styles.mealInner}>
                    {/* Image with subtle gradient */}
                    <View style={styles.mealImageWrap}>
                      <Image
                        source={RecipeImages[meal.recipeId]}
                        style={styles.mealImage}
                        contentFit="cover"
                      />
                    </View>

                    <View style={styles.mealInfo}>
                      <Text style={styles.mealTitle} numberOfLines={1}>
                        {recipe.title}
                      </Text>
                      <View style={styles.mealMeta}>
                        <View style={styles.metaChip}>
                          <Ionicons
                            name="people"
                            size={12}
                            color={COLORS.primary}
                          />
                          <Text style={styles.metaChipText}>
                            {meal.servings}{" "}
                            {meal.servings === 1 ? "person" : "people"}
                          </Text>
                        </View>
                        <View style={styles.proportionChip}>
                          <Text style={styles.proportionText}>
                            ×{(meal.servings / recipe.metadata.servings).toFixed(1)}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <Pressable
                      style={styles.removeBtn}
                      onPress={(e) => {
                        e.stopPropagation();
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        removeFromMealPlan(meal.id);
                      }}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Ionicons
                        name="close"
                        size={16}
                        color={COLORS.textMuted}
                      />
                    </Pressable>
                  </Pressable>
                </Link>

                {/* Cook Button */}
                <View style={styles.cardActions}>
                  <Pressable
                    style={styles.startCookingBtn}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      router.push({
                        pathname: "/cooking/[id]",
                        params: { id: meal.recipeId, servings: meal.servings },
                      });
                    }}
                  >
                    <LinearGradient
                      colors={[COLORS.primary, COLORS.primaryDark]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.cookBtnGradient}
                    >
                      <Ionicons name="play" size={14} color="#1A0E04" />
                      <Text style={styles.startCookingText}>Start Cooking</Text>
                    </LinearGradient>
                  </Pressable>
                </View>
              </Animated.View>
            );
          })}
          <View style={styles.footerSpacer} />
        </ScrollView>
      ) : (
        <EmptyState
          icon="flame-outline"
          title="Your Kitchen is Empty"
          description="Browse recipes and add them to your meal plan to start your culinary adventure."
          actionLabel="Find Recipes"
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
  scrollContent: {
    paddingTop: SPACING.s,
  },
  // Stats
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: SPACING.m,
    gap: SPACING.s,
    marginBottom: SPACING.l,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.l,
    padding: SPACING.m,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.elevated,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.s,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    fontFamily: FONTS.mono,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.textMuted,
    marginTop: 2,
    letterSpacing: 0.3,
  },
  sectionSubtitle: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.textMuted,
    letterSpacing: 2,
    marginBottom: SPACING.m,
    paddingHorizontal: SPACING.m,
    fontFamily: FONTS.mono,
  },
  // Meal cards
  mealCard: {
    marginHorizontal: SPACING.m,
    marginBottom: SPACING.m,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.l,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  mealInner: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.s + 2,
  },
  mealImageWrap: {
    width: 70,
    height: 70,
    borderRadius: RADIUS.m,
    overflow: "hidden",
  },
  mealImage: {
    width: "100%",
    height: "100%",
  },
  mealInfo: {
    flex: 1,
    paddingHorizontal: SPACING.m,
  },
  mealTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  mealMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.s,
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaChipText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  proportionChip: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
  },
  proportionText: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.primary,
    fontFamily: FONTS.mono,
  },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.elevated,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardActions: {
    paddingHorizontal: SPACING.s + 2,
    paddingBottom: SPACING.s + 2,
  },
  startCookingBtn: {
    borderRadius: RADIUS.m,
    overflow: "hidden",
  },
  cookBtnGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.s + 2,
    gap: 6,
  },
  startCookingText: {
    color: "#1A0E04",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  footerSpacer: {
    height: 120,
  },
});

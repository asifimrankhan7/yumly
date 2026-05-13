import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { COLORS, RADIUS, SHADOWS, SPACING, FONTS } from "../../constants/theme";
import { RecipeImages } from "../../constants/recipe-images";
import { useFavorites } from "../../context/FavoritesContext";
import { Recipe } from "../../types";
import * as Haptics from "expo-haptics";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - SPACING.m * 3) / 2;

export type RecipeSummary = Pick<Recipe, "id" | "title" | "isVeg"> & {
  images: { thumbnail: string };
  metadata: { prepTimeMinutes: number; difficulty: string; calories: number };
};

const DifficultyBadge = ({ difficulty }: { difficulty: string }) => {
  const getColor = () => {
    switch (difficulty) {
      case "Easy": return COLORS.secondary;
      case "Medium": return COLORS.primary;
      case "Hard": return COLORS.error;
      default: return COLORS.textMuted;
    }
  };
  const color = getColor();
  return (
    <View style={[styles.difficultyBadge, { backgroundColor: `${color}18` }]}>
      <View style={[styles.difficultyDot, { backgroundColor: color }]} />
      <Text style={[styles.difficultyText, { color }]}>{difficulty}</Text>
    </View>
  );
};

const VegIndicator = ({ isVeg }: { isVeg: boolean }) => {
  const color = isVeg ? COLORS.veg : COLORS.nonVeg;
  return (
    <View style={[styles.vegContainer, { borderColor: color }]}>
      <View style={[styles.vegDot, { backgroundColor: color }]} />
    </View>
  );
};

const RecipeCard = React.memo(
  ({
    recipe,
    index,
    horizontal = false,
    containerStyle = {},
  }: {
    recipe: RecipeSummary;
    index: number;
    horizontal?: boolean;
    containerStyle?: any;
  }) => {
    const { toggleFavorite, isFavorite } = useFavorites();
    const favorited = isFavorite(recipe.id);

    return (
      <Link href={`/recipe/${recipe.id}`} asChild>
        <Pressable style={StyleSheet.flatten([styles.container, containerStyle])}>
          <Animated.View
            entering={FadeInDown.delay(index * 80).duration(500).springify()}
            style={styles.inner}
          >
            {/* Image */}
            <View style={styles.imageContainer}>
              <Image
                source={RecipeImages[recipe.id]}
                style={styles.image}
                contentFit="cover"
                transition={400}
              />
              {/* Gradient overlay for readability */}
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.6)"]}
                style={styles.imageGradient}
              />
              
              {/* Veg indicator */}
              <VegIndicator isVeg={recipe.isVeg} />

              {/* Favorite Button */}
              <Pressable
                style={styles.favoriteButton}
                onPress={(e) => {
                  e.stopPropagation();
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  toggleFavorite(recipe.id);
                }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name={favorited ? "heart" : "heart-outline"}
                  size={18}
                  color={favorited ? COLORS.error : "rgba(255,255,255,0.85)"}
                />
              </Pressable>

              {/* Time badge on image */}
              <View style={styles.timeBadge}>
                <Ionicons name="time-outline" size={11} color={COLORS.text} />
                <Text style={styles.timeBadgeText}>
                  {recipe.metadata.prepTimeMinutes}m
                </Text>
              </View>
            </View>

            {/* Content */}
            <View style={styles.content}>
              <Text style={styles.title} numberOfLines={1}>
                {recipe.title}
              </Text>
              <View style={styles.footer}>
                <DifficultyBadge difficulty={recipe.metadata.difficulty} />
                {!horizontal && (
                  <Text style={styles.calories}>
                    {recipe.metadata.calories} cal
                  </Text>
                )}
              </View>
            </View>
          </Animated.View>
        </Pressable>
      </Link>
    );
  }
);

RecipeCard.displayName = "RecipeCard";

export default RecipeCard;

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginBottom: SPACING.m,
  },
  inner: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.l,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 0.95,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "40%",
  },
  favoriteButton: {
    position: "absolute",
    top: SPACING.s,
    right: SPACING.s,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  timeBadge: {
    position: "absolute",
    bottom: SPACING.s,
    right: SPACING.s,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.s,
    gap: 3,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  timeBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.text,
    fontFamily: FONTS.mono,
  },
  content: {
    padding: SPACING.s + 2,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    lineHeight: 18,
    marginBottom: SPACING.xs + 2,
    letterSpacing: -0.2,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  difficultyBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  difficultyDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  calories: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.textMuted,
    fontFamily: FONTS.mono,
  },
  vegContainer: {
    position: "absolute",
    bottom: SPACING.s,
    left: SPACING.s,
    width: 14,
    height: 14,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3,
  },
  vegDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

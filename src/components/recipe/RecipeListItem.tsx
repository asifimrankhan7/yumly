import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { Link } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { RecipeImages } from "../../constants/recipe-images";
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from "../../constants/theme";
import { useFavorites } from "../../context/FavoritesContext";
import { RecipeSummary } from "./RecipeCard";

const RecipeListItem = React.memo(
  ({
    recipe,
    index,
  }: {
    recipe: RecipeSummary;
    index: number;
  }) => {
    const { toggleFavorite, isFavorite } = useFavorites();
    const favorited = isFavorite(recipe.id);

    return (
      <Link href={`/recipe/${recipe.id}`} asChild>
        <Pressable style={styles.container}>
          <Animated.View
            entering={FadeInDown.delay(index * 50).duration(400).springify()}
            style={styles.inner}
          >
            {/* Thumbnail */}
            <View style={styles.thumbnailContainer}>
              <Image
                source={RecipeImages[recipe.id]}
                style={styles.thumbnail}
                contentFit="cover"
                transition={300}
              />
              {/* Veg indicator */}
              <View
                style={[
                  styles.vegDot,
                  {
                    backgroundColor: recipe.isVeg
                      ? COLORS.veg
                      : COLORS.nonVeg,
                  },
                ]}
              />
            </View>

            {/* Content */}
            <View style={styles.content}>
              <View style={styles.textContainer}>
                <Text style={styles.title} numberOfLines={1}>
                  {recipe.title}
                </Text>
                <View style={styles.stats}>
                  <View style={styles.statItem}>
                    <Ionicons
                      name="time-outline"
                      size={13}
                      color={COLORS.primary}
                    />
                    <Text style={styles.statText}>
                      {recipe.metadata.prepTimeMinutes} min
                    </Text>
                  </View>
                  <View style={styles.dot} />
                  <View style={styles.statItem}>
                    <Text style={styles.difficultyPill}>
                      {recipe.metadata.difficulty}
                    </Text>
                  </View>
                </View>
              </View>

              <Pressable
                style={[
                  styles.favoriteButton,
                  favorited && styles.favoriteButtonActive,
                ]}
                onPress={(e) => {
                  e.stopPropagation();
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  toggleFavorite(recipe.id);
                }}
              >
                <Ionicons
                  name={favorited ? "heart" : "heart-outline"}
                  size={18}
                  color={favorited ? COLORS.error : COLORS.textMuted}
                />
              </Pressable>
            </View>
          </Animated.View>
        </Pressable>
      </Link>
    );
  }
);

RecipeListItem.displayName = "RecipeListItem";

export default RecipeListItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.l,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  inner: {
    flexDirection: "row",
    padding: SPACING.s + 2,
    alignItems: "center",
  },
  thumbnailContainer: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.m,
    overflow: "hidden",
    position: "relative",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  vegDot: {
    position: "absolute",
    bottom: 4,
    left: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.3)",
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: SPACING.m,
  },
  textContainer: {
    flex: 1,
    marginRight: SPACING.s,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: FONTS.mono,
    fontWeight: "500",
  },
  difficultyPill: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    overflow: "hidden",
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.textMuted,
    marginHorizontal: SPACING.s,
  },
  favoriteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.elevated,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  favoriteButtonActive: {
    backgroundColor: "rgba(232, 93, 93, 0.1)",
    borderColor: "rgba(232, 93, 93, 0.2)",
  },
});

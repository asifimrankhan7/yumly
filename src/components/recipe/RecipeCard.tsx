import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link } from "expo-router";
import React from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { COLORS, RADIUS, SHADOWS, SPACING } from "../../constants/theme";
import { RecipeImages } from "../../constants/recipe-images";
import { useFavorites } from "../../context/FavoritesContext";
import { Recipe } from "../../types";
import * as Haptics from "expo-haptics";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - SPACING.m * 3) / 2;

export type RecipeSummary = Pick<Recipe, "id" | "title" | "isVeg"> & {
  images: { thumbnail: string };
  metadata: { prepTimeMinutes: number; difficulty: string };
};

const VegIndicator = ({ isVeg }: { isVeg: boolean }) => {
  const color = isVeg ? "#24963F" : "#AF3333";
  return (
    <View style={[styles.vegContainer, { borderColor: color }]}>
       <View style={[styles.vegDot, { backgroundColor: color }]} />
    </View>
  );
};

const RecipeCard = React.memo(({
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
          entering={FadeInDown.delay(index * 100).duration(500)}
          style={styles.inner}
        >
          <View style={styles.imageContainer}>
            <Image
              source={RecipeImages[recipe.id]}
              style={styles.image}
              contentFit="cover"
              transition={300}
            />
            <VegIndicator isVeg={recipe.isVeg} />
            <Pressable 
              style={styles.favoriteButton}
              onPress={(e) => {
                e.stopPropagation();
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                toggleFavorite(recipe.id);
              }}
            >
              <Ionicons 
                name={favorited ? "heart" : "heart-outline"} 
                size={22} 
                color={favorited ? "#FF3B30" : "white"} 
              />
            </Pressable>
          </View>

          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={1}>{recipe.title}</Text>
            <View style={styles.footer}>
              <View style={styles.stat}>
                <Ionicons name="time-outline" size={14} color={COLORS.textLight} />
                <Text style={styles.statText}>{recipe.metadata.prepTimeMinutes}m</Text>
              </View>
              <View style={styles.dot} />
              <View style={styles.stat}>
                <Ionicons name="stats-chart-outline" size={14} color={COLORS.textLight} />
                <Text style={styles.statText}>{recipe.metadata.difficulty}</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </Link>
  );
});

RecipeCard.displayName = "RecipeCard";

export default RecipeCard;

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.l,
    marginBottom: SPACING.m,
    ...SHADOWS.small,
    overflow: "hidden",
  },
  inner: {
    flex: 1,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  favoriteButton: {
    position: "absolute",
    top: SPACING.s,
    right: SPACING.s,
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: SPACING.xs + 2,
    borderRadius: 100,
  },
  content: {
    padding: SPACING.s + 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: SPACING.xs,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginLeft: 4,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.textLight,
    marginHorizontal: SPACING.s,
    opacity: 0.3,
  },
  vegContainer: {
    position: "absolute",
    bottom: SPACING.s,
    left: SPACING.s,
    width: 12,
    height: 12,
    backgroundColor: "white",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
    padding: 1,
  },
  vegDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

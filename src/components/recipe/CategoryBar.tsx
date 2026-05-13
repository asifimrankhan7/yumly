import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";

const CATEGORY_EMOJIS: { [key: string]: string } = {
  "All": "✨",
  "Breakfast": "🌅",
  "Snacks": "🍿",
  "Main Course": "🍛",
  "Desserts": "🍰",
  "Italian": "🇮🇹",
  "Mexican": "🌮",
  "Chinese": "🥡",
};

interface CategoryBarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryBar({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryBarProps) {
  const handleSelect = (category: string) => {
    if (category !== selectedCategory) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onSelectCategory(category);
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category, index) => {
        const isActive = category === selectedCategory;
        const emoji = CATEGORY_EMOJIS[category] || "🍽️";

        return (
          <Animated.View
            key={category}
            entering={FadeIn.delay(index * 50).duration(400)}
          >
            <Pressable
              onPress={() => handleSelect(category)}
              style={StyleSheet.flatten([styles.pill, isActive && styles.pillActive])}
            >
              <Text style={styles.emoji}>{emoji}</Text>
              <Text
                style={StyleSheet.flatten([styles.pillText, isActive && styles.pillTextActive])}
              >
                {category}
              </Text>
            </Pressable>
          </Animated.View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    gap: SPACING.s,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s + 2,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  pillActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.borderAccent,
  },
  emoji: {
    fontSize: 14,
  },
  pillText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textMuted,
    letterSpacing: 0.2,
  },
  pillTextActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },
});

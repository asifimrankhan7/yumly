import React from "react";
import { ScrollView, Text, StyleSheet, Pressable } from "react-native";
import { COLORS, SPACING, RADIUS } from "../../constants/theme";
import * as Haptics from "expo-haptics";

interface CategoryBarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryBar({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
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
      {categories.map((category) => {
        const isActive = category === selectedCategory;
        return (
          <Pressable
            key={category}
            onPress={() => handleSelect(category)}
            style={[
              styles.pill,
              isActive && styles.pillActive
            ]}
          >
            <Text style={[
              styles.pillText,
              isActive && styles.pillTextActive
            ]}>
              {category}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.m,
    gap: SPACING.s,
  },
  pill: {
    paddingHorizontal: SPACING.m + 4,
    paddingVertical: SPACING.s + 2,
    borderRadius: RADIUS.xl,
    backgroundColor: "#F2F1ED", // Soft light gray/cream for inactive
  },
  pillActive: {
    backgroundColor: COLORS.primary, // Brown highlight
  },
  pillText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textLight,
  },
  pillTextActive: {
    color: "white",
  },
});

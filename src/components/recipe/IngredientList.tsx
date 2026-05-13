import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { COLORS, SPACING, RADIUS, FONTS } from "../../constants/theme";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";

import { Ingredient } from "../../types";

interface Props {
  ingredients: Ingredient[];
  initialServings: number;
  currentServings?: number;
}

export default function IngredientList({
  ingredients,
  initialServings,
  currentServings,
}: Props) {
  const [servings, setServings] = useState(currentServings || initialServings);

  const scale = servings / initialServings;

  const getEmojiForIngredient = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("pasta")) return "🍝";
    if (n.includes("tomato")) return "🍅";
    if (n.includes("garlic")) return "🧄";
    if (n.includes("cream")) return "🥛";
    if (n.includes("basil")) return "🌿";
    if (n.includes("egg")) return "🍳";
    if (n.includes("tuna")) return "🐟";
    if (n.includes("rice")) return "🍚";
    if (n.includes("bread")) return "🍞";
    if (n.includes("avocado")) return "🥑";
    if (n.includes("beef")) return "🥩";
    if (n.includes("chicken")) return "🍗";
    if (n.includes("onion")) return "🧅";
    if (n.includes("paneer")) return "🧀";
    if (n.includes("butter")) return "🧈";
    if (n.includes("oil")) return "🫒";
    if (n.includes("salt")) return "🧂";
    if (n.includes("sugar")) return "🍬";
    if (n.includes("lentil") || n.includes("dal")) return "🫘";
    if (n.includes("spinach") || n.includes("palak")) return "🥬";
    if (n.includes("potato") || n.includes("aloo")) return "🥔";
    if (n.includes("chilli") || n.includes("pepper")) return "🌶️";
    if (n.includes("ginger")) return "🫚";
    if (n.includes("flour")) return "🌾";
    if (n.includes("milk")) return "🥛";
    if (n.includes("chocolate")) return "🍫";
    return "🥣";
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.sectionLabel}>WHAT YOU NEED</Text>
          <Text style={styles.title}>Ingredients</Text>
        </View>
        <View style={styles.servingsControl}>
          <Pressable
            onPress={() => setServings(Math.max(1, servings - 1))}
            style={styles.controlBtn}
          >
            <Ionicons name="remove" size={16} color={COLORS.text} />
          </Pressable>
          <Text style={styles.servingsText}>{servings}</Text>
          <Pressable
            onPress={() => setServings(servings + 1)}
            style={styles.controlBtn}
          >
            <Ionicons name="add" size={16} color={COLORS.text} />
          </Pressable>
        </View>
      </View>

      <View style={styles.list}>
        {ingredients.map((item, index) => (
          <Animated.View
            key={index}
            entering={FadeInDown.delay(index * 30).duration(300)}
            style={styles.ingredientRow}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.emoji}>
                {getEmojiForIngredient(item.name)}
              </Text>
            </View>
            <View style={styles.details}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.quantity}>
                {(item.quantity * scale).toFixed(
                  item.quantity % 1 === 0 ? 0 : 1
                )}{" "}
                {item.unit}
              </Text>
            </View>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.l,
    paddingHorizontal: SPACING.m,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: SPACING.m,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.primary,
    letterSpacing: 2,
    marginBottom: 4,
    fontFamily: FONTS.mono,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    fontFamily: FONTS.serif,
  },
  servingsControl: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.elevated,
    borderRadius: RADIUS.m,
    padding: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  controlBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: COLORS.bg3,
    alignItems: "center",
    justifyContent: "center",
  },
  servingsText: {
    marginHorizontal: SPACING.m,
    fontWeight: "800",
    color: COLORS.text,
    fontSize: 15,
    fontFamily: FONTS.mono,
  },
  list: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  ingredientRow: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.s + 2,
    backgroundColor: COLORS.card,
    padding: SPACING.s + 2,
    borderRadius: RADIUS.m,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.elevated,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.s,
  },
  emoji: {
    fontSize: 16,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 2,
  },
  quantity: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textMuted,
    fontFamily: FONTS.mono,
  },
});

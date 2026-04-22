import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { COLORS, SPACING, RADIUS } from "../../constants/theme";
import { Ionicons } from "@expo/vector-icons";

import { Ingredient } from "../../types";

interface Props {
  ingredients: Ingredient[];
  initialServings: number;
}

export default function IngredientList({ ingredients, initialServings }: Props) {
  const [servings, setServings] = useState(initialServings);

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
    return "🥣";
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ingredients</Text>
        <View style={styles.servingsControl}>
          <Pressable 
            onPress={() => setServings(Math.max(1, servings - 1))}
            style={styles.controlBtn}
          >
            <Ionicons name="remove" size={18} color={COLORS.text} />
          </Pressable>
          <Text style={styles.servingsText}>{servings} servings</Text>
          <Pressable 
            onPress={() => setServings(servings + 1)}
            style={styles.controlBtn}
          >
            <Ionicons name="add" size={18} color={COLORS.text} />
          </Pressable>
        </View>
      </View>

      <View style={styles.list}>
        {ingredients.map((item, index) => (
          <View key={index} style={styles.ingredientRow}>
            <View style={styles.iconContainer}>
              <Text style={styles.emoji}>{getEmojiForIngredient(item.name)}</Text>
            </View>
            <View style={styles.details}>
              <Text style={styles.quantity}>
                {(item.quantity * scale).toFixed(item.quantity % 1 === 0 ? 0 : 1)} {item.unit}
              </Text>
              <Text style={styles.name}>{item.name}</Text>
            </View>
          </View>
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
    alignItems: "center",
    marginBottom: SPACING.m,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },
  servingsControl: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: RADIUS.m,
    padding: SPACING.xs,
  },
  controlBtn: {
    padding: SPACING.xs,
  },
  servingsText: {
    marginHorizontal: SPACING.s,
    fontWeight: "600",
    color: COLORS.text,
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
    marginBottom: SPACING.m,
    backgroundColor: COLORS.card,
    padding: SPACING.s,
    borderRadius: RADIUS.m,
  },
  iconContainer: {
    backgroundColor: "#F0F0F0",
    padding: SPACING.s,
    borderRadius: RADIUS.s,
    marginRight: SPACING.s,
  },
  emoji: {
    fontSize: 18,
  },
  details: {
    flex: 1,
  },
  quantity: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.text,
  },
  name: {
    fontSize: 12,
    color: COLORS.textLight,
  },
});

import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, RADIUS, FONTS } from "../../constants/theme";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <Animated.View
      entering={FadeIn.duration(600)}
      style={styles.container}
    >
      <Animated.View
        entering={FadeInUp.delay(200).duration(500).springify()}
        style={styles.iconCircle}
      >
        <View style={styles.iconInner}>
          <Ionicons name={icon} size={40} color={COLORS.primary} />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(300).duration(500)}>
        <Text style={styles.title}>{title}</Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(400).duration(500)}>
        <Text style={styles.description}>{description}</Text>
      </Animated.View>

      {actionLabel && onAction && (
        <Animated.View entering={FadeInUp.delay(500).duration(500)}>
          <Pressable style={styles.actionBtn} onPress={onAction}>
            <Text style={styles.actionText}>{actionLabel}</Text>
            <Ionicons name="arrow-forward" size={16} color={COLORS.text} />
          </Pressable>
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.xl,
    marginTop: 40,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.elevated,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.l,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: SPACING.s,
    fontFamily: FONTS.serif,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.m,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.m,
    borderRadius: RADIUS.l,
    gap: SPACING.s,
  },
  actionText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "700",
  },
});

import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, RADIUS } from "../../constants/theme";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export default function SearchBar({ value, onChangeText }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={20} color={COLORS.textLight} />
      <TextInput 
        placeholder="Search over 100+ recipes"
        placeholderTextColor={COLORS.textLight}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.05)",
    marginHorizontal: SPACING.m,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s + 2,
    borderRadius: RADIUS.xl,
    marginVertical: SPACING.l,
  },
  input: {
    flex: 1,
    marginLeft: SPACING.s,
    fontSize: 14,
    color: COLORS.text,
  },
});

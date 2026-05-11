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
        placeholder="Search 200+ delicious recipes..."
        placeholderTextColor={COLORS.textLight}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <View style={styles.clearButton}>
          <Ionicons 
            name="close-circle" 
            size={18} 
            color={COLORS.textLight} 
            onPress={() => onChangeText("")}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.bg3,
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
    paddingVertical: 8,
  },
  clearButton: {
    padding: SPACING.xs,
  },
});

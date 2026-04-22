import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  Pressable, 
  FlatList 
} from "react-native";
import { COLORS, SPACING, RADIUS, SHADOWS } from "../../constants/theme";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

interface Props {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

export default function PreferenceModal({
  visible,
  onClose,
  title,
  options,
  selectedValue,
  onSelect,
}: Props) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </Pressable>
          </View>

          <FlatList
            data={options}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable 
                style={[
                  styles.option,
                  item === selectedValue && styles.optionSelected
                ]}
                onPress={() => {
                  Haptics.selectionAsync();
                  onSelect(item);
                  onClose();
                }}
              >
                <Text style={[
                  styles.optionText,
                  item === selectedValue && styles.optionTextSelected
                ]}>{item}</Text>
                {item === selectedValue && (
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                )}
              </Pressable>
            )}
            style={styles.list}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: "white",
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.l,
    maxHeight: "70%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.l,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },
  closeBtn: {
    padding: SPACING.xs,
  },
  list: {
    marginBottom: SPACING.xl,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.m,
    borderRadius: RADIUS.m,
    marginBottom: SPACING.s,
    backgroundColor: "#F9F9F9",
  },
  optionSelected: {
    backgroundColor: "rgba(156, 90, 60, 0.05)",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "500",
  },
  optionTextSelected: {
    color: COLORS.primary,
    fontWeight: "700",
  },
});

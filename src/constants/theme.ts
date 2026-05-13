import { Platform } from "react-native";

export const COLORS = {
  // Core palette - Warm earth tones
  primary: "#E8A838",
  primaryDark: "#D4654A",
  primaryLight: "rgba(232, 168, 56, 0.12)",
  primaryGlow: "rgba(232, 168, 56, 0.25)",
  secondary: "#8BA888",
  secondaryLight: "rgba(139, 168, 136, 0.12)",

  // Backgrounds
  background: "#0D0D0F",
  surface: "#161618",
  card: "#1A1A1D",
  elevated: "#1E1D22",
  bg3: "#242428",
  glass: "rgba(255, 255, 255, 0.03)",

  // Text
  text: "#F5F0EB",
  textSecondary: "#8A8690",
  textLight: "#8A8690",
  textMuted: "#5A5660",
  text2: "#8A8690",
  text3: "#5A5660",

  // Accents
  accent: "#E8A838",
  accentWarm: "#D4654A",
  accentCool: "#6B8EBF",

  // Borders
  border: "rgba(245, 240, 235, 0.06)",
  borderLight: "rgba(245, 240, 235, 0.1)",
  borderAccent: "rgba(232, 168, 56, 0.2)",

  // Semantic
  success: "#8BA888",
  error: "#E85D5D",
  warning: "#E8A838",
  veg: "#8BA888",
  nonVeg: "#E85D5D",
  info: "#6B8EBF",

  // Legacy aliases (for backwards compat)
  bg: "#0D0D0F",
};

export const SPACING = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  xs: 6,
  s: 10,
  m: 14,
  l: 20,
  xl: 28,
  xxl: 36,
  full: 100,
};

export const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 6,
  },
  large: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  glow: {
    shadowColor: "#E8A838",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const FONTS = {
  serif: Platform.OS === "ios" ? "Georgia" : "serif",
  mono: Platform.OS === "ios" ? "Menlo" : "monospace",
};

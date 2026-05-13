import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming
} from "react-native-reanimated";
import { COLORS, FONTS, RADIUS } from "../src/constants/theme";
import { useUser } from "../src/context/UserContext";

const { width } = Dimensions.get("window");

// --- Sub-components ---

const FloatingOrb = ({
  style,
  delay = 0,
}: {
  style: any;
  delay?: number;
}) => {
  const floatX = useSharedValue(0);
  const floatY = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    floatX.value = withDelay(
      delay,
      withRepeat(
        withTiming(20, {
          duration: 8000,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      )
    );
    floatY.value = withDelay(
      delay,
      withRepeat(
        withTiming(-30, {
          duration: 8000,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      )
    );
    scale.value = withDelay(
      delay,
      withRepeat(
        withTiming(1.1, {
          duration: 8000,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      )
    );
  }, [delay, floatX, floatY, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: floatX.value },
      { translateY: floatY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View style={[styles.orb, style, animatedStyle]}>
      <LinearGradient
        colors={[style.backgroundColor, "transparent"]}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
};

const Particle = ({ delay = 0 }: { delay?: number }) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);
  const top = Math.random() * 100;
  const left = Math.random() * 100;

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(withTiming(0.5, { duration: 2000 }), -1, true)
    );
    scale.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration: 2000 }), -1, true)
    );
  }, [delay, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
    position: "absolute",
    top: `${top}%`,
    left: `${left}%`,
  }));

  return <Animated.View style={[styles.particle, animatedStyle]} />;
};

// --- Main Screen ---

export default function OnboardingScreen() {
  const router = useRouter();
  const {
    onboardingComplete,
    setName: setGlobalName,
    setOnboardingComplete,
    isLoading: isUserLoading,
  } = useUser();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Transitions
  const screenOpacity = useSharedValue(1);
  const screenTranslateX = useSharedValue(0);

  useEffect(() => {
    if (!isUserLoading && onboardingComplete) {
      router.replace("/(tabs)");
    }
  }, [onboardingComplete, isUserLoading, router]);

  const switchStep = useCallback(
    (nextStep: number) => {
      screenOpacity.value = withTiming(0, { duration: 300 }, () => {
        screenTranslateX.value = 50;
        setStep(nextStep);
        screenTranslateX.value = withTiming(0, { duration: 400 });
        screenOpacity.value = withTiming(1, { duration: 400 });
      });
    },
    [screenOpacity, screenTranslateX]
  );

  const handleNextStep = () => {
    if (step === 1) switchStep(2);
    else if (step === 2 && name.length >= 2) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setGlobalName(name);
        switchStep(3);
      }, 1200);
    }
  };

  const handleExplore = () => {
    setOnboardingComplete(true);
    router.replace("/(tabs)");
  };

  const animatedScreenStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
    transform: [{ translateX: screenTranslateX.value }],
  }));

  if (isUserLoading)
    return (
      <View
        style={[styles.container, { backgroundColor: COLORS.background }]}
      />
    );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background Orbs */}
      {(step === 1 || step === 3) && (
        <View style={StyleSheet.absoluteFill}>
          <FloatingOrb
            style={{
              ...styles.orb1,
              backgroundColor: "rgba(232,168,56,0.1)",
            }}
          />
          <FloatingOrb
            style={{
              ...styles.orb2,
              backgroundColor: "rgba(212,101,74,0.06)",
            }}
            delay={3000}
          />
          <FloatingOrb
            style={{
              ...styles.orb3,
              backgroundColor: "rgba(232,168,56,0.04)",
            }}
            delay={5000}
          />
          <View style={styles.particlesContainer}>
            {[...Array(12)].map((_, i) => (
              <Particle key={i} delay={i * 300} />
            ))}
          </View>
        </View>
      )}

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/LOGO1.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      <Animated.View style={[styles.screenWrapper, animatedScreenStyle]}>
        {step === 1 && <StepOne onNext={handleNextStep} />}
        {step === 2 && (
          <StepTwo
            name={name}
            setName={setName}
            onNext={handleNextStep}
            isLoading={isLoading}
          />
        )}
        {step === 3 && (
          <StepThree name={name} onExplore={handleExplore} />
        )}
      </Animated.View>
    </View>
  );
}

// --- Step Views ---

const StepOne = ({ onNext }: { onNext: () => void }) => {
  const rotate = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    rotate.value = withRepeat(
      withTiming(360, { duration: 20000, easing: Easing.linear }),
      -1,
      false
    );
    pulse.value = withRepeat(
      withTiming(1.03, {
        duration: 4000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, [pulse, rotate]);

  const plateAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const ringAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  const reverseRingStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${-rotate.value * 0.6}deg` }],
  }));

  return (
    <View style={styles.stepContent}>
      {/* Hero */}
      <View style={styles.heroArea}>
        <View style={styles.plateWrap}>
          <Animated.View style={[styles.plateRing2, reverseRingStyle]} />
          <Animated.View style={[styles.plateRing, ringAnimatedStyle]}>
            <View style={styles.ringDot} />
          </Animated.View>
          <Animated.View style={[styles.plateCircle, plateAnimatedStyle]}>
            <Text style={{ fontSize: 72 }}>🍳</Text>
            <View style={[styles.orbitBadge, styles.badge1]}>
              <View style={styles.badgeDot} />
              <Text style={styles.badgeText}>200+ recipes</Text>
            </View>
            <View style={[styles.orbitBadge, styles.badge2]}>
              <View style={styles.badgeDot} />
              <Text style={styles.badgeText}>Step-by-step</Text>
            </View>
          </Animated.View>
        </View>
      </View>

      {/* Bottom Content */}
      <View style={styles.bottomContent}>
        <View style={styles.slideDots}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
        <Text style={styles.headline}>
          Cook with{" "}
          <Text style={styles.accentText}>passion,</Text>
          {"\n"}eat with joy.
        </Text>
        <Text style={styles.subheadline}>
          Discover hundreds of recipes with guided cooking, timers, and smart
          meal planning.
        </Text>

        <TouchableOpacity
          style={styles.mainBtn}
          onPress={onNext}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBtn}
          >
            <Text style={styles.mainBtnText}>Get Started</Text>
            <View style={styles.btnArrow}>
              <Ionicons name="arrow-forward" size={16} color="#1A0E04" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.signinRow}>
          <Text style={styles.signinText}>Already have an account? </Text>
          <TouchableOpacity>
            <Text style={styles.signinLink}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const StepTwo = ({
  name,
  setName,
  onNext,
  isLoading,
}: {
  name: string;
  setName: (name: string) => void;
  onNext: () => void;
  isLoading: boolean;
}) => {
  return (
    <View style={styles.stepContent}>
      <View style={styles.s2Top}>
        <LinearGradient
          colors={[COLORS.surface, COLORS.background]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.welcomeIconWrap}>
          <View style={styles.welcomeBowl}>
            <Text style={{ fontSize: 44 }}>👨‍🍳</Text>
          </View>
        </View>
      </View>

      <View style={styles.s2Content}>
        <Text style={styles.s2Label}>QUICK SETUP</Text>
        <Text style={styles.s2Title}>
          What should{"\n"}we call you?
        </Text>
        <Text style={styles.s2Sub}>
          We{"'"}ll personalize your entire food journey around your
          preferences.
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>YOUR FIRST NAME</Text>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.nameInput}
              placeholder="e.g. Alex, Priya, Marco..."
              placeholderTextColor={COLORS.textMuted}
              value={name}
              onChangeText={setName}
              autoFocus
              selectionColor={COLORS.primary}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.continueBtn,
            (name.length < 2 || isLoading) && styles.btnDisabled,
          ]}
          onPress={onNext}
          disabled={name.length < 2 || isLoading}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark]}
            style={styles.gradientBtn}
          >
            {isLoading ? (
              <View style={styles.loadingDots}>
                <View style={styles.loadingDot} />
                <View style={styles.loadingDot} />
                <View style={styles.loadingDot} />
              </View>
            ) : (
              <Text style={styles.mainBtnText}>Let{"'"}s Cook →</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const StepThree = ({
  name,
  onExplore,
}: {
  name: string;
  onExplore: () => void;
}) => {
  const capName = name.charAt(0).toUpperCase() + name.slice(1);

  return (
    <View style={styles.stepContent}>
      <View style={styles.welcomeAnim}>
        <View style={styles.wPlate}>
          <Text style={{ fontSize: 52 }}>🍽️</Text>
        </View>
        <View style={styles.checkmark}>
          <Ionicons name="checkmark" size={18} color="#1A0E04" />
        </View>
      </View>

      <Text style={styles.welcomeName}>
        Welcome,{"\n"}
        <Text style={styles.accentText}>{capName || "Chef"}!</Text>
      </Text>
      <Text style={styles.welcomeTagline}>
        Your culinary journey begins now. Discover, cook, and savour every
        moment.
      </Text>

      <View style={styles.featureGrid}>
        <FeatureCard
          emoji="🔍"
          title="Explore Recipes"
          desc="200+ curated dishes"
        />
        <FeatureCard
          emoji="🍳"
          title="Guided Cooking"
          desc="Step-by-step mode"
        />
        <FeatureCard
          emoji="🥗"
          title="Meal Planner"
          desc="Plan your meals"
        />
        <FeatureCard
          emoji="⏱️"
          title="Smart Timers"
          desc="Built-in timers"
        />
      </View>

      <TouchableOpacity
        style={styles.exploreBtn}
        onPress={onExplore}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          style={styles.gradientBtn}
        >
          <Text style={styles.mainBtnText}>Explore Yumly</Text>
          <Ionicons name="arrow-forward" size={18} color="#1A0E04" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const FeatureCard = ({
  emoji,
  title,
  desc,
}: {
  emoji: string;
  title: string;
  desc: string;
}) => (
  <View style={styles.featCard}>
    <Text style={styles.featEmoji}>{emoji}</Text>
    <Text style={styles.featTitle}>{title}</Text>
    <Text style={styles.featDesc}>{desc}</Text>
  </View>
);

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  screenWrapper: {
    flex: 1,
  },
  stepContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  // Background
  orb: {
    position: "absolute",
    borderRadius: 150,
  },
  orb1: { width: 300, height: 300, top: -80, left: -60 },
  orb2: { width: 250, height: 250, bottom: 120, right: -80 },
  orb3: { width: 200, height: 200, top: "40%", left: "30%" },
  particlesContainer: { ...StyleSheet.absoluteFillObject },
  particle: {
    width: 2,
    height: 2,
    backgroundColor: COLORS.primary,
    borderRadius: 1,
  },
  // Step 1
  logoContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 40,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    zIndex: 10,
  },
  logoImage: {
    width: width * 0.4,
    height: 45,
  },
  heroArea: {
    height: 380,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  plateWrap: {
    width: 220,
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  plateRing: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 1,
    borderColor: "rgba(232,168,56,0.12)",
  },
  plateRing2: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 1,
    borderColor: "rgba(232,168,56,0.05)",
    borderStyle: "dashed",
  },
  ringDot: {
    position: "absolute",
    top: -4,
    left: "50%",
    width: 8,
    height: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 4,
    shadowColor: COLORS.primary,
    shadowRadius: 10,
    shadowOpacity: 1,
  },
  plateCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: "rgba(232,168,56,0.12)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 40,
  },
  orbitBadge: {
    position: "absolute",
    backgroundColor: COLORS.elevated,
    borderWidth: 1,
    borderColor: "rgba(232,168,56,0.2)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  badge1: { top: -10, right: -20 },
  badge2: { bottom: 20, left: -30 },
  badgeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.primary,
  },
  badgeText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "600",
  },
  bottomContent: {
    width: "100%",
    paddingHorizontal: 32,
    paddingBottom: 40,
    marginTop: "auto",
  },
  slideDots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginBottom: 32,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.textMuted,
  },
  activeDot: { width: 24, backgroundColor: COLORS.primary },
  headline: {
    fontSize: 40,
    fontWeight: "600",
    color: COLORS.text,
    lineHeight: 44,
    marginBottom: 14,
    fontFamily: FONTS.serif,
  },
  accentText: { color: COLORS.primary },
  subheadline: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 32,
  },
  mainBtn: {
    width: "100%",
    borderRadius: RADIUS.l,
    overflow: "hidden",
  },
  gradientBtn: {
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  mainBtnText: {
    color: "#1A0E04",
    fontSize: 16,
    fontWeight: "800",
  },
  btnArrow: {
    width: 24,
    height: 24,
    backgroundColor: "rgba(26,14,4,0.1)",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  signinRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signinText: { color: COLORS.textMuted, fontSize: 13 },
  signinLink: { color: COLORS.primary, fontSize: 13, fontWeight: "600" },
  // Step 2
  s2Top: {
    width: "100%",
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeIconWrap: { marginTop: 40 },
  welcomeBowl: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: "rgba(232,168,56,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  s2Content: {
    flex: 1,
    width: "100%",
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    marginTop: -36,
    padding: 32,
  },
  s2Label: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 10,
    fontFamily: FONTS.mono,
  },
  s2Title: {
    fontSize: 34,
    fontWeight: "600",
    color: COLORS.text,
    lineHeight: 38,
    marginBottom: 10,
    fontFamily: FONTS.serif,
  },
  s2Sub: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 36,
  },
  inputGroup: { marginBottom: 14 },
  inputLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: "700",
    marginBottom: 10,
    letterSpacing: 1.5,
    fontFamily: FONTS.mono,
  },
  inputWrap: { flexDirection: "row", alignItems: "center" },
  nameInput: {
    flex: 1,
    backgroundColor: COLORS.elevated,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.l,
    padding: 16,
    color: COLORS.text,
    fontSize: 16,
  },
  continueBtn: {
    width: "100%",
    borderRadius: RADIUS.l,
    overflow: "hidden",
  },
  btnDisabled: { opacity: 0.4 },
  loadingDots: { flexDirection: "row", gap: 5 },
  loadingDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#1A0E04",
  },
  // Step 3
  welcomeAnim: { marginBottom: 32, position: "relative" },
  wPlate: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: "rgba(232,168,56,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 34,
    height: 34,
    backgroundColor: COLORS.primary,
    borderRadius: 17,
    borderWidth: 3,
    borderColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  welcomeName: {
    fontSize: 38,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
    fontFamily: FONTS.serif,
    marginBottom: 12,
  },
  welcomeTagline: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 44,
    paddingHorizontal: 20,
  },
  featureGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingHorizontal: 32,
    marginBottom: 40,
  },
  featCard: {
    width: (width - 64 - 10) / 2,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.l,
    padding: 16,
  },
  featEmoji: { fontSize: 24, marginBottom: 8 },
  featTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 3,
  },
  featDesc: { color: COLORS.textMuted, fontSize: 11 },
  exploreBtn: {
    width: width - 64,
    borderRadius: RADIUS.l,
    overflow: "hidden",
  },
});

import { Ionicons } from "@expo/vector-icons";
import { useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Speech from "expo-speech";
import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import CookingPot from "../../src/components/recipe/CookingPot";
import { COLORS, RADIUS, SHADOWS, SPACING } from "../../src/constants/theme";
import { useMealPlan } from "../../src/context/MealPlanContext";
import recipesData from "../../src/data/recipes.json";
import { Recipe } from "../../src/types";

const recipes = recipesData as Recipe[];

const alertSound = require("../../assets/sounds/alert.wav");
const successSound = require("../../assets/sounds/success.wav");
const startSound = require("../../assets/sounds/start.wav");

export default function CookingScreen() {
  const { id } = useLocalSearchParams();
  const recipeId = Array.isArray(id) ? (id[0] ?? "") : (id ?? "");
  const router = useRouter();
  const { removeByRecipeId } = useMealPlan();
  const recipe = recipes.find((r) => r.id === recipeId);

  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const oneShotPlayer = useAudioPlayer(alertSound, { downloadFirst: true });
  const lastPlayedSource = useRef<any>(alertSound);

  const instructions = recipe?.instructions || [];
  const currentInstruction = instructions[currentStep];

  const playSound = React.useCallback(
    (source = alertSound) => {
      try {
        if (!oneShotPlayer) return;

        if (lastPlayedSource.current === source && oneShotPlayer.isLoaded) {
          oneShotPlayer.seekTo(0);
          oneShotPlayer.play();
        } else {
          oneShotPlayer.replace(source);
          oneShotPlayer.play();
          lastPlayedSource.current = source;
        }
      } catch (error) {
        console.warn("Error playing one-shot sound:", error);
      }
    },
    [oneShotPlayer],
  );

  // TTS Logic
  const speakInstruction = React.useCallback(async () => {
    if (!currentInstruction?.text) return;

    try {
      const isCurrentlySpeaking = await Speech.isSpeakingAsync();
      if (isCurrentlySpeaking) {
        await Speech.stop();
      }

      setIsSpeaking(true);
      Speech.speak(currentInstruction.text, {
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    } catch (error) {
      console.warn("Speech error:", error);
      setIsSpeaking(false);
    }
  }, [currentInstruction?.text]);

  const stopSpeaking = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  // Lifecycle-safe Keep Awake
  useEffect(() => {
    async function toggleKeepAwake() {
      try {
        await activateKeepAwakeAsync();
      } catch (e) {
        console.warn("Failed to activate keep awake:", e);
      }
    }
    toggleKeepAwake();
    return () => {
      deactivateKeepAwake().catch(() => {});
      Speech.stop(); // Stop audio if user leaves
    };
  }, []);

  // Auto-read on step change
  useEffect(() => {
    speakInstruction();
  }, [currentStep, speakInstruction]);

  useEffect(() => {
    if (currentInstruction?.timerSeconds) {
      setTimeLeft(currentInstruction.timerSeconds);
      setIsTimerActive(false);
    } else {
      setTimeLeft(0);
      setIsTimerActive(false);
    }
  }, [currentStep, currentInstruction?.timerSeconds]);

  // Effect for handling the 1-second countdown interval
  useEffect(() => {
    let interval: number | null = null;

    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, timeLeft]);

  const handleFinish = React.useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    playSound(successSound);
    if (recipe) {
      removeByRecipeId(recipe.id);
    }
    setShowSuccess(true);
  }, [playSound, recipe, removeByRecipeId]);

  // Handle timer completion (haptics and completion sound)
  const prevTimeLeft = useRef(timeLeft);
  useEffect(() => {
    if (prevTimeLeft.current > 0 && timeLeft === 0 && !isTimerActive) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      playSound(alertSound);

      // If this was the last step and it had a timer, trigger the finish dialog
      if (currentStep === instructions.length - 1) {
        handleFinish();
      }
    }
    prevTimeLeft.current = timeLeft;
  }, [timeLeft, isTimerActive, currentStep, instructions.length, playSound, handleFinish]);

  if (!recipe) return null;

  const totalSteps = instructions.length;
  const progress = totalSteps > 0 ? (currentStep + 1) / totalSteps : 0;

  const handleNext = () => {
    if (currentStep < instructions.length - 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      playSound();
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color={COLORS.text} />
        </Pressable>
        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>
            Step {currentStep + 1} of {instructions.length}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${progress * 100}%` }]}
            />
          </View>
        </View>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.mainContent}>
        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            key={`step-${currentStep}`}
            entering={FadeIn.duration(400)}
            style={styles.instructionCard}
          >
            <View style={styles.instructionHeaderRow}>
              <Text style={styles.instructionTitle}>Instruction</Text>
              <Pressable
                onPress={isSpeaking ? stopSpeaking : speakInstruction}
                style={styles.speakerBtn}
              >
                <Ionicons
                  name={isSpeaking ? "volume-high" : "volume-medium-outline"}
                  size={24}
                  color={isSpeaking ? COLORS.primary : COLORS.textLight}
                />
              </Pressable>
            </View>
            <Text style={styles.instructionText}>
              {currentInstruction?.text || ""}
            </Text>
          </Animated.View>

          {currentInstruction.timerSeconds ? (
            <View style={styles.timerSection}>
              <CookingPot
                isActive={isTimerActive}
                timeLeft={timeLeft}
                formatTime={formatTime}
              />

              <Pressable
                style={[
                  styles.timerToggle,
                  isTimerActive && styles.timerToggleActive,
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  if (!isTimerActive) playSound(startSound);
                  setIsTimerActive(!isTimerActive);
                }}
              >
                <Ionicons
                  name={isTimerActive ? "pause" : "play"}
                  size={24}
                  color="white"
                />
                <Text style={styles.timerToggleText}>
                  {isTimerActive ? "Pause Timer" : "Start Timer"}
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.noTimerSection}>
              <CookingPot
                isActive={false}
                timeLeft={0}
                formatTime={() => "0:00"}
              />
              <Text style={styles.noTimerText}>
                Follow the instruction above to prepare your dish.
              </Text>
            </View>
          )}

          {/* Spacer to prevent overlap with footer when scrolled to bottom */}
          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Fixed Footer - Now inside mainContent but at the bottom */}
        <View style={styles.footer}>
          <Pressable
            style={[styles.navBtn, currentStep === 0 && styles.navBtnDisabled]}
            onPress={handleBack}
            disabled={currentStep === 0}
          >
            <Ionicons
              name="chevron-back"
              size={20}
              color={currentStep === 0 ? COLORS.textLight : COLORS.text}
            />
            <Text
              style={[
                styles.navBtnText,
                currentStep === 0 && styles.navBtnTextDisabled,
              ]}
            >
              Back
            </Text>
          </Pressable>

          <Pressable style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextBtnText}>
              {currentStep === instructions.length - 1 ? "Finish" : "Next Step"}
            </Text>
            {currentStep < instructions.length - 1 && (
              <Ionicons name="chevron-forward" size={20} color="white" />
            )}
          </Pressable>
        </View>
      </View>

      {/* Success Celebration Modal */}
      <Modal animationType="fade" transparent={true} visible={showSuccess}>
        <View style={styles.successOverlay}>
          <Animated.View
            entering={FadeIn.delay(200)}
            style={styles.successContent}
          >
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark-done" size={60} color="white" />
            </View>
            <Text style={styles.successTitle}>Bon Appétit!</Text>
            <Text style={styles.successSubtitle}>
              You&apos;ve successfully finished cooking {recipe.title}. The
              recipe has been removed from your meal plan.
            </Text>

            <View style={styles.successActions}>
              <Pressable
                style={styles.successHomeBtn}
                onPress={() => {
                  setShowSuccess(false);
                  router.push("/(tabs)");
                }}
              >
                <Text style={styles.successHomeText}>Back to Home</Text>
              </Pressable>

              <Pressable
                style={styles.successPlanBtn}
                onPress={() => {
                  setShowSuccess(false);
                  router.push("/(tabs)/mealplan");
                }}
              >
                <Text style={styles.successPlanText}>View Meal Plan</Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
    height: 60,
  },
  mainContent: {
    flex: 1,
    position: "relative",
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.m,
    paddingBottom: 20, // Reduced as we have the footer spacer
    flexGrow: 1,
  },
  closeBtn: {
    padding: SPACING.s,
  },
  progressHeader: {
    alignItems: "center",
    flex: 1,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.textLight,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  progressBar: {
    width: 100,
    height: 4,
    backgroundColor: "#F0F0F0",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
  },
  placeholder: {
    width: 40,
  },
  instructionCard: {
    backgroundColor: "#F9F6F0",
    padding: SPACING.l,
    borderRadius: RADIUS.l,
    minHeight: 140,
    ...SHADOWS.small,
  },
  instructionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.s,
  },
  speakerBtn: {
    padding: SPACING.xs,
    borderRadius: RADIUS.s,
    backgroundColor: "rgba(255,107,53,0.1)",
  },
  instructionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.primary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  instructionText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    lineHeight: 26,
  },
  timerSection: {
    marginTop: SPACING.xl,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: SPACING.xl,
  },
  timerToggle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.text,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.s + 4,
    borderRadius: RADIUS.m,
    ...SHADOWS.small,
  },
  timerToggleActive: {
    backgroundColor: COLORS.primary,
  },
  timerToggleText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: SPACING.s,
  },
  noTimerSection: {
    marginTop: SPACING.xl,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.xl,
  },
  noTimerText: {
    textAlign: "center",
    color: COLORS.textLight,
    fontSize: 14,
    paddingHorizontal: SPACING.xl,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.m,
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    width: "100%",
  },
  navBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.s,
  },
  navBtnDisabled: {
    opacity: 0.2,
  },
  navBtnText: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.text,
    marginLeft: 4,
  },
  navBtnTextDisabled: {
    color: COLORS.textLight,
  },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.s + 4,
    borderRadius: RADIUS.m,
    minWidth: 120,
    justifyContent: "center",
    ...SHADOWS.small,
  },
  nextBtnText: {
    color: "white",
    fontSize: 15,
    fontWeight: "800",
    marginRight: 4,
  },
  successOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
  },
  successContent: {
    backgroundColor: "white",
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: "center",
    width: "100%",
    ...SHADOWS.medium,
  },
  successIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.success,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.l,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SPACING.s,
  },
  successSubtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: SPACING.xl,
  },
  successActions: {
    width: "100%",
  },
  successHomeBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.m,
    borderRadius: RADIUS.m,
    alignItems: "center",
    marginBottom: SPACING.s,
  },
  successHomeText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  successPlanBtn: {
    paddingVertical: SPACING.m,
    borderRadius: RADIUS.m,
    alignItems: "center",
  },
  successPlanText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
});

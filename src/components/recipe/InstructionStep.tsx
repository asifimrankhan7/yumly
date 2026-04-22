import { Ionicons } from "@expo/vector-icons";
import { useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, RADIUS, SHADOWS, SPACING } from "../../constants/theme";

const alertSound = require("../../../assets/sounds/alert.wav");
const successSound = require("../../../assets/sounds/success.wav");

interface Props {
  step: number;
  text: string;
  timerSeconds?: number;
  readOnly?: boolean;
}

export default function InstructionStep({ step, text, timerSeconds, readOnly = false }: Props) {
  const [timeLeft, setTimeLeft] = useState(timerSeconds || 0);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const player = useAudioPlayer(alertSound, { downloadFirst: true });
  const lastPlayedSource = useRef<any>(alertSound);

  const playSound = React.useCallback(
    (source = alertSound) => {
      try {
        if (!player) return;

        if (lastPlayedSource.current === source && player.isLoaded) {
          player.seekTo(0).catch(() => {});
          player.play();
        } else {
          player.replace(source);
          player.play();
          lastPlayedSource.current = source;
        }
      } catch (error) {
        console.warn("Error playing instruction sound:", error);
      }
    },
    [player],
  );

  useEffect(() => {
    let interval: number | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const prevTimeLeft = useRef(timeLeft);
  useEffect(() => {
    if (prevTimeLeft.current > 0 && timeLeft === 0 && !isActive) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      playSound();
    }
    prevTimeLeft.current = timeLeft;
  }, [timeLeft, isActive, playSound]);

  const toggleComplete = () => {
    const nextState = !isCompleted;
    setIsCompleted(nextState);
    if (nextState) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      playSound(successSound);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View style={[styles.container, isCompleted && styles.containerCompleted]}>
      <View style={styles.header}>
        <View
          style={[styles.stepBadge, isCompleted && styles.stepBadgeCompleted]}
        >
          {isCompleted ? (
            <Ionicons name="checkmark" size={14} color="white" />
          ) : (
            <Text style={styles.stepText}>{step}</Text>
          )}
        </View>
        <Text style={[styles.title, isCompleted && styles.textCompleted]}>
          Step {step}
        </Text>

        {!readOnly && (
          <Pressable
            style={[
              styles.completeToggle,
              isCompleted && styles.completeToggleActive,
            ]}
            onPress={toggleComplete}
          >
            <Ionicons
              name={isCompleted ? "checkmark-circle" : "ellipse-outline"}
              size={22}
              color={isCompleted ? COLORS.success : COLORS.textLight}
            />
          </Pressable>
        )}
      </View>

      <Text
        style={[styles.instructionText, isCompleted && styles.textCompleted]}
      >
        {text}
      </Text>

      {timerSeconds && !isCompleted && !readOnly && (
        <Pressable
          style={[styles.timerButton, isActive && styles.timerActive]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setIsActive(!isActive);
          }}
        >
          <Ionicons
            name={isActive ? "stop-circle" : "timer-outline"}
            size={18}
            color="white"
          />
          <Text style={styles.timerBtnText}>
            {isActive
              ? `Stop Timer (${formatTime(timeLeft)})`
              : `Start Timer (${formatTime(timerSeconds)})`}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: RADIUS.l,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    ...SHADOWS.small,
  },
  containerCompleted: {
    backgroundColor: "#F8F8F8",
    borderColor: "#E0E0E0",
    opacity: 0.8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.s,
  },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.text,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.s,
  },
  stepBadgeCompleted: {
    backgroundColor: COLORS.success,
  },
  stepText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    flex: 1,
  },
  completeToggle: {
    padding: 2,
  },
  completeToggleActive: {
    opacity: 1,
  },
  instructionText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: SPACING.m,
  },
  textCompleted: {
    textDecorationLine: "line-through",
    color: COLORS.textLight,
  },
  timerButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.s,
    borderRadius: RADIUS.m,
  },
  timerActive: {
    backgroundColor: COLORS.success,
  },
  timerBtnText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: SPACING.s,
    fontSize: 14,
  },
});

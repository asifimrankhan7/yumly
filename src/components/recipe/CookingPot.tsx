import React, { useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { COLORS, SHADOWS } from "../../constants/theme";

interface CookingPotProps {
  isActive: boolean;
  timeLeft: number;
  formatTime: (seconds: number) => string;
}

const SteamParticle = ({ delay, isActive }: { delay: number; isActive: boolean }) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      translateY.value = withRepeat(
        withDelay(delay, withTiming(-60, { duration: 2000, easing: Easing.out(Easing.ease) })),
        -1,
        false
      );
      translateX.value = withRepeat(
        withDelay(delay, withSequence(
          withTiming(15, { duration: 1000 }),
          withTiming(-15, { duration: 1000 })
        )),
        -1,
        false
      );
      opacity.value = withRepeat(
        withDelay(delay, withSequence(
          withTiming(0.6, { duration: 500 }),
          withTiming(0, { duration: 1500 })
        )),
        -1,
        false
      );
    } else {
      translateY.value = 0;
      opacity.value = 0;
      translateX.value = 0;
    }
  }, [isActive, delay, translateY, translateX, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
    ],
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.steam, animatedStyle]} />;
};

export default function CookingPot({ isActive, timeLeft, formatTime }: CookingPotProps) {
  const jiggle = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isActive) {
      jiggle.value = withRepeat(
        withSequence(
          withTiming(-1.5, { duration: 50 }),
          withTiming(1.5, { duration: 50 })
        ),
        -1,
        true
      );
      scale.value = withRepeat(
        withTiming(1.02, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      jiggle.value = withTiming(0);
      scale.value = withTiming(1);
    }
  }, [isActive, jiggle, scale]);

  const potAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${jiggle.value}deg` },
      { scale: scale.value }
    ],
  }));

  return (
    <View style={styles.container}>
      {/* Steam Particles */}
      <View style={styles.steamContainer}>
        <SteamParticle delay={0} isActive={isActive} />
        <SteamParticle delay={600} isActive={isActive} />
        <SteamParticle delay={1200} isActive={isActive} />
      </View>

      {/* Pot Component */}
      <Animated.View style={[styles.potWrapper, potAnimatedStyle]}>
        {/* Pot Lid Handle */}
        <View style={styles.potHandle} />
        
        {/* Pot Lid */}
        <View style={styles.potLid} />

        {/* Pot Body */}
        <View style={styles.potBody}>
          <View style={styles.timeWrapper}>
            <Text style={styles.timeText}>{formatTime(timeLeft)}</Text>
            <Text style={styles.statusText}>{isActive ? "BOILING" : "READY"}</Text>
          </View>
          
          {/* Decorative Pot "Shine" */}
          <View style={styles.potShine} />
        </View>

        {/* Side Handles */}
        <View style={[styles.sideHandle, styles.leftHandle]} />
        <View style={[styles.sideHandle, styles.rightHandle]} />
      </Animated.View>

      {/* Burner/Heat Base */}
      <View style={styles.burnerBase}>
        {isActive && (
          <View style={styles.heatGlow} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 240,
    width: 240,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  steamContainer: {
    position: "absolute",
    top: 10,
    width: 60,
    height: 60,
    alignItems: "center",
  },
  steam: {
    width: 20,
    height: 20,
    backgroundColor: "rgba(200, 200, 200, 0.4)",
    borderRadius: 10,
    position: "absolute",
  },
  potWrapper: {
    alignItems: "center",
    zIndex: 2,
  },
  potHandle: {
    width: 30,
    height: 12,
    backgroundColor: "#333",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    marginBottom: -2,
  },
  potLid: {
    width: 140,
    height: 15,
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomWidth: 3,
    borderBottomColor: "rgba(0,0,0,0.1)",
    ...SHADOWS.small,
  },
  potBody: {
    width: 160,
    height: 110,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    ...SHADOWS.medium,
  },
  potShine: {
    position: "absolute",
    top: 10,
    left: 15,
    width: 30,
    height: 60,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 15,
    transform: [{ rotate: "15deg" }],
  },
  sideHandle: {
    position: "absolute",
    width: 25,
    height: 40,
    backgroundColor: "#444",
    top: 55,
    borderRadius: 8,
    zIndex: -1,
  },
  leftHandle: {
    left: -15,
  },
  rightHandle: {
    right: -15,
  },
  timeWrapper: {
    alignItems: "center",
  },
  timeText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "800",
    color: "rgba(255,255,255,0.7)",
    letterSpacing: 2,
    marginTop: -2,
  },
  burnerBase: {
    width: 140,
    height: 6,
    backgroundColor: "#222",
    borderRadius: 3,
    marginTop: -5,
    zIndex: 1,
  },
  heatGlow: {
    position: "absolute",
    top: -10,
    left: 20,
    width: 100,
    height: 15,
    backgroundColor: "rgba(255, 100, 0, 0.4)",
    borderRadius: 10,
  },
});

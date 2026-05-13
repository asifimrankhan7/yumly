import React, { useRef } from 'react';
import { Animated, StyleSheet, Text, Pressable, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import * as Haptics from 'expo-haptics';

interface SwipeableRowProps {
  children: React.ReactNode;
  onDelete: () => void;
}

export default function SwipeableRow({ children, onDelete }: SwipeableRowProps) {
  const swipeableRef = useRef<Swipeable>(null);

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <Pressable 
        style={styles.rightAction} 
        onPress={() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          swipeableRef.current?.close();
          onDelete();
        }}
      >
        <Animated.View style={[styles.actionIcon, { transform: [{ scale }] }]}>
          <View style={styles.trashCircle}>
            <Ionicons name="trash-outline" size={20} color={COLORS.text} />
          </View>
          <Text style={styles.actionText}>Remove</Text>
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      friction={2}
      rightThreshold={40}
      renderRightActions={renderRightActions}
      containerStyle={styles.swipeContainer}
    >
      {children}
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  swipeContainer: {
    marginBottom: SPACING.s + 2,
    borderRadius: RADIUS.l,
    overflow: 'hidden',
  },
  rightAction: {
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: 100,
    height: '100%',
    borderRadius: RADIUS.l,
  },
  actionIcon: {
    alignItems: 'center',
    paddingRight: SPACING.m,
  },
  trashCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  actionText: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

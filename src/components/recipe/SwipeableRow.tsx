import React, { useRef } from 'react';
import { Animated, StyleSheet, Text, Pressable } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, RADIUS } from '../../constants/theme';
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
          <Ionicons name="trash-outline" size={28} color="white" />
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
      onSwipeableOpen={(direction) => {
        if (direction === 'right') {
          // Trigger delete on full swipe if needed, or just let the button handle it
          // For now, let's keep it manual as requested "reusable button"
        }
      }}
    >
      {children}
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  swipeContainer: {
    marginBottom: SPACING.m,
    borderRadius: RADIUS.m,
    overflow: 'hidden',
  },
  rightAction: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: 100,
    height: '100%',
    borderRadius: RADIUS.m,
  },
  actionIcon: {
    alignItems: 'center',
    paddingRight: SPACING.m,
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
});

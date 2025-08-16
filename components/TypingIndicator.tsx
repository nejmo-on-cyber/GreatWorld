import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface TypingIndicatorProps {
  isTyping: boolean;
  userName?: string;
}

export default function TypingIndicator({ isTyping, userName = 'Someone' }: TypingIndicatorProps) {
  const [dots] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isTyping) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(dots, {
            toValue: 1,
            duration: 600,
            useNativeDriver: false,
          }),
          Animated.timing(dots, {
            toValue: 0,
            duration: 600,
            useNativeDriver: false,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }
  }, [isTyping, dots]);

  if (!isTyping) return null;

  const dotOpacity1 = dots.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 1, 0.3],
  });

  const dotOpacity2 = dots.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.3, 1],
  });

  const dotOpacity3 = dots.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.3, 0.3],
  });

  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <Text style={styles.typingText}>{userName} is typing</Text>
        <View style={styles.dotsContainer}>
          <Animated.View style={[styles.dot, { opacity: dotOpacity1 }]} />
          <Animated.View style={[styles.dot, { opacity: dotOpacity2 }]} />
          <Animated.View style={[styles.dot, { opacity: dotOpacity3 }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  bubble: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 6,
    maxWidth: '80%',
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typingText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#94A3B8',
  },
});

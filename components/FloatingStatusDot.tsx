import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface FloatingStatusDotProps {
  status: 'online' | 'offline' | 'away' | 'busy';
  size?: number;
  position?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
}

export default function FloatingStatusDot({ 
  status, 
  size = 8, 
  position = 'top-right' 
}: FloatingStatusDotProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (status === 'online') {
      // Very subtle pulse for online
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.7,
            duration: 2500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2500,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    }
  }, [status, pulseAnim]);

  useEffect(() => {
    if (status === 'away') {
      // Gentle blink for away
      const blinkAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnim, {
            toValue: 0.5,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(blinkAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );
      blinkAnimation.start();
      return () => blinkAnimation.stop();
    }
  }, [status, blinkAnim]);

  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return '#10B981'; // Green
      case 'away':
        return '#F59E0B'; // Yellow/Orange
      case 'busy':
        return '#EF4444'; // Red
      case 'offline':
        return '#9CA3AF'; // Light gray
      default:
        return '#9CA3AF';
    }
  };

  const getPositionStyle = () => {
    switch (position) {
      case 'top-right':
        return { top: 2, right: 2 };
      case 'bottom-right':
        return { bottom: 2, right: 2 };
      case 'top-left':
        return { top: 2, left: 2 };
      case 'bottom-left':
        return { bottom: 2, left: 2 };
      default:
        return { top: 2, right: 2 };
    }
  };

  const getStatusStyle = () => {
    const baseStyle = {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: getStatusColor(),
      borderWidth: 1.5,
      borderColor: 'white',
      shadowColor: getStatusColor(),
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 6,
      elevation: 6,
    };

    switch (status) {
      case 'online':
        return [
          baseStyle,
          {
            opacity: pulseAnim,
            transform: [{ scale: pulseAnim }],
          },
        ];
      case 'away':
        return [
          baseStyle,
          {
            opacity: blinkAnim,
          },
        ];
      case 'busy':
        return [
          baseStyle,
          {
            backgroundColor: '#EF4444',
          },
        ];
      case 'offline':
        return [
          baseStyle,
          {
            backgroundColor: '#9CA3AF',
          },
        ];
      default:
        return [baseStyle];
    }
  };

  return (
    <View style={[styles.container, getPositionStyle()]}>
      <Animated.View style={getStatusStyle()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 10,
  },
});

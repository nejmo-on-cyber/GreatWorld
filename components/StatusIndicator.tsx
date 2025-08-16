import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'away' | 'busy';
  size?: number;
  showPulse?: boolean;
}

export default function StatusIndicator({ 
  status, 
  size = 12, 
  showPulse = true 
}: StatusIndicatorProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (showPulse && status === 'online') {
      // Subtle pulse animation for online status
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.6,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    }
  }, [status, showPulse, pulseAnim]);

  useEffect(() => {
    if (status === 'away') {
      // Gentle blink animation for away status
      const blinkAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnim, {
            toValue: 0.4,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(blinkAnim, {
            toValue: 1,
            duration: 1200,
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
        return '#6B7280'; // Gray
      default:
        return '#6B7280';
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
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 4,
    };

    switch (status) {
      case 'online':
        return [
          baseStyle,
          showPulse && {
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
            backgroundColor: '#6B7280',
          },
        ];
      default:
        return [baseStyle];
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={getStatusStyle()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

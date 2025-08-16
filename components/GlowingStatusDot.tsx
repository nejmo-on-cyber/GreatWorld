import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface GlowingStatusDotProps {
  status: 'online' | 'offline' | 'away' | 'busy';
  size?: number;
  position?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
}

export default function GlowingStatusDot({ 
  status, 
  size = 8, 
  position = 'top-right' 
}: GlowingStatusDotProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (status === 'online') {
      // Subtle pulse with glow for online
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
      
      // Glow animation
      const glowAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 0.6,
            duration: 3000,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: false,
          }),
        ])
      );
      
      pulseAnimation.start();
      glowAnimation.start();
      return () => {
        pulseAnimation.stop();
        glowAnimation.stop();
      };
    }
  }, [status, pulseAnim, glowAnim]);

  useEffect(() => {
    if (status === 'away') {
      // Gentle blink with glow for away
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
      
      // Subtle glow animation
      const glowAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 0.7,
            duration: 2000,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false,
          }),
        ])
      );
      
      blinkAnimation.start();
      glowAnimation.start();
      return () => {
        blinkAnimation.stop();
        glowAnimation.stop();
      };
    }
  }, [status, blinkAnim, glowAnim]);

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
    const statusColor = getStatusColor();
    const glowOpacity = status === 'online' || status === 'away' ? glowAnim : new Animated.Value(1);
    
    const baseStyle = {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: statusColor,
      borderWidth: 1.5,
      borderColor: 'white',
    };

    const glowStyle = {
      shadowColor: statusColor,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: glowOpacity,
      shadowRadius: 8,
      elevation: 8,
    };

    switch (status) {
      case 'online':
        return [
          baseStyle,
          glowStyle,
          {
            opacity: pulseAnim,
            transform: [{ scale: pulseAnim }],
          },
        ];
      case 'away':
        return [
          baseStyle,
          glowStyle,
          {
            opacity: blinkAnim,
          },
        ];
      case 'busy':
        return [
          baseStyle,
          {
            shadowColor: statusColor,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: 6,
            elevation: 6,
          },
        ];
      case 'offline':
        return [
          baseStyle,
          {
            shadowColor: statusColor,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 4,
          },
        ];
      default:
        return [baseStyle, glowStyle];
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

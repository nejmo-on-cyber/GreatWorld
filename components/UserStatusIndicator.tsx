import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';

export type UserStatus = 
  | 'available'
  | 'dnd'
  | 'away'
  | 'busy'
  | 'open-to-chat'
  | 'focused'
  | 'offline';

interface UserStatusIndicatorProps {
  status: UserStatus;
  size?: number;
  showTooltip?: boolean;
  onPress?: () => void;
}

const statusConfig = {
  available: {
    color: '#10B981',
    label: 'Available',
    animation: 'steady',
  },
  'open-to-chat': {
    color: '#059669',
    label: 'Open to Chat',
    animation: 'pulse',
  },
  busy: {
    color: '#EF4444',
    label: 'Busy - In a Meeting',
    animation: 'rapidBlink',
  },
  dnd: {
    color: '#DC2626',
    label: 'Do Not Disturb',
    animation: 'slowPulse',
  },
  away: {
    color: '#F59E0B',
    label: 'Away',
    animation: 'dimFlicker',
  },
  focused: {
    color: '#8B5CF6',
    label: 'Focused - Deep Work',
    animation: 'steady',
  },
  offline: {
    color: '#9CA3AF',
    label: 'Offline',
    animation: 'none',
  },
};

export default function UserStatusIndicator({
  status,
  size = 10,
  showTooltip = false,
  onPress,
}: UserStatusIndicatorProps) {
  const animatedValue = useRef(new Animated.Value(1)).current;
  const config = statusConfig[status];

  useEffect(() => {
    const createAnimation = () => {
      switch (config.animation) {
        case 'pulse':
          return Animated.loop(
            Animated.sequence([
              Animated.timing(animatedValue, {
                toValue: 0.6,
                duration: 1000,
                useNativeDriver: false,
              }),
              Animated.timing(animatedValue, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: false,
              }),
            ])
          );
        
        case 'slowPulse':
          return Animated.loop(
            Animated.sequence([
              Animated.timing(animatedValue, {
                toValue: 0.4,
                duration: 1500,
                useNativeDriver: false,
              }),
              Animated.timing(animatedValue, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: false,
              }),
            ])
          );
        
        case 'rapidBlink':
          return Animated.loop(
            Animated.sequence([
              Animated.timing(animatedValue, {
                toValue: 0.2,
                duration: 300,
                useNativeDriver: false,
              }),
              Animated.timing(animatedValue, {
                toValue: 1,
                duration: 300,
                useNativeDriver: false,
              }),
            ])
          );
        
        case 'dimFlicker':
          return Animated.loop(
            Animated.sequence([
              Animated.timing(animatedValue, {
                toValue: 0.3,
                duration: 800,
                useNativeDriver: false,
              }),
              Animated.timing(animatedValue, {
                toValue: 0.7,
                duration: 600,
                useNativeDriver: false,
              }),
              Animated.timing(animatedValue, {
                toValue: 0.5,
                duration: 400,
                useNativeDriver: false,
              }),
              Animated.timing(animatedValue, {
                toValue: 1,
                duration: 1200,
                useNativeDriver: false,
              }),
            ])
          );
        
        case 'steady':
        case 'none':
        default:
          animatedValue.setValue(status === 'offline' ? 0.6 : 1);
          return null;
      }
    };

    const animation = createAnimation();
    if (animation) {
      animation.start();
    }

    return () => {
      if (animation) {
        animation.stop();
      }
    };
  }, [status, animatedValue, config.animation]);

  const StatusLight = () => (
    <Animated.View
      style={[
        styles.statusLight,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: config.color,
          opacity: animatedValue,
        },
      ]}
    />
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={styles.container}>
        <StatusLight />
        {showTooltip && (
          <View style={styles.tooltip}>
            <Text style={styles.tooltipText}>{config.label}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <StatusLight />
      {showTooltip && (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>{config.label}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusLight: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  tooltip: {
    position: 'absolute',
    bottom: -30,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    minWidth: 80,
    alignItems: 'center',
  },
  tooltipText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
});
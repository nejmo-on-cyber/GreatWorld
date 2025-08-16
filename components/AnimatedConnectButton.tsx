import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Text, Animated, StyleSheet } from 'react-native';
import { Users, Check, X } from 'lucide-react-native';

interface AnimatedConnectButtonProps {
  connectionStatus: 'none' | 'pending_sent' | 'pending_received' | 'connected' | 'blocked';
  onConnect: () => void;
  onWithdraw: () => void;
  onUpdateToPending: () => void;
  disabled?: boolean;
}

export default function AnimatedConnectButton({
  connectionStatus,
  onConnect,
  onWithdraw,
  onUpdateToPending,
  disabled = false,
}: AnimatedConnectButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const backgroundColorAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const sentToPendingTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (connectionStatus === 'pending_sent') {
      // Scale animation when connection is sent
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 150,
          useNativeDriver: false,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: false,
        }),
      ]).start();

      // Background color transition
      Animated.timing(backgroundColorAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();

      // Set timeout to change to "Connection Pending" after 3 seconds
      sentToPendingTimeout.current = setTimeout(() => {
        onUpdateToPending();
      }, 3000);

      // Subtle pulse for pending state
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.95,
            duration: 1500,
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: false,
          }),
        ])
      );
      pulseAnimation.start();
      return () => {
        pulseAnimation.stop();
        if (sentToPendingTimeout.current) {
          clearTimeout(sentToPendingTimeout.current);
        }
      };
    } else if (connectionStatus === 'pending_received') {
      // Background color transition for pending state
      Animated.timing(backgroundColorAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();

      // Subtle pulse for pending state
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.95,
            duration: 1500,
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: false,
          }),
        ])
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    } else {
      // Reset animations
      Animated.timing(backgroundColorAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
      
      if (sentToPendingTimeout.current) {
        clearTimeout(sentToPendingTimeout.current);
        sentToPendingTimeout.current = null;
      }
    }
  }, [connectionStatus, scaleAnim, backgroundColorAnim, pulseAnim, onUpdateToPending]);

  const handlePress = () => {
    if (disabled) return;
    
    if (connectionStatus === 'pending_sent') {
      onWithdraw();
    } else {
      onConnect();
    }
  };

  const backgroundColor = backgroundColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#1E40AF', '#F0FDF4'],
  });

  const borderColor = backgroundColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#1E40AF', '#10B981'],
  });

  const shadowColor = backgroundColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#1E40AF', '#10B981'],
  });

  const getButtonContent = () => {
    switch (connectionStatus) {
      case 'pending_sent':
        return (
          <>
            <Check size={16} color="#10B981" strokeWidth={2} />
            <Text style={styles.sentText}>Connection Sent</Text>
          </>
        );
      case 'pending_received':
        return (
          <>
            <Check size={16} color="#10B981" strokeWidth={2} />
            <Text style={styles.pendingText}>Connection Pending</Text>
          </>
        );
      case 'connected':
        return (
          <>
            <Check size={16} color="#10B981" strokeWidth={2} />
            <Text style={styles.connectedText}>Connected</Text>
          </>
        );
      default:
        return (
          <>
            <Users size={16} color="white" strokeWidth={2} />
            <Text style={styles.defaultText}>Connect</Text>
          </>
        );
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || connectionStatus === 'connected'}
      onPress={handlePress}
    >
      <Animated.View
        style={[
          styles.button,
          {
            backgroundColor,
            borderColor,
            shadowColor,
            transform: [
              { scale: scaleAnim },
              { scale: connectionStatus === 'pending_sent' ? pulseAnim : 1 }
            ],
          },
        ]}
      >
        {getButtonContent()}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  defaultText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  sentText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  pendingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  connectedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
});
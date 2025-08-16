import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { MessageCircle } from 'lucide-react-native';
import { useMessaging } from '@/hooks/useMessaging';
import { useRouter } from 'expo-router';

interface MessageButtonProps {
  userId: string;
  userName: string;
  userPhoto: string;
  isConnected: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'outline';
  onPress?: () => void;
}

export default function MessageButton({
  userId,
  userName,
  userPhoto,
  isConnected,
  size = 'medium',
  variant = 'primary',
  onPress,
}: MessageButtonProps) {
  const { navigateToChat } = useMessaging();
  const navigation = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }

    if (!isConnected) {
      Alert.alert(
        'Connection Required',
        'You need to be connected with this person to send messages. Would you like to send a connection request first?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Send Request', 
            onPress: () => {
              Alert.alert('Request Sent', 'Connection request sent! You can message once they accept.');
            }
          },
        ]
      );
      return;
    }

    // Navigate to chat
    navigateToChat(userId, userName, userPhoto, isConnected);
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          button: { paddingHorizontal: 12, paddingVertical: 6, gap: 4 },
          icon: 14,
          text: 12,
        };
      case 'large':
        return {
          button: { paddingHorizontal: 20, paddingVertical: 12, gap: 8 },
          icon: 20,
          text: 16,
        };
      default:
        return {
          button: { paddingHorizontal: 16, paddingVertical: 8, gap: 6 },
          icon: 16,
          text: 14,
        };
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          button: { backgroundColor: '#F3F4F6' },
          text: { color: '#374151' },
          icon: '#6B7280',
        };
      case 'outline':
        return {
          button: { 
            backgroundColor: 'transparent', 
            borderWidth: 1, 
            borderColor: '#1E40AF' 
          },
          text: { color: '#1E40AF' },
          icon: '#1E40AF',
        };
      default:
        return {
          button: { backgroundColor: '#1E40AF' },
          text: { color: 'white' },
          icon: 'white',
        };
    }
  };

  const sizeConfig = getSizeStyles();
  const variantConfig = getVariantStyles();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        sizeConfig.button,
        variantConfig.button,
        !isConnected && styles.disabledButton,
      ]}
      onPress={handlePress}
      disabled={!isConnected}
    >
      <MessageCircle 
        size={sizeConfig.icon} 
        color={!isConnected ? '#9CA3AF' : variantConfig.icon} 
        strokeWidth={2} 
      />
      <Text style={[
        styles.text,
        { fontSize: sizeConfig.text },
        variantConfig.text,
        !isConnected && styles.disabledText,
      ]}>
        Message
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  disabledButton: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
    shadowOpacity: 0.05,
  },
  disabledText: {
    color: '#94A3B8',
  },
});

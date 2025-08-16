import { useState, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserStatus } from '@/components/UserStatusIndicator';

interface UserStatusData {
  status: UserStatus;
  customMessage: string;
  lastUpdated: string;
}

const DEFAULT_STATUS: UserStatusData = {
  status: 'available',
  customMessage: '',
  lastUpdated: new Date().toISOString(),
};

export function useUserStatus() {
  const [statusData, setStatusData] = useState<UserStatusData>(DEFAULT_STATUS);
  const [isLoading, setIsLoading] = useState(true);

  // Load status from storage on mount
  useEffect(() => {
    loadStatusFromStorage();
  }, []);

  const loadStatusFromStorage = async () => {
    try {
      const savedStatus = await AsyncStorage.getItem('userStatus');
      if (savedStatus) {
        const parsed = JSON.parse(savedStatus);
        setStatusData(parsed);
      }
    } catch (error) {
      console.error('Failed to load user status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (status: UserStatus, customMessage: string = '') => {
    const newStatusData: UserStatusData = {
      status,
      customMessage,
      lastUpdated: new Date().toISOString(),
    };

    try {
      await AsyncStorage.setItem('userStatus', JSON.stringify(newStatusData));
      setStatusData(newStatusData);
      
      // In a real app, you would also sync with your backend API here
      // await api.updateUserStatus(newStatusData);
      
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  const getStatusForDisplay = () => {
    return {
      ...statusData,
      isOnline: statusData.status !== 'offline',
    };
  };

  // Auto-update status based on user activity
  useEffect(() => {
    let inactivityTimer: ReturnType<typeof setTimeout>;

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      clearTimeout(inactivityTimer);
      
      if (nextAppState === 'active') {
        // If user was away and becomes active, update to available
        if (statusData.status === 'away') {
          updateStatus('available', statusData.customMessage);
        }
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        // Set timer for inactivity when app goes to background
        inactivityTimer = setTimeout(() => {
          if (statusData.status === 'available' || statusData.status === 'open-to-chat') {
            updateStatus('away', statusData.customMessage);
          }
        }, 5 * 60 * 1000); // 5 minutes of inactivity
      }
    };

    // Listen for app state changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      clearTimeout(inactivityTimer);
      subscription?.remove();
    };
  }, [statusData.status, statusData.customMessage]);

  return {
    statusData,
    isLoading,
    updateStatus,
    getStatusForDisplay,
  };
}
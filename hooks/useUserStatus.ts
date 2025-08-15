import { useState, useEffect } from 'react';
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
      // In a real app, this would load from AsyncStorage or API
      // For now, we'll simulate loading from local storage
      const savedStatus = localStorage.getItem('userStatus');
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
      // Save to storage
      localStorage.setItem('userStatus', JSON.stringify(newStatusData));
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
    let inactivityTimer: NodeJS.Timeout;
    let isUserActive = true;

    const handleUserActivity = () => {
      isUserActive = true;
      clearTimeout(inactivityTimer);
      
      // If user was away and becomes active, update to available
      if (statusData.status === 'away') {
        updateStatus('available', statusData.customMessage);
      }

      // Set timer for inactivity
      inactivityTimer = setTimeout(() => {
        if (statusData.status === 'available' || statusData.status === 'open-to-chat') {
          updateStatus('away', statusData.customMessage);
        }
      }, 10 * 60 * 1000); // 10 minutes of inactivity
    };

    // Listen for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, true);
    });

    // Initial activity setup
    handleUserActivity();

    return () => {
      clearTimeout(inactivityTimer);
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity, true);
      });
    };
  }, [statusData.status, statusData.customMessage]);

  return {
    statusData,
    isLoading,
    updateStatus,
    getStatusForDisplay,
  };
}
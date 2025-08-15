import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Bell,
  Shield,
  MapPin,
  Eye,
  Users,
  MessageCircle,
  Smartphone,
  Globe,
  CircleHelp as HelpCircle,
  FileText,
  Trash2,
  LogOut,
  ChevronRight,
} from 'lucide-react-native';

interface SettingsState {
  notifications: {
    connectionRequests: boolean;
    messages: boolean;
    nearbyProfessionals: boolean;
    aiSuggestions: boolean;
    eventInvites: boolean;
    pushNotifications: boolean;
  };
  privacy: {
    profileVisibility: 'everyone' | 'connections' | 'nobody';
    showOnlineStatus: boolean;
    showLastSeen: boolean;
    allowLocationSharing: boolean;
    showInSearch: boolean;
  };
  discovery: {
    maxDistance: number;
    autoHide: boolean;
    showCompatibilityScore: boolean;
    industryFilter: boolean;
  };
}

export default function SettingsScreen() {
  const [settings, setSettings] = useState<SettingsState>({
    notifications: {
      connectionRequests: true,
      messages: true,
      nearbyProfessionals: true,
      aiSuggestions: false,
      eventInvites: true,
      pushNotifications: true,
    },
    privacy: {
      profileVisibility: 'everyone',
      showOnlineStatus: true,
      showLastSeen: true,
      allowLocationSharing: true,
      showInSearch: true,
    },
    discovery: {
      maxDistance: 500,
      autoHide: true,
      showCompatibilityScore: true,
      industryFilter: false,
    },
  });

  const updateNotificationSetting = (key: keyof SettingsState['notifications'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }));
  };

  const updatePrivacySetting = (key: keyof SettingsState['privacy'], value: any) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value,
      },
    }));
  };

  const updateDiscoverySetting = (key: keyof SettingsState['discovery'], value: any) => {
    setSettings(prev => ({
      ...prev,
      discovery: {
        ...prev.discovery,
        [key]: value,
      },
    }));
  };

  const handleDistanceChange = () => {
    Alert.alert(
      'Discovery Distance',
      'Choose your maximum discovery radius',
      [
        { text: '100m', onPress: () => updateDiscoverySetting('maxDistance', 100) },
        { text: '250m', onPress: () => updateDiscoverySetting('maxDistance', 250) },
        { text: '500m', onPress: () => updateDiscoverySetting('maxDistance', 500) },
        { text: '1km', onPress: () => updateDiscoverySetting('maxDistance', 1000) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleVisibilityChange = () => {
    Alert.alert(
      'Profile Visibility',
      'Who can see your profile?',
      [
        { text: 'Everyone', onPress: () => updatePrivacySetting('profileVisibility', 'everyone') },
        { text: 'Connections Only', onPress: () => updatePrivacySetting('profileVisibility', 'connections') },
        { text: 'Nobody', onPress: () => updatePrivacySetting('profileVisibility', 'nobody') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleBlockedUsers = () => {
    router.push('/settings/blocked-users');
  };

  const handlePrivacyPolicy = () => {
    Alert.alert('Privacy Policy', 'Opening privacy policy...');
  };

  const handleTermsOfService = () => {
    Alert.alert('Terms of Service', 'Opening terms of service...');
  };

  const handleHelp = () => {
    router.push('/settings/help');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deleted', 'Your account has been permanently deleted.');
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            router.replace('/');
          },
        },
      ]
    );
  };

  const SettingRow = ({
    icon: Icon,
    title,
    subtitle,
    value,
    onPress,
    showSwitch = false,
    switchValue,
    onSwitchChange,
    showArrow = true,
  }: {
    icon: any;
    title: string;
    subtitle?: string;
    value?: string;
    onPress?: () => void;
    showSwitch?: boolean;
    switchValue?: boolean;
    onSwitchChange?: (value: boolean) => void;
    showArrow?: boolean;
  }) => (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      disabled={showSwitch}
    >
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Icon size={20} color="#6B7280" strokeWidth={2} />
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && (
            <Text style={styles.settingSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      <View style={styles.settingRight}>
        {value && (
          <Text style={styles.settingValue}>{value}</Text>
        )}
        {showSwitch && (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ false: '#E5E7EB', true: '#BFDBFE' }}
            thumbColor={switchValue ? '#1E40AF' : '#9CA3AF'}
          />
        )}
        {showArrow && !showSwitch && (
          <ChevronRight size={20} color="#D1D5DB" strokeWidth={2} />
        )}
      </View>
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#111827" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Notifications Section */}
        <SectionHeader title="Notifications" />
        <View style={styles.section}>
          <SettingRow
            icon={Bell}
            title="Push Notifications"
            subtitle="Enable all push notifications"
            showSwitch={true}
            switchValue={settings.notifications.pushNotifications}
            onSwitchChange={(value) => updateNotificationSetting('pushNotifications', value)}
          />
          <SettingRow
            icon={Users}
            title="Connection Requests"
            subtitle="New connection requests"
            showSwitch={true}
            switchValue={settings.notifications.connectionRequests}
            onSwitchChange={(value) => updateNotificationSetting('connectionRequests', value)}
          />
          <SettingRow
            icon={MessageCircle}
            title="Messages"
            subtitle="New messages from connections"
            showSwitch={true}
            switchValue={settings.notifications.messages}
            onSwitchChange={(value) => updateNotificationSetting('messages', value)}
          />
          <SettingRow
            icon={MapPin}
            title="Nearby Professionals"
            subtitle="When professionals are nearby"
            showSwitch={true}
            switchValue={settings.notifications.nearbyProfessionals}
            onSwitchChange={(value) => updateNotificationSetting('nearbyProfessionals', value)}
          />
          <SettingRow
            icon={Smartphone}
            title="AI Suggestions"
            subtitle="AI-powered networking suggestions"
            showSwitch={true}
            switchValue={settings.notifications.aiSuggestions}
            onSwitchChange={(value) => updateNotificationSetting('aiSuggestions', value)}
          />
        </View>

        {/* Privacy Section */}
        <SectionHeader title="Privacy & Safety" />
        <View style={styles.section}>
          <SettingRow
            icon={Eye}
            title="Profile Visibility"
            subtitle="Who can see your profile"
            value={settings.privacy.profileVisibility === 'everyone' ? 'Everyone' : 
                   settings.privacy.profileVisibility === 'connections' ? 'Connections Only' : 'Nobody'}
            onPress={handleVisibilityChange}
          />
          <SettingRow
            icon={MapPin}
            title="Location Sharing"
            subtitle="Allow others to see your location"
            showSwitch={true}
            switchValue={settings.privacy.allowLocationSharing}
            onSwitchChange={(value) => updatePrivacySetting('allowLocationSharing', value)}
          />
          <SettingRow
            icon={Globe}
            title="Show Online Status"
            subtitle="Let others see when you're online"
            showSwitch={true}
            switchValue={settings.privacy.showOnlineStatus}
            onSwitchChange={(value) => updatePrivacySetting('showOnlineStatus', value)}
          />
          <SettingRow
            icon={Users}
            title="Show in Search"
            subtitle="Appear in search results"
            showSwitch={true}
            switchValue={settings.privacy.showInSearch}
            onSwitchChange={(value) => updatePrivacySetting('showInSearch', value)}
          />
          <SettingRow
            icon={Shield}
            title="Blocked Users"
            subtitle="Manage blocked users"
            onPress={handleBlockedUsers}
          />
        </View>

        {/* Discovery Section */}
        <SectionHeader title="Discovery" />
        <View style={styles.section}>
          <SettingRow
            icon={MapPin}
            title="Discovery Distance"
            subtitle="Maximum distance for finding professionals"
            value={settings.discovery.maxDistance >= 1000 ? 
                   `${settings.discovery.maxDistance / 1000}km` : 
                   `${settings.discovery.maxDistance}m`}
            onPress={handleDistanceChange}
          />
          <SettingRow
            icon={Eye}
            title="Auto-Hide When Moving"
            subtitle="Hide your location when walking/driving"
            showSwitch={true}
            switchValue={settings.discovery.autoHide}
            onSwitchChange={(value) => updateDiscoverySetting('autoHide', value)}
          />
          <SettingRow
            icon={Smartphone}
            title="Show Compatibility Score"
            subtitle="Display AI compatibility percentages"
            showSwitch={true}
            switchValue={settings.discovery.showCompatibilityScore}
            onSwitchChange={(value) => updateDiscoverySetting('showCompatibilityScore', value)}
          />
        </View>

        {/* Support Section */}
        <SectionHeader title="Support" />
        <View style={styles.section}>
          <SettingRow
            icon={HelpCircle}
            title="Help & Support"
            subtitle="Get help or contact support"
            onPress={handleHelp}
          />
          <SettingRow
            icon={FileText}
            title="Privacy Policy"
            subtitle="Read our privacy policy"
            onPress={handlePrivacyPolicy}
          />
          <SettingRow
            icon={FileText}
            title="Terms of Service"
            subtitle="Read our terms of service"
            onPress={handleTermsOfService}
          />
        </View>

        {/* Account Section */}
        <SectionHeader title="Account" />
        <View style={styles.section}>
          <SettingRow
            icon={Trash2}
            title="Delete Account"
            subtitle="Permanently delete your account"
            onPress={handleDeleteAccount}
            showArrow={false}
          />
          <SettingRow
            icon={LogOut}
            title="Sign Out"
            subtitle="Sign out of your account"
            onPress={handleLogout}
            showArrow={false}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>GreatWorld AI v1.0.0</Text>
          <Text style={styles.footerSubtext}>
            Your privacy and safety are our top priorities
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 16,
  },
  headerSpacer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 32,
    marginBottom: 8,
    marginHorizontal: 20,
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
});
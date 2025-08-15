import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { Settings, CreditCard as Edit3, Shield, Eye, EyeOff, MapPin, Briefcase, Users, Star, Bell, Lock, CircleHelp as HelpCircle, LogOut, Camera, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import UserStatusIndicator from '@/components/UserStatusIndicator';
import UserStatusSelector from '@/components/UserStatusSelector';
import { useUserStatus } from '@/hooks/useUserStatus';

interface UserProfile {
  firstName: string;
  lastName: string;
  photo: string;
  profession: string;
  company: string;
  bio: string;
  interests: string[];
  lookingFor: string[];
  isVerified: boolean;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  connections: number;
  profileViews: number;
  compatibility: number;
}

const mockProfile: UserProfile = {
  firstName: 'Nejmo',
  lastName: 'Serraoui',
  photo: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  profession: 'Senior Software Engineer',
  company: 'Apple',
  bio: 'Passionate about building scalable mobile applications and AI-driven solutions. Always looking to connect with fellow innovators.',
  interests: ['iOS Development', 'Machine Learning', 'Startups', 'Design Patterns'],
  lookingFor: ['networking', 'collaboration', 'hiring'],
  isVerified: true,
  verificationStatus: 'verified',
  connections: 127,
  profileViews: 89,
  compatibility: 92,
};

export default function ProfileScreen() {
  const [profile] = useState<UserProfile>(mockProfile);
  const [isVisible, setIsVisible] = useState(true);
  const { statusData, updateStatus } = useUserStatus();

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing feature coming soon!');
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => console.log('Logout') },
      ]
    );
  };

  const handleVerification = () => {
    Alert.alert('ID Verification', 'Your identity has been successfully verified!');
  };

  const SettingsOption = ({
    icon: Icon,
    title,
    subtitle,
    onPress,
    showArrow = true,
    iconColor = '#6B7280',
    destructive = false,
  }: {
    icon: any;
    title: string;
    subtitle?: string;
    onPress: () => void;
    showArrow?: boolean;
    iconColor?: string;
    destructive?: boolean;
  }) => (
    <TouchableOpacity style={styles.settingsOption} onPress={onPress}>
      <View style={styles.settingsOptionLeft}>
        <View style={[styles.settingsIconContainer, destructive && styles.destructiveIconContainer]}>
          <Icon size={20} color={destructive ? '#EF4444' : iconColor} strokeWidth={2} />
        </View>
        <View>
          <Text style={[styles.settingsOptionTitle, destructive && styles.destructiveText]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.settingsOptionSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      {showArrow && (
        <Text style={styles.settingsArrow}>›</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.headerButton, !isVisible && styles.headerButtonInactive]}
            onPress={() => setIsVisible(!isVisible)}
          >
            {isVisible ? (
              <Eye size={20} color="#1E40AF" strokeWidth={2} />
            ) : (
              <EyeOff size={20} color="#6B7280" strokeWidth={2} />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleSettings}>
            <Settings size={20} color="#6B7280" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: profile.photo }} style={styles.profileImage} />
            <TouchableOpacity style={styles.cameraButton}>
              <Camera size={16} color="white" strokeWidth={2} />
            </TouchableOpacity>
            <View style={styles.statusIndicatorContainer}>
              <UserStatusIndicator status={statusData.status} size={16} />
            </View>
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.nameContainer}>
              <Text style={styles.profileName}>
                {profile.firstName} {profile.lastName}
              </Text>
              {profile.isVerified && (
                <Shield size={20} color="#1E40AF" strokeWidth={2} />
              )}
            </View>
            <Text style={styles.profileProfession}>{profile.profession}</Text>
            <Text style={styles.profileCompany}>{profile.company}</Text>

            <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile}>
              <Edit3 size={16} color="#1E40AF" strokeWidth={2} />
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Status Section */}
        <View style={styles.statusSection}>
          <Text style={styles.sectionTitle}>Your Status</Text>
          <UserStatusSelector
            currentStatus={statusData.status}
            customMessage={statusData.customMessage}
            onStatusChange={updateStatus}
          />
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile.connections}</Text>
            <Text style={styles.statLabel}>Connections</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile.profileViews}</Text>
            <Text style={styles.statLabel}>Profile Views</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile.compatibility}%</Text>
            <Text style={styles.statLabel}>Avg Match</Text>
          </View>
        </View>

        {/* Bio Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bioText}>{profile.bio}</Text>
        </View>

        {/* Interests Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <View style={styles.tagsContainer}>
            {profile.interests.map((interest, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Looking For Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Looking For</Text>
          <Text style={styles.lookingForText}>
            {profile.lookingFor.map(item => item.charAt(0).toUpperCase() + item.slice(1)).join(', ')}
          </Text>
        </View>

        {/* Verification Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verification Status</Text>
          <TouchableOpacity style={styles.verificationCard} onPress={handleVerification}>
            <View style={styles.verificationLeft}>
              {profile.verificationStatus === 'verified' && (
                <CheckCircle size={24} color="#10B981" strokeWidth={2} />
              )}
              {profile.verificationStatus === 'pending' && (
                <AlertTriangle size={24} color="#F59E0B" strokeWidth={2} />
              )}
              <View style={styles.verificationInfo}>
                <Text style={styles.verificationTitle}>
                  {profile.verificationStatus === 'verified' && 'Identity Verified'}
                  {profile.verificationStatus === 'pending' && 'Verification Pending'}
                </Text>
                <Text style={styles.verificationSubtitle}>
                  {profile.verificationStatus === 'verified' && 'Your identity has been confirmed'}
                  {profile.verificationStatus === 'pending' && 'Review in progress'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Settings Options */}
        <View style={styles.settingsSection}>
          <SettingsOption
            icon={Bell}
            title="Notifications"
            subtitle="Manage your notification preferences"
            onPress={() => Alert.alert('Notifications', 'Notification settings coming soon!')}
          />
          <SettingsOption
            icon={Lock}
            title="Privacy & Safety"
            subtitle="Control your visibility and safety settings"
            onPress={() => Alert.alert('Privacy', 'Privacy settings coming soon!')}
          />
          <SettingsOption
            icon={MapPin}
            title="Location Settings"
            subtitle="Manage location sharing preferences"
            onPress={() => Alert.alert('Location', 'Location settings coming soon!')}
          />
          <SettingsOption
            icon={HelpCircle}
            title="Help & Support"
            subtitle="Get help or contact support"
            onPress={() => Alert.alert('Help', 'Support center coming soon!')}
          />
          <SettingsOption
            icon={LogOut}
            title="Sign Out"
            onPress={handleLogout}
            showArrow={false}
            destructive={true}
          />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonInactive: {
    backgroundColor: '#E5E7EB',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIndicatorContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileInfo: {
    alignItems: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  profileProfession: {
    fontSize: 18,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  profileCompany: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF8FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 6,
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E40AF',
  },
  statusSection: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 12,
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginTop: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  bioText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#EBF8FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E40AF',
  },
  lookingForText: {
    fontSize: 16,
    color: '#374151',
  },
  verificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
  },
  verificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  verificationInfo: {
    flex: 1,
  },
  verificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  verificationSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  settingsSection: {
    backgroundColor: 'white',
    marginTop: 12,
    marginBottom: 20,
  },
  settingsOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingsOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  destructiveIconContainer: {
    backgroundColor: '#FEF2F2',
  },
  settingsOptionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  settingsOptionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  destructiveText: {
    color: '#EF4444',
  },
  settingsArrow: {
    fontSize: 20,
    color: '#D1D5DB',
    fontWeight: '300',
  },
});
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { MapPin, Radar, Eye, EyeOff, Zap, MessageSquare, Shield, Settings, RefreshCw, Users, Camera, Calendar, ChartBar as BarChart3, Clock } from 'lucide-react-native';
import ARDiscoveryView from '@/components/ARDiscoveryView';
import SmartScheduling from '@/components/SmartScheduling';
import NetworkAnalytics from '@/components/NetworkAnalytics';
import ProfileModal from '@/components/ProfileModal';

interface NearbyUser {
  id: string;
  firstName: string;
  lastName: string;
  photo: string;
  profession: string;
  company: string;
  distance: number;
  compatibility: number;
  interests: string[];
  lookingFor: string[];
  isVerified: boolean;
  lastActive: string;
}

const mockNearbyUsers: NearbyUser[] = [
  {
    id: '1',
    firstName: 'Nejmo',
    lastName: 'Serraoui',
    photo: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    profession: 'Product Manager',
    company: 'Meta',
    distance: 85,
    compatibility: 94,
    interests: ['AI', 'Product Strategy', 'Startups'],
    lookingFor: ['networking', 'collaboration'],
    isVerified: true,
    lastActive: '2 min ago',
  },
  {
    id: '2',
    firstName: 'Marcus',
    lastName: 'Rodriguez',
    photo: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    profession: 'Software Engineer',
    company: 'Google',
    distance: 120,
    compatibility: 89,
    interests: ['Machine Learning', 'Open Source', 'Blockchain'],
    lookingFor: ['hiring', 'networking'],
    isVerified: true,
    lastActive: '5 min ago',
  },
  {
    id: '3',
    firstName: 'Emily',
    lastName: 'Johnson',
    photo: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    profession: 'UX Designer',
    company: 'Airbnb',
    distance: 95,
    compatibility: 92,
    interests: ['Design Systems', 'User Research', 'Accessibility'],
    lookingFor: ['collaboration', 'networking'],
    isVerified: true,
    lastActive: '1 min ago',
  },
];

export default function DiscoverScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isStationary, setIsStationary] = useState(true);
  const [nearbyUsers, setNearbyUsers] = useState<NearbyUser[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showARView, setShowARView] = useState(false);
  const [showScheduling, setShowScheduling] = useState(false);
  const [selectedUser, setSelectedUser] = useState<NearbyUser | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<NearbyUser | null>(null);

  useEffect(() => {
    // Simulate loading nearby users
    setTimeout(() => {
      setNearbyUsers(mockNearbyUsers);
    }, 1000);
  }, []);

  const handleVisibilityToggle = () => {
    setIsVisible(!isVisible);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Shuffle the users array to simulate new data
    setTimeout(() => {
      setNearbyUsers([...mockNearbyUsers].sort(() => Math.random() - 0.5));
      setRefreshing(false);
    }, 100);
  };

  const handleConnectRequest = (user: NearbyUser) => {
    setSelectedProfile(user);
    setShowProfileModal(true);
  };

  const handleUserCardPress = (user: NearbyUser) => {
    setSelectedProfile(user);
    setShowProfileModal(true);
  };

  const handleConnect = (profileId: string) => {
    // Update the user's connection status
    setNearbyUsers(prev => 
      prev.map(user => 
        user.id === profileId 
          ? { ...user, connectionStatus: 'pending_sent' }
          : user
      )
    );
    setShowProfileModal(false);
  };

  const handleMessage = (profileId: string) => {
    // Close modal first, then navigate
    setShowProfileModal(false);
    setSelectedProfile(null);
    router.push(`/chat/${profileId}`);
  };

  const handleViewFullProfile = (profileId: string) => {
    setShowProfileModal(false);
    setSelectedProfile(null);
    router.push(`/profile/${profileId}`);
  };

  const handleScheduleMeeting = (slot: any) => {
    console.log('Meeting scheduled:', slot);
  };

  const arUsers = nearbyUsers.map(user => ({
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    profession: user.profession,
    distance: user.distance,
    direction: Math.random() * 360, // Mock direction
    compatibility: user.compatibility,
    isVerified: user.isVerified,
  }));
  
  const StatusIndicator = () => (
    <View style={styles.statusContainer}>
      <View style={[styles.statusIndicator, isStationary ? styles.stationaryStatus : styles.movingStatus]}>
        <View style={styles.statusIconContainer}>
          {isStationary ? (
            <Radar size={16} color="white" strokeWidth={2} />
          ) : (
            <MapPin size={16} color="white" strokeWidth={2} />
          )}
        </View>
        <Text style={styles.statusText}>
          {isStationary ? 'You are stationary - Visible to nearby professionals' : 'You are moving - Hidden from radar'}
        </Text>
      </View>
    </View>
  );

interface UserCardProps {
  user: NearbyUser;
}

  const UserCard = ({ user }: UserCardProps) => (
    <TouchableOpacity 
      style={styles.userCard}
      onPress={() => handleUserCardPress(user)}
      activeOpacity={0.7}
    >
      <View style={styles.userCardHeader}>
        <View style={styles.userInfo}>
          <Image source={{ uri: user.photo }} style={styles.userPhoto} />
          <View style={styles.userDetails}>
            <View style={styles.nameContainer}>
              <Text style={styles.userName}>{user.firstName} {user.lastName}</Text>
              {user.isVerified && (
                <Shield size={16} color="#1E40AF" strokeWidth={2} />
              )}
            </View>
            <Text style={styles.userProfession}>{user.profession}</Text>
            <Text style={styles.userCompany}>{user.company}</Text>
            <View style={styles.metaItem}>
              <Text style={styles.metaText}>{user.distance}m away</Text>
            </View>
          </View>
        </View>
        <View style={styles.metaItem}>
          <Clock size={14} color="#6B7280" strokeWidth={2} />
          <Text style={styles.metaText}>{user.lastActive}</Text>
        </View>
        <View style={styles.compatibilityBadge}>
          <Zap size={12} color="#FBBF24" strokeWidth={2} />
          <Text style={styles.compatibilityText}>{user.compatibility}%</Text>
        </View>
      </View>

      <View style={styles.tagsContainer}>
        {user.interests.slice(0, 3).map((interest, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{interest}</Text>
          </View>
        ))}
      </View>

      <View style={styles.lookingForContainer}>
        <Text style={styles.lookingForLabel}>Looking for:</Text>
        <Text style={styles.lookingForText}>
          {user.lookingFor.map(item => item.charAt(0).toUpperCase() + item.slice(1)).join(', ')}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.connectButton}
        onPress={(e) => {
          e.stopPropagation();
          handleConnectRequest(user);
        }}
      >
        <Users size={16} color="white" strokeWidth={2} />
        <Text style={styles.connectButtonText}>View Profile</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Discover</Text>
          <Text style={styles.headerSubtitle}>Professionals nearby</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleRefresh}
          >
            <RefreshCw 
              size={20} 
              color="#6B7280" 
              strokeWidth={2}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowAnalytics(!showAnalytics)}
          >
            <BarChart3 
              size={20} 
              color="#6B7280" 
              strokeWidth={2}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowARView(true)}
          >
            <Camera 
              size={20} 
              color="#6B7280" 
              strokeWidth={2}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerButton, !isVisible && styles.headerButtonInactive]}
            onPress={handleVisibilityToggle}
          >
            {isVisible ? (
              <Eye size={20} color="#1E40AF" strokeWidth={2} />
            ) : (
              <EyeOff size={20} color="#6B7280" strokeWidth={2} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <StatusIndicator />

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#1E40AF']} // Android
            tintColor="#1E40AF" // iOS
            title="Finding nearby professionals..."
            titleColor="#6B7280"
          />
        }
      >
        {showAnalytics && <NetworkAnalytics visible={showAnalytics} />}
        
        {!showAnalytics && (
          <>
            {!isStationary && (
              <View style={styles.hiddenNotice}>
                <MapPin size={24} color="#F59E0B" strokeWidth={2} />
                <Text style={styles.hiddenNoticeTitle}>You're on the move!</Text>
                <Text style={styles.hiddenNoticeText}>
                  Stop for 2+ minutes to appear on the radar and see nearby professionals.
                </Text>
              </View>
            )}

            {isStationary && !isVisible && (
              <View style={styles.hiddenNotice}>
                <EyeOff size={24} color="#6B7280" strokeWidth={2} />
                <Text style={styles.hiddenNoticeTitle}>You're invisible</Text>
                <Text style={styles.hiddenNoticeText}>
                  Tap the eye icon above to become visible to nearby professionals.
                </Text>
              </View>
            )}

            {isStationary && isVisible && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Nearby Professionals</Text>
                  <Text style={styles.sectionSubtitle}>{nearbyUsers.length} people within 500m</Text>
                </View>

                {nearbyUsers.map(user => (
                  <UserCard key={user.id} user={user} />
                ))}

                {nearbyUsers.length === 0 && (
                  <View style={styles.emptyState}>
                    <Radar size={48} color="#D1D5DB" strokeWidth={1.5} />
                    <Text style={styles.emptyStateTitle}>No one nearby</Text>
                    <Text style={styles.emptyStateText}>
                      Try moving to a different location or check back later.
                    </Text>
                  </View>
                )}
              </>
            )}
          </>
        )}
      </ScrollView>

      <ARDiscoveryView
        visible={showARView}
        onClose={() => setShowARView(false)}
        nearbyUsers={arUsers}
      />

      {selectedUser && (
        <SmartScheduling
          visible={showScheduling}
          onClose={() => {
            setShowScheduling(false);
            setSelectedUser(null);
          }}
          targetUser={{
            name: `${selectedUser.firstName} ${selectedUser.lastName}`,
            profession: selectedUser.profession,
            company: selectedUser.company,
          }}
          onScheduleMeeting={handleScheduleMeeting}
        />
      )}

      <ProfileModal
        visible={showProfileModal}
        onClose={() => {
          setShowProfileModal(false);
          setSelectedProfile(null);
        }}
        profile={selectedProfile ? {
          ...selectedProfile,
          bio: 'Passionate about building products that connect people and drive meaningful engagement. 8+ years in product management with focus on AI-driven features and user experience optimization.',
          joinedDate: '2023-08-15',
          location: 'San Francisco, CA',
          connectionStatus: selectedProfile.connectionStatus || 'none',
          status: 'available' as const,
          customMessage: selectedProfile.id === '1' ? 'Building the future of AI' : '',
        } : null}
        onConnect={handleConnect}
        onMessage={handleMessage}
        onViewFullProfile={handleViewFullProfile}
      />
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
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
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
  statusContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  stationaryStatus: {
    backgroundColor: '#10B981',
  },
  movingStatus: {
    backgroundColor: '#F59E0B',
  },
  statusIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  hiddenNotice: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 32,
    borderRadius: 16,
    marginBottom: 20,
  },
  hiddenNoticeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
  },
  hiddenNoticeText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  userCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  userCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  userPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  userProfession: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
  },
  userCompany: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
  },
  userDistance: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  compatibilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  compatibilityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D97706',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#EBF8FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1E40AF',
  },
  lookingForContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  lookingForLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  lookingForText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E40AF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  connectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 48,
    borderRadius: 16,
    marginTop: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});
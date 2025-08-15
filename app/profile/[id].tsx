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
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Shield, MapPin, Briefcase, Users, MessageCircle, Calendar, Star, Flag, MoveHorizontal as MoreHorizontal, Zap, Clock, CircleCheck as CheckCircle } from 'lucide-react-native';
import AIConversationStarters from '@/components/AIConversationStarters';
import SmartScheduling from '@/components/SmartScheduling';
import VoiceIntroductions from '@/components/VoiceIntroductions';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  photo: string;
  profession: string;
  company: string;
  bio: string;
  interests: string[];
  lookingFor: string[];
  isVerified: boolean;
  distance: number;
  compatibility: number;
  lastActive: string;
  connections: number;
  mutualConnections: number;
  connectionStatus: 'none' | 'pending_sent' | 'pending_received' | 'connected' | 'blocked';
  joinedDate: string;
  location: string;
}

const mockProfiles: { [key: string]: UserProfile } = {
  '1': {
    id: '1',
    firstName: 'Nejmo',
    lastName: 'Serraoui',
    photo: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    profession: 'Senior Product Manager',
    company: 'Meta',
    bio: 'Passionate about building products that connect people and drive meaningful engagement. 8+ years in product management with focus on AI-driven features and user experience optimization.',
    interests: ['AI & Machine Learning', 'Product Strategy', 'User Experience', 'Startups', 'Design Thinking'],
    lookingFor: ['networking', 'collaboration', 'mentoring'],
    isVerified: true,
    distance: 85,
    compatibility: 94,
    lastActive: '2 min ago',
    connections: 234,
    mutualConnections: 12,
    connectionStatus: 'none',
    joinedDate: '2023-08-15',
    location: 'San Francisco, CA',
  },
  '2': {
    id: '2',
    firstName: 'Marcus',
    lastName: 'Rodriguez',
    photo: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    profession: 'Senior Software Engineer',
    company: 'Google',
    bio: 'Full-stack developer specializing in scalable web applications and machine learning systems. Open source contributor and tech community organizer.',
    interests: ['Machine Learning', 'Open Source', 'Blockchain', 'Cloud Architecture', 'DevOps'],
    lookingFor: ['hiring', 'networking', 'collaboration'],
    isVerified: true,
    distance: 120,
    compatibility: 89,
    lastActive: '5 min ago',
    connections: 189,
    mutualConnections: 8,
    connectionStatus: 'pending_sent',
    joinedDate: '2023-09-22',
    location: 'Palo Alto, CA',
  },
  '3': {
    id: '3',
    firstName: 'Emily',
    lastName: 'Johnson',
    photo: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    profession: 'Senior UX Designer',
    company: 'Airbnb',
    bio: 'Design systems expert with a passion for creating inclusive and accessible user experiences. Leading design for mobile and web platforms.',
    interests: ['Design Systems', 'User Research', 'Accessibility', 'Mobile Design', 'Prototyping'],
    lookingFor: ['collaboration', 'networking', 'speaking'],
    isVerified: true,
    distance: 95,
    compatibility: 92,
    lastActive: '1 min ago',
    connections: 156,
    mutualConnections: 15,
    connectionStatus: 'connected',
    joinedDate: '2023-07-10',
    location: 'San Francisco, CA',
  },
};

export default function ProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showAIStarters, setShowAIStarters] = useState(false);
  const [showScheduling, setShowScheduling] = useState(false);
  const [showVoiceIntro, setShowVoiceIntro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading profile data
    setTimeout(() => {
      if (id && mockProfiles[id]) {
        setProfile(mockProfiles[id]);
      }
      setIsLoading(false);
    }, 500);
  }, [id]);

  const handleConnect = () => {
    if (!profile) return;

    Alert.alert(
      'Send Connection Request',
      `Send a connection request to ${profile.firstName} ${profile.lastName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'AI Starters',
          onPress: () => setShowAIStarters(true),
        },
        {
          text: 'Voice Intro',
          onPress: () => setShowVoiceIntro(true),
        },
        {
          text: 'Send Request',
          style: 'default',
          onPress: () => {
            setProfile(prev => prev ? { ...prev, connectionStatus: 'pending_sent' } : null);
            Alert.alert('Request Sent!', `Your connection request has been sent to ${profile.firstName}.`);
          },
        },
      ]
    );
  };

  const handleMessage = () => {
    if (!profile) return;
    Alert.alert('Message', `Start a conversation with ${profile.firstName}?`);
  };

  const handleScheduleMeeting = () => {
    if (!profile) return;
    setShowScheduling(true);
  };

  const handleReport = () => {
    if (!profile) return;
    Alert.alert(
      'Report User',
      'Why are you reporting this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Inappropriate Content', onPress: () => Alert.alert('Reported', 'Thank you for your report.') },
        { text: 'Fake Profile', onPress: () => Alert.alert('Reported', 'Thank you for your report.') },
        { text: 'Harassment', onPress: () => Alert.alert('Reported', 'Thank you for your report.') },
      ]
    );
  };

  const handleSendMessage = (message: string) => {
    console.log('Sending message:', message);
  };

  const handleSendVoiceIntro = (audioData: string) => {
    console.log('Sending voice intro:', audioData);
  };

  const handleScheduleSlot = (slot: any) => {
    console.log('Scheduling meeting:', slot);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Profile not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getConnectionStatusButton = () => {
    switch (profile.connectionStatus) {
      case 'pending_sent':
        return (
          <TouchableOpacity style={[styles.actionButton, styles.pendingButton]} disabled>
            <Clock size={16} color="#6B7280" strokeWidth={2} />
            <Text style={styles.pendingButtonText}>Request Sent</Text>
          </TouchableOpacity>
        );
      case 'pending_received':
        return (
          <TouchableOpacity style={[styles.actionButton, styles.acceptButton]} onPress={handleConnect}>
            <CheckCircle size={16} color="white" strokeWidth={2} />
            <Text style={styles.acceptButtonText}>Accept Request</Text>
          </TouchableOpacity>
        );
      case 'connected':
        return (
          <TouchableOpacity style={[styles.actionButton, styles.messageButton]} onPress={handleMessage}>
            <MessageCircle size={16} color="#1E40AF" strokeWidth={2} />
            <Text style={styles.messageButtonText}>Message</Text>
          </TouchableOpacity>
        );
      default:
        return (
          <TouchableOpacity style={[styles.actionButton, styles.connectButton]} onPress={handleConnect}>
            <Users size={16} color="white" strokeWidth={2} />
            <Text style={styles.connectButtonText}>Connect</Text>
          </TouchableOpacity>
        );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#111827" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.headerButton} onPress={handleReport}>
          <MoreHorizontal size={24} color="#6B7280" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image source={{ uri: profile.photo }} style={styles.profilePhoto} />
          
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
            
            <View style={styles.metaInfo}>
              <View style={styles.metaItem}>
                <MapPin size={14} color="#6B7280" strokeWidth={2} />
                <Text style={styles.metaText}>{profile.distance}m away</Text>
              </View>
              <View style={styles.metaItem}>
                <Clock size={14} color="#6B7280" strokeWidth={2} />
                <Text style={styles.metaText}>{profile.lastActive}</Text>
              </View>
            </View>
          </View>

          <View style={styles.compatibilityBadge}>
            <Zap size={12} color="#FBBF24" strokeWidth={2} />
            <Text style={styles.compatibilityText}>{profile.compatibility}%</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile.connections}</Text>
            <Text style={styles.statLabel}>Connections</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile.mutualConnections}</Text>
            <Text style={styles.statLabel}>Mutual</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {new Date(profile.joinedDate).getFullYear()}
            </Text>
            <Text style={styles.statLabel}>Joined</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {getConnectionStatusButton()}
          
          {profile.connectionStatus === 'connected' && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.scheduleButton]} 
              onPress={handleScheduleMeeting}
            >
              <Calendar size={16} color="#10B981" strokeWidth={2} />
              <Text style={styles.scheduleButtonText}>Schedule</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Bio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bioText}>{profile.bio}</Text>
        </View>

        {/* Interests */}
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

        {/* Looking For */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Looking For</Text>
          <Text style={styles.lookingForText}>
            {profile.lookingFor.map(item => 
              item.charAt(0).toUpperCase() + item.slice(1)
            ).join(', ')}
          </Text>
        </View>

        {/* Professional Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Details</Text>
          <View style={styles.professionalInfo}>
            <View style={styles.professionalItem}>
              <Briefcase size={16} color="#6B7280" strokeWidth={2} />
              <Text style={styles.professionalText}>{profile.profession} at {profile.company}</Text>
            </View>
            <View style={styles.professionalItem}>
              <MapPin size={16} color="#6B7280" strokeWidth={2} />
              <Text style={styles.professionalText}>{profile.location}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* AI Conversation Starters Modal */}
      <AIConversationStarters
        visible={showAIStarters}
        onClose={() => setShowAIStarters(false)}
        targetUserName={profile.firstName}
        targetUserProfession={profile.profession}
        targetUserCompany={profile.company}
        onSendMessage={handleSendMessage}
      />

      {/* Smart Scheduling Modal */}
      <SmartScheduling
        visible={showScheduling}
        onClose={() => setShowScheduling(false)}
        targetUser={{
          name: `${profile.firstName} ${profile.lastName}`,
          profession: profile.profession,
          company: profile.company,
        }}
        onScheduleMeeting={handleScheduleSlot}
      />

      {/* Voice Introduction Modal */}
      <VoiceIntroductions
        visible={showVoiceIntro}
        onClose={() => setShowVoiceIntro(false)}
        targetUser={{
          name: `${profile.firstName} ${profile.lastName}`,
          profession: profile.profession,
        }}
        onSendVoiceIntro={handleSendVoiceIntro}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#1E40AF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
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
  headerButton: {
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
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: 'white',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  profilePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  profileProfession: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  profileCompany: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  metaInfo: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
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
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 20,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
  },
  connectButton: {
    backgroundColor: '#1E40AF',
  },
  connectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  pendingButton: {
    backgroundColor: '#F3F4F6',
  },
  pendingButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  acceptButton: {
    backgroundColor: '#10B981',
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  messageButton: {
    backgroundColor: '#EBF8FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  messageButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
  },
  scheduleButton: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  scheduleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
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
  professionalInfo: {
    gap: 12,
  },
  professionalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  professionalText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
});
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import {
  X,
  Shield,
  MapPin,
  Briefcase,
  Users,
  MessageCircle,
  Calendar,
  Zap,
  Clock,
  CircleCheck as CheckCircle,
  Eye,
} from 'lucide-react-native';
import UserStatusIndicator, { UserStatus } from './UserStatusIndicator';

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
  status?: UserStatus;
  customMessage?: string;
}

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
  profile: UserProfile | null;
  onConnect: (profileId: string) => void;
  onMessage: (profileId: string) => void;
  onViewFullProfile: (profileId: string) => void;
}

export default function ProfileModal({
  visible,
  onClose,
  profile,
  onConnect,
  onMessage,
  onViewFullProfile,
}: ProfileModalProps) {
  if (!profile) return null;

  const handleConnect = () => {
    Alert.alert(
      'Send Connection Request',
      `Send a connection request to ${profile.firstName} ${profile.lastName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Request',
          onPress: () => {
            onConnect(profile.id);
            Alert.alert('Request Sent!', `Your connection request has been sent to ${profile.firstName}.`);
          },
        },
      ]
    );
  };

  const handleMessage = () => {
    onMessage(profile.id);
    onClose();
  };

  const handleViewFullProfile = () => {
    onViewFullProfile(profile.id);
    onClose();
  };

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
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#6B7280" strokeWidth={2} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.viewFullButton} onPress={handleViewFullProfile}>
            <Eye size={16} color="#1E40AF" strokeWidth={2} />
            <Text style={styles.viewFullButtonText}>View Full Profile</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.profilePhotoContainer}>
              <Image source={{ uri: profile.photo }} style={styles.profilePhoto} />
              {profile.status && (
                <View style={styles.statusIndicatorContainer}>
                  <UserStatusIndicator status={profile.status} size={12} />
                </View>
              )}
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
              
              {profile.customMessage && (
                <Text style={styles.customStatusMessage}>{profile.customMessage}</Text>
              )}
              
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

          {/* Bio */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bioText} numberOfLines={3}>
              {profile.bio}
            </Text>
          </View>

          {/* Interests */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={styles.tagsContainer}>
              {profile.interests.slice(0, 6).map((interest, index) => (
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
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {getConnectionStatusButton()}
          
          {profile.connectionStatus === 'connected' && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.scheduleButton]} 
              onPress={() => {
                Alert.alert('Schedule Meeting', 'Meeting scheduling feature coming soon!');
              }}
            >
              <Calendar size={16} color="#10B981" strokeWidth={2} />
              <Text style={styles.scheduleButtonText}>Schedule</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    maxHeight: Dimensions.get('window').height * 0.9,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewFullButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF8FF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  viewFullButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E40AF',
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
  profilePhotoContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profilePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  statusIndicatorContainer: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
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
  customStatusMessage: {
    fontSize: 12,
    color: '#8B5CF6',
    fontStyle: 'italic',
    marginBottom: 8,
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
  actionButtons: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
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
});
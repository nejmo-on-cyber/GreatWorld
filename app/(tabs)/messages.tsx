import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { router, useRouter } from 'expo-router';
import {
  MessageCircle,
  Search,
  Send,
  Shield,
  Circle,
} from 'lucide-react-native';
import ProfileModal from '@/components/ProfileModal';
import { useMessaging } from '@/hooks/useMessaging';
import StatusIndicator from '@/components/StatusIndicator';
import FloatingStatusDot from '@/components/FloatingStatusDot';
import GlowingStatusDot from '@/components/GlowingStatusDot';

interface Message {
  id: string;
  firstName: string;
  lastName: string;
  photo: string;
  profession: string;
  company: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  isVerified: boolean;
  online: boolean;
  status: 'online' | 'offline' | 'away' | 'busy';
}

const mockMessages: Message[] = [
  {
    id: '1',
    firstName: 'Nejmo',
    lastName: 'Serraoui',
    photo: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    profession: 'Product Manager',
    company: 'Meta',
    lastMessage: 'Thanks for connecting! I\'d love to chat about product strategy sometime.',
    timestamp: '2m ago',
    unread: true,
    isVerified: true,
    online: true,
    status: 'online',
  },
  {
    id: '2',
    firstName: 'Marcus',
    lastName: 'Rodriguez',
    photo: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    profession: 'Software Engineer',
    company: 'Google',
    lastMessage: 'The React project sounds interesting. When can we discuss it?',
    timestamp: '1h ago',
    unread: true,
    isVerified: true,
    online: false,
    status: 'away',
  },
  {
    id: '3',
    firstName: 'Emily',
    lastName: 'Johnson',
    photo: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    profession: 'UX Designer',
    company: 'Airbnb',
    lastMessage: 'Great meeting you today! Looking forward to collaborating.',
    timestamp: '3h ago',
    unread: false,
    isVerified: true,
    online: true,
    status: 'busy',
  },
  {
    id: '4',
    firstName: 'David',
    lastName: 'Kim',
    photo: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    profession: 'Frontend Developer',
    company: 'Stripe',
    lastMessage: 'Thanks for the code review tips!',
    timestamp: '1d ago',
    unread: false,
    isVerified: true,
    online: false,
    status: 'offline',
  },
];

export default function MessagesScreen() {
  const { conversations, navigateToChat, isAILoading } = useMessaging();
  const navigation = useRouter();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Message | null>(null);

  const handleMessagePress = (message: Message) => {
    navigation.push(`/chat/${message.id}`);
  };

  const handleViewProfile = (conversation: any) => {
    setSelectedProfile({
      id: conversation.participantId,
      firstName: conversation.participantName.split(' ')[0],
      lastName: conversation.participantName.split(' ').slice(1).join(' '),
      photo: conversation.participantPhoto,
      profession: 'Professional',
      company: 'Unknown',
      lastMessage: conversation.lastMessage,
      timestamp: conversation.timestamp,
      unread: conversation.unread,
      isVerified: conversation.isConnected,
      online: false,
    });
    setShowProfileModal(true);
  };

  const handleConnect = (profileId: string) => {
    Alert.alert('Connection Request', 'Connection request sent!');
    setShowProfileModal(false);
  };

  const handleMessage = (profileId: string) => {
    // Close modal first, then navigate using messaging hook
    setShowProfileModal(false);
    setSelectedProfile(null);
    navigateToChat(profileId);
  };

  const handleViewFullProfile = (profileId: string) => {
    setShowProfileModal(false);
    setSelectedProfile(null);
    router.push(`/profile/${profileId}`);
  };

  const unreadCount = conversations.filter(conv => conv.unread).length;

  const MessageCard = ({ conversation }: { conversation: any }) => (
    <TouchableOpacity
      style={[styles.messageCard, conversation.unread && styles.unreadMessageCard]}
      onPress={() => navigation.push(`/chat/${conversation.id}`)}
      onLongPress={() => handleViewProfile(conversation)}
      activeOpacity={0.7}
    >
      <View style={styles.photoContainer}>
        <Image source={{ uri: conversation.participantPhoto }} style={styles.messagePhoto} />
        <GlowingStatusDot 
          status={conversation.status || 'offline'} 
          size={8} 
          position="top-right" 
        />
        {conversation.isConnected && (
          <View style={styles.connectionBadge}>
            <Shield size={10} color="white" strokeWidth={2} />
          </View>
        )}
      </View>
      
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <View style={styles.nameContainer}>
            <Text style={[styles.messageName, conversation.unread && styles.unreadMessageName]}>
              {conversation.participantName}
            </Text>
          </View>
          <Text style={[styles.messageTime, conversation.unread && styles.unreadMessageTime]}>
            {conversation.timestamp}
          </Text>
        </View>
        
        <Text style={[styles.lastMessage, conversation.unread && styles.unreadLastMessage]} numberOfLines={1}>
          {isAILoading && conversation.unread ? 'Typing...' : conversation.lastMessage || 'Start a conversation...'}
        </Text>
      </View>
      
      {conversation.unread && (
        <View style={styles.unreadIndicator}>
          <View style={styles.unreadBadge} />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Messages</Text>
          <Text style={styles.headerSubtitle}>
            {unreadCount > 0 ? `${unreadCount} unread messages` : 'All caught up!'}
          </Text>
        </View>
        <TouchableOpacity style={styles.searchButton}>
          <Search size={20} color="#6B7280" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {conversations.length > 0 ? (
          conversations.map(conversation => (
            <MessageCard key={conversation.id} conversation={conversation} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <MessageCircle size={48} color="#D1D5DB" strokeWidth={1.5} />
            <Text style={styles.emptyStateTitle}>No messages yet</Text>
            <Text style={styles.emptyStateText}>
              Start connecting with professionals nearby to begin conversations.
            </Text>
            <TouchableOpacity style={styles.discoverButton}>
              <Text style={styles.discoverButtonText}>Discover People</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <ProfileModal
        visible={showProfileModal}
        onClose={() => {
          setShowProfileModal(false);
          setSelectedProfile(null);
        }}
        profile={selectedProfile ? {
          id: selectedProfile.id,
          firstName: selectedProfile.firstName,
          lastName: selectedProfile.lastName,
          photo: selectedProfile.photo,
          profession: selectedProfile.profession,
          company: selectedProfile.company,
          bio: 'Passionate about building innovative solutions and connecting with fellow professionals in the tech industry.',
          interests: ['Technology', 'Innovation', 'Networking', 'Startups'],
          lookingFor: ['collaboration', 'networking'],
          isVerified: selectedProfile.isVerified,
          distance: Math.floor(Math.random() * 200) + 50,
          compatibility: Math.floor(Math.random() * 20) + 80,
          lastActive: '5 min ago',
          connections: Math.floor(Math.random() * 200) + 100,
          mutualConnections: Math.floor(Math.random() * 15) + 5,
          connectionStatus: 'connected',
          joinedDate: '2023-08-15',
          location: 'San Francisco, CA',
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
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500',
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  content: {
    flex: 1,
    paddingTop: 8,
  },
  messageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  unreadMessageCard: {
    backgroundColor: '#FEF7FF',
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.15,
  },
  photoContainer: {
    position: 'relative',
    marginRight: 16,
  },
  messagePhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },

  connectionBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  messageContent: {
    flex: 1,
    justifyContent: 'center',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  nameContainer: {
    flex: 1,
  },
  messageName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  unreadMessageName: {
    color: '#1E293B',
  },
  messageTime: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
  unreadMessageTime: {
    color: '#8B5CF6',
    fontWeight: '600',
  },
  lastMessage: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 20,
    fontWeight: '400',
  },
  unreadLastMessage: {
    color: '#475569',
    fontWeight: '600',
  },
  unreadIndicator: {
    marginLeft: 12,
    justifyContent: 'center',
  },
  unreadBadge: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#8B5CF6',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 48,
    margin: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  discoverButton: {
    backgroundColor: '#1E40AF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  discoverButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.3,
  },
});
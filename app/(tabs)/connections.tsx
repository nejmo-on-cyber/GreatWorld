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
import { Users, Clock, Check, X, MessageCircle, Shield, MoveHorizontal as MoreHorizontal, UserCheck, UserMinus, Search } from 'lucide-react-native';
import ProfileModal from '@/components/ProfileModal';

interface Connection {
  id: string;
  firstName: string;
  lastName: string;
  photo: string;
  profession: string;
  company: string;
  status: 'pending_sent' | 'pending_received' | 'accepted' | 'rejected';
  connectedAt?: string;
  introMessage?: string;
  lastMessage?: string;
  isVerified: boolean;
  mutualConnections?: number;
}

const mockConnections: Connection[] = [
  {
    id: '1',
    firstName: 'David',
    lastName: 'Kim',
    photo: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    profession: 'Frontend Developer',
    company: 'Stripe',
    status: 'pending_received',
    introMessage: 'Hi! I saw your profile and would love to connect. I\'m working on some exciting React projects.',
    isVerified: true,
    mutualConnections: 3,
  },
  {
    id: '2',
    firstName: 'Lisa',
    lastName: 'Wong',
    photo: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    profession: 'Product Designer',
    company: 'Figma',
    status: 'accepted',
    connectedAt: '2 days ago',
    lastMessage: 'Thanks for the connection! Looking forward to collaborating.',
    isVerified: true,
    mutualConnections: 7,
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Brown',
    photo: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    profession: 'Data Scientist',
    company: 'OpenAI',
    status: 'pending_sent',
    introMessage: 'Hello! I\'m interested in your AI work and would love to discuss potential collaborations.',
    isVerified: true,
  },
  {
    id: '4',
    firstName: 'Jessica',
    lastName: 'Taylor',
    photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    profession: 'Marketing Director',
    company: 'Notion',
    status: 'accepted',
    connectedAt: '1 week ago',
    lastMessage: 'Great meeting you at the conference!',
    isVerified: true,
    mutualConnections: 12,
  },
];

export default function ConnectionsScreen() {
  const [connections, setConnections] = useState<Connection[]>(mockConnections);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'accepted'>('all');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Connection | null>(null);

  const handleAcceptConnection = (connectionId: string) => {
    setConnections(prev => 
      prev.map(conn => 
        conn.id === connectionId 
          ? { ...conn, status: 'accepted', connectedAt: 'Just now' }
          : conn
      )
    );
    Alert.alert('Connection Accepted!', 'You can now message each other.');
  };

  const handleRejectConnection = (connectionId: string) => {
    Alert.alert(
      'Reject Connection',
      'Are you sure you want to reject this connection request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => {
            setConnections(prev => prev.filter(conn => conn.id !== connectionId));
          },
        },
      ]
    );
  };

  const handleSendMessage = (connection: Connection) => {
    router.push(`/chat/${connection.id}`);
  };

  const handleViewProfile = (connection: Connection) => {
    setSelectedProfile(connection);
    setShowProfileModal(true);
  };

  const handleConnect = (profileId: string) => {
    // Handle connection logic
    setConnections(prev => 
      prev.map(conn => 
        conn.id === profileId 
          ? { ...conn, status: 'accepted', connectedAt: 'Just now' }
          : conn
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

  const filteredConnections = connections.filter(conn => {
    switch (activeFilter) {
      case 'pending':
        return conn.status === 'pending_received' || conn.status === 'pending_sent';
      case 'accepted':
        return conn.status === 'accepted';
      default:
        return true;
    }
  });

  const pendingReceivedCount = connections.filter(conn => conn.status === 'pending_received').length;
  const acceptedCount = connections.filter(conn => conn.status === 'accepted').length;

  const FilterTab = ({ 
    filter, 
    title, 
    count 
  }: { 
    filter: 'all' | 'pending' | 'accepted';
    title: string;
    count?: number;
  }) => (
    <TouchableOpacity
      style={[styles.filterTab, activeFilter === filter && styles.activeFilterTab]}
      onPress={() => setActiveFilter(filter)}
    >
      <Text style={[styles.filterTabText, activeFilter === filter && styles.activeFilterTabText]}>
        {title}
      </Text>
      {count !== undefined && count > 0 && (
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const ConnectionCard = ({ connection }: { connection: Connection }) => (
    <TouchableOpacity 
      style={styles.connectionCard}
      onPress={() => handleViewProfile(connection)}
      activeOpacity={0.7}
    >
      <View style={styles.connectionHeader}>
        <Image source={{ uri: connection.photo }} style={styles.connectionPhoto} />
        <View style={styles.connectionInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.connectionName}>
              {connection.firstName} {connection.lastName}
            </Text>
            {connection.isVerified && (
              <Shield size={16} color="#1E40AF" strokeWidth={2} />
            )}
          </View>
          <Text style={styles.connectionProfession}>{connection.profession}</Text>
          <Text style={styles.connectionCompany}>{connection.company}</Text>
          {connection.mutualConnections && (
            <Text style={styles.mutualConnections}>
              {connection.mutualConnections} mutual connections
            </Text>
          )}
        </View>
        <View style={styles.statusIndicator}>
          {connection.status === 'pending_received' && (
            <View style={[styles.statusBadge, styles.pendingReceivedBadge]}>
              <Clock size={12} color="#F59E0B" strokeWidth={2} />
              <Text style={styles.pendingReceivedText}>New</Text>
            </View>
          )}
          {connection.status === 'pending_sent' && (
            <View style={[styles.statusBadge, styles.pendingSentBadge]}>
              <Clock size={12} color="#6B7280" strokeWidth={2} />
              <Text style={styles.pendingSentText}>Sent</Text>
            </View>
          )}
          {connection.status === 'accepted' && (
            <View style={[styles.statusBadge, styles.acceptedBadge]}>
              <UserCheck size={12} color="#10B981" strokeWidth={2} />
              <Text style={styles.acceptedText}>Connected</Text>
            </View>
          )}
        </View>
      </View>

      {connection.introMessage && (
        <View style={styles.messageContainer}>
          <Text style={styles.messageLabel}>
            {connection.status === 'pending_received' ? 'Introduction:' : 'Your message:'}
          </Text>
          <Text style={styles.messageText}>{connection.introMessage}</Text>
        </View>
      )}

      {connection.lastMessage && connection.status === 'accepted' && (
        <View style={styles.messageContainer}>
          <Text style={styles.messageLabel}>Last message:</Text>
          <Text style={styles.messageText}>{connection.lastMessage}</Text>
        </View>
      )}

      <View style={styles.actionButtons}>
        {connection.status === 'pending_received' && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => handleRejectConnection(connection.id)}
            >
              <X size={16} color="#EF4444" strokeWidth={2} />
              <Text style={styles.rejectButtonText}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.acceptButton]}
              onPress={() => handleAcceptConnection(connection.id)}
            >
              <Check size={16} color="white" strokeWidth={2} />
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
          </>
        )}
        
        {connection.status === 'accepted' && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, styles.messageButton]}
              onPress={(e) => {
                e.stopPropagation();
                handleSendMessage(connection);
              }}
            >
              <MessageCircle size={16} color="#1E40AF" strokeWidth={2} />
              <Text style={styles.messageButtonText}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.moreButton}>
              <MoreHorizontal size={16} color="#6B7280" strokeWidth={2} />
            </TouchableOpacity>
          </>
        )}

        {connection.status === 'pending_sent' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => handleRejectConnection(connection.id)}
          >
            <UserMinus size={16} color="#6B7280" strokeWidth={2} />
            <Text style={styles.cancelButtonText}>Cancel Request</Text>
          </TouchableOpacity>
        )}
      </View>

      {connection.connectedAt && (
        <Text style={styles.connectionDate}>Connected {connection.connectedAt}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Network</Text>
          <Text style={styles.headerSubtitle}>Your professional connections</Text>
        </View>
        <TouchableOpacity style={styles.searchButton}>
          <Search size={20} color="#6B7280" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <View style={styles.filterTabs}>
        <FilterTab filter="all" title="All" />
        <FilterTab filter="pending" title="Pending" count={pendingReceivedCount} />
        <FilterTab filter="accepted" title="Connected" count={acceptedCount} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredConnections.length > 0 ? (
          filteredConnections.map(connection => (
            <ConnectionCard key={connection.id} connection={connection} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Users size={48} color="#D1D5DB" strokeWidth={1.5} />
            <Text style={styles.emptyStateTitle}>No connections yet</Text>
            <Text style={styles.emptyStateText}>
              Start discovering and connecting with professionals nearby to build your network.
            </Text>
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
          lookingFor: selectedProfile.status === 'accepted' ? ['collaboration', 'networking'] : ['networking'],
          isVerified: selectedProfile.isVerified,
          distance: Math.floor(Math.random() * 200) + 50, // Mock distance
          compatibility: Math.floor(Math.random() * 20) + 80, // Mock compatibility
          lastActive: '5 min ago',
          connections: Math.floor(Math.random() * 200) + 100,
          mutualConnections: selectedProfile.mutualConnections || 0,
          connectionStatus: selectedProfile.status === 'accepted' ? 'connected' : 
                          selectedProfile.status === 'pending_sent' ? 'pending_sent' :
                          selectedProfile.status === 'pending_received' ? 'pending_received' : 'none',
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
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 16,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    gap: 6,
  },
  activeFilterTab: {
    backgroundColor: '#1E40AF',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeFilterTabText: {
    color: 'white',
  },
  countBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 18,
    alignItems: 'center',
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  connectionCard: {
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
  connectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  connectionPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  connectionInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  connectionName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  connectionProfession: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
  },
  connectionCompany: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
  },
  mutualConnections: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  statusIndicator: {
    marginLeft: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  pendingReceivedBadge: {
    backgroundColor: '#FEF3C7',
  },
  pendingReceivedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D97706',
  },
  pendingSentBadge: {
    backgroundColor: '#F3F4F6',
  },
  pendingSentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  acceptedBadge: {
    backgroundColor: '#D1FAE5',
  },
  acceptedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#047857',
  },
  messageContainer: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  messageLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  acceptButton: {
    backgroundColor: '#10B981',
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  rejectButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  rejectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
  messageButton: {
    backgroundColor: '#EBF8FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  messageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectionDate: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
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
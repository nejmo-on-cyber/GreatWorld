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
import { router } from 'expo-router';
import {
  MessageCircle,
  Search,
  Send,
  Shield,
  Circle,
} from 'lucide-react-native';

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
  },
];

export default function MessagesScreen() {
  const [messages] = useState<Message[]>(mockMessages);

  const handleMessagePress = (message: Message) => {
    router.push(`/chat/${message.id}`);
  };

  const handleViewProfile = (message: Message) => {
    router.push(`/profile/${message.id}`);
  };

  const unreadCount = messages.filter(msg => msg.unread).length;

  const MessageCard = ({ message }: { message: Message }) => (
    <TouchableOpacity
      style={[styles.messageCard, message.unread && styles.unreadMessageCard]}
      onPress={() => handleMessagePress(message)}
      onLongPress={() => handleViewProfile(message)}
    >
      <View style={styles.photoContainer}>
        <Image source={{ uri: message.photo }} style={styles.messagePhoto} />
        {message.online && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <View style={styles.nameContainer}>
            <Text style={[styles.messageName, message.unread && styles.unreadMessageName]}>
              {message.firstName} {message.lastName}
            </Text>
            {message.isVerified && (
              <Shield size={14} color="#1E40AF" strokeWidth={2} />
            )}
          </View>
          <Text style={styles.messageTime}>{message.timestamp}</Text>
        </View>
        
        <Text style={styles.messageProfession}>
          {message.profession} at {message.company}
        </Text>
        
        <Text style={[styles.lastMessage, message.unread && styles.unreadLastMessage]} numberOfLines={2}>
          {message.lastMessage}
        </Text>
      </View>
      
      {message.unread && <View style={styles.unreadBadge} />}
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
        {messages.length > 0 ? (
          messages.map(message => (
            <MessageCard key={message.id} message={message} />
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
  content: {
    flex: 1,
  },
  messageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  unreadMessageCard: {
    backgroundColor: '#FEFEFE',
    borderLeftWidth: 4,
    borderLeftColor: '#1E40AF',
  },
  photoContainer: {
    position: 'relative',
    marginRight: 16,
  },
  messagePhoto: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: 'white',
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  messageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  unreadMessageName: {
    fontWeight: '700',
  },
  messageTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  messageProfession: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
  },
  lastMessage: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  unreadLastMessage: {
    color: '#374151',
    fontWeight: '500',
  },
  unreadBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1E40AF',
    marginLeft: 12,
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 48,
    margin: 20,
    borderRadius: 16,
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
    marginBottom: 24,
  },
  discoverButton: {
    backgroundColor: '#1E40AF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  discoverButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
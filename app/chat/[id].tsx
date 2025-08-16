import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router, useRouter } from 'expo-router';
import { ArrowLeft, Send, Phone, Video, MoveHorizontal as MoreHorizontal, Mic, Camera, Plus } from 'lucide-react-native';
import { useMessaging } from '@/hooks/useMessaging';
import { useAIChat } from '@/hooks/useAIChat';
import TypingIndicator from '@/components/TypingIndicator';

interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  type: 'text' | 'voice' | 'image';
  isRead: boolean;
}

interface ChatUser {
  id: string;
  name: string;
  profession: string;
  company: string;
  isOnline: boolean;
}

const mockChatData: { [key: string]: { user: ChatUser; messages: ChatMessage[] } } = {
  '1': {
    user: {
      id: '1',
      name: 'Nejmo Serraoui',
      profession: 'Senior Product Manager',
      company: 'Meta',
      isOnline: true,
    },
    messages: [
      {
        id: '1',
        senderId: '1',
        text: 'Hi! Thanks for connecting. I saw your background in software engineering and would love to chat about potential collaboration opportunities.',
        timestamp: '10:30 AM',
        type: 'text',
        isRead: true,
      },
      {
        id: '2',
        senderId: 'me',
        text: 'Hi Nejmo! Great to connect with you too. I\'d be happy to discuss tech projects. What kind of collaboration were you thinking about?',
        timestamp: '10:32 AM',
        type: 'text',
        isRead: true,
      },
      {
        id: '3',
        senderId: '1',
        text: 'We\'re working on some exciting product features and could use someone with your expertise. Would you be interested in a coffee chat this week?',
        timestamp: '10:35 AM',
        type: 'text',
        isRead: true,
      },
    ],
  },
  '2': {
    user: {
      id: '2',
      name: 'Marcus Rodriguez',
      profession: 'Senior Software Engineer',
      company: 'Google',
      isOnline: false,
    },
    messages: [
      {
        id: '1',
        senderId: '2',
        text: 'Hey! I noticed we have similar interests in machine learning. Would love to connect and maybe collaborate on some open source projects.',
        timestamp: 'Yesterday',
        type: 'text',
        isRead: true,
      },
    ],
  },
  '3': {
    user: {
      id: '3',
      name: 'Emily Johnson',
      profession: 'Senior UX Designer',
      company: 'Airbnb',
      isOnline: true,
    },
    messages: [
      {
        id: '1',
        senderId: '3',
        text: 'Hi! Great to connect with you. I saw your work and would love to discuss some design collaboration opportunities.',
        timestamp: '2:15 PM',
        type: 'text',
        isRead: true,
      },
      {
        id: '2',
        senderId: 'me',
        text: 'Hi Emily! Thanks for reaching out. I\'d be interested in hearing more about the design projects you\'re working on.',
        timestamp: '2:18 PM',
        type: 'text',
        isRead: true,
      },
    ],
  },
  '4': {
    user: {
      id: '4',
      name: 'David Kim',
      profession: 'Frontend Developer',
      company: 'Stripe',
      isOnline: false,
    },
    messages: [
      {
        id: '1',
        senderId: '4',
        text: 'Hi! I saw your profile and would love to connect. I\'m working on some exciting React projects and could use your insights.',
        timestamp: '11:30 AM',
        type: 'text',
        isRead: true,
      },
    ],
  },
};

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useRouter();
  const { 
    getConversationById, 
    getMessagesForConversation, 
    addMessageToConversation, 
    markConversationAsRead,
    isAILoading
  } = useMessaging();
  const { isLoading: isAIGenerating } = useAIChat();
  const [chatData, setChatData] = useState<{ user: ChatUser; messages: ChatMessage[] } | null>(null);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load chat data using the messaging hook
    setTimeout(() => {
      if (id) {
        const conversation = getConversationById(id);
        const messages = getMessagesForConversation(id);
        
        if (conversation) {
          // Existing conversation found
          setChatData({
            user: {
              id: conversation.participantId,
              name: conversation.participantName,
              profession: 'Professional',
              company: 'Unknown',
              isOnline: false,
            },
            messages: messages,
          });
          
          // Mark conversation as read
          markConversationAsRead(id);
        } else {
          // Create new conversation for unknown user
          const newChatData = {
            user: {
              id: id,
              name: 'New Contact',
              profession: 'Professional',
              company: 'Unknown',
              isOnline: false,
            },
            messages: [
              {
                id: '1',
                senderId: 'me',
                text: 'Hi! Thanks for connecting. Looking forward to our conversation.',
                timestamp: 'Just now',
                type: 'text' as const,
                isRead: false,
              },
            ],
          };
          setChatData(newChatData);
        }
      }
      setIsLoading(false);
    }, 500);
  }, [id, getConversationById, getMessagesForConversation, markConversationAsRead]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !chatData || !id) return;
    

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'me',
      text: messageText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
      isRead: false,
    };

    // Update local state immediately
    setChatData(prev => prev ? {
      ...prev,
      messages: [...prev.messages, newMessage]
    } : null);

    const currentText = messageText.trim();
    setMessageText('');

    // Add message to conversation using the messaging hook (this will trigger AI response)
    await addMessageToConversation(id, newMessage);
  };

  const handleCall = () => {
    if (!chatData) return;
    Alert.alert('Voice Call', `Call ${chatData.user.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call', onPress: () => Alert.alert('Calling...', 'Feature coming soon!') },
    ]);
  };

  const handleVideoCall = () => {
    if (!chatData) return;
    Alert.alert('Video Call', `Video call ${chatData.user.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call', onPress: () => Alert.alert('Video calling...', 'Feature coming soon!') },
    ]);
  };

  const handleViewProfile = () => {
    if (!chatData) return;
    navigation.push(`/profile/${chatData.user.id}`);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading chat...</Text>
      </View>
    );
  }

  if (!chatData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Chat not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const MessageBubble = ({ message }: { message: ChatMessage }) => {
    const isMe = message.senderId === 'me';
    
    return (
      <View style={[styles.messageBubble, isMe ? styles.myMessage : styles.theirMessage]}>
        <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.theirMessageText]}>
          {message.text}
        </Text>
        <Text style={[styles.messageTime, isMe ? styles.myMessageTime : styles.theirMessageTime]}>
          {message.timestamp}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.back()}>
          <ArrowLeft size={24} color="#111827" strokeWidth={2} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.headerInfo} onPress={handleViewProfile}>
          <View>
            <Text style={styles.headerName}>{chatData.user.name}</Text>
            <Text style={styles.headerStatus}>
              {chatData.user.isOnline ? 'Online' : 'Last seen recently'}
            </Text>
          </View>
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerActionButton} onPress={handleCall}>
            <Phone size={20} color="#6B7280" strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerActionButton} onPress={handleVideoCall}>
            <Video size={20} color="#6B7280" strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerActionButton}>
            <MoreHorizontal size={20} color="#6B7280" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <ScrollView 
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {chatData.messages.map(message => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <TypingIndicator 
          isTyping={isAILoading || isAIGenerating} 
          userName={chatData.user.name}
        />
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton}>
          <Plus size={20} color="#6B7280" strokeWidth={2} />
        </TouchableOpacity>
        
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          value={messageText}
          onChangeText={setMessageText}
          multiline
          maxLength={500}
        />
        
        <TouchableOpacity style={styles.voiceButton}>
          <Mic size={20} color="#6B7280" strokeWidth={2} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.sendButton, messageText.trim() && styles.sendButtonActive]}
          onPress={handleSendMessage}
          disabled={!messageText.trim()}
        >
          <Send size={20} color={messageText.trim() ? "white" : "#9CA3AF"} strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#1E40AF',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 16,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.3,
  },
  header: {
    flexDirection: 'row',
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
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  headerStatus: {
    fontSize: 14,
    color: '#10B981',
    marginTop: 2,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerActionButton: {
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
  messagesContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 40,
  },
  messageBubble: {
    maxWidth: '80%',
    marginBottom: 20,
    padding: 16,
    borderRadius: 20,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#1E40AF',
    borderBottomRightRadius: 6,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    borderBottomLeftRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  myMessageText: {
    color: 'white',
  },
  theirMessageText: {
    color: '#0F172A',
  },
  messageTime: {
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
  myMessageTime: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'right',
  },
  theirMessageTime: {
    color: '#94A3B8',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  attachButton: {
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
  textInput: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 16,
    maxHeight: 120,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  voiceButton: {
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
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  sendButtonActive: {
    backgroundColor: '#1E40AF',
    shadowColor: '#1E40AF',
    shadowOpacity: 0.3,
  },
});
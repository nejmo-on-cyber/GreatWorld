import { useState, useEffect } from 'react';
import { router, useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { useAIChat } from './useAIChat';

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantPhoto: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  isConnected: boolean;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  type: 'text' | 'voice' | 'image';
  isRead: boolean;
}

// Mock data for conversations
const mockConversations: Conversation[] = [
  {
    id: '1',
    participantId: '1',
    participantName: 'Nejmo Serraoui',
    participantPhoto: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    lastMessage: 'Thanks for connecting! I\'d love to chat about product strategy sometime.',
    timestamp: '2m ago',
    unread: true,
    isConnected: true,
  },
  {
    id: '2',
    participantId: '2',
    participantName: 'Marcus Rodriguez',
    participantPhoto: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    lastMessage: 'The React project sounds interesting. When can we discuss it?',
    timestamp: '1h ago',
    unread: true,
    isConnected: true,
  },
  {
    id: '3',
    participantId: '3',
    participantName: 'Emily Johnson',
    participantPhoto: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    lastMessage: 'Great meeting you today! Looking forward to collaborating.',
    timestamp: '3h ago',
    unread: false,
    isConnected: true,
  },
];

// Mock data for chat messages
const mockChatMessages: { [conversationId: string]: Message[] } = {
  '1': [
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
  ],
  '2': [
    {
      id: '1',
      senderId: '2',
      text: 'Hey! I noticed we have similar interests in machine learning. Would love to connect and maybe collaborate on some open source projects.',
      timestamp: 'Yesterday',
      type: 'text',
      isRead: true,
    },
  ],
  '3': [
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
};

export const useMessaging = () => {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [chatMessages, setChatMessages] = useState<{ [conversationId: string]: Message[] }>(mockChatMessages);
  const { generateAIResponse, isLoading: isAILoading } = useAIChat();

  // Check if a conversation exists with a specific user
  const getConversationWithUser = (userId: string): Conversation | null => {
    return conversations.find(conv => conv.participantId === userId) || null;
  };

  // Create a new conversation
  const createConversation = (userId: string, userName: string, userPhoto: string, isConnected: boolean = false): string => {
    const conversationId = `conv_${Date.now()}`;
    const newConversation: Conversation = {
      id: conversationId,
      participantId: userId,
      participantName: userName,
      participantPhoto: userPhoto,
      lastMessage: '',
      timestamp: 'Just now',
      unread: false,
      isConnected,
    };

    setConversations(prev => [newConversation, ...prev]);
    setChatMessages(prev => ({
      ...prev,
      [conversationId]: [],
    }));

    return conversationId;
  };

  // Send a message to a user
  const sendMessage = (userId: string, messageText: string, userName?: string, userPhoto?: string, isConnected?: boolean) => {
    let conversation = getConversationWithUser(userId);
    let conversationId: string;

    if (conversation) {
      // Existing conversation found
      conversationId = conversation.id;
    } else {
      // Create new conversation
      if (!userName || !userPhoto) {
        Alert.alert('Error', 'User information is required to start a new conversation.');
        return;
      }
      conversationId = createConversation(userId, userName, userPhoto, isConnected || false);
    }

    // Add the message to the conversation
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
      isRead: false,
    };

    setChatMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage],
    }));

    // Update conversation's last message
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, lastMessage: messageText, timestamp: 'Just now' }
          : conv
      )
    );

    return conversationId;
  };

  // Get conversation ID for a user (without navigation)
  const getConversationIdForUser = (userId: string, userName?: string, userPhoto?: string, isConnected?: boolean): string => {
    let conversation = getConversationWithUser(userId);
    let conversationId: string;

    if (conversation) {
      // Existing conversation found
      conversationId = conversation.id;
    } else {
      // Create new conversation if user info is provided
      if (userName && userPhoto) {
        conversationId = createConversation(userId, userName, userPhoto, isConnected || false);
      } else {
        // For unknown users, create a temporary conversation
        conversationId = `temp_${userId}`;
      }
    }

    return conversationId;
  };

  // Navigate to chat with a user
  const navigateToChat = (userId: string, userName?: string, userPhoto?: string, isConnected?: boolean) => {
    const conversationId = getConversationIdForUser(userId, userName, userPhoto, isConnected);
    router.push(`/chat/${conversationId}`);
  };

  // Get messages for a conversation
  const getMessagesForConversation = (conversationId: string): Message[] => {
    return chatMessages[conversationId] || [];
  };

  // Add a message to a specific conversation
  const addMessageToConversation = async (conversationId: string, message: Message) => {
    setChatMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), message],
    }));

    // Update conversation's last message
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { 
              ...conv, 
              lastMessage: message.text, 
              timestamp: 'Just now',
              unread: message.senderId !== 'me'
            }
          : conv
      )
    );

    // Generate AI response if the message is from the user
    if (message.senderId === 'me') {
      const conversation = getConversationById(conversationId);
      if (conversation) {
        try {
          const conversationContext = `This is a conversation with ${conversation.participantName}. Previous messages: ${(chatMessages[conversationId] || []).slice(-3).map(m => m.text).join(' | ')}`;
          const userProfile = `Professional networking conversation with ${conversation.participantName}`;
          
          const aiResponse = await generateAIResponse(message.text, conversationContext, userProfile);
          
          // Add AI response to conversation
          const aiMessage: Message = {
            id: Date.now().toString() + '_ai',
            senderId: conversation.participantId,
            text: aiResponse.text,
            timestamp: aiResponse.timestamp,
            type: 'text',
            isRead: false,
          };
          
          setChatMessages(prev => ({
            ...prev,
            [conversationId]: [...(prev[conversationId] || []), aiMessage],
          }));
          
          // Update conversation's last message to AI response
          setConversations(prev => 
            prev.map(conv => 
              conv.id === conversationId 
                ? { 
                    ...conv, 
                    lastMessage: aiResponse.text, 
                    timestamp: 'Just now',
                    unread: true
                  }
                : conv
            )
          );
        } catch (error) {
          console.error('Error generating AI response:', error);
        }
      }
    }
  };

  // Mark conversation as read
  const markConversationAsRead = (conversationId: string) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, unread: false }
          : conv
      )
    );
  };

  // Get conversation by ID
  const getConversationById = (conversationId: string): Conversation | null => {
    return conversations.find(conv => conv.id === conversationId) || null;
  };

  return {
    conversations,
    getConversationWithUser,
    createConversation,
    sendMessage,
    navigateToChat,
    getConversationIdForUser,
    getMessagesForConversation,
    addMessageToConversation,
    markConversationAsRead,
    getConversationById,
    isAILoading,
  };
};

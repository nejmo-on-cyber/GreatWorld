import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Zap,
  X,
  Copy,
  Send,
  RefreshCw,
} from 'lucide-react-native';

interface ConversationStarter {
  id: string;
  text: string;
  category: 'professional' | 'interest' | 'casual';
}

interface AIConversationStartersProps {
  visible: boolean;
  onClose: () => void;
  targetUserName: string;
  targetUserProfession: string;
  targetUserCompany: string;
  onSendMessage: (message: string) => void;
}

const mockConversationStarters: ConversationStarter[] = [
  {
    id: '1',
    text: "Hi Sarah! I noticed you work in product management at Meta. I'm curious about your thoughts on AI-driven product features.",
    category: 'professional',
  },
  {
    id: '2',
    text: "Hello! I saw we share an interest in AI and startups. Would love to exchange insights on the current AI landscape.",
    category: 'interest',
  },
  {
    id: '3',
    text: "Hi there! Great to connect with someone nearby who's also in tech. How are you finding the startup scene in this area?",
    category: 'casual',
  },
];

export default function AIConversationStarters({
  visible,
  onClose,
  targetUserName,
  targetUserProfession,
  targetUserCompany,
  onSendMessage,
}: AIConversationStartersProps) {
  const [starters, setStarters] = useState<ConversationStarter[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (visible) {
      generateConversationStarters();
    }
  }, [visible]);

  const generateConversationStarters = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      const personalizedStarters = mockConversationStarters.map(starter => ({
        ...starter,
        text: starter.text.replace('Sarah', targetUserName),
      }));
      setStarters(personalizedStarters);
      setIsGenerating(false);
    }, 1500);
  };

  const handleCopyMessage = (message: string) => {
    // In a real app, this would copy to clipboard
    Alert.alert('Copied!', 'Message copied to clipboard');
  };

  const handleSendMessage = (message: string) => {
    onSendMessage(message);
    onClose();
  };

  const handleRegenerateStarters = () => {
    generateConversationStarters();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'professional':
        return '#1E40AF';
      case 'interest':
        return '#059669';
      case 'casual':
        return '#7C3AED';
      default:
        return '#6B7280';
    }
  };

  const getCategoryBgColor = (category: string) => {
    switch (category) {
      case 'professional':
        return '#EBF8FF';
      case 'interest':
        return '#ECFDF5';
      case 'casual':
        return '#F3E8FF';
      default:
        return '#F3F4F6';
    }
  };

  const StarterCard = ({ starter }: { starter: ConversationStarter }) => (
    <View style={styles.starterCard}>
      <View style={styles.starterHeader}>
        <View style={[
          styles.categoryBadge,
          { backgroundColor: getCategoryBgColor(starter.category) }
        ]}>
          <Text style={[
            styles.categoryText,
            { color: getCategoryColor(starter.category) }
          ]}>
            {starter.category}
          </Text>
        </View>
      </View>
      
      <Text style={styles.starterText}>{starter.text}</Text>
      
      <View style={styles.starterActions}>
        <TouchableOpacity
          style={styles.copyButton}
          onPress={() => handleCopyMessage(starter.text)}
        >
          <Copy size={16} color="#6B7280" strokeWidth={2} />
          <Text style={styles.copyButtonText}>Copy</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => handleSendMessage(starter.text)}
        >
          <Send size={16} color="white" strokeWidth={2} />
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.aiIcon}>
              <Zap size={20} color="#FBBF24" strokeWidth={2} />
            </View>
            <View>
              <Text style={styles.headerTitle}>AI Conversation Starters</Text>
              <Text style={styles.headerSubtitle}>For {targetUserName}</Text>
            </View>
          </View>
          
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.regenerateButton}
              onPress={handleRegenerateStarters}
              disabled={isGenerating}
            >
              <RefreshCw 
                size={20} 
                color="#1E40AF" 
                strokeWidth={2}
              />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color="#6B7280" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Connecting with</Text>
            <Text style={styles.infoText}>
              {targetUserName} • {targetUserProfession} at {targetUserCompany}
            </Text>
          </View>

          {isGenerating ? (
            <View style={styles.loadingState}>
              <View style={styles.loadingIcon}>
                <Zap size={32} color="#FBBF24" strokeWidth={2} />
              </View>
              <Text style={styles.loadingTitle}>Generating conversation starters...</Text>
              <Text style={styles.loadingText}>
                Our AI is crafting personalized messages based on both your profiles
              </Text>
            </View>
          ) : (
            <View style={styles.startersContainer}>
              <Text style={styles.sectionTitle}>Suggested conversation starters</Text>
              {starters.map(starter => (
                <StarterCard key={starter.id} starter={starter} />
              ))}
            </View>
          )}

          <Text style={styles.disclaimer}>
            These suggestions are AI-generated. Feel free to personalize them or write your own message.
          </Text>
        </ScrollView>
      </View>
    </Modal>
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
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  aiIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
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
    gap: 8,
  },
  regenerateButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EBF8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  infoCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 16,
    color: '#111827',
  },
  loadingState: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 48,
    borderRadius: 16,
  },
  loadingIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  startersContainer: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  starterCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  starterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  starterText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  starterActions: {
    flexDirection: 'row',
    gap: 12,
  },
  copyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    gap: 6,
  },
  copyButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  sendButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#1E40AF',
    borderRadius: 8,
    gap: 6,
  },
  sendButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  disclaimer: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 18,
  },
});
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
  Calendar,
  Clock,
  MapPin,
  Coffee,
  Briefcase,
  Users,
  Zap,
  X,
  Check,
} from 'lucide-react-native';

interface AvailableSlot {
  id: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  type: 'coffee' | 'lunch' | 'meeting' | 'walk';
}

interface SmartSchedulingProps {
  visible: boolean;
  onClose: () => void;
  targetUser: {
    name: string;
    profession: string;
    company: string;
  };
  onScheduleMeeting: (slot: AvailableSlot) => void;
}

const mockAvailableSlots: AvailableSlot[] = [
  {
    id: '1',
    date: 'Today',
    time: '3:00 PM',
    duration: 30,
    location: 'Starbucks on Main St (2 min walk)',
    type: 'coffee',
  },
  {
    id: '2',
    date: 'Today',
    time: '5:30 PM',
    duration: 60,
    location: 'Central Park (5 min walk)',
    type: 'walk',
  },
  {
    id: '3',
    date: 'Tomorrow',
    time: '12:00 PM',
    duration: 60,
    location: 'Cafe Luna (3 min walk)',
    type: 'lunch',
  },
  {
    id: '4',
    date: 'Tomorrow',
    time: '2:00 PM',
    duration: 45,
    location: 'WeWork Lobby (1 min walk)',
    type: 'meeting',
  },
];

export default function SmartScheduling({
  visible,
  onClose,
  targetUser,
  onScheduleMeeting,
}: SmartSchedulingProps) {
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      generateSmartSlots();
    }
  }, [visible]);

  const generateSmartSlots = async () => {
    setIsLoading(true);
    // Simulate AI-powered slot generation
    setTimeout(() => {
      setAvailableSlots(mockAvailableSlots);
      setIsLoading(false);
    }, 1500);
  };

  const handleSchedule = (slot: AvailableSlot) => {
    Alert.alert(
      'Schedule Meeting',
      `Send meeting request for ${slot.date} at ${slot.time}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Request',
          onPress: () => {
            onScheduleMeeting(slot);
            onClose();
            Alert.alert('Request Sent!', `Meeting request sent to ${targetUser.name}`);
          },
        },
      ]
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'coffee':
        return <Coffee size={16} color="#8B5CF6" strokeWidth={2} />;
      case 'lunch':
        return <Users size={16} color="#10B981" strokeWidth={2} />;
      case 'meeting':
        return <Briefcase size={16} color="#1E40AF" strokeWidth={2} />;
      case 'walk':
        return <MapPin size={16} color="#F59E0B" strokeWidth={2} />;
      default:
        return <Clock size={16} color="#6B7280" strokeWidth={2} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'coffee':
        return '#F3E8FF';
      case 'lunch':
        return '#ECFDF5';
      case 'meeting':
        return '#EBF8FF';
      case 'walk':
        return '#FFFBEB';
      default:
        return '#F3F4F6';
    }
  };

  const SlotCard = ({ slot }: { slot: AvailableSlot }) => (
    <TouchableOpacity
      style={[styles.slotCard, { backgroundColor: getTypeColor(slot.type) }]}
      onPress={() => handleSchedule(slot)}
    >
      <View style={styles.slotHeader}>
        <View style={styles.slotType}>
          {getTypeIcon(slot.type)}
          <Text style={styles.slotTypeText}>
            {slot.type.charAt(0).toUpperCase() + slot.type.slice(1)}
          </Text>
        </View>
        <Text style={styles.slotDuration}>{slot.duration} min</Text>
      </View>

      <View style={styles.slotTime}>
        <Calendar size={16} color="#374151" strokeWidth={2} />
        <Text style={styles.slotTimeText}>{slot.date} at {slot.time}</Text>
      </View>

      <View style={styles.slotLocation}>
        <MapPin size={16} color="#6B7280" strokeWidth={2} />
        <Text style={styles.slotLocationText}>{slot.location}</Text>
      </View>

      <View style={styles.slotFooter}>
        <View style={styles.aiSuggestion}>
          <Zap size={12} color="#FBBF24" strokeWidth={2} />
          <Text style={styles.aiSuggestionText}>AI Suggested</Text>
        </View>
        <TouchableOpacity style={styles.scheduleButton}>
          <Check size={16} color="white" strokeWidth={2} />
          <Text style={styles.scheduleButtonText}>Request</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
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
              <Text style={styles.headerTitle}>Smart Scheduling</Text>
              <Text style={styles.headerSubtitle}>Meet {targetUser.name}</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#6B7280" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Meeting with</Text>
            <Text style={styles.infoText}>
              {targetUser.name} • {targetUser.profession} at {targetUser.company}
            </Text>
            <Text style={styles.infoSubtext}>
              AI has found optimal meeting times based on both your schedules and nearby locations
            </Text>
          </View>

          {isLoading ? (
            <View style={styles.loadingState}>
              <View style={styles.loadingIcon}>
                <Zap size={32} color="#FBBF24" strokeWidth={2} />
              </View>
              <Text style={styles.loadingTitle}>Finding optimal meeting times...</Text>
              <Text style={styles.loadingText}>
                Analyzing calendars, locations, and preferences
              </Text>
            </View>
          ) : (
            <View style={styles.slotsContainer}>
              <Text style={styles.sectionTitle}>Suggested meeting times</Text>
              {availableSlots.map(slot => (
                <SlotCard key={slot.id} slot={slot} />
              ))}
            </View>
          )}

          <View style={styles.featuresCard}>
            <Text style={styles.featuresTitle}>Smart Scheduling Features</Text>
            <View style={styles.featuresList}>
              <View style={styles.feature}>
                <Calendar size={16} color="#1E40AF" strokeWidth={2} />
                <Text style={styles.featureText}>Calendar integration</Text>
              </View>
              <View style={styles.feature}>
                <MapPin size={16} color="#1E40AF" strokeWidth={2} />
                <Text style={styles.featureText}>Nearby venue suggestions</Text>
              </View>
              <View style={styles.feature}>
                <Zap size={16} color="#1E40AF" strokeWidth={2} />
                <Text style={styles.featureText}>AI-optimized timing</Text>
              </View>
              <View style={styles.feature}>
                <Users size={16} color="#1E40AF" strokeWidth={2} />
                <Text style={styles.featureText}>Meeting type recommendations</Text>
              </View>
            </View>
          </View>

          <Text style={styles.disclaimer}>
            Meeting requests are sent with your contact information. Both parties can reschedule or cancel anytime.
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
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  infoSubtext: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
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
  slotsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  slotCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  slotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  slotType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  slotTypeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  slotDuration: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  slotTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  slotTimeText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  slotLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  slotLocationText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  slotFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aiSuggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  aiSuggestionText: {
    fontSize: 12,
    color: '#D97706',
    fontWeight: '500',
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E40AF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  scheduleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  featuresCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  featuresList: {
    gap: 8,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
  },
  disclaimer: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },
});
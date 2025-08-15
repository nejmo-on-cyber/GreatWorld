import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { ChevronDown, X, MessageSquare } from 'lucide-react-native';
import UserStatusIndicator, { UserStatus } from './UserStatusIndicator';

interface StatusOption {
  value: UserStatus;
  label: string;
  description: string;
  icon?: string;
}

const statusOptions: StatusOption[] = [
  {
    value: 'available',
    label: 'Available',
    description: 'Ready to connect and chat',
  },
  {
    value: 'open-to-chat',
    label: 'Open to Chat',
    description: 'Actively looking for conversations',
  },
  {
    value: 'busy',
    label: 'Busy',
    description: 'In a meeting or occupied',
  },
  {
    value: 'dnd',
    label: 'Do Not Disturb',
    description: 'Please avoid interruptions',
  },
  {
    value: 'away',
    label: 'Away',
    description: 'Temporarily unavailable',
  },
  {
    value: 'focused',
    label: 'Focused',
    description: 'Deep work mode - minimal interruptions',
  },
  {
    value: 'offline',
    label: 'Appear Offline',
    description: 'Hide your online presence',
  },
];

interface UserStatusSelectorProps {
  currentStatus: UserStatus;
  customMessage?: string;
  onStatusChange: (status: UserStatus, customMessage?: string) => void;
}

export default function UserStatusSelector({
  currentStatus,
  customMessage = '',
  onStatusChange,
}: UserStatusSelectorProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tempCustomMessage, setTempCustomMessage] = useState(customMessage);

  const currentStatusOption = statusOptions.find(option => option.value === currentStatus);

  const handleStatusSelect = (status: UserStatus) => {
    onStatusChange(status, tempCustomMessage);
    setIsModalVisible(false);
  };

  const handleCustomMessageSave = () => {
    if (tempCustomMessage.length > 20) {
      Alert.alert('Message Too Long', 'Custom status message must be 20 characters or less.');
      return;
    }
    onStatusChange(currentStatus, tempCustomMessage);
  };

  const StatusOption = ({ option }: { option: StatusOption }) => (
    <TouchableOpacity
      style={[
        styles.statusOption,
        currentStatus === option.value && styles.selectedStatusOption
      ]}
      onPress={() => handleStatusSelect(option.value)}
    >
      <View style={styles.statusOptionLeft}>
        <UserStatusIndicator status={option.value} size={12} />
        <View style={styles.statusOptionText}>
          <Text style={[
            styles.statusOptionLabel,
            currentStatus === option.value && styles.selectedStatusText
          ]}>
            {option.label}
          </Text>
          <Text style={styles.statusOptionDescription}>
            {option.description}
          </Text>
        </View>
      </View>
      {currentStatus === option.value && (
        <View style={styles.checkmark}>
          <Text style={styles.checkmarkText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity
        style={styles.statusSelector}
        onPress={() => setIsModalVisible(true)}
      >
        <View style={styles.statusSelectorLeft}>
          <UserStatusIndicator status={currentStatus} size={10} />
          <View style={styles.statusInfo}>
            <Text style={styles.statusLabel}>
              {currentStatusOption?.label || 'Available'}
            </Text>
            {customMessage && (
              <Text style={styles.customMessage} numberOfLines={1}>
                {customMessage}
              </Text>
            )}
          </View>
        </View>
        <ChevronDown size={16} color="#6B7280" strokeWidth={2} />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Set Your Status</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <X size={24} color="#6B7280" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.statusOptionsContainer}>
              <Text style={styles.sectionTitle}>Choose your availability</Text>
              {statusOptions.map((option) => (
                <StatusOption key={option.value} option={option} />
              ))}
            </View>

            <View style={styles.customMessageSection}>
              <Text style={styles.sectionTitle}>Custom Status Message</Text>
              <Text style={styles.sectionSubtitle}>
                Add a personal message (optional, 20 characters max)
              </Text>
              
              <View style={styles.customMessageContainer}>
                <MessageSquare size={16} color="#6B7280" strokeWidth={2} />
                <TextInput
                  style={styles.customMessageInput}
                  placeholder="What's on your mind?"
                  value={tempCustomMessage}
                  onChangeText={setTempCustomMessage}
                  maxLength={20}
                  onBlur={handleCustomMessageSave}
                />
                <Text style={styles.characterCount}>
                  {tempCustomMessage.length}/20
                </Text>
              </View>
            </View>

            <View style={styles.statusPreview}>
              <Text style={styles.sectionTitle}>Preview</Text>
              <View style={styles.previewCard}>
                <UserStatusIndicator status={currentStatus} size={12} />
                <View style={styles.previewText}>
                  <Text style={styles.previewLabel}>
                    {currentStatusOption?.label || 'Available'}
                  </Text>
                  {tempCustomMessage && (
                    <Text style={styles.previewMessage}>
                      {tempCustomMessage}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  statusSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minHeight: 40,
  },
  statusSelectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  statusInfo: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  customMessage: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  modalHeader: {
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
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  statusOptionsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  selectedStatusOption: {
    backgroundColor: '#EBF8FF',
  },
  statusOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  statusOptionText: {
    flex: 1,
  },
  statusOptionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  selectedStatusText: {
    color: '#1E40AF',
  },
  statusOptionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  customMessageSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  customMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  customMessageInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    paddingVertical: 4,
  },
  characterCount: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  statusPreview: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  previewText: {
    flex: 1,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  previewMessage: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
});
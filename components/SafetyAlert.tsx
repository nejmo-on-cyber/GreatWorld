import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { Shield, TriangleAlert as AlertTriangle, X, Phone, MessageSquare } from 'lucide-react-native';

interface SafetyAlertProps {
  visible: boolean;
  onClose: () => void;
  type: 'stalking' | 'inappropriate' | 'fake_profile' | 'harassment';
  reportedUser?: string;
}

export default function SafetyAlert({ visible, onClose, type, reportedUser }: SafetyAlertProps) {
  const handleEmergencyContact = () => {
    Alert.alert(
      'Emergency Contact',
      'This will contact local emergency services. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call Emergency', style: 'destructive' },
      ]
    );
  };

  const handleReport = () => {
    Alert.alert('Report Submitted', 'Thank you for your report. We will review this immediately.');
    onClose();
  };

  const getAlertContent = () => {
    switch (type) {
      case 'stalking':
        return {
          title: 'Potential Stalking Detected',
          message: 'Our AI has detected unusual location patterns. Your safety is our priority.',
          color: '#EF4444',
          bgColor: '#FEF2F2',
        };
      case 'harassment':
        return {
          title: 'Harassment Report',
          message: 'This behavior violates our community guidelines. We take this seriously.',
          color: '#F59E0B',
          bgColor: '#FFFBEB',
        };
      case 'fake_profile':
        return {
          title: 'Suspicious Profile',
          message: 'This profile may not be authentic. Proceed with caution.',
          color: '#F59E0B',
          bgColor: '#FFFBEB',
        };
      default:
        return {
          title: 'Safety Alert',
          message: 'Something requires your attention.',
          color: '#EF4444',
          bgColor: '#FEF2F2',
        };
    }
  };

  const alertContent = getAlertContent();

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.alertContainer, { backgroundColor: alertContent.bgColor }]}>
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: alertContent.color }]}>
              <AlertTriangle size={24} color="white" strokeWidth={2} />
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color="#6B7280" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>{alertContent.title}</Text>
          <Text style={styles.message}>{alertContent.message}</Text>

          {reportedUser && (
            <Text style={styles.userInfo}>Regarding: {reportedUser}</Text>
          )}

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.reportButton]}
              onPress={handleReport}
            >
              <Shield size={18} color="white" strokeWidth={2} />
              <Text style={styles.reportButtonText}>Submit Report</Text>
            </TouchableOpacity>

            {type === 'stalking' && (
              <TouchableOpacity
                style={[styles.actionButton, styles.emergencyButton]}
                onPress={handleEmergencyContact}
              >
                <Phone size={18} color="white" strokeWidth={2} />
                <Text style={styles.emergencyButtonText}>Emergency</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.actionButton, styles.supportButton]}
              onPress={() => {
                Alert.alert('Support', 'Contact support feature coming soon!');
                onClose();
              }}
            >
              <MessageSquare size={18} color="#1E40AF" strokeWidth={2} />
              <Text style={styles.supportButtonText}>Contact Support</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.disclaimer}>
            Your safety is our priority. All reports are reviewed immediately by our safety team.
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alertContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  userInfo: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 20,
  },
  actions: {
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  reportButton: {
    backgroundColor: '#1E40AF',
  },
  reportButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  emergencyButton: {
    backgroundColor: '#EF4444',
  },
  emergencyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  supportButton: {
    backgroundColor: '#EBF8FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  supportButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
  },
  disclaimer: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
});
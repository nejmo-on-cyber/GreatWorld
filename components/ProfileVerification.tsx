import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
  Camera,
  Upload,
  X,
  ArrowRight,
} from 'lucide-react-native';

interface VerificationStatus {
  status: 'verified' | 'pending' | 'rejected' | 'unverified';
  submittedAt?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

interface ProfileVerificationProps {
  verificationStatus: VerificationStatus;
  onVerify: () => void;
  onResubmit: () => void;
}

export default function ProfileVerification({
  verificationStatus,
  onVerify,
  onResubmit,
}: ProfileVerificationProps) {
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const getStatusConfig = () => {
    switch (verificationStatus.status) {
      case 'verified':
        return {
          icon: CheckCircle,
          iconColor: '#10B981',
          title: 'Identity Verified',
          subtitle: 'Your identity has been confirmed',
          description: 'Your profile is verified and trusted by the community.',
          actionText: 'View Certificate',
          actionColor: '#10B981',
        };
      case 'pending':
        return {
          icon: Clock,
          iconColor: '#F59E0B',
          title: 'Verification Pending',
          subtitle: 'Review in progress',
          description: 'We\'re reviewing your verification documents. This usually takes 1-2 business days.',
          actionText: 'Check Status',
          actionColor: '#F59E0B',
        };
      case 'rejected':
        return {
          icon: AlertTriangle,
          iconColor: '#EF4444',
          title: 'Verification Rejected',
          subtitle: verificationStatus.rejectionReason || 'Documents not accepted',
          description: 'Your verification was not approved. Please review the requirements and try again.',
          actionText: 'Resubmit',
          actionColor: '#EF4444',
        };
      default:
        return {
          icon: Shield,
          iconColor: '#6B7280',
          title: 'Get Verified',
          subtitle: 'Verify your identity',
          description: 'Get verified to build trust and unlock premium features.',
          actionText: 'Start Verification',
          actionColor: '#1E40AF',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const handleAction = () => {
    switch (verificationStatus.status) {
      case 'verified':
        Alert.alert('Verification Certificate', 'Your verification certificate is valid until December 2024.');
        break;
      case 'pending':
        setShowVerificationModal(true);
        break;
      case 'rejected':
        onResubmit();
        break;
      default:
        onVerify();
        break;
    }
  };

  const VerificationModal = () => (
    <Modal
      visible={showVerificationModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowVerificationModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Verification Status</Text>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => setShowVerificationModal(false)}
          >
            <X size={24} color="#6B7280" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.statusCard}>
            <Clock size={48} color="#F59E0B" strokeWidth={2} />
            <Text style={styles.statusTitle}>Verification in Progress</Text>
            <Text style={styles.statusDescription}>
              We received your verification documents on {verificationStatus.submittedAt || 'recently'}.
              Our team is currently reviewing them.
            </Text>
          </View>

          <View style={styles.timelineContainer}>
            <Text style={styles.timelineTitle}>Timeline</Text>
            
            <View style={styles.timelineItem}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineDate}>{verificationStatus.submittedAt || 'Today'}</Text>
                <Text style={styles.timelineText}>Documents submitted</Text>
              </View>
            </View>

            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, styles.timelineDotPending]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineDate}>1-2 business days</Text>
                <Text style={styles.timelineText}>Under review</Text>
              </View>
            </View>

            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, styles.timelineDotFuture]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineDate}>Soon</Text>
                <Text style={styles.timelineText}>Verification complete</Text>
              </View>
            </View>
          </View>

          <View style={styles.helpSection}>
            <Text style={styles.helpTitle}>Need Help?</Text>
            <Text style={styles.helpText}>
              If you have questions about your verification status, contact our support team.
            </Text>
            <TouchableOpacity style={styles.helpButton}>
              <Text style={styles.helpButtonText}>Contact Support</Text>
              <ArrowRight size={16} color="#1E40AF" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>Verification Status</Text>
        </View>

        <TouchableOpacity style={styles.verificationCard} onPress={handleAction}>
          <View style={styles.verificationLeft}>
            <View style={styles.iconContainer}>
              <Icon size={24} color={config.iconColor} strokeWidth={2} />
            </View>
            <View style={styles.verificationInfo}>
              <Text style={styles.verificationTitle}>{config.title}</Text>
              <Text style={styles.verificationSubtitle}>{config.subtitle}</Text>
              <Text style={styles.verificationDescription}>{config.description}</Text>
            </View>
          </View>
          <View style={styles.verificationRight}>
            <Text style={[styles.actionText, { color: config.actionColor }]}>
              {config.actionText}
            </Text>
            <ArrowRight size={16} color={config.actionColor} strokeWidth={2} />
          </View>
        </TouchableOpacity>

        {verificationStatus.status === 'unverified' && (
          <View style={styles.benefitsContainer}>
            <Text style={styles.benefitsTitle}>Benefits of Verification:</Text>
            <View style={styles.benefitItem}>
              <CheckCircle size={16} color="#10B981" strokeWidth={2} />
              <Text style={styles.benefitText}>Build trust with other professionals</Text>
            </View>
            <View style={styles.benefitItem}>
              <CheckCircle size={16} color="#10B981" strokeWidth={2} />
              <Text style={styles.benefitText}>Unlock premium networking features</Text>
            </View>
            <View style={styles.benefitItem}>
              <CheckCircle size={16} color="#10B981" strokeWidth={2} />
              <Text style={styles.benefitText}>Get priority in search results</Text>
            </View>
          </View>
        )}
      </View>

      <VerificationModal />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 12,
  },
  header: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  verificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  verificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  verificationInfo: {
    flex: 1,
  },
  verificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  verificationSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  verificationDescription: {
    fontSize: 12,
    color: '#9CA3AF',
    lineHeight: 16,
  },
  verificationRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  benefitsContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
  },
  benefitsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 14,
    color: '#374151',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  statusCard: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    marginBottom: 24,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  statusDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  timelineContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    marginTop: 4,
    marginRight: 12,
  },
  timelineDotPending: {
    backgroundColor: '#F59E0B',
  },
  timelineDotFuture: {
    backgroundColor: '#E5E7EB',
  },
  timelineContent: {
    flex: 1,
  },
  timelineDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  timelineText: {
    fontSize: 14,
    color: '#6B7280',
  },
  helpSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EBF8FF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  helpButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
  },
});

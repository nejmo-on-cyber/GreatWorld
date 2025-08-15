import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Linking,
} from 'react-native';
import { router } from 'expo-router';
import {
  ArrowLeft,
  MessageCircle,
  Mail,
  Phone,
  CircleHelp as HelpCircle,
  ChevronRight,
  ExternalLink,
  Book,
  Shield,
  Bug,
} from 'lucide-react-native';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'How does proximity detection work?',
    answer: 'GreatWorld AI uses GPS to detect when you\'re stationary (not moving for 2+ minutes) and shows you other professionals within your selected radius. Your location is never shared with others - they only see approximate distance.',
  },
  {
    question: 'Why can\'t I see anyone nearby?',
    answer: 'Make sure you\'re stationary for at least 2 minutes, have location services enabled, and your visibility is set to "visible". Also check that there are other users in your area.',
  },
  {
    question: 'How do I verify my professional identity?',
    answer: 'Go to your profile settings and tap "Verify Identity". Upload a government-issued ID and your LinkedIn profile. Verification typically takes 24-48 hours.',
  },
  {
    question: 'What happens when I block someone?',
    answer: 'Blocked users cannot see your profile, send you messages, or find you in discovery. The block is bidirectional and immediate.',
  },
  {
    question: 'How does AI matching work?',
    answer: 'Our AI analyzes your professional background, interests, and goals to calculate compatibility scores with other users and suggest relevant conversation starters.',
  },
  {
    question: 'Is my location data safe?',
    answer: 'Yes. We only store your current location temporarily for matching purposes. Location history is automatically deleted after 7 days, and we never share exact coordinates with other users.',
  },
];

export default function HelpScreen() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'How would you like to contact our support team?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Email', onPress: () => Linking.openURL('mailto:support@greatworld.ai') },
        { text: 'Chat', onPress: () => Alert.alert('Chat Support', 'Live chat feature coming soon!') },
      ]
    );
  };

  const handleReportBug = () => {
    Alert.alert(
      'Report a Bug',
      'Please describe the issue you\'re experiencing and we\'ll investigate it.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send Report', onPress: () => Alert.alert('Bug Report Sent', 'Thank you for your report!') },
      ]
    );
  };

  const handleSafetyCenter = () => {
    Alert.alert('Safety Center', 'Opening safety guidelines and resources...');
  };

  const handleUserGuide = () => {
    Alert.alert('User Guide', 'Opening comprehensive user guide...');
  };

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const ContactOption = ({
    icon: Icon,
    title,
    subtitle,
    onPress,
  }: {
    icon: any;
    title: string;
    subtitle: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity style={styles.contactOption} onPress={onPress}>
      <View style={styles.contactLeft}>
        <View style={styles.contactIcon}>
          <Icon size={20} color="#1E40AF" strokeWidth={2} />
        </View>
        <View>
          <Text style={styles.contactTitle}>{title}</Text>
          <Text style={styles.contactSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <ChevronRight size={20} color="#D1D5DB" strokeWidth={2} />
    </TouchableOpacity>
  );

  const FAQItem = ({ item, index }: { item: FAQItem; index: number }) => (
    <TouchableOpacity
      style={styles.faqItem}
      onPress={() => toggleFAQ(index)}
    >
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{item.question}</Text>
        <Text style={[
          styles.faqToggle,
          expandedFAQ === index && styles.faqToggleExpanded
        ]}>
          {expandedFAQ === index ? '−' : '+'}
        </Text>
      </View>
      {expandedFAQ === index && (
        <Text style={styles.faqAnswer}>{item.answer}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#111827" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Contact Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get Help</Text>
          <ContactOption
            icon={MessageCircle}
            title="Contact Support"
            subtitle="Get help from our support team"
            onPress={handleContactSupport}
          />
          <ContactOption
            icon={Bug}
            title="Report a Bug"
            subtitle="Report technical issues"
            onPress={handleReportBug}
          />
          <ContactOption
            icon={Shield}
            title="Safety Center"
            subtitle="Safety guidelines and resources"
            onPress={handleSafetyCenter}
          />
          <ContactOption
            icon={Book}
            title="User Guide"
            subtitle="Complete guide to using the app"
            onPress={handleUserGuide}
          />
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqContainer}>
            {faqData.map((item, index) => (
              <FAQItem key={index} item={item} index={index} />
            ))}
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.contactInfo}>
            <View style={styles.contactInfoItem}>
              <Mail size={16} color="#6B7280" strokeWidth={2} />
              <Text style={styles.contactInfoText}>support@greatworld.ai</Text>
            </View>
            <View style={styles.contactInfoItem}>
              <Phone size={16} color="#6B7280" strokeWidth={2} />
              <Text style={styles.contactInfoText}>+1 (555) 123-4567</Text>
            </View>
            <Text style={styles.supportHours}>
              Support Hours: Monday - Friday, 9 AM - 6 PM PST
            </Text>
          </View>
        </View>

        {/* App Information */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoTitle}>GreatWorld AI</Text>
          <Text style={styles.appInfoVersion}>Version 1.0.0</Text>
          <Text style={styles.appInfoText}>
            Professional networking made simple and safe
          </Text>
        </View>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 16,
  },
  headerSpacer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EBF8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  contactSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  faqContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    flex: 1,
    marginRight: 12,
  },
  faqToggle: {
    fontSize: 20,
    fontWeight: '300',
    color: '#6B7280',
    width: 24,
    textAlign: 'center',
  },
  faqToggleExpanded: {
    color: '#1E40AF',
  },
  faqAnswer: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  contactInfo: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  contactInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  contactInfoText: {
    fontSize: 14,
    color: '#374151',
  },
  supportHours: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
    fontStyle: 'italic',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  appInfoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  appInfoVersion: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  appInfoText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
  },
});
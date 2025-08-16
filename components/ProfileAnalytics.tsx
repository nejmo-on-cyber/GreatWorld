import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TrendingUp, Eye, Users, MessageCircle, Calendar, MapPin, Star } from 'lucide-react-native';

interface ProfileAnalyticsProps {
  connections: number;
  profileViews: number;
  compatibility: number;
  messages: number;
  meetings: number;
  averageDistance: number;
  topIndustries: string[];
  onViewDetails: () => void;
}

export default function ProfileAnalytics({
  connections,
  profileViews,
  compatibility,
  messages,
  meetings,
  averageDistance,
  topIndustries,
  onViewDetails,
}: ProfileAnalyticsProps) {
  const getCompatibilityColor = () => {
    if (compatibility >= 90) return '#10B981';
    if (compatibility >= 70) return '#F59E0B';
    return '#EF4444';
  };

  const getCompatibilityText = () => {
    if (compatibility >= 90) return 'Excellent';
    if (compatibility >= 70) return 'Good';
    return 'Fair';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TrendingUp size={20} color="#1E40AF" strokeWidth={2} />
          <Text style={styles.title}>Profile Analytics</Text>
        </View>
        <TouchableOpacity style={styles.detailsButton} onPress={onViewDetails}>
          <Text style={styles.detailsButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>

      {/* Key Metrics */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <View style={styles.metricIcon}>
            <Users size={16} color="#1E40AF" strokeWidth={2} />
          </View>
          <Text style={styles.metricNumber}>{connections}</Text>
          <Text style={styles.metricLabel}>Connections</Text>
        </View>

        <View style={styles.metricCard}>
          <View style={styles.metricIcon}>
            <Eye size={16} color="#1E40AF" strokeWidth={2} />
          </View>
          <Text style={styles.metricNumber}>{profileViews}</Text>
          <Text style={styles.metricLabel}>Profile Views</Text>
        </View>

        <View style={styles.metricCard}>
          <View style={styles.metricIcon}>
            <MessageCircle size={16} color="#1E40AF" strokeWidth={2} />
          </View>
          <Text style={styles.metricNumber}>{messages}</Text>
          <Text style={styles.metricLabel}>Messages</Text>
        </View>

        <View style={styles.metricCard}>
          <View style={styles.metricIcon}>
            <Calendar size={16} color="#1E40AF" strokeWidth={2} />
          </View>
          <Text style={styles.metricNumber}>{meetings}</Text>
          <Text style={styles.metricLabel}>Meetings</Text>
        </View>
      </View>

      {/* Compatibility Score */}
      <View style={styles.compatibilitySection}>
        <View style={styles.compatibilityHeader}>
          <Star size={18} color="#FBBF24" strokeWidth={2} />
          <Text style={styles.compatibilityTitle}>AI Compatibility Score</Text>
        </View>
        <View style={styles.compatibilityContent}>
          <View style={styles.compatibilityScore}>
            <Text style={[styles.compatibilityNumber, { color: getCompatibilityColor() }]}>
              {compatibility}%
            </Text>
            <Text style={[styles.compatibilityText, { color: getCompatibilityColor() }]}>
              {getCompatibilityText()}
            </Text>
          </View>
          <Text style={styles.compatibilityDescription}>
            Your profile matches well with {compatibility}% of nearby professionals
          </Text>
        </View>
      </View>

      {/* Insights */}
      <View style={styles.insightsSection}>
        <Text style={styles.insightsTitle}>Insights</Text>
        
        <View style={styles.insightItem}>
          <MapPin size={16} color="#6B7280" strokeWidth={2} />
          <Text style={styles.insightText}>
            Average distance to connections: <Text style={styles.insightHighlight}>{averageDistance}m</Text>
          </Text>
        </View>

        <View style={styles.insightItem}>
          <Users size={16} color="#6B7280" strokeWidth={2} />
          <Text style={styles.insightText}>
            Top industries: <Text style={styles.insightHighlight}>{topIndustries.join(', ')}</Text>
          </Text>
        </View>

        <View style={styles.insightItem}>
          <TrendingUp size={16} color="#6B7280" strokeWidth={2} />
          <Text style={styles.insightText}>
            Profile views increased by <Text style={styles.insightHighlight}>23%</Text> this week
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 12,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  detailsButton: {
    backgroundColor: '#EBF8FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E40AF',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  metricIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EBF8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  compatibilitySection: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  compatibilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  compatibilityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
  },
  compatibilityContent: {
    alignItems: 'center',
  },
  compatibilityScore: {
    alignItems: 'center',
    marginBottom: 8,
  },
  compatibilityNumber: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  compatibilityText: {
    fontSize: 14,
    fontWeight: '600',
  },
  compatibilityDescription: {
    fontSize: 14,
    color: '#92400E',
    textAlign: 'center',
    lineHeight: 20,
  },
  insightsSection: {
    gap: 12,
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  insightText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  insightHighlight: {
    color: '#1E40AF',
    fontWeight: '600',
  },
});

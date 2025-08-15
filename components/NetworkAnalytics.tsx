import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { TrendingUp, Users, MapPin, Zap, Target, Award, Calendar, ChartBar as BarChart3 } from 'lucide-react-native';

interface NetworkStats {
  totalConnections: number;
  weeklyGrowth: number;
  topIndustries: Array<{ name: string; count: number; percentage: number }>;
  locationHotspots: Array<{ location: string; meetings: number }>;
  compatibilityAverage: number;
  responseRate: number;
  meetingSuccess: number;
}

interface NetworkAnalyticsProps {
  visible: boolean;
}

const { width } = Dimensions.get('window');

const mockStats: NetworkStats = {
  totalConnections: 127,
  weeklyGrowth: 23,
  topIndustries: [
    { name: 'Technology', count: 45, percentage: 35 },
    { name: 'Finance', count: 28, percentage: 22 },
    { name: 'Healthcare', count: 22, percentage: 17 },
    { name: 'Marketing', count: 18, percentage: 14 },
    { name: 'Design', count: 14, percentage: 12 },
  ],
  locationHotspots: [
    { location: 'Financial District', meetings: 23 },
    { location: 'Union Square', meetings: 18 },
    { location: 'SoMa', meetings: 15 },
    { location: 'Mission Bay', meetings: 12 },
  ],
  compatibilityAverage: 87,
  responseRate: 78,
  meetingSuccess: 92,
};

export default function NetworkAnalytics({ visible }: NetworkAnalyticsProps) {
  const [stats, setStats] = useState<NetworkStats>(mockStats);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  const StatCard = ({ 
    icon: Icon, 
    title, 
    value, 
    change, 
    color = '#1E40AF' 
  }: { 
    icon: any; 
    title: string; 
    value: string; 
    change?: string; 
    color?: string; 
  }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
        <Icon size={20} color={color} strokeWidth={2} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        {change && (
          <Text style={[styles.statChange, { color: change.startsWith('+') ? '#10B981' : '#EF4444' }]}>
            {change}
          </Text>
        )}
      </View>
    </View>
  );

  const IndustryBar = ({ industry }: { industry: { name: string; count: number; percentage: number } }) => (
    <View style={styles.industryItem}>
      <View style={styles.industryHeader}>
        <Text style={styles.industryName}>{industry.name}</Text>
        <Text style={styles.industryCount}>{industry.count}</Text>
      </View>
      <View style={styles.industryBarContainer}>
        <View 
          style={[
            styles.industryBar, 
            { width: `${industry.percentage}%` }
          ]} 
        />
      </View>
      <Text style={styles.industryPercentage}>{industry.percentage}%</Text>
    </View>
  );

  const LocationItem = ({ location }: { location: { location: string; meetings: number } }) => (
    <View style={styles.locationItem}>
      <MapPin size={16} color="#6B7280" strokeWidth={2} />
      <Text style={styles.locationName}>{location.location}</Text>
      <Text style={styles.locationCount}>{location.meetings} meetings</Text>
    </View>
  );

  if (!visible) return null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Network Analytics</Text>
        <Text style={styles.headerSubtitle}>Your professional networking insights</Text>
      </View>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        {(['week', 'month', 'year'] as const).map(period => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.activePeriodButton
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text style={[
              styles.periodButtonText,
              selectedPeriod === period && styles.activePeriodButtonText
            ]}>
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Key Stats */}
      <View style={styles.statsGrid}>
        <StatCard
          icon={Users}
          title="Total Connections"
          value={stats.totalConnections.toString()}
          change={`+${stats.weeklyGrowth} this week`}
          color="#1E40AF"
        />
        <StatCard
          icon={Zap}
          title="Avg Compatibility"
          value={`${stats.compatibilityAverage}%`}
          change="+5% vs last month"
          color="#10B981"
        />
        <StatCard
          icon={Target}
          title="Response Rate"
          value={`${stats.responseRate}%`}
          change="+12% vs last month"
          color="#F59E0B"
        />
        <StatCard
          icon={Award}
          title="Meeting Success"
          value={`${stats.meetingSuccess}%`}
          change="+8% vs last month"
          color="#8B5CF6"
        />
      </View>

      {/* Industry Breakdown */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <BarChart3 size={20} color="#1E40AF" strokeWidth={2} />
          <Text style={styles.sectionTitle}>Industry Breakdown</Text>
        </View>
        <View style={styles.industriesContainer}>
          {stats.topIndustries.map((industry, index) => (
            <IndustryBar key={index} industry={industry} />
          ))}
        </View>
      </View>

      {/* Location Hotspots */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MapPin size={20} color="#1E40AF" strokeWidth={2} />
          <Text style={styles.sectionTitle}>Meeting Hotspots</Text>
        </View>
        <View style={styles.locationsContainer}>
          {stats.locationHotspots.map((location, index) => (
            <LocationItem key={index} location={location} />
          ))}
        </View>
      </View>

      {/* Growth Chart Placeholder */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <TrendingUp size={20} color="#1E40AF" strokeWidth={2} />
          <Text style={styles.sectionTitle}>Connection Growth</Text>
        </View>
        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartPlaceholderText}>
            Interactive growth chart would go here
          </Text>
          <Text style={styles.chartPlaceholderSubtext}>
            Showing connections over time with trend analysis
          </Text>
        </View>
      </View>

      {/* Insights */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI Insights</Text>
        <View style={styles.insightsContainer}>
          <View style={styles.insight}>
            <View style={styles.insightIcon}>
              <Zap size={16} color="#FBBF24" strokeWidth={2} />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Peak Activity</Text>
              <Text style={styles.insightText}>
                You're most active on Tuesday afternoons. Consider scheduling more meetings then.
              </Text>
            </View>
          </View>
          
          <View style={styles.insight}>
            <View style={styles.insightIcon}>
              <Target size={16} color="#10B981" strokeWidth={2} />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Industry Opportunity</Text>
              <Text style={styles.insightText}>
                You have strong connections in tech. Consider expanding into healthcare.
              </Text>
            </View>
          </View>
          
          <View style={styles.insight}>
            <View style={styles.insightIcon}>
              <MapPin size={16} color="#8B5CF6" strokeWidth={2} />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Location Tip</Text>
              <Text style={styles.insightText}>
                Financial District has your highest meeting success rate (95%).
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 8,
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  activePeriodButton: {
    backgroundColor: '#1E40AF',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activePeriodButtonText: {
    color: 'white',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 12,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: (width - 52) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statContent: {
    gap: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  statTitle: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  statChange: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  section: {
    backgroundColor: 'white',
    marginTop: 12,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  industriesContainer: {
    gap: 12,
  },
  industryItem: {
    gap: 6,
  },
  industryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  industryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  industryCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  industryBarContainer: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  industryBar: {
    height: '100%',
    backgroundColor: '#1E40AF',
    borderRadius: 3,
  },
  industryPercentage: {
    fontSize: 12,
    color: '#6B7280',
    alignSelf: 'flex-end',
  },
  locationsContainer: {
    gap: 12,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  locationCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  chartPlaceholderText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  chartPlaceholderSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'center',
  },
  insightsContainer: {
    gap: 16,
  },
  insight: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  insightIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});
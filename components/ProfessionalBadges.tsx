import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
} from 'react-native';
import { Award, Shield, Star, Zap, Users, Target, TrendingUp, X, CircleCheck as CheckCircle, Clock } from 'lucide-react-native';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  earned: boolean;
  earnedDate?: string;
  progress?: number;
  requirement: string;
}

interface ProfessionalBadgesProps {
  visible: boolean;
  onClose: () => void;
  userBadges: Badge[];
}

const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'Verified Professional',
    description: 'Identity and professional credentials verified',
    icon: 'shield',
    color: '#1E40AF',
    bgColor: '#EBF8FF',
    earned: true,
    earnedDate: '2024-01-15',
    requirement: 'Complete ID verification and LinkedIn integration',
  },
  {
    id: '2',
    name: 'Super Connector',
    description: 'Made 50+ successful professional connections',
    icon: 'users',
    color: '#10B981',
    bgColor: '#ECFDF5',
    earned: true,
    earnedDate: '2024-02-20',
    requirement: 'Make 50 successful connections',
  },
  {
    id: '3',
    name: 'AI Compatibility Expert',
    description: 'Achieved 90%+ average compatibility score',
    icon: 'zap',
    color: '#F59E0B',
    bgColor: '#FFFBEB',
    earned: true,
    earnedDate: '2024-03-10',
    requirement: 'Maintain 90%+ average compatibility',
  },
  {
    id: '4',
    name: 'Meeting Master',
    description: 'Scheduled and completed 25+ in-person meetings',
    icon: 'target',
    color: '#8B5CF6',
    bgColor: '#F3E8FF',
    earned: false,
    progress: 18,
    requirement: 'Complete 25 in-person meetings',
  },
  {
    id: '5',
    name: 'Industry Leader',
    description: 'Top 1% most connected in your industry',
    icon: 'trending-up',
    color: '#EF4444',
    bgColor: '#FEF2F2',
    earned: false,
    progress: 85,
    requirement: 'Reach top 1% in your industry',
  },
  {
    id: '6',
    name: 'Community Champion',
    description: 'Helped 10+ professionals find their ideal connections',
    icon: 'star',
    color: '#06B6D4',
    bgColor: '#ECFEFF',
    earned: false,
    progress: 7,
    requirement: 'Help 10 professionals connect',
  },
];

export default function ProfessionalBadges({
  visible,
  onClose,
  userBadges = mockBadges,
}: ProfessionalBadgesProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'earned' | 'progress'>('all');

  const getIcon = (iconName: string, color: string) => {
    const iconProps = { size: 24, color, strokeWidth: 2 };
    
    switch (iconName) {
      case 'shield':
        return <Shield {...iconProps} />;
      case 'users':
        return <Users {...iconProps} />;
      case 'zap':
        return <Zap {...iconProps} />;
      case 'target':
        return <Target {...iconProps} />;
      case 'trending-up':
        return <TrendingUp {...iconProps} />;
      case 'star':
        return <Star {...iconProps} />;
      default:
        return <Award {...iconProps} />;
    }
  };

  const filteredBadges = userBadges.filter(badge => {
    switch (selectedCategory) {
      case 'earned':
        return badge.earned;
      case 'progress':
        return !badge.earned;
      default:
        return true;
    }
  });

  const earnedCount = userBadges.filter(badge => badge.earned).length;
  const totalCount = userBadges.length;

  const CategoryTab = ({ 
    category, 
    title, 
    count 
  }: { 
    category: 'all' | 'earned' | 'progress';
    title: string;
    count?: number;
  }) => (
    <TouchableOpacity
      style={[
        styles.categoryTab,
        selectedCategory === category && styles.activeCategoryTab
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text style={[
        styles.categoryTabText,
        selectedCategory === category && styles.activeCategoryTabText
      ]}>
        {title}
      </Text>
      {count !== undefined && (
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const BadgeCard = ({ badge }: { badge: Badge }) => (
    <View style={[
      styles.badgeCard,
      !badge.earned && styles.unearned,
      { borderLeftColor: badge.color }
    ]}>
      <View style={styles.badgeHeader}>
        <View style={[styles.badgeIcon, { backgroundColor: badge.bgColor }]}>
          {getIcon(badge.icon, badge.color)}
        </View>
        <View style={styles.badgeInfo}>
          <View style={styles.badgeNameContainer}>
            <Text style={[
              styles.badgeName,
              !badge.earned && styles.unearnedText
            ]}>
              {badge.name}
            </Text>
            {badge.earned ? (
              <CheckCircle size={16} color="#10B981" strokeWidth={2} />
            ) : (
              <Clock size={16} color="#6B7280" strokeWidth={2} />
            )}
          </View>
          <Text style={styles.badgeDescription}>{badge.description}</Text>
          <Text style={styles.badgeRequirement}>{badge.requirement}</Text>
        </View>
      </View>

      {badge.earned && badge.earnedDate && (
        <View style={styles.earnedInfo}>
          <Text style={styles.earnedDate}>
            Earned on {new Date(badge.earnedDate).toLocaleDateString()}
          </Text>
        </View>
      )}

      {!badge.earned && badge.progress !== undefined && (
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>Progress</Text>
            <Text style={styles.progressPercentage}>
              {Math.round((badge.progress / (badge.requirement.match(/\d+/)?.[0] || 100)) * 100)}%
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { 
                  width: `${(badge.progress / (parseInt(badge.requirement.match(/\d+/)?.[0] || '100'))) * 100}%`,
                  backgroundColor: badge.color 
                }
              ]} 
            />
          </View>
          <Text style={styles.progressDetail}>
            {badge.progress} / {badge.requirement.match(/\d+/)?.[0] || '?'}
          </Text>
        </View>
      )}
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
            <View style={styles.headerIcon}>
              <Award size={20} color="#F59E0B" strokeWidth={2} />
            </View>
            <View>
              <Text style={styles.headerTitle}>Professional Badges</Text>
              <Text style={styles.headerSubtitle}>
                {earnedCount} of {totalCount} earned
              </Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#6B7280" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <View style={styles.categoryTabs}>
          <CategoryTab category="all" title="All" count={totalCount} />
          <CategoryTab category="earned" title="Earned" count={earnedCount} />
          <CategoryTab category="progress" title="In Progress" count={totalCount - earnedCount} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Your Achievement Level</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{earnedCount}</Text>
                <Text style={styles.statLabel}>Badges Earned</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {Math.round((earnedCount / totalCount) * 100)}%
                </Text>
                <Text style={styles.statLabel}>Completion</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  #{Math.floor(Math.random() * 1000) + 1}
                </Text>
                <Text style={styles.statLabel}>Global Rank</Text>
              </View>
            </View>
          </View>

          <View style={styles.badgesContainer}>
            {filteredBadges.map(badge => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </View>

          <View style={styles.benefitsCard}>
            <Text style={styles.benefitsTitle}>Badge Benefits</Text>
            <View style={styles.benefitsList}>
              <Text style={styles.benefit}>• Increased profile visibility</Text>
              <Text style={styles.benefit}>• Priority in AI matching algorithm</Text>
              <Text style={styles.benefit}>• Access to exclusive networking events</Text>
              <Text style={styles.benefit}>• Professional credibility boost</Text>
            </View>
          </View>
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
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFBEB',
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
  categoryTabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    gap: 6,
  },
  activeCategoryTab: {
    backgroundColor: '#1E40AF',
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeCategoryTabText: {
    color: 'white',
  },
  countBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 18,
    alignItems: 'center',
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  badgesContainer: {
    gap: 16,
    marginBottom: 20,
  },
  badgeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  unearned: {
    opacity: 0.7,
  },
  badgeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  badgeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeInfo: {
    flex: 1,
  },
  badgeNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  badgeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  unearnedText: {
    color: '#6B7280',
  },
  badgeDescription: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 6,
  },
  badgeRequirement: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  earnedInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  earnedDate: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  progressContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressDetail: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
  },
  benefitsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  benefitsList: {
    gap: 6,
  },
  benefit: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});
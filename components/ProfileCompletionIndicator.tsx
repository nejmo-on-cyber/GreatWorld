import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckCircle, AlertCircle, ChevronRight } from 'lucide-react-native';

interface ProfileField {
  name: string;
  isCompleted: boolean;
  isRequired: boolean;
}

interface ProfileCompletionIndicatorProps {
  fields: ProfileField[];
  onCompleteProfile: () => void;
}

export default function ProfileCompletionIndicator({
  fields,
  onCompleteProfile,
}: ProfileCompletionIndicatorProps) {
  const completedFields = fields.filter(field => field.isCompleted).length;
  const totalFields = fields.length;
  const completionPercentage = Math.round((completedFields / totalFields) * 100);
  
  const incompleteFields = fields.filter(field => !field.isCompleted);
  const hasIncompleteRequired = incompleteFields.some(field => field.isRequired);

  const getCompletionColor = () => {
    if (completionPercentage >= 90) return '#10B981';
    if (completionPercentage >= 70) return '#F59E0B';
    return '#EF4444';
  };

  const getCompletionMessage = () => {
    if (completionPercentage >= 90) return 'Excellent! Your profile is nearly complete.';
    if (completionPercentage >= 70) return 'Good progress! Add a few more details to improve your profile.';
    return 'Complete your profile to get better matches and connections.';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${completionPercentage}%`,
                  backgroundColor: getCompletionColor()
                }
              ]} 
            />
          </View>
          <Text style={styles.percentageText}>{completionPercentage}%</Text>
        </View>
        <Text style={styles.title}>Profile Completion</Text>
        <Text style={styles.message}>{getCompletionMessage()}</Text>
      </View>

      {hasIncompleteRequired && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Complete these to improve your profile:</Text>
          {incompleteFields.slice(0, 3).map((field, index) => (
            <View key={index} style={styles.suggestionItem}>
              <AlertCircle size={16} color="#F59E0B" strokeWidth={2} />
              <Text style={styles.suggestionText}>
                {field.name}
                {field.isRequired && <Text style={styles.requiredText}> (Required)</Text>}
              </Text>
            </View>
          ))}
          {incompleteFields.length > 3 && (
            <Text style={styles.moreText}>+{incompleteFields.length - 3} more fields</Text>
          )}
        </View>
      )}

      <TouchableOpacity style={styles.completeButton} onPress={onCompleteProfile}>
        <Text style={styles.completeButtonText}>
          {completionPercentage >= 90 ? 'Review Profile' : 'Complete Profile'}
        </Text>
        <ChevronRight size={16} color="white" strokeWidth={2} />
      </TouchableOpacity>
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
    alignItems: 'center',
    marginBottom: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    minWidth: 40,
    textAlign: 'right',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  suggestionsContainer: {
    marginBottom: 16,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  suggestionText: {
    fontSize: 14,
    color: '#6B7280',
  },
  requiredText: {
    color: '#EF4444',
    fontWeight: '500',
  },
  moreText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
    marginTop: 4,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E40AF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

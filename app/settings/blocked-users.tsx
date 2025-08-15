import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, UserMinus, Shield } from 'lucide-react-native';

interface BlockedUser {
  id: string;
  firstName: string;
  lastName: string;
  photo: string;
  profession: string;
  company: string;
  blockedAt: string;
  reason: string;
}

const mockBlockedUsers: BlockedUser[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    photo: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    profession: 'Sales Manager',
    company: 'TechCorp',
    blockedAt: '2024-01-15',
    reason: 'Inappropriate behavior',
  },
  {
    id: '2',
    firstName: 'Mike',
    lastName: 'Johnson',
    photo: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    profession: 'Marketing Director',
    company: 'StartupXYZ',
    blockedAt: '2024-02-03',
    reason: 'Spam messages',
  },
];

export default function BlockedUsersScreen() {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>(mockBlockedUsers);

  const handleUnblockUser = (userId: string, userName: string) => {
    Alert.alert(
      'Unblock User',
      `Are you sure you want to unblock ${userName}? They will be able to see your profile and send you messages again.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unblock',
          onPress: () => {
            setBlockedUsers(prev => prev.filter(user => user.id !== userId));
            Alert.alert('User Unblocked', `${userName} has been unblocked.`);
          },
        },
      ]
    );
  };

  const BlockedUserCard = ({ user }: { user: BlockedUser }) => (
    <View style={styles.userCard}>
      <Image source={{ uri: user.photo }} style={styles.userPhoto} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>
          {user.firstName} {user.lastName}
        </Text>
        <Text style={styles.userProfession}>{user.profession}</Text>
        <Text style={styles.userCompany}>{user.company}</Text>
        <Text style={styles.blockedInfo}>
          Blocked on {new Date(user.blockedAt).toLocaleDateString()}
        </Text>
        <Text style={styles.blockReason}>Reason: {user.reason}</Text>
      </View>
      <TouchableOpacity
        style={styles.unblockButton}
        onPress={() => handleUnblockUser(user.id, `${user.firstName} ${user.lastName}`)}
      >
        <UserMinus size={16} color="#EF4444" strokeWidth={2} />
        <Text style={styles.unblockButtonText}>Unblock</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#111827" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Blocked Users</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {blockedUsers.length > 0 ? (
          <>
            <View style={styles.infoCard}>
              <Shield size={24} color="#EF4444" strokeWidth={2} />
              <Text style={styles.infoTitle}>Blocked Users</Text>
              <Text style={styles.infoText}>
                You have blocked {blockedUsers.length} user{blockedUsers.length !== 1 ? 's' : ''}. 
                Blocked users cannot see your profile, send you messages, or find you in discovery.
              </Text>
            </View>

            {blockedUsers.map(user => (
              <BlockedUserCard key={user.id} user={user} />
            ))}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Shield size={48} color="#D1D5DB" strokeWidth={1.5} />
            <Text style={styles.emptyStateTitle}>No Blocked Users</Text>
            <Text style={styles.emptyStateText}>
              You haven't blocked anyone yet. When you block someone, they'll appear here.
            </Text>
          </View>
        )}
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
    padding: 20,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 12,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  userCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  userPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  userProfession: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
  },
  userCompany: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
  },
  blockedInfo: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  blockReason: {
    fontSize: 12,
    color: '#EF4444',
    fontStyle: 'italic',
  },
  unblockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 6,
  },
  unblockButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#EF4444',
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 48,
    borderRadius: 16,
    marginTop: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Camera,
  X,
  Plus,
  Check,
  MapPin,
  Briefcase,
  User,
  Edit3,
  Save,
  Trash2,
} from 'lucide-react-native';

interface EditableProfile {
  firstName: string;
  lastName: string;
  photo: string;
  profession: string;
  company: string;
  bio: string;
  interests: string[];
  lookingFor: string[];
  location: string;
  website: string;
  linkedin: string;
  isVisible: boolean;
  showOnlineStatus: boolean;
  allowLocationSharing: boolean;
}

const defaultProfile: EditableProfile = {
  firstName: 'Nejmo',
  lastName: 'Serraoui',
  photo: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  profession: 'Senior Software Engineer',
  company: 'Apple',
  bio: 'Passionate about building scalable mobile applications and AI-driven solutions. Always looking to connect with fellow innovators.',
  interests: ['iOS Development', 'Machine Learning', 'Startups', 'Design Patterns'],
  lookingFor: ['networking', 'collaboration', 'hiring'],
  location: 'San Francisco, CA',
  website: '',
  linkedin: '',
  isVisible: true,
  showOnlineStatus: true,
  allowLocationSharing: true,
};

export default function EditProfileScreen() {
  const [profile, setProfile] = useState<EditableProfile>(defaultProfile);
  const [newInterest, setNewInterest] = useState('');
  const [newLookingFor, setNewLookingFor] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Check if profile has changed from default
    setHasChanges(JSON.stringify(profile) !== JSON.stringify(defaultProfile));
  }, [profile]);

  const updateProfile = (field: keyof EditableProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const addInterest = () => {
    if (newInterest.trim() && !profile.interests.includes(newInterest.trim())) {
      updateProfile('interests', [...profile.interests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const removeInterest = (index: number) => {
    updateProfile('interests', profile.interests.filter((_, i) => i !== index));
  };

  const addLookingFor = () => {
    if (newLookingFor.trim() && !profile.lookingFor.includes(newLookingFor.trim())) {
      updateProfile('lookingFor', [...profile.lookingFor, newLookingFor.trim()]);
      setNewLookingFor('');
    }
  };

  const removeLookingFor = (index: number) => {
    updateProfile('lookingFor', profile.lookingFor.filter((_, i) => i !== index));
  };

  const handlePhotoChange = () => {
    Alert.alert(
      'Change Profile Photo',
      'Choose an option',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: () => Alert.alert('Camera', 'Camera functionality coming soon!') },
        { text: 'Choose from Library', onPress: () => Alert.alert('Photo Library', 'Photo library functionality coming soon!') },
      ]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSaving(false);
    Alert.alert('Success', 'Profile updated successfully!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const handleDiscard = () => {
    if (hasChanges) {
      Alert.alert(
        'Discard Changes',
        'Are you sure you want to discard your changes?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  };

  const EditableField = ({
    icon: Icon,
    label,
    value,
    onChangeText,
    placeholder,
    multiline = false,
    numberOfLines = 1,
  }: {
    icon: any;
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    multiline?: boolean;
    numberOfLines?: number;
  }) => (
    <View style={styles.fieldContainer}>
      <View style={styles.fieldHeader}>
        <Icon size={20} color="#6B7280" strokeWidth={2} />
        <Text style={styles.fieldLabel}>{label}</Text>
      </View>
      <TextInput
        style={[styles.textInput, multiline && styles.multilineInput]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );

  const TagInput = ({
    label,
    items,
    onAdd,
    onRemove,
    placeholder,
    value,
    onChangeText,
  }: {
    label: string;
    items: string[];
    onAdd: () => void;
    onRemove: (index: number) => void;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
  }) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.tagInputContainer}>
        <TextInput
          style={styles.tagInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          onSubmitEditing={onAdd}
        />
        <TouchableOpacity style={styles.addTagButton} onPress={onAdd}>
          <Plus size={16} color="white" strokeWidth={2} />
        </TouchableOpacity>
      </View>
      <View style={styles.tagsContainer}>
        {items.map((item, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{item}</Text>
            <TouchableOpacity onPress={() => onRemove(index)}>
              <X size={14} color="#6B7280" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );

  const ToggleField = ({
    icon: Icon,
    label,
    subtitle,
    value,
    onToggle,
  }: {
    icon: any;
    label: string;
    subtitle: string;
    value: boolean;
    onToggle: (value: boolean) => void;
  }) => (
    <View style={styles.toggleContainer}>
      <View style={styles.toggleLeft}>
        <Icon size={20} color="#6B7280" strokeWidth={2} />
        <View style={styles.toggleContent}>
          <Text style={styles.toggleLabel}>{label}</Text>
          <Text style={styles.toggleSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#E5E7EB', true: '#BFDBFE' }}
        thumbColor={value ? '#1E40AF' : '#9CA3AF'}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleDiscard}>
          <ArrowLeft size={24} color="#111827" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity 
          style={[styles.saveButton, (!hasChanges || isSaving) && styles.saveButtonDisabled]} 
          onPress={handleSave}
          disabled={!hasChanges || isSaving}
        >
          <Save size={20} color={hasChanges && !isSaving ? "white" : "#9CA3AF"} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Photo */}
        <View style={styles.photoSection}>
          <View style={styles.photoContainer}>
            <Image source={{ uri: profile.photo }} style={styles.profilePhoto} />
            <TouchableOpacity style={styles.cameraButton} onPress={handlePhotoChange}>
              <Camera size={16} color="white" strokeWidth={2} />
            </TouchableOpacity>
          </View>
          <Text style={styles.photoHint}>Tap to change photo</Text>
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <EditableField
            icon={User}
            label="First Name"
            value={profile.firstName}
            onChangeText={(text) => updateProfile('firstName', text)}
            placeholder="Enter your first name"
          />
          
          <EditableField
            icon={User}
            label="Last Name"
            value={profile.lastName}
            onChangeText={(text) => updateProfile('lastName', text)}
            placeholder="Enter your last name"
          />
          
          <EditableField
            icon={Briefcase}
            label="Profession"
            value={profile.profession}
            onChangeText={(text) => updateProfile('profession', text)}
            placeholder="e.g., Software Engineer"
          />
          
          <EditableField
            icon={Briefcase}
            label="Company"
            value={profile.company}
            onChangeText={(text) => updateProfile('company', text)}
            placeholder="e.g., Apple Inc."
          />
          
          <EditableField
            icon={MapPin}
            label="Location"
            value={profile.location}
            onChangeText={(text) => updateProfile('location', text)}
            placeholder="e.g., San Francisco, CA"
          />
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <EditableField
            icon={Edit3}
            label="Bio"
            value={profile.bio}
            onChangeText={(text) => updateProfile('bio', text)}
            placeholder="Tell others about yourself..."
            multiline={true}
            numberOfLines={4}
          />
        </View>

        {/* Interests */}
        <View style={styles.section}>
          <TagInput
            label="Interests"
            items={profile.interests}
            onAdd={addInterest}
            onRemove={removeInterest}
            placeholder="Add an interest"
            value={newInterest}
            onChangeText={setNewInterest}
          />
        </View>

        {/* Looking For */}
        <View style={styles.section}>
          <TagInput
            label="Looking For"
            items={profile.lookingFor}
            onAdd={addLookingFor}
            onRemove={removeLookingFor}
            placeholder="Add what you're looking for"
            value={newLookingFor}
            onChangeText={setNewLookingFor}
          />
        </View>

        {/* Social Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Social Links</Text>
          
          <EditableField
            icon={Edit3}
            label="Website"
            value={profile.website}
            onChangeText={(text) => updateProfile('website', text)}
            placeholder="https://yourwebsite.com"
          />
          
          <EditableField
            icon={Edit3}
            label="LinkedIn"
            value={profile.linkedin}
            onChangeText={(text) => updateProfile('linkedin', text)}
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </View>

        {/* Privacy Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          
          <ToggleField
            icon={Edit3}
            label="Profile Visibility"
            subtitle="Allow others to see your profile"
            value={profile.isVisible}
            onToggle={(value) => updateProfile('isVisible', value)}
          />
          
          <ToggleField
            icon={Edit3}
            label="Online Status"
            subtitle="Show when you're online"
            value={profile.showOnlineStatus}
            onToggle={(value) => updateProfile('showOnlineStatus', value)}
          />
          
          <ToggleField
            icon={MapPin}
            label="Location Sharing"
            subtitle="Allow others to see your location"
            value={profile.allowLocationSharing}
            onToggle={(value) => updateProfile('allowLocationSharing', value)}
          />
        </View>

        {/* Profile Completion */}
        <View style={styles.completionSection}>
          <Text style={styles.completionTitle}>Profile Completion</Text>
          <View style={styles.completionBar}>
            <View style={[styles.completionFill, { width: '85%' }]} />
          </View>
          <Text style={styles.completionText}>85% Complete</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    justifyContent: 'space-between',
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
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  content: {
    flex: 1,
  },
  photoSection: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: 'white',
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoHint: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    backgroundColor: 'white',
    marginTop: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  tagInputContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  tagInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  addTagButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF8FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E40AF',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  toggleContent: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  toggleSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  completionSection: {
    backgroundColor: 'white',
    marginTop: 12,
    marginBottom: 20,
    padding: 20,
    alignItems: 'center',
  },
  completionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  completionBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
  },
  completionFill: {
    height: '100%',
    backgroundColor: '#1E40AF',
    borderRadius: 4,
  },
  completionText: {
    fontSize: 14,
    color: '#6B7280',
  },
});

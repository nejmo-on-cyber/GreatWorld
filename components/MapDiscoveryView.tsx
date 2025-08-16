import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  Modal,
  StatusBar,
} from 'react-native';
import { MapPin, X, MessageCircle, Users, Navigation, ZoomIn, ZoomOut, Locate, Layers } from 'lucide-react-native';
import GlowingStatusDot from './GlowingStatusDot';

interface MapUser {
  id: string;
  firstName: string;
  lastName: string;
  photo: string;
  profession: string;
  company: string;
  latitude: number;
  longitude: number;
  distance: number;
  lastSeen: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  isVerified: boolean;
}

interface MapDiscoveryViewProps {
  visible: boolean;
  onClose: () => void;
  users?: MapUser[];
  onUserPress: (user: MapUser) => void;
  onMessageUser: (userId: string) => void;
  onConnectUser: (userId: string) => void;
}

const { width, height } = Dimensions.get('window');

// Mock San Francisco map positions (relative to container)
const mockMapUsers: MapUser[] = [
  {
    id: '1',
    firstName: 'Nejmo',
    lastName: 'Serraoui',
    photo: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    profession: 'Product Manager',
    company: 'Meta',
    latitude: 0.3, // Relative position (0-1)
    longitude: 0.6,
    distance: 85,
    lastSeen: '2m ago',
    status: 'online',
    isVerified: true,
  },
  {
    id: '2',
    firstName: 'Marcus',
    lastName: 'Rodriguez',
    photo: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    profession: 'Software Engineer',
    company: 'Google',
    latitude: 0.2,
    longitude: 0.3,
    distance: 120,
    lastSeen: '5m ago',
    status: 'away',
    isVerified: true,
  },
  {
    id: '3',
    firstName: 'Sarah',
    lastName: 'Chen',
    photo: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    profession: 'Data Scientist',
    company: 'Netflix',
    latitude: 0.7,
    longitude: 0.8,
    distance: 200,
    lastSeen: '10m ago',
    status: 'online',
    isVerified: true,
  },
  {
    id: '4',
    firstName: 'Alex',
    lastName: 'Thompson',
    photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    profession: 'Mobile Developer',
    company: 'Uber',
    latitude: 0.5,
    longitude: 0.2,
    distance: 180,
    lastSeen: '1m ago',
    status: 'online',
    isVerified: true,
  },
];

export default function MapDiscoveryView({
  visible,
  onClose,
  users = mockMapUsers,
  onUserPress,
  onMessageUser,
  onConnectUser,
}: MapDiscoveryViewProps) {
  const [selectedUser, setSelectedUser] = useState<MapUser | null>(null);
  const [showPeopleList, setShowPeopleList] = useState(true);
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');

  if (!visible) return null;

  const handleMarkerPress = (user: MapUser) => {
    setSelectedUser(user);
    onUserPress(user);
  };

  const renderPeopleList = () => (
    <View style={styles.peopleListContainer}>
      <View style={styles.peopleListHeader}>
        <Text style={styles.peopleListTitle}>People Nearby</Text>
        <Text style={styles.peopleCount}>{users.length}</Text>
      </View>
      <ScrollView style={styles.peopleScrollView} showsVerticalScrollIndicator={false}>
        {users.map((user) => (
          <TouchableOpacity
            key={user.id}
            style={styles.personCard}
            onPress={() => handleMarkerPress(user)}
          >
            <View style={styles.personPhotoContainer}>
              <Image source={{ uri: user.photo }} style={styles.personPhoto} />
              <GlowingStatusDot status={user.status} size={8} position="bottom-right" />
            </View>
            <View style={styles.personInfo}>
              <Text style={styles.personName}>
                {user.firstName} {user.lastName}
              </Text>
              <Text style={styles.personDetails}>
                {user.profession} at {user.company}
              </Text>
              <Text style={styles.personDistance}>
                {user.distance}m away • {user.lastSeen}
              </Text>
            </View>
            <View style={styles.personActions}>
              <TouchableOpacity
                style={[styles.personActionButton, styles.messageActionButton]}
                onPress={() => onMessageUser(user.id)}
              >
                <MessageCircle size={18} color="white" strokeWidth={2} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.personActionButton, styles.connectActionButton]}
                onPress={() => onConnectUser(user.id)}
              >
                <Users size={18} color="white" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <View style={styles.fullScreenContainer}>
        {/* Full Screen Realistic Map */}
        <View style={styles.fullScreenMap}>
          {/* Map Background with realistic styling */}
          <View style={[styles.mapBackground, mapType === 'satellite' ? styles.satelliteBackground : styles.standardBackground]}>
            {mapType === 'standard' ? (
              <>
                {/* Water bodies */}
                <View style={styles.sanFranciscoBay} />
                <View style={styles.pacificOcean} />
                
                {/* Land areas with neighborhoods */}
                <View style={styles.landMass}>
                  {/* Major Streets and Highways */}
                  <View style={[styles.highway, { top: '25%', left: '20%', width: '60%', height: 4, transform: [{ rotate: '15deg' }] }]} />
                  <View style={[styles.highway, { top: '45%', left: '15%', width: '70%', height: 4, transform: [{ rotate: '-10deg' }] }]} />
                  <View style={[styles.highway, { top: '65%', left: '25%', width: '50%', height: 4 }]} />
                  
                  {/* Major vertical streets */}
                  <View style={[styles.majorStreet, { left: '35%', top: '10%', height: '80%', width: 3 }]} />
                  <View style={[styles.majorStreet, { left: '55%', top: '15%', height: '70%', width: 3 }]} />
                  <View style={[styles.majorStreet, { left: '75%', top: '20%', height: '60%', width: 3 }]} />
                  
                  {/* Street grid */}
                  {Array.from({ length: 8 }, (_, i) => (
                    <View key={`h-${i}`} style={[styles.street, { 
                      top: `${15 + i * 10}%`, 
                      left: '30%', 
                      width: '60%', 
                      height: 1.5 
                    }]} />
                  ))}
                  {Array.from({ length: 6 }, (_, i) => (
                    <View key={`v-${i}`} style={[styles.street, { 
                      left: `${40 + i * 8}%`, 
                      top: '15%', 
                      height: '70%', 
                      width: 1.5 
                    }]} />
                  ))}
                  
                  {/* Parks and landmarks */}
                  <View style={[styles.goldenGatePark, { top: '30%', left: '20%', width: 100, height: 60 }]} />
                  <View style={[styles.presidioPark, { top: '10%', left: '15%', width: 80, height: 50 }]} />
                  <View style={[styles.park, { top: '55%', left: '40%', width: 40, height: 30 }]} />
                  <View style={[styles.park, { top: '70%', left: '60%', width: 35, height: 25 }]} />
                  
                  {/* Buildings and blocks */}
                  {Array.from({ length: 20 }, (_, i) => (
                    <View key={`building-${i}`} style={[styles.buildingBlock, {
                      top: `${20 + (i % 5) * 15}%`,
                      left: `${35 + Math.floor(i / 5) * 12}%`,
                      width: 8 + Math.random() * 6,
                      height: 6 + Math.random() * 4,
                    }]} />
                  ))}
                </View>
              </>
            ) : (
              // Satellite view
              <View style={styles.satelliteView}>
                <View style={styles.satelliteWater} />
                <View style={styles.satelliteLand} />
              </View>
            )}
            
            {/* User markers positioned on map */}
            {users.map((user) => (
              <TouchableOpacity
                key={user.id}
                style={[
                  styles.realisticUserMarker,
                  {
                    top: `${user.latitude * 100}%`,
                    left: `${user.longitude * 100}%`,
                  }
                ]}
                onPress={() => handleMarkerPress(user)}
              >
                <View style={styles.realisticMarkerContainer}>
                  <View style={styles.markerShadow} />
                  <Image source={{ uri: user.photo }} style={styles.realisticMarkerPhoto} />
                  <View style={styles.markerBorder} />
                  <GlowingStatusDot status={user.status} size={10} position="bottom-right" />
                </View>
              </TouchableOpacity>
            ))}
            
            {/* Current user location with realistic styling */}
            <View style={styles.realisticCurrentLocation}>
              <View style={styles.locationAccuracyCircle} />
              <View style={styles.locationDot} />
              <View style={styles.locationPulse} />
            </View>
          </View>
        </View>

        {/* Map Controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity style={styles.controlButton} onPress={onClose}>
            <X size={20} color="#1E40AF" strokeWidth={2} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={() => setMapType(mapType === 'standard' ? 'satellite' : 'standard')}
          >
            <Layers size={20} color="#1E40AF" strokeWidth={2} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.controlButton}>
            <Locate size={20} color="#1E40AF" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Zoom Controls */}
        <View style={styles.zoomControls}>
          <TouchableOpacity style={styles.zoomButton}>
            <ZoomIn size={20} color="#1E40AF" strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.zoomButton}>
            <ZoomOut size={20} color="#1E40AF" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Toggle People List Button */}
        <TouchableOpacity 
          style={styles.peopleToggleButton}
          onPress={() => setShowPeopleList(!showPeopleList)}
        >
          <Users size={20} color="white" strokeWidth={2} />
          <Text style={styles.peopleToggleText}>
            {showPeopleList ? 'Hide' : 'Show'} People
          </Text>
        </TouchableOpacity>

        {/* Conditional People List */}
        {showPeopleList && renderPeopleList()}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // Full Screen Container
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullScreenMap: {
    flex: 1,
    position: 'relative',
  },
  
  // Map Background Styles
  mapBackground: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  standardBackground: {
    backgroundColor: '#E8F4FD', // Light blue base for water
  },
  satelliteBackground: {
    backgroundColor: '#2D3748', // Dark satellite view
  },
  
  // San Francisco Geographic Features
  sanFranciscoBay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: '45%',
    bottom: '20%',
    backgroundColor: '#3B82F6', // Deep blue bay
  },
  pacificOcean: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: '75%',
    bottom: 0,
    backgroundColor: '#1E40AF', // Deeper ocean blue
  },
  landMass: {
    position: 'absolute',
    top: 0,
    left: '45%',
    right: 0,
    bottom: 0,
    backgroundColor: '#F7FAFC', // Light land color
  },
  
  // Streets and Roads
  highway: {
    position: 'absolute',
    backgroundColor: '#FCD34D', // Golden highway color
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  majorStreet: {
    position: 'absolute',
    backgroundColor: '#D1D5DB', // Light gray major streets
    borderRadius: 1,
  },
  street: {
    position: 'absolute',
    backgroundColor: '#E5E7EB', // Very light gray minor streets
  },
  
  // Parks and Landmarks
  goldenGatePark: {
    position: 'absolute',
    backgroundColor: '#10B981', // Rich green
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  presidioPark: {
    position: 'absolute',
    backgroundColor: '#059669', // Darker green
    borderRadius: 10,
  },
  park: {
    position: 'absolute',
    backgroundColor: '#34D399', // Light green parks
    borderRadius: 6,
  },
  
  // Building Blocks
  buildingBlock: {
    position: 'absolute',
    backgroundColor: '#F3F4F6',
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: '#D1D5DB',
  },
  
  // Satellite View
  satelliteView: {
    flex: 1,
    position: 'relative',
  },
  satelliteWater: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: '40%',
    bottom: 0,
    backgroundColor: '#1E3A8A',
  },
  satelliteLand: {
    position: 'absolute',
    top: 0,
    left: '40%',
    right: 0,
    bottom: 0,
    backgroundColor: '#374151',
  },
  
  // Realistic User Markers
  realisticUserMarker: {
    position: 'absolute',
    transform: [{ translateX: -30 }, { translateY: -30 }],
    zIndex: 10,
  },
  realisticMarkerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  markerShadow: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    top: 2,
    left: 2,
  },
  realisticMarkerPhoto: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 4,
    borderColor: 'white',
    zIndex: 2,
  },
  markerBorder: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#1E40AF',
    zIndex: 1,
  },
  
  // Current User Location
  realisticCurrentLocation: {
    position: 'absolute',
    top: '50%',
    left: '70%',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -20 }, { translateY: -20 }],
  },
  locationAccuracyCircle: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.4)',
  },
  locationDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    borderWidth: 3,
    borderColor: 'white',
    zIndex: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  locationPulse: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.4)',
    zIndex: 2,
  },
  
  // Map Controls
  mapControls: {
    position: 'absolute',
    top: 60,
    right: 20,
    flexDirection: 'column',
    gap: 12,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  
  // Zoom Controls
  zoomControls: {
    position: 'absolute',
    bottom: 200,
    right: 20,
    flexDirection: 'column',
    gap: 8,
  },
  zoomButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  
  // People Toggle Button
  peopleToggleButton: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 64, 175, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  peopleToggleText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // People List (Updated for full screen)
  peopleListContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    maxHeight: height * 0.35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 12,
  },
  peopleListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229, 231, 235, 0.8)',
  },
  peopleListTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  peopleCount: {
    fontSize: 14,
    color: '#6B7280',
    backgroundColor: 'rgba(243, 244, 246, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: '500',
  },
  peopleScrollView: {
    maxHeight: height * 0.22,
  },
  personCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(243, 244, 246, 0.6)',
  },
  personPhotoContainer: {
    position: 'relative',
    marginRight: 12,
  },
  personPhoto: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  personInfo: {
    flex: 1,
  },
  personName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  personDetails: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  personDistance: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  personActions: {
    flexDirection: 'row',
    gap: 8,
  },
  personActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(243, 244, 246, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  messageActionButton: {
    backgroundColor: 'rgba(30, 64, 175, 0.9)',
  },
  connectActionButton: {
    backgroundColor: 'rgba(5, 150, 105, 0.9)',
  },
});
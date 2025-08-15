import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import {
  Camera,
  Radar,
  Zap,
  Users,
  MapPin,
  Eye,
  Settings,
} from 'lucide-react-native';

interface ARUser {
  id: string;
  name: string;
  profession: string;
  distance: number;
  direction: number; // degrees from north
  compatibility: number;
  isVerified: boolean;
}

interface ARDiscoveryViewProps {
  visible: boolean;
  onClose: () => void;
  nearbyUsers: ARUser[];
}

const { width, height } = Dimensions.get('window');

export default function ARDiscoveryView({ visible, onClose, nearbyUsers }: ARDiscoveryViewProps) {
  const [compass, setCompass] = useState(0);
  const [isCalibrating, setIsCalibrating] = useState(true);

  useEffect(() => {
    if (visible) {
      // Simulate compass calibration
      setTimeout(() => setIsCalibrating(false), 2000);
    }
  }, [visible]);

  const getUserPosition = (user: ARUser) => {
    // Calculate position based on direction and distance
    const angle = (user.direction - compass) * (Math.PI / 180);
    const maxDistance = 200; // Max distance for AR view
    const normalizedDistance = Math.min(user.distance, maxDistance) / maxDistance;
    
    const x = width / 2 + Math.sin(angle) * (width * 0.3) * (1 - normalizedDistance);
    const y = height / 2 - Math.cos(angle) * (height * 0.2) * (1 - normalizedDistance);
    
    return { x, y };
  };

  const ARUserMarker = ({ user }: { user: ARUser }) => {
    const position = getUserPosition(user);
    const scale = Math.max(0.5, 1 - (user.distance / 500));
    
    return (
      <TouchableOpacity
        style={[
          styles.arMarker,
          {
            left: position.x - 30,
            top: position.y - 40,
            transform: [{ scale }],
          },
        ]}
        onPress={() => Alert.alert('Connect', `Send connection request to ${user.name}?`)}
      >
        <View style={styles.markerContainer}>
          <View style={[styles.markerDot, user.isVerified && styles.verifiedDot]}>
            <Users size={12} color="white" strokeWidth={2} />
          </View>
          <View style={styles.markerInfo}>
            <Text style={styles.markerName} numberOfLines={1}>
              {user.name}
            </Text>
            <Text style={styles.markerDistance}>{user.distance}m</Text>
          </View>
          <View style={styles.compatibilityBadge}>
            <Zap size={8} color="#FBBF24" strokeWidth={2} />
            <Text style={styles.compatibilityText}>{user.compatibility}%</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (!visible) return null;

  return (
    <View style={styles.container}>
      {/* Camera Background Simulation */}
      <View style={styles.cameraBackground}>
        <View style={styles.gridOverlay}>
          {Array.from({ length: 20 }).map((_, i) => (
            <View key={i} style={styles.gridLine} />
          ))}
        </View>
      </View>

      {/* AR Overlay */}
      <View style={styles.arOverlay}>
        {/* Compass */}
        <View style={styles.compass}>
          <Radar size={24} color="white" strokeWidth={2} />
          <Text style={styles.compassText}>N</Text>
        </View>

        {/* Calibration */}
        {isCalibrating && (
          <View style={styles.calibrationOverlay}>
            <View style={styles.calibrationCard}>
              <Text style={styles.calibrationTitle}>Calibrating AR...</Text>
              <Text style={styles.calibrationText}>Move your phone in a figure-8 pattern</Text>
            </View>
          </View>
        )}

        {/* AR Users */}
        {!isCalibrating && nearbyUsers.map(user => (
          <ARUserMarker key={user.id} user={user} />
        ))}

        {/* Center Crosshair */}
        <View style={styles.crosshair}>
          <View style={styles.crosshairLine} />
          <View style={[styles.crosshairLine, styles.crosshairVertical]} />
        </View>

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          <TouchableOpacity style={styles.controlButton} onPress={onClose}>
            <MapPin size={20} color="white" strokeWidth={2} />
            <Text style={styles.controlText}>Map View</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.controlButton}>
            <Eye size={20} color="white" strokeWidth={2} />
            <Text style={styles.controlText}>Filter</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.controlButton}>
            <Settings size={20} color="white" strokeWidth={2} />
            <Text style={styles.controlText}>Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsOverlay}>
          <Text style={styles.statsText}>{nearbyUsers.length} professionals nearby</Text>
          <Text style={styles.statsSubtext}>AR Discovery Mode</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
  },
  cameraBackground: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    position: 'relative',
  },
  gridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: 'white',
    height: 1,
    width: '100%',
    top: '5%',
  },
  arOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  compass: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  compassText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  calibrationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calibrationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  calibrationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  calibrationText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  arMarker: {
    position: 'absolute',
    width: 60,
    alignItems: 'center',
  },
  markerContainer: {
    alignItems: 'center',
  },
  markerDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    borderWidth: 2,
    borderColor: 'white',
  },
  verifiedDot: {
    backgroundColor: '#10B981',
  },
  markerInfo: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 60,
  },
  markerName: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  markerDistance: {
    color: '#D1D5DB',
    fontSize: 10,
  },
  compatibilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 2,
    gap: 2,
  },
  compatibilityText: {
    color: '#92400E',
    fontSize: 10,
    fontWeight: '600',
  },
  crosshair: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 40,
    height: 40,
    marginTop: -20,
    marginLeft: -20,
  },
  crosshairLine: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    width: 20,
    height: 2,
    top: 19,
    left: 10,
  },
  crosshairVertical: {
    width: 2,
    height: 20,
    top: 10,
    left: 19,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  controlButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    minWidth: 80,
  },
  controlText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  statsOverlay: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  statsText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  statsSubtext: {
    color: '#D1D5DB',
    fontSize: 12,
    marginTop: 2,
  },
});
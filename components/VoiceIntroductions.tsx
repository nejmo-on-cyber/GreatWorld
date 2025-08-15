import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  Animated,
} from 'react-native';
import { Mic, MicOff, Play, Pause, Send, X, Volume2, AudioWaveform as Waveform } from 'lucide-react-native';

interface VoiceIntroductionsProps {
  visible: boolean;
  onClose: () => void;
  targetUser: {
    name: string;
    profession: string;
  };
  onSendVoiceIntro: (audioData: string) => void;
}

export default function VoiceIntroductions({
  visible,
  onClose,
  targetUser,
  onSendVoiceIntro,
}: VoiceIntroductionsProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [waveformAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      // Animate waveform
      Animated.loop(
        Animated.sequence([
          Animated.timing(waveformAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
          }),
          Animated.timing(waveformAnimation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      waveformAnimation.setValue(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const startRecording = () => {
    setIsRecording(true);
    setRecordingDuration(0);
    setHasRecording(false);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setHasRecording(true);
  };

  const playRecording = () => {
    setIsPlaying(true);
    // Simulate playback
    setTimeout(() => setIsPlaying(false), recordingDuration * 1000);
  };

  const sendVoiceIntro = () => {
    if (!hasRecording) return;
    
    Alert.alert(
      'Send Voice Introduction',
      `Send your ${recordingDuration}s voice message to ${targetUser.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: () => {
            onSendVoiceIntro('mock-audio-data');
            onClose();
            Alert.alert('Voice Introduction Sent!', `Your voice message has been sent to ${targetUser.name}`);
          },
        },
      ]
    );
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const WaveformBar = ({ height }: { height: number }) => (
    <Animated.View
      style={[
        styles.waveformBar,
        {
          height: waveformAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [4, height],
          }),
        },
      ]}
    />
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
            <View style={styles.voiceIcon}>
              <Volume2 size={20} color="#8B5CF6" strokeWidth={2} />
            </View>
            <View>
              <Text style={styles.headerTitle}>Voice Introduction</Text>
              <Text style={styles.headerSubtitle}>For {targetUser.name}</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#6B7280" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Record a personal introduction</Text>
            <Text style={styles.infoText}>
              Voice messages have 3x higher response rates than text. 
              Keep it under 30 seconds and mention why you'd like to connect.
            </Text>
          </View>

          {/* Recording Interface */}
          <View style={styles.recordingContainer}>
            <View style={styles.waveformContainer}>
              {isRecording ? (
                <View style={styles.waveform}>
                  {Array.from({ length: 20 }).map((_, i) => (
                    <WaveformBar key={i} height={Math.random() * 40 + 10} />
                  ))}
                </View>
              ) : hasRecording ? (
                <View style={styles.recordingComplete}>
                  <Waveform size={48} color="#8B5CF6" strokeWidth={1.5} />
                  <Text style={styles.recordingCompleteText}>
                    Recording complete ({formatDuration(recordingDuration)})
                  </Text>
                </View>
              ) : (
                <View style={styles.recordingPrompt}>
                  <Mic size={48} color="#D1D5DB" strokeWidth={1.5} />
                  <Text style={styles.recordingPromptText}>
                    Tap the microphone to start recording
                  </Text>
                </View>
              )}
            </View>

            {/* Recording Controls */}
            <View style={styles.controls}>
              {!hasRecording ? (
                <TouchableOpacity
                  style={[
                    styles.recordButton,
                    isRecording && styles.recordingButton
                  ]}
                  onPress={isRecording ? stopRecording : startRecording}
                >
                  {isRecording ? (
                    <MicOff size={32} color="white" strokeWidth={2} />
                  ) : (
                    <Mic size={32} color="white" strokeWidth={2} />
                  )}
                </TouchableOpacity>
              ) : (
                <View style={styles.playbackControls}>
                  <TouchableOpacity
                    style={styles.playButton}
                    onPress={playRecording}
                    disabled={isPlaying}
                  >
                    {isPlaying ? (
                      <Pause size={24} color="#8B5CF6" strokeWidth={2} />
                    ) : (
                      <Play size={24} color="#8B5CF6" strokeWidth={2} />
                    )}
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.rerecordButton}
                    onPress={() => {
                      setHasRecording(false);
                      setRecordingDuration(0);
                    }}
                  >
                    <Text style={styles.rerecordText}>Re-record</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {isRecording && (
              <View style={styles.recordingStatus}>
                <View style={styles.recordingIndicator} />
                <Text style={styles.recordingTime}>
                  {formatDuration(recordingDuration)}
                </Text>
                <Text style={styles.recordingLimit}>
                  / 0:30 max
                </Text>
              </View>
            )}
          </View>

          {/* Tips */}
          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>Recording Tips</Text>
            <View style={styles.tipsList}>
              <Text style={styles.tip}>• Introduce yourself and your role</Text>
              <Text style={styles.tip}>• Mention why you want to connect</Text>
              <Text style={styles.tip}>• Keep it conversational and friendly</Text>
              <Text style={styles.tip}>• Find a quiet environment</Text>
            </View>
          </View>

          {/* Send Button */}
          {hasRecording && (
            <TouchableOpacity
              style={styles.sendButton}
              onPress={sendVoiceIntro}
            >
              <Send size={20} color="white" strokeWidth={2} />
              <Text style={styles.sendButtonText}>
                Send Voice Introduction
              </Text>
            </TouchableOpacity>
          )}
        </View>
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
  voiceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3E8FF',
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
  content: {
    flex: 1,
    padding: 20,
  },
  infoCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  recordingContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  waveformContainer: {
    height: 120,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    height: 60,
  },
  waveformBar: {
    width: 3,
    backgroundColor: '#8B5CF6',
    borderRadius: 2,
  },
  recordingComplete: {
    alignItems: 'center',
    gap: 12,
  },
  recordingCompleteText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  recordingPrompt: {
    alignItems: 'center',
    gap: 12,
  },
  recordingPromptText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  controls: {
    alignItems: 'center',
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  recordingButton: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
  },
  playbackControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rerecordButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
  },
  rerecordText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  recordingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  recordingIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  recordingTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  recordingLimit: {
    fontSize: 14,
    color: '#6B7280',
  },
  tipsCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  tipsList: {
    gap: 6,
  },
  tip: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
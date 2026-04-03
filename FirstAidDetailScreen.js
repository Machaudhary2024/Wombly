import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Linking,
  Modal,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { API_BASE_URL } from './apiConfig';
import YouTubeVideoPlayer from './components/YouTubeVideoPlayer';

const { width } = Dimensions.get('window');
const isTablet = width > 600;

const FirstAidDetailScreen = ({ navigation, route }) => {
  const { categoryId, categoryTitle, categorySteps, tutorialLinks: passedTutorialLinks } = route.params;
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const [tutorialLinks, setTutorialLinks] = useState(passedTutorialLinks || []);
  const [videosLoading, setVideosLoading] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [selectedVideoTitle, setSelectedVideoTitle] = useState('');
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  const handleTutorialPress = (video) => {
    if (!video?.videoId) {
      Alert.alert('No Video', 'This tutorial is loading or currently unavailable. Please try again shortly.');
      return;
    }
    setSelectedVideoId(video.videoId);
    setSelectedVideoTitle(video.title || 'Tutorial Video');
    setShowVideoPlayer(true);
  };

  return (
    <View style={styles.container}>
      {/* Red/Orange Header with Back Button */}
      <LinearGradient
        colors={['#E74C3C', '#C0392B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{categoryTitle}</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tutorial Button */}
        <TouchableOpacity
          style={styles.tutorialButton}
          onPress={() => setShowTutorialModal(true)}
        >
          <LinearGradient
            colors={['#E74C3C', '#C0392B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.tutorialButtonGradient}
          >
            <MaterialCommunityIcons name="play-circle" size={20} color="#FFFFFF" />
            <Text style={styles.tutorialButtonText}>Watch Tutorial Videos</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Steps */}
        {categorySteps && categorySteps.map((step) => (
          <View key={step.number} style={styles.stepCard}>
            <LinearGradient
              colors={['#F8F9FA', '#FFFFFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.stepGradient}
            >
              <View style={styles.stepHeader}>
                <View style={styles.stepNumberCircle}>
                  <Text style={styles.stepNumberText}>{step.number}</Text>
                </View>
                <View style={styles.stepTitleContainer}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                </View>
                <MaterialCommunityIcons name={step.icon} size={22} color="#E74C3C" />
              </View>

              <Text style={styles.stepDescription}>{step.description}</Text>

              {/* Tips Box */}
              <View style={styles.tipsBox}>
                <View style={styles.tipsHeader}>
                  <MaterialCommunityIcons name="lightbulb" size={16} color="#E74C3C" />
                  <Text style={styles.tipsBoxTitle}>Important Tips:</Text>
                </View>
                {step.tips && step.tips.map((tip, index) => (
                  <Text key={index} style={styles.tipItem}>
                    • {tip}
                  </Text>
                ))}
              </View>
            </LinearGradient>
          </View>
        ))}

        {/* Tutorial Modal */}
        <Modal
          visible={showTutorialModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowTutorialModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Tutorial Videos</Text>
                <TouchableOpacity
                  onPress={() => setShowTutorialModal(false)}
                  style={styles.closeButton}
                >
                  <MaterialCommunityIcons name="close" size={28} color="#2D3436" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.tutorialList}>
                {videosLoading ? (
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <MaterialCommunityIcons name="loading" size={48} color="#3498DB" />
                    <Text style={{ marginTop: 16, fontSize: 16, color: '#666' }}>
                      Loading videos...
                    </Text>
                  </View>
                ) : Array.isArray(tutorialLinks) && tutorialLinks.length > 0 ? (
                  tutorialLinks.map((tutorial, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.tutorialItem}
                      onPress={() => handleTutorialPress(tutorial)}
                    >
                      <LinearGradient
                        colors={['#FADBD8', '#F5B7B1']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.tutorialItemGradient}
                      >
                        <View style={styles.tutorialItemLeft}>
                          <MaterialCommunityIcons name="youtube" size={32} color="#E74C3C" />
                          <View style={styles.tutorialItemText}>
                            <Text style={styles.tutorialItemTitle}>{tutorial.title}</Text>
                            <Text style={styles.tutorialItemSubtitle}>Tap to watch</Text>
                          </View>
                        </View>
                        <MaterialCommunityIcons name="play" size={24} color="#E74C3C" />
                      </LinearGradient>
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#E67E22" />
                    <Text style={{ marginTop: 16, fontSize: 16, color: '#666' }}>
                      No videos available for this topic
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Video Player Modal */}
        {showVideoPlayer && selectedVideoId && (
          <Modal
            visible={showVideoPlayer}
            transparent={false}
            animationType="slide"
            onRequestClose={() => setShowVideoPlayer(false)}
          >
            <View style={styles.videoPlayerContainer}>
              <View style={styles.videoPlayerHeader}>
                <TouchableOpacity
                  style={styles.videoPlayerCloseButton}
                  onPress={() => setShowVideoPlayer(false)}
                >
                  <MaterialCommunityIcons name="close-circle" size={36} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.videoPlayerTitle}>{selectedVideoTitle}</Text>
                <View style={{ width: 36 }} />
              </View>
              <ScrollView 
                style={styles.videoPlayerContent}
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
              >
                <YouTubeVideoPlayer videoId={selectedVideoId} height={300} />
              </ScrollView>
            </View>
          </Modal>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: isTablet ? 22 : 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: isTablet ? 20 : 15,
    paddingVertical: 20,
    paddingBottom: 90,
  },
  tutorialButton: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  tutorialButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  tutorialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginHorizontal: 10,
  },
  stepCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  stepGradient: {
    padding: 18,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  stepNumberCircle: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#E74C3C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  stepTitleContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  stepDescription: {
    fontSize: 14,
    color: '#555',
    lineHeight: 21,
    marginBottom: 14,
  },
  tipsBox: {
    backgroundColor: '#FEF9E7',
    borderLeftWidth: 4,
    borderLeftColor: '#E74C3C',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipsBoxTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#C0392B',
    marginLeft: 8,
  },
  tipItem: {
    fontSize: 12,
    color: '#7D5E0A',
    lineHeight: 18,
    marginBottom: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  closeButton: {
    padding: 5,
  },
  tutorialList: {
    maxHeight: '78%',
  },
  tutorialItem: {
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 10,
    overflow: 'hidden',
  },
  tutorialItemGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  tutorialItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tutorialItemText: {
    marginLeft: 12,
    flex: 1,
  },
  tutorialItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 2,
  },
  tutorialItemSubtitle: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  videoPlayerContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  videoPlayerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: isTablet ? 20 : 30,
    paddingBottom: 15,
    backgroundColor: '#1A1A1A',
  },
  videoPlayerCloseButton: {
    padding: 8,
  },
  videoPlayerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  videoPlayerContent: {
    flex: 1,
    backgroundColor: '#000000',
  },
});

export default FirstAidDetailScreen;

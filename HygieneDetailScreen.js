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

const { width } = Dimensions.get('window');
const isTablet = width > 600;

const HygieneDetailScreen = ({ navigation, route }) => {
  const { categoryId, categoryTitle, categoryTips, tutorialLinks: passedTutorialLinks } = route.params;
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const [tutorialLinks, setTutorialLinks] = useState(passedTutorialLinks || []);
  const [videosLoading, setVideosLoading] = useState(false);

  const handleTutorialPress = (url) => {
    if (!url) {
      Alert.alert('No Video', 'This tutorial is loading or currently unavailable. Please try again shortly.');
      return;
    }
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open the tutorial. Please check your internet connection.');
    });
  };

  return (
    <View style={styles.container}>
      {/* Green Header with Back Button */}
      <LinearGradient
        colors={['#27AE60', '#229954']}
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
            colors={['#16A085', '#138D75']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.tutorialButtonGradient}
          >
            <MaterialCommunityIcons name="play-circle" size={20} color="#FFFFFF" />
            <Text style={styles.tutorialButtonText}>Watch Tutorial Videos</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Tips */}
        {categoryTips && categoryTips.map((tip) => (
          <View key={tip.number} style={styles.tipCard}>
            <LinearGradient
              colors={['#F8F9FA', '#FFFFFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.tipGradient}
            >
              <View style={styles.tipHeader}>
                <View style={styles.tipNumberCircle}>
                  <Text style={styles.tipNumberText}>{tip.number}</Text>
                </View>
                <View style={styles.tipTitleContainer}>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                </View>
                <MaterialCommunityIcons name={tip.icon} size={22} color="#16A085" />
              </View>

              <Text style={styles.tipDescription}>{tip.description}</Text>

              {/* Details Box */}
              <View style={styles.detailsBox}>
                <View style={styles.detailsHeader}>
                  <MaterialCommunityIcons name="information" size={16} color="#16A085" />
                  <Text style={styles.detailsBoxTitle}>Key Details:</Text>
                </View>
                {tip.details && tip.details.map((detail, index) => (
                  <Text key={index} style={styles.detailItem}>
                    • {detail}
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
                      onPress={() => handleTutorialPress(tutorial.url)}
                    >
                      <LinearGradient
                        colors={['#E8F8F5', '#D5F4E6']}
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
                        <MaterialCommunityIcons name="play" size={24} color="#16A085" />
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
    padding: 20,
    paddingBottom: 30,
  },
  tutorialButton: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tutorialButtonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tutorialButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginHorizontal: 10,
  },
  tipCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  tipGradient: {
    padding: 12,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tipNumberCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#16A085',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  tipNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tipTitleContainer: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 1,
  },
  tipDescription: {
    fontSize: 12,
    color: '#16A085',
    fontStyle: 'italic',
    marginBottom: 8,
    lineHeight: 18,
  },
  detailsBox: {
    backgroundColor: '#E8F8F5',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#16A085',
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailsBoxTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0B5345',
    marginLeft: 6,
  },
  detailItem: {
    fontSize: 12,
    color: '#145A32',
    marginBottom: 4,
    lineHeight: 16,
  },
  importantCard: {
    marginTop: 20,
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  importantGradient: {
    padding: 18,
  },
  noteIcon: {
    marginBottom: 10,
  },
  importantTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B8860B',
    marginBottom: 10,
  },
  importantText: {
    fontSize: 14,
    color: '#8B6914',
    lineHeight: 22,
  },
  doctorCard: {
    marginBottom: 30,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  doctorGradient: {
    padding: 18,
  },
  phoneIcon: {
    marginBottom: 10,
  },
  doctorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A93226',
    marginBottom: 10,
  },
  doctorText: {
    fontSize: 14,
    color: '#78281F',
    lineHeight: 22,
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
    paddingTop: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  closeButton: {
    padding: 8,
  },
  tutorialList: {
    padding: 20,
  },
  noVideosText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
  tutorialItem: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  tutorialItemGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    justifyContent: 'space-between',
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
    color: '#0B5345',
    marginBottom: 4,
  },
  tutorialItemSubtitle: {
    fontSize: 12,
    color: '#16A085',
  },
});

export default HygieneDetailScreen;

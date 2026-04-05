import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { API_BASE_URL } from './apiConfig';

const { width } = Dimensions.get('window');
const isTablet = width > 600;

const FirstAidDetailScreen = ({ navigation, route }) => {
  const { categoryId, categoryTitle, categorySteps, tutorialLinks: passedTutorialLinks } = route.params;
  const [tutorialLinks, setTutorialLinks] = useState(passedTutorialLinks || []);

  function openYouTube(videoId) {
    if (!videoId || videoId.startsWith('REPLACE_')) return;
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    Linking.openURL(url).catch(() => {});
  }

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
        {/* Video Section */}
        <View style={styles.videoSection}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="youtube" size={24} color="#E74C3C" />
            <Text style={styles.sectionTitle}>Tutorial Videos</Text>
          </View>
          {Array.isArray(tutorialLinks) && tutorialLinks.length > 0 ? (
            tutorialLinks.map((v, i) => {
              const canOpen = v.videoId && !v.videoId.startsWith('REPLACE_');
              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.videoCard, !canOpen && styles.videoCardPlaceholder]}
                  onPress={() => openYouTube(v.videoId)}
                  activeOpacity={0.85}
                  disabled={!canOpen}
                >
                  <View style={styles.videoIconWrap}>
                    <MaterialCommunityIcons
                      name="play-circle"
                      size={48}
                      color={canOpen ? '#E74C3C' : '#BBB'}
                    />
                  </View>
                  <Text style={styles.videoTitle}>{v.title}</Text>
                  <Text style={styles.videoSub}>
                    {canOpen ? 'Tap to open on YouTube' : 'error'}
                  </Text>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={styles.noVideosBox}>
              <MaterialCommunityIcons name="alert-circle-outline" size={40} color="#E67E22" />
              <Text style={styles.noVideosText}>No videos available for this topic</Text>
            </View>
          )}
        </View>

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

        {/* Emergency Callout Box */}
        <View style={styles.emergencyCallout}>
          <LinearGradient
            colors={['#FADBD8', '#F5B7B1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.emergencyCalloutGradient}
          >
            <MaterialCommunityIcons name="alert-box" size={24} color="#C0392B" style={styles.emergencyCalloutIcon} />
            <View style={styles.emergencyCalloutContent}>
              <Text style={styles.emergencyCalloutTitle}>Emergency Situation?</Text>
              <Text style={styles.emergencyCalloutText}>
                If the situation feels out of control, call emergency services immediately (115 in Pakistan).
              </Text>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.bottomSpacer} />
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
  videoSection: {
    marginBottom: 20,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginLeft: 10,
  },
  videoIntro: {
    fontSize: 14,
    color: '#636E72',
    marginBottom: 14,
    lineHeight: 20,
  },
  videoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  videoCardPlaceholder: {
    opacity: 0.85,
  },
  videoIconWrap: {
    marginBottom: 10,
  },
  videoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3436',
    textAlign: 'center',
  },
  videoSub: {
    fontSize: 12,
    color: '#636E72',
    marginTop: 4,
  },
  noVideosBox: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    marginTop: 10,
  },
  noVideosText: {
    fontSize: 14,
    color: '#636E72',
    marginTop: 10,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 24,
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
  emergencyCallout: {
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  emergencyCalloutGradient: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#C0392B',
  },
  emergencyCalloutIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  emergencyCalloutContent: {
    flex: 1,
  },
  emergencyCalloutTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#C0392B',
    marginBottom: 6,
  },
  emergencyCalloutText: {
    fontSize: 13,
    color: '#722F1F',
    lineHeight: 20,
  },
});

export default FirstAidDetailScreen;

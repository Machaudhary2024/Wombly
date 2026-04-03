import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { API_BASE_URL } from './apiConfig';
import FloatingChatButton from './components/FloatingChatButton';

const { width, height } = Dimensions.get('window');
const isTablet = width > 600;

const FirstAidGuidanceScreen = ({ navigation }) => {
  const [tutorialLinks, setTutorialLinks] = useState({});
  const [pulseAnim] = useState(new Animated.Value(1));



  // Pulse animation for emergency indicator
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  // Fetch videos from MongoDB for First Aid
  useEffect(() => {
    const fetchAllVideos = async () => {
      try {
        const topics = ['CPR & Choking', 'Allergies & Reactions', 'Minor Injuries', 'Burns & Scalds', 'Poisoning', 'Fever & Infection'];
        const topicMap = {
          'CPR & Choking': 1,
          'Allergies & Reactions': 2,
          'Minor Injuries': 3,
          'Burns & Scalds': 4,
          'Poisoning': 5,
          'Fever & Infection': 6,
        };

        const newTutorialLinks = {};

        for (const topic of topics) {
          try {
            const response = await fetch(
              `${API_BASE_URL}/api/first-aid-videos/${encodeURIComponent(topic)}`
            );
            const result = await response.json();

            if (result.success && result.data && result.data.length > 0) {
              newTutorialLinks[topicMap[topic]] = result.data
                .slice(0, 1)
                .map((video) => ({
                  title: video.title,
                  videoId: video.videoId,
                  thumbnail: video.thumbnail,
                  id: video._id,
                }));
            } else {
              newTutorialLinks[topicMap[topic]] = [];
            }
          } catch (error) {
            console.error(`Error fetching videos for ${topic}:`, error);
            newTutorialLinks[topicMap[topic]] = [];
          }
        }

        setTutorialLinks(newTutorialLinks);
      } catch (error) {
        console.error('Error fetching tutorials:', error);
        setTutorialLinks({});
      }
    };

    fetchAllVideos();
  }, []);

  const categories = [
    {
      id: 1,
      title: 'CPR & Choking',
      icon: 'heart-pulse',
      color: '#F5B7B1',
      iconColor: '#A93226',
      description: 'Life-saving techniques',
    },
    {
      id: 2,
      title: 'Allergies',
      icon: 'alert-circle',
      color: '#F8B88B',
      iconColor: '#BA4A00',
      description: 'Allergic reactions',
    },
    {
      id: 3,
      title: 'Minor Injuries',
      icon: 'bandage',
      color: '#AED6F1',
      iconColor: '#2E86C1',
      description: 'Cuts, bruises & sprains',
    },
    {
      id: 4,
      title: 'Burns & Scalds',
      icon: 'flame',
      color: '#F9D5C6',
      iconColor: '#B35806',
      description: 'Thermal injuries',
    },
    {
      id: 5,
      title: 'Poisoning',
      icon: 'skull-crossbones',
      color: '#D7BDE2',
      iconColor: '#6C3483',
      description: 'Chemical exposure',
    },
    {
      id: 6,
      title: 'Fever & Infection',
      icon: 'thermometer',
      color: '#FADBD8',
      iconColor: '#9B2C2C',
      description: 'Temperature & infections',
    },
  ];

  const guidanceData = {
    1: {
      title: 'CPR & Choking',
      steps: [
        {
          number: 1,
          title: 'Check Responsiveness',
          description: 'Tap the child\'s shoulders and shout "Are you okay?"',
          icon: 'hand-back-left',
          tips: ['Stay calm', 'Note the time', 'Call emergency services if unresponsive'],
        },
        {
          number: 2,
          title: 'Open Airway',
          description: 'Gently tilt the head back and lift the chin to open the airway',
          icon: 'air-filter',
          tips: ['Be gentle with neck', 'Check for obstructions', 'Look, listen, feel for breathing'],
        },
        {
          number: 3,
          title: 'CPR Technique',
          description: 'Place 2 fingers on the chest center and compress 30 times at 100-120 compressions/minute',
          icon: 'hand-front-right',
          tips: ['Push hard and fast', 'Let chest recoil completely', 'Continue until help arrives'],
        },
        {
          number: 4,
          title: 'Choking Relief',
          description: 'For infants (under 1 year): Back blows and chest thrusts. For older: Abdominal thrusts',
          icon: 'hand-left',
          tips: ['Never insert fingers blindly', 'Be forceful but controlled', 'Call Emergency Services immediately'],
        },
      ],
    },
    2: {
      title: 'Allergies & Reactions',
      steps: [
        {
          number: 1,
          title: 'Identify Symptoms',
          description: 'Look for: rash, swelling (lips/tongue), itching, breathing difficulty, vomiting',
          icon: 'eye-alert',
          tips: ['Take photos for record', 'Note when symptoms started', 'Identify potential allergen'],
        },
        {
          number: 2,
          title: 'Mild Reaction Treatment',
          description: 'Give antihistamine (Benadryl) as directed by pediatrician. Watch for 4-6 hours',
          icon: 'pill',
          tips: ['Use weight-appropriate dose', 'Document reaction', 'Contact pediatrician'],
        },
        {
          number: 3,
          title: 'Severe Reaction (Anaphylaxis)',
          description: 'If difficulty breathing, swelling of throat, loss of consciousness: Use EpiPen immediately',
          icon: 'syringe',
          tips: ['Inject into outer thigh', 'Call Emergency Services immediately', 'Keep on side if unconscious'],
        },
        {
          number: 4,
          title: 'Prevention',
          description: 'Avoid known allergens, read labels, inform caregivers, consider allergy testing',
          icon: 'shield-check',
          tips: ['Keep food diary', 'Introduce new foods one at a time', 'Have emergency kit ready'],
        },
      ],
    },
    3: {
      title: 'Minor Injuries',
      steps: [
        {
          number: 1,
          title: 'Stop the Bleeding',
          description: 'Apply direct pressure with clean cloth for 5-10 minutes',
          icon: 'bandage',
          tips: ['Don\'t remove the cloth', 'Use elevated position', 'Press firmly but don\'t cut off circulation'],
        },
        {
          number: 2,
          title: 'Clean the Wound',
          description: 'Rinse with clean water or saline solution. Wash around (not inside) with gentle soap',
          icon: 'water-opacity',
          tips: ['Use lukewarm water', 'Gently pat dry', 'Remove visible debris'],
        },
        {
          number: 3,
          title: 'Apply Antiseptic',
          description: 'Use antibiotic ointment (Neosporin) to prevent infection',
          icon: 'bottle',
          tips: ['Use toddler-safe products', 'Apply thin layer', 'Reapply if bandage removed'],
        },
        {
          number: 4,
          title: 'Cover & Monitor',
          description: 'Use sterile bandage. Change daily or when wet/dirty. Watch for signs of infection',
          icon: 'medical-bag',
          tips: ['Infection signs: increased redness, warmth, pus', 'See doctor if deep or won\'t stop bleeding', 'Update tetanus if needed'],
        },
      ],
    },
    4: {
      title: 'Burns & Scalds',
      steps: [
        {
          number: 1,
          title: 'Cool the Burn',
          description: 'Immediately rinse with cool (not cold) running water for 10-20 minutes',
          icon: 'water-opacity',
          tips: ['Use lukewarm water', 'Don\'t use ice (causes more damage)', 'Remove tight clothing/jewelry'],
        },
        {
          number: 2,
          title: 'Remove Coverings',
          description: 'Gently remove any tight clothing unless stuck to skin',
          icon: 'shirt',
          tips: ['Be very gentle', 'If stuck, don\'t force removal', 'Leave for doctor to handle'],
        },
        {
          number: 3,
          title: 'Apply Healing Treatment',
          description: 'Use antibiotic ointment and cover with sterile, non-stick bandage',
          icon: 'band-aid-light-outline',
          tips: ['Avoid butter, oils, ice', 'Don\'t pop blisters', 'Use breathable dressing'],
        },
        {
          number: 4,
          title: 'Seek Medical Help',
          description: 'For deep burns, large area, or face/hands: Call emergency services immediately',
          icon: 'ambulance',
          tips: ['Depth: deeper than skin redness = serious', 'Area: larger than 2x2 inches = serious', 'Watch for signs of shock'],
        },
      ],
    },
    5: {
      title: 'Poisoning',
      steps: [
        {
          number: 1,
          title: 'Identify the Poison',
          description: 'Look for empty bottles, containers, or substances. Keep samples with you',
          icon: 'magnify',
          tips: ['Check mouth for residue', 'Note time of ingestion', 'Take photo of container'],
        },
        {
          number: 2,
          title: 'Call Poison Control',
          description: 'Call Poison Control Center (1-800-222-1222) immediately with substance info',
          icon: 'phone-classic',
          tips: ['Have the container/substance name', 'Know approximate amount', 'Note child\'s age & weight'],
        },
        {
          number: 3,
          title: 'Initial Response',
          description: 'DO NOT induce vomiting. Keep child warm and comfortable. Monitor breathing',
          icon: 'lung',
          tips: ['Never force vomiting', 'If unconscious, turn on side', 'Note any symptoms'],
        },
        {
          number: 4,
          title: 'Hospital Transport',
          description: 'Keep the poison container. Transport to hospital as directed by Poison Control',
          icon: 'ambulance',
          tips: ['Bring container with you', 'List all symptoms', 'Continue monitoring during travel'],
        },
      ],
    },
    6: {
      title: 'Fever & Infection',
      steps: [
        {
          number: 1,
          title: 'Check Temperature',
          description: 'Use digital thermometer. Fever is generally 100.4°F (38°C) or higher rectally',
          icon: 'thermometer',
          tips: ['Use rectal method under age 3', 'Take at consistent times', 'Record all readings'],
        },
        {
          number: 2,
          title: 'Comfort Measures',
          description: 'Dress lightly, keep room cool, ensure adequate fluids to prevent dehydration',
          icon: 'water-check',
          tips: ['Offer frequent liquids', 'Don\'t overdress', 'Keep room at comfortable temperature'],
        },
        {
          number: 3,
          title: 'Medication',
          description: 'Use age-appropriate fever reducer (acetaminophen or ibuprofen) as directed by pediatrician',
          icon: 'pill',
          tips: ['Follow weight-based dosing', 'Don\'t exceed recommended frequency', 'Never use aspirin'],
        },
        {
          number: 4,
          title: 'When to Seek Help',
          description: 'Call doctor if: fever over 103°F, lasts >3 days, difficulty breathing, rash, or lethargy',
          icon: 'alert-circle',
          tips: ['High fever doesn\'t always mean serious illness', 'Trust your instincts', 'Seek help when worried'],
        },
      ],
    },
  };

  const renderCategoryList = () => {
    return (
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Emergency Banner */}
        <LinearGradient
          colors={['#E74C3C', '#C0392B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.emergencyBanner}
        >
          <Animated.View
            style={{
              transform: [{ scale: pulseAnim }],
            }}
          >
            <MaterialCommunityIcons name="alert-circle" size={40} color="#FFFFFF" />
          </Animated.View>
          <View style={styles.emergencyText}>
            <Text style={styles.emergencyTitle}>Emergency?</Text>
            <Text style={styles.emergencyNumber}>Call Emergency Services immediately</Text>
          </View>
        </LinearGradient>

        {/* Quick Tips */}
        <View style={styles.quickTipsCard}>
          <LinearGradient
            colors={['#FFE5F1', '#F3E5F5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.quickTipsGradient}
          >
            <MaterialCommunityIcons name="lightbulb" size={28} color="#9C27B0" style={styles.tipsIcon} />
            <Text style={styles.quickTipsTitle}>Quick Tips:</Text>
            <Text style={styles.quickTipsText}>
              • Always keep a first aid kit at home{'\n'}
              • Know your pediatrician's emergency line{'\n'}
              • Take a CPR class for toddlers{'\n'}
              • Stay calm - your child takes cues from you
            </Text>
          </LinearGradient>
        </View>

        {/* Category Grid */}
        <Text style={styles.categoryTitle}>Select a Topic</Text>
        <View style={styles.categoryGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryCard, isTablet && styles.categoryCardTablet]}
              onPress={() => {
                const categoryData = guidanceData[category.id];
                navigation.navigate('FirstAidDetailScreen', {
                  categoryId: category.id,
                  categoryTitle: category.title,
                  categorySteps: categoryData?.steps || [],
                  tutorialLinks: tutorialLinks[category.id] || [],
                });
              }}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[category.color, category.color]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.categoryGradient}
              >
                <MaterialCommunityIcons name={category.icon} size={40} color={category.iconColor} />
                <Text style={styles.categoryCardTitle}>{category.title}</Text>
                <Text style={styles.categoryCardDescription}>{category.description}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* When to Call Emergency Box */}
        <View style={styles.emergencyCard}>
          <LinearGradient
            colors={['#FADBD8', '#F5B7B1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.emergencyGradient}
          >
            <MaterialCommunityIcons name="alert-box" size={28} color="#C0392B" style={styles.emergencyIcon} />
            <Text style={styles.emergencyTitle}>When to Call Emergency :</Text>
            <Text style={styles.emergencyText}>
              • Difficulty breathing or gasping{'\n'}
              • Unconsciousness or unresponsiveness{'\n'}
              • Severe bleeding that won't stop{'\n'}
              • Blue lips or skin{'\n'}
              • Severe allergic reactions{'\n'}
              • Ingestion of poison{'\n'}
              • Severe burns or deep injuries
            </Text>
          </LinearGradient>
        </View>

        {/* Phone Numbers Box */}
        <View style={styles.phoneCard}>
          <LinearGradient
            colors={['#D4E6F1', '#AED6F1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.phoneGradient}
          >
            <MaterialCommunityIcons name="phone" size={28} color="#2E86C1" style={styles.phoneIcon} />
            <Text style={styles.phoneTitle}>Keep These Numbers Handy:</Text>
            <Text style={styles.phoneText}>
              • Emergency: 115{'\n'}
              • Rescue 1122: 042-99231701-2
            </Text>
          </LinearGradient>
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#f0cfe3', '#de81fa']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#961e46" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>First Aid Guidance</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      {renderCategoryList()}
      <FloatingChatButton navigation={navigation} />
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
    fontSize: isTablet ? 24 : 20,
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
  emergencyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: isTablet ? 25 : 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  emergencyText: {
    marginLeft: 15,
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  emergencyNumber: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 5,
    fontWeight: '600',
  },
  quickTipsCard: {
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quickTipsGradient: {
    padding: isTablet ? 25 : 20,
  },
  tipsIcon: {
    marginBottom: 10,
  },
  quickTipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 10,
  },
  quickTipsText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
  categoryTitle: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 15,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryCard: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    minHeight: 140,
  },
  categoryCardTablet: {
    width: '31%',
  },
  categoryGradient: {
    padding: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  categoryCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2D3436',
    marginTop: 12,
    textAlign: 'center',
  },
  categoryCardDescription: {
    fontSize: 11,
    color: '#636E72',
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 15,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#E74C3C',
    borderRadius: 12,
  },
  backButtonDetail: {
    padding: 8,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    marginLeft: 10,
  },
  stepCard: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  stepGradient: {
    padding: 20,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
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
  stepNumberCircleText: {
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
  stepNumber: {
    marginRight: 10,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepDescription: {
    fontSize: 14,
    color: '#555',
    lineHeight: 21,
    marginBottom: 15,
  },
  tipsBox: {
    backgroundColor: '#FFF9E6',
    borderLeftWidth: 4,
    borderLeftColor: '#F39C12',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tipsBoxTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#E67E22',
    marginLeft: 8,
  },
  tipItem: {
    fontSize: 12,
    color: '#555',
    marginVertical: 4,
    lineHeight: 18,
  },
  warningCard: {
    marginVertical: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  warningGradient: {
    padding: 20,
  },
  warningIcon: {
    marginBottom: 10,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C0392B',
    marginBottom: 10,
  },
  warningText: {
    fontSize: 13,
    color: '#A93226',
    lineHeight: 20,
  },
  doctorCard: {
    marginVertical: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 30,
  },
  doctorGradient: {
    padding: 20,
  },
  phoneIcon: {
    marginBottom: 10,
  },
  doctorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E86C1',
    marginBottom: 10,
  },
  doctorText: {
    fontSize: 13,
    color: '#1F5E86',
    lineHeight: 22,
  },
  tutorialButton: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  tutorialButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  tutorialButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
    marginRight: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  closeButton: {
    padding: 8,
  },
  tutorialList: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  tutorialItem: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tutorialItemGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 15,
  },
  tutorialItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  tutorialItemText: {
    marginLeft: 15,
    flex: 1,
  },
  tutorialItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3436',
  },
  tutorialItemSubtitle: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 4,
  },
  emergencyCard: {
    marginTop: 20,
    marginBottom: 15,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  emergencyGradient: {
    padding: 20,
  },
  emergencyIcon: {
    marginBottom: 10,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C0392B',
    marginBottom: 10,
  },
  emergencyText: {
    fontSize: 13,
    color: '#A93226',
    lineHeight: 20,
  },
  phoneCard: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  phoneGradient: {
    padding: 20,
  },
  phoneIcon: {
    marginBottom: 10,
  },
  phoneTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E86C1',
    marginBottom: 10,
  },
  phoneText: {
    fontSize: 13,
    color: '#1F5E86',
    lineHeight: 22,
  },
});

export default FirstAidGuidanceScreen;

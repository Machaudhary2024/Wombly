import React, { useState, useEffect } from 'react';
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
import FloatingChatButton from './components/FloatingChatButton';

const { width, height } = Dimensions.get('window');
const isTablet = width > 600;

const HygieneGuidanceScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const [tutorialLinks, setTutorialLinks] = useState({});
  const [videosLoading, setVideosLoading] = useState(true);

  // Fetch videos from YouTube API
  useEffect(() => {
    const fetchAllVideos = async () => {
      try {
        setVideosLoading(true);
        const categories = ['diaper', 'bathing', 'handwash', 'dental', 'skincare', 'laundry', 'wounds', 'foodsafety'];
        const categoryMap = {
          diaper: 1,
          bathing: 2,
          handwash: 3,
          dental: 4,
          skincare: 5,
          laundry: 6,
          wounds: 7,
          foodsafety: 8,
        };

        const newTutorialLinks = {};

        for (const category of categories) {
          try {
            const response = await fetch(
              `${API_BASE_URL}/api/videos-by-category/hygiene`
            );
            const result = await response.json();

            if (result.success && result.data && result.data.length > 0) {
              // Map videos to categories with specific queries for better results
              newTutorialLinks[categoryMap[category]] = result.data
                .slice(0, 3)
                .map((video) => ({
                  title: video.title,
                  url: video.url,
                  thumbnail: video.thumbnail,
                  id: video.id,
                }));
            } else {
              newTutorialLinks[categoryMap[category]] = [];
            }
          } catch (error) {
            console.error(`Error fetching videos for ${category}:`, error);
            newTutorialLinks[categoryMap[category]] = [];
          }
        }

        setTutorialLinks(newTutorialLinks);
      } catch (error) {
        console.error('Error fetching tutorials:', error);
        // Keep app working with empty videos
        setTutorialLinks({});
      } finally {
        setVideosLoading(false);
      }
    };

    fetchAllVideos();
  }, []);

  const categories = [
    {
      id: 1,
      title: 'Diaper Care',
      icon: 'baby-face-outline',
      color: '#3498DB',
      description: 'Preventing diaper rashes',
    },
    {
      id: 2,
      title: 'Bathing & Washing',
      icon: 'shower-head',
      color: '#2ECC71',
      description: 'Proper cleaning techniques',
    },
    {
      id: 3,
      title: 'Hand Hygiene',
      icon: 'hand-wash',
      color: '#E67E22',
      description: 'Preventing germs & infections',
    },
    {
      id: 4,
      title: 'Oral Hygiene',
      icon: 'tooth',
      color: '#9B59B6',
      description: 'Teeth care & prevention',
    },
    {
      id: 5,
      title: 'Nail & Skin Care',
      icon: 'nail',
      color: '#E74C3C',
      description: 'Preventing cuts & infections',
    },
    {
      id: 6,
      title: 'Clothing & Laundry',
      icon: 'tshirt-crew',
      color: '#F39C12',
      description: 'Fabric care for sensitive skin',
    },
    {
      id: 7,
      title: 'Wound & Infection Prevention',
      icon: 'shield-alert',
      color: '#C0392B',
      description: 'Keeping toddler safe & healthy',
    },
    {
      id: 8,
      title: 'Food Hygiene',
      icon: 'silverware-fork-knife',
      color: '#16A085',
      description: 'Safe food handling',
    },
  ];

  const guidanceData = {
    1: {
      title: 'Diaper Care & Rash Prevention',
      tips: [
        {
          number: 1,
          icon: 'clock-time-five',
          title: 'Change Diapers Frequently',
          description: 'Change diapers every 2-3 hours or immediately after bowel movements',
          details: [
            'Wet diapers left too long cause moisture buildup',
            'Bacteria thrive in warm, moist environments',
            'Check diapers even at night for comfort',
            'Use night diapers with better absorbency for longer wear',
          ],
        },
        {
          number: 2,
          icon: 'water-outline',
          title: 'Gentle Cleaning Method',
          description: 'Use warm water and soft cloth for each diaper change',
          details: [
            'Avoid harsh baby wipes with alcohol (can irritate)',
            'Use fragrance-free, hypoallergenic wipes',
            'Wipe from front to back to prevent UTIs',
            'Pat dry gently with a soft cloth, don\'t rub',
            'Allow skin to air dry for 5-10 minutes if possible',
          ],
        },
        {
          number: 3,
          icon: 'lotion-outline',
          title: 'Apply Diaper Cream',
          description: 'Use protective cream at each diaper change',
          details: [
            'Zinc oxide or petroleum-based creams create moisture barrier',
            'Apply thick layer on areas prone to rash',
            'Use fragrance-free products only',
            'Reapply after each cleaning and before diaper',
            'Switch brands if rash worsens (might be allergic)',
          ],
        },
        {
          number: 4,
          icon: 'diapers',
          title: 'Diaper Selection',
          description: 'Choose diapers appropriate for your toddler\'s skin',
          details: [
            'Avoid diapers too tight (causes friction)',
            'Hypoallergenic diapers reduce rash risk',
            'Try different brands if rash persists',
            'Cloth diapers good but need frequent changes',
            'Size up if diaper leaves marks on skin',
          ],
        },
        {
          number: 5,
          icon: 'air-filter',
          title: 'Allow Air Circulation',
          description: 'Let skin breathe during diaper-free time',
          details: [
            'Provide 15-30 minutes without diaper daily',
            'Place waterproof mat underneath for safety',
            'Sunshine provides natural antibacterial benefits',
            'Never leave unattended without diaper',
            'Avoid plastic pants that trap moisture',
          ],
        },
      ],
    },
    2: {
      title: 'Bathing & Washing Your Toddler',
      tips: [
        {
          number: 1,
          icon: 'thermometer',
          title: 'Water Temperature',
          description: 'Use lukewarm water (90-100°F / 32-37°C)',
          details: [
            'Test water with your elbow or wrist first',
            'Hot water removes protective skin oils',
            'Cold water might shock and dry skin',
            'Slightly warm water is soothing & safe',
            'Use a bath thermometer for accuracy',
          ],
        },
        {
          number: 2,
          icon: 'drop-outline',
          title: 'Bath Frequency & Duration',
          description: 'Bathe 2-3 times per week; keep baths short',
          details: [
            'Daily baths strip natural oils from skin',
            'Limit bath time to 5-10 minutes',
            'Frequent bathing causes dry, irritated skin',
            'More frequent washing increases infection risk',
            'Spot clean between baths as needed',
          ],
        },
        {
          number: 3,
          icon: 'soap-outline',
          title: 'Choose Right Soap & Shampoo',
          description: 'Use gentle, fragrance-free products only',
          details: [
            'Avoid adult soaps (too harsh)',
            'Use fragrance-free or hypoallergenic baby soap',
            'Double-check for dyes and perfumes',
            'Avoid antibacterial soaps (disrupt skin flora)',
            'Test new products on small area first',
          ],
        },
        {
          number: 4,
          icon: 'water-opacity',
          title: 'Proper Washing Technique',
          description: 'Wash gently to avoid irritation and infection',
          details: [
            'Use soft cloth or sponge, never scrub',
            'Pay attention to folds: neck, underarms, groin',
            'Ensure complete rinsing (soap residue irritates)',
            'Wash hair last to minimize water in eyes/ears',
            'Keep water out of ears and nose',
          ],
        },
        {
          number: 5,
          icon: 'towel',
          title: 'Drying & Moisturizing',
          description: 'Pat dry and apply moisturizer immediately',
          details: [
            'Pat dry gently with soft towel',
            'Don\'t leave skin wet (promotes fungal growth)',
            'Apply moisturizer to damp skin (traps moisture)',
            'Use fragrance-free lotion or baby oil',
            'Pay extra attention to skin folds',
          ],
        },
      ],
    },
    3: {
      title: 'Hand Hygiene & Infection Prevention',
      tips: [
        {
          number: 1,
          icon: 'hand-wash',
          title: 'Teach Handwashing Routine',
          description: 'Wash hands before eating and after outdoor play',
          details: [
            'Make it fun with songs (sing Happy Birthday twice)',
            'Wash for at least 20 seconds',
            'Include between fingers, nails, wrist area',
            'Wash hands after diaper changes',
            'Use lukewarm water only',
          ],
        },
        {
          number: 2,
          icon: 'soap',
          title: 'Gentle Hand Soap',
          description: 'Use mild, fragrance-free soap only',
          details: [
            'Avoid antibacterial and harsh soaps',
            'Liquid soap better than bar (less contamination)',
            'Fragrance-free prevents skin irritation',
            'Keep soap in accessible dispenser',
            'Teach proper rubbing technique early',
          ],
        },
        {
          number: 3,
          icon: 'nail-care',
          title: 'Keep Nails Clean & Short',
          description: 'Trim nails regularly to prevent scratching',
          details: [
            'Cut nails straight across, slightly rounded',
            'Clean under nails with soft brush',
            'Short nails reduce scratching injuries',
            'Prevents bacteria accumulation under nails',
            'Use baby nail clippers (safer & easier)',
          ],
        },
        {
          number: 4,
          icon: 'blanket-outline',
          title: 'Prevent Nail Scratches',
          description: 'Use mittens and keep nails short',
          details: [
            'Scratches become entry points for infection',
            'Mittens help very young toddlers',
            'Apply antibiotic ointment on scratches',
            'Keep nails smooth (file rough edges)',
            'Watch for signs of infection: redness, swelling, pus',
          ],
        },
        {
          number: 5,
          icon: 'cup-outline',
          title: 'Separate Personal Items',
          description: 'Don\'t share cups, bottles, or utensils',
          details: [
            'Each family member needs own cup/bottle',
            'Sharing spreads viruses and bacteria',
            'Wash items after every use',
            'Use hot water and dishwasher when possible',
            'Teach child not to share eating utensils with others',
          ],
        },
      ],
    },
    4: {
      title: 'Oral Hygiene & Teeth Care',
      tips: [
        {
          number: 1,
          icon: 'tooth-outline',
          title: 'Start Early Oral Care',
          description: 'Begin dental hygiene before first tooth appears',
          details: [
            'Wipe gums with soft damp cloth after feeding',
            'Start brushing as soon as first tooth erupts',
            'Makes toddler comfortable with mouth care',
            'Prevents bacteria buildup on gums',
            'Creates healthy habits early',
          ],
        },
        {
          number: 2,
          icon: 'toothbrush',
          title: 'Brushing Technique',
          description: 'Brush gently twice daily with proper technique',
          details: [
            'Use soft-bristled toddler toothbrush',
            'Use pea-sized amount of fluoride toothpaste',
            'Brush at 45-degree angle to gums',
            'Gentle circular motions, not harsh scrubbing',
            'Brush for 2 minutes (sing a song)',
            'Brush before bed most importantly',
          ],
        },
        {
          number: 3,
          icon: 'water-opacity',
          title: 'Water Intake & Mouth Health',
          description: 'Encourage water drinking, limit sugary drinks',
          details: [
            'Sugar feeds bacteria causing cavities',
            'Juice and milk left in mouth increase decay risk',
            'Offer water after meals to rinse mouth',
            'Never put toddler to bed with bottle',
            'Limit sugary snacks between meals',
          ],
        },
        {
          number: 4,
          icon: 'tooth-extract-outline',
          title: 'Prevent Oral Infections',
          description: 'Watch for thrush and other oral issues',
          details: [
            'Thrush (white coating) common in toddlers',
            'Wash bottles and pacifiers daily',
            'Sterilize feeding items weekly',
            'Keep toothbrush clean and replace monthly',
            'See dentist if white patches or sores appear',
          ],
        },
        {
          number: 5,
          icon: 'calendar-check',
          title: 'Dental Checkups',
          description: 'Schedule first dental visit by age 3',
          details: [
            'Regular checkups prevent cavities',
            'Dentist can spot problems early',
            'Professional cleaning every 6 months',
            'Fluoride treatments strengthen enamel',
            'Early visits make dental care comfortable',
          ],
        },
      ],
    },
    5: {
      title: 'Nail & Skin Care Prevention',
      tips: [
        {
          number: 1,
          icon: 'nail-care',
          title: 'Regular Nail Trimming',
          description: 'Keep nails short to prevent scratching injuries',
          details: [
            'Trim nails when toddler is calm/sleeping',
            'Use sharp, baby-appropriate nail clippers',
            'Cut straight across, leave small white edge',
            'Trim every 1-2 weeks',
            'File down any sharp edges with soft file',
          ],
        },
        {
          number: 2,
          icon: 'bandage',
          title: 'Handle Scratches Immediately',
          description: 'Prevent infection by treating scratches quickly',
          details: [
            'Wash scratch with mild soap and water',
            'Apply antibiotic ointment (like Neosporin)',
            'Cover with bandage if bleeding',
            'Watch for signs of infection daily',
            'Infection signs: increasing redness, warmth, pus, swelling',
          ],
        },
        {
          number: 3,
          icon: 'lotion-outline',
          title: 'Moisturize Regularly',
          description: 'Keep skin hydrated to prevent cracking',
          details: [
            'Apply moisturizer twice daily, especially after bath',
            'Dry skin becomes irritated and prone to infection',
            'Use fragrance-free, hypoallergenic lotion',
            'Pay special attention to elbows, knees, hands',
            'Avoid products with alcohol (drying)',
          ],
        },
        {
          number: 4,
          icon: 'alert-circle',
          title: 'Watch for Skin Infections',
          description: 'Learn signs of eczema, impetigo, and fungal infections',
          details: [
            'Eczema: dry, itchy, red patches',
            'Impetigo: honey-crusted sores (highly contagious)',
            'Fungal: ring-shaped rash (athlete\'s foot, ringworm)',
            'Staph: painful pustules or boils',
            'See doctor if rash doesn\'t improve in 3-5 days',
          ],
        },
        {
          number: 5,
          icon: 'shield-check',
          title: 'Prevention Tips',
          description: 'Reduce skin issues with good hygiene practices',
          details: [
            'Avoid scratching: keep nails short',
            'Don\'t share towels with others',
            'Wash clothes in gentle detergent',
            'Avoid harsh soaps that dry skin',
            'Keep toddler\'s environment clean and dry',
          ],
        },
      ],
    },
    6: {
      title: 'Clothing & Laundry Care',
      tips: [
        {
          number: 1,
          icon: 'tshirt-crew',
          title: 'Choose Appropriate Fabrics',
          description: 'Select soft, breathable materials for sensitive skin',
          details: [
            'Cotton is best (soft, breathable, hypoallergenic)',
            'Avoid synthetic fabrics (trap moisture, irritate)',
            'Avoid wool (scratchy, can irritate skin)',
            'Check seams aren\'t rough or irritating',
            'Ensure tags don\'t rub against skin',
          ],
        },
        {
          number: 2,
          icon: 'washing-machine',
          title: 'Washing New Clothes',
          description: 'Pre-wash all new clothing before wearing',
          details: [
            'Wash new clothes removes dyes and chemicals',
            'Use gentle, fragrance-free detergent only',
            'Avoid fabric softener (irritates skin)',
            'Wash in hot water to remove chemicals',
            'Rinse thoroughly (detergent residue irritates)',
          ],
        },
        {
          number: 3,
          icon: 'droplet',
          title: 'Laundry Detergent Selection',
          description: 'Use only gentle, hypoallergenic detergents',
          details: [
            'Use baby-specific or "free & clear" detergent',
            'Avoid scented, dyed detergents',
            'Avoid bleach and harsh chemicals',
            'Use half the recommended amount',
            'Consider double-rinse cycle for cleanliness',
          ],
        },
        {
          number: 4,
          icon: 'dryer',
          title: 'Drying & Storage',
          description: 'Dry carefully and store in clean environment',
          details: [
            'Air dry when possible (sun has antibacterial benefits)',
            'Use gentle heat in dryer if available',
            'Don\'t use dryer sheets (chemical coating irritates)',
            'Store in clean, dry drawer',
            'Ensure no mold or dampness in storage area',
          ],
        },
        {
          number: 5,
          icon: 'alert-circle',
          title: 'Prevent Laundry-Related Issues',
          description: 'Keep clothing clean to avoid rashes and infections',
          details: [
            'Change clothes immediately if wet or sweaty',
            'Wash clothes regularly (not after wearing once)',
            'Spit-up and sweat harbor bacteria',
            'Don\'t store dirty clothes in bedroom',
            'Wash hands after handling dirty laundry',
          ],
        },
      ],
    },
    7: {
      title: 'Wound & Infection Prevention',
      tips: [
        {
          number: 1,
          icon: 'bandage',
          title: 'Clean Wound Immediately',
          description: 'Proper cleaning prevents 90% of infections',
          details: [
            'Wash with mild soap and lukewarm water',
            'Gently remove any dirt or debris',
            'Pat dry with clean cloth',
            'Apply antibiotic ointment for extra protection',
            'Cover with sterile bandage if wound is bleeding',
          ],
        },
        {
          number: 2,
          icon: 'shield-alert',
          title: 'Keep Wounds Dry & Clean',
          description: 'Moisture and bacteria cause infections',
          details: [
            'Change bandages daily or when wet/dirty',
            'Avoid soaking wound in water until healed',
            'Keep wound free from dirt and debris',
            'Wash hands before touching wound',
            'Don\'t pick at scabs (risks spreading infection)',
          ],
        },
        {
          number: 3,
          icon: 'hospital-box',
          title: 'Recognize Infection Signs',
          description: 'Watch for these warning signs of infection',
          details: [
            'Increasing redness or warmth around wound',
            'Swelling that increases after 2 days',
            'Pus or yellow drainage from wound',
            'Red streaks extending from wound',
            'Fever or general feeling of illness',
          ],
        },
        {
          number: 4,
          icon: 'alert-circle-outline',
          title: 'When to Seek Medical Help',
          description: 'Don\'t delay - get professional care for serious wounds',
          details: [
            'Wounds longer than ½ inch may need stitches',
            'Deep puncture wounds (step on nail)',
            'Wounds that won\'t stop bleeding after 10 min',
            'Animal or human bites (high infection risk)',
            'Any sign of infection (see doctor immediately)',
          ],
        },
        {
          number: 5,
          icon: 'shield-check',
          title: 'Prevent Infections with Immunity',
          description: 'Keep vaccinations current for protection',
          details: [
            'Tetanus vaccine prevents serious infections',
            'Update after any wound over 5 years',
            'Follow recommended vaccine schedule',
            'Ask doctor about infections in your area',
            'Healthy diet & sleep boost immune system',
          ],
        },
      ],
    },
    8: {
      title: 'Food Hygiene & Safe Eating',
      tips: [
        {
          number: 1,
          icon: 'silverware-fork-knife',
          title: 'Hand Washing Before Eating',
          description: 'Always wash hands thoroughly before meals',
          details: [
            'Wash hands with soap and water for 20 seconds',
            'Include under nails and between fingers',
            'Prevents foodborne illness',
            'Teach toddler to wash hands independently',
            'Model good hygiene behavior',
          ],
        },
        {
          number: 2,
          icon: 'bottle-multiple',
          title: 'Keep Feeding Items Clean',
          description: 'Bottles, cups, and utensils must be sanitized',
          details: [
            'Wash immediately after use (bacteria grow quickly)',
            'Use hot soapy water and scrub thoroughly',
            'Sterilize bottles/nipples daily if under 12 months',
            'Use dishwasher on hot cycle for best cleaning',
            'Replace bottles/cups if cracked or damaged',
          ],
        },
        {
          number: 3,
          icon: 'refrigerator',
          title: 'Proper Food Storage',
          description: 'Prevent bacterial growth with proper storage',
          details: [
            'Store prepared food in refrigerator within 2 hours',
            'Keep fridge at 40°F or colder',
            'Don\'t reuse leftover food from plate',
            'Throw away food left at room temp over 2 hours',
            'Date containers so you know what\'s fresh',
          ],
        },
        {
          number: 4,
          icon: 'water-filter',
          title: 'Water Safety',
          description: 'Ensure drinking water is clean and safe',
          details: [
            'Use filtered or bottled water if tap water is unsafe',
            'Boil water if traveling to unknown areas',
            'Change water bottle regularly',
            'Avoid water from questionable sources',
            'Offer water throughout day for hydration',
          ],
        },
        {
          number: 5,
          icon: 'alert-circle',
          title: 'Signs of Foodborne Illness',
          description: 'Know when to seek medical help',
          details: [
            'Vomiting or diarrhea after eating',
            'Abdominal pain or cramping',
            'Fever accompanying digestive symptoms',
            'Rashes or swelling of lips/mouth',
            'Contact doctor if symptoms last over few hours',
          ],
        },
      ],
    },
  };

  const handleTutorialPress = (url) => {
    if (!url) {
      Alert.alert('No Video', 'This tutorial is loading or currently unavailable. Please try again shortly.');
      return;
    }
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open the tutorial. Please check your internet connection.');
    });
  };

  const renderCategoryList = () => {
    return (
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Warning Banner */}
        <LinearGradient
          colors={['#E74C3C', '#C0392B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.warningBanner}
        >
          <MaterialCommunityIcons name="alert-circle" size={40} color="#FFFFFF" />
          <View style={styles.warningText}>
            <Text style={styles.warningTitle}>Proper Hygiene is Essential</Text>
            <Text style={styles.warningSubtitle}>Prevents rashes, infections & serious health issues</Text>
          </View>
        </LinearGradient>

        {/* Quick Tips */}
        <View style={styles.quickTipsCard}>
          <LinearGradient
            colors={['#E8F8F5', '#D5F4E6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.quickTipsGradient}
          >
            <MaterialCommunityIcons name="checkmark-circle" size={28} color="#16A085" style={styles.tipsIcon} />
            <Text style={styles.quickTipsTitle}>Essential Practices:</Text>
            <Text style={styles.quickTipsText}>
              • Change diapers every 2-3 hours{'\n'}
              • Bathe 2-3 times per week only{'\n'}
              • Use fragrance-free products{'\n'}
              • Wash hands before eating{'\n'}
              • Keep nails short & clean{'\n'}
              • Treat wounds immediately
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
              onPress={() => setSelectedCategory(category.id)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[category.color, category.color]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.categoryGradient}
              >
                <MaterialCommunityIcons name={category.icon} size={40} color="#FFFFFF" />
                <Text style={styles.categoryCardTitle}>{category.title}</Text>
                <Text style={styles.categoryCardDescription}>{category.description}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  };

  const renderDetailedGuide = () => {
    const data = guidanceData[selectedCategory];
    if (!data) return null;

    return (
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.detailHeader}>
          <TouchableOpacity 
            onPress={() => setSelectedCategory(null)}
            style={styles.backButtonDetail}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.detailTitle}>{data.title}</Text>
        </View>

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
        {data.tips.map((tip) => (
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
                <MaterialCommunityIcons name={tip.icon} size={28} color="#16A085" />
              </View>

              <Text style={styles.tipDescription}>{tip.description}</Text>

              {/* Details Box */}
              <View style={styles.detailsBox}>
                <View style={styles.detailsHeader}>
                  <MaterialCommunityIcons name="information" size={18} color="#16A085" />
                  <Text style={styles.detailsBoxTitle}>Key Details:</Text>
                </View>
                {tip.details.map((detail, index) => (
                  <Text key={index} style={styles.detailItem}>
                    • {detail}
                  </Text>
                ))}
              </View>
            </LinearGradient>
          </View>
        ))}

        {/* Important Note */}
        <View style={styles.importantCard}>
          <LinearGradient
            colors={['#FEF9E7', '#FCF3CF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.importantGradient}
          >
            <MaterialCommunityIcons name="lightbulb" size={28} color="#F39C12" style={styles.noteIcon} />
            <Text style={styles.importantTitle}>Important Reminders:</Text>
            <Text style={styles.importantText}>
              • Every child's skin is different{'\n'}
              • If rash persists, consult pediatrician{'\n'}
              • Always use hypoallergenic products{'\n'}
              • Consistency is key to prevention{'\n'}
              • Watch for signs of allergic reactions
            </Text>
          </LinearGradient>
        </View>

        {/* Doctor Contact */}
        <View style={styles.doctorCard}>
          <LinearGradient
            colors={['#FADBD8', '#F5B7B1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.doctorGradient}
          >
            <MaterialCommunityIcons name="stethoscope" size={28} color="#C0392B" style={styles.phoneIcon} />
            <Text style={styles.doctorTitle}>When to See Your Pediatrician:</Text>
            <Text style={styles.doctorText}>
              • Rash lasting more than 3-5 days{'\n'}
              • Signs of infection (redness, pus, warmth){'\n'}
              • Spreading rash or new symptoms{'\n'}
              • Severe itching affecting sleep{'\n'}
              • Child seems unwell or feverish{'\n'}
              • Any signs of allergic reaction
            </Text>
          </LinearGradient>
        </View>

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
                ) : tutorialLinks[selectedCategory] && tutorialLinks[selectedCategory].length > 0 ? (
                  tutorialLinks[selectedCategory].map((tutorial, index) => (
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
                      No videos available for this category
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2ECC71', '#27AE60']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hygiene Guidance</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      {selectedCategory === null ? renderCategoryList() : renderDetailedGuide()}
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
  },
  warningBanner: {
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
  warningText: {
    marginLeft: 15,
    flex: 1,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  warningSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 5,
    opacity: 0.9,
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
    color: '#0B5345',
    marginBottom: 10,
  },
  quickTipsText: {
    fontSize: 14,
    color: '#145A32',
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
  },
  categoryCard: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  categoryCardTablet: {
    width: '31%',
  },
  categoryGradient: {
    padding: 20,
    alignItems: 'center',
  },
  categoryCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 10,
    textAlign: 'center',
  },
  categoryCardDescription: {
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 5,
    textAlign: 'center',
    opacity: 0.9,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#27AE60',
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
  tipCard: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  tipGradient: {
    padding: 20,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  tipNumberCircle: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#2ECC71',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  tipNumberText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tipTitleContainer: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  tipDescription: {
    fontSize: 14,
    color: '#555',
    lineHeight: 21,
    marginBottom: 15,
  },
  detailsBox: {
    backgroundColor: '#E8F8F5',
    borderLeftWidth: 4,
    borderLeftColor: '#16A085',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailsBoxTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0B5345',
    marginLeft: 8,
  },
  detailItem: {
    fontSize: 12,
    color: '#186A3B',
    marginVertical: 4,
    lineHeight: 18,
  },
  importantCard: {
    marginVertical: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  importantGradient: {
    padding: 20,
  },
  noteIcon: {
    marginBottom: 10,
  },
  importantTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7D6608',
    marginBottom: 10,
  },
  importantText: {
    fontSize: 13,
    color: '#6E5B47',
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
    color: '#922B21',
    marginBottom: 10,
  },
  doctorText: {
    fontSize: 13,
    color: '#78281F',
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
});

export default HygieneGuidanceScreen;

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const PAGE_HEADING =
  'Craving chaat at 2 a.m.? You\'re in good company—many Pakistani mums-to-be do!';

const FAQS = [
  {
    q: 'Should we neglect our cravings?',
    a: 'No. You don\'t have to ignore cravings. Enjoy them in moderation and balance with nutritious meals. If you crave junk often, try healthier swaps (e.g. fruit instead of mithai, baked instead of fried).',
  },
  {
    q: 'Are pregnancy cravings a sign of nutrient deficiency?',
    a: 'Sometimes. Strong cravings for ice can be linked to low iron; craving non-food items (e.g. soil) needs a doctor. Most cravings are hormonal. If unsure, ask your doctor and get routine blood tests.',
  },
  {
    q: 'Why do I crave spicy or chatpata food during pregnancy?',
    a: 'Hormones can dull taste, so you may want stronger flavours. Spicy and chatpata foods are common in Pakistani diets. Enjoy in moderation—if you get heartburn, cut back and eat earlier in the day.',
  },
  {
    q: 'Is it safe to eat street food (e.g. gol gappay, chaat) when pregnant?',
    a: 'Prefer clean, trusted places and fresh preparation. Avoid uncooked chutneys or water from unknown sources. Homemade or hygienic restaurant versions are safer. When in doubt, skip or make at home.',
  },
  {
    q: 'Can I satisfy my mithai craving during pregnancy?',
    a: 'Yes, in moderation. Small portions of quality mithai are fine. Balance with protein and fibre. If you have gestational diabetes, follow your doctor\'s advice on sweets.',
  },
];

const MEAL_IDEAS = [
  {
    title: 'Dahi & fruit',
    desc: 'Cold dahi with chopped mango, banana, or berries. Satisfies sweet and creamy cravings safely.',
    icon: 'bowl-mix',
  },
  {
    title: 'Fruit chaat (homemade)',
    desc: 'Apple, banana, orange, chaat masala, lemon. Chatpata and fresh—easy to make at home.',
    icon: 'fruit-citrus',
  },
  {
    title: 'Lassi (plain or sweet)',
    desc: 'Thanda lassi with a pinch of salt or a little sugar. Cooling and good for calcium.',
    icon: 'cup-water',
  },
  {
    title: 'Dates with nuts',
    desc: '2–3 dates with almonds or akhrot. Energy, fibre, and iron—great for Pakistani mums.',
    icon: 'fruit-cherries',
  },
  {
    title: 'Aloo chaat (homemade)',
    desc: 'Boiled potato, chaat masala, lemon, fresh coriander. Safer than street chaat when made at home.',
    icon: 'food-variant',
  },
  {
    title: 'Samosas / pakoray (baked or air-fried)',
    desc: 'Bake or air-fry instead of deep-frying. Satisfies crispy cravings with less oil.',
    icon: 'food',
  },
  {
    title: 'Lemon water & nimco',
    desc: 'Nimco in small amounts with lemon water. For salty, crunchy cravings—don\'t overdo salt.',
    icon: 'cookie',
  },
  {
    title: 'Halwa (suji or gajar)',
    desc: 'Small portion of suji or gajar ka halwa. Warm, comforting, and familiar—moderation is key.',
    icon: 'rice',
  },
];

const CRAVING_VIDEOS = [
  { id: 'REPLACE_WITH_VIDEO_ID_1', title: 'Pregnancy cravings – healthy tips' },
  { id: 'REPLACE_WITH_VIDEO_ID_2', title: 'Pakistani pregnancy diet ideas' },
];

function openYouTube(videoId) {
  if (!videoId || videoId.startsWith('REPLACE_')) return;
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  Linking.openURL(url).catch(() => {});
}

const CravingsScreen = ({ navigation }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFE5F1', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#6C5CE7" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cravings</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageHeading}>{PAGE_HEADING}</Text>

        <View style={styles.faqSection}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="help-circle-outline" size={24} color="#9C27B0" />
            <Text style={styles.sectionTitle}>FAQs</Text>
          </View>
          {FAQS.map((faq, i) => {
            const isOpen = openFaqIndex === i;
            return (
              <TouchableOpacity
                key={i}
                style={[styles.faqItem, isOpen && styles.faqItemOpen]}
                onPress={() => setOpenFaqIndex(isOpen ? null : i)}
                activeOpacity={0.85}
              >
                <View style={styles.faqRow}>
                  <Text style={styles.faqQuestion}>{faq.q}</Text>
                  <MaterialCommunityIcons
                    name={isOpen ? 'chevron-up' : 'chevron-down'}
                    size={24}
                    color="#9C27B0"
                  />
                </View>
                {isOpen && <Text style={styles.faqAnswer}>{faq.a}</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.mealsSection}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="silverware-fork-knife" size={24} color="#26A69A" />
            <Text style={styles.sectionTitle}>Craving meal ideas (Pakistani-friendly)</Text>
          </View>
          <Text style={styles.mealsIntro}>
            Safe, satisfying ideas for common cravings—swap street food with homemade when you can.
          </Text>
          {MEAL_IDEAS.map((meal, i) => (
            <View key={i} style={styles.mealCard}>
              <View style={[styles.mealIconWrap, { backgroundColor: meal.icon ? '#26A69A22' : '#eee' }]}>
                <MaterialCommunityIcons name={meal.icon} size={28} color="#26A69A" />
              </View>
              <View style={styles.mealTextWrap}>
                <Text style={styles.mealTitle}>{meal.title}</Text>
                <Text style={styles.mealDesc}>{meal.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.videoSection}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="youtube" size={24} color="#FF0000" />
            <Text style={styles.sectionTitle}>Videos</Text>
          </View>
          <Text style={styles.videoIntro}>
            Tap a card to open the video on YouTube. Edit CRAVING_VIDEOS in CravingsScreen.js to add or change video IDs (e.g. from youtube.com/watch?v=VIDEO_ID).
          </Text>
          {CRAVING_VIDEOS.map((v, i) => {
            const canOpen = v.id && !v.id.startsWith('REPLACE_');
            return (
              <TouchableOpacity
                key={i}
                style={[styles.videoCard, !canOpen && styles.videoCardPlaceholder]}
                onPress={() => openYouTube(v.id)}
                activeOpacity={0.85}
                disabled={!canOpen}
              >
                <View style={styles.videoIconWrap}>
                  <MaterialCommunityIcons name="play-circle" size={48} color={canOpen ? '#FF0000' : '#BBB'} />
                </View>
                <Text style={styles.videoTitle}>{v.title}</Text>
                <Text style={styles.videoSub}>
                  {canOpen ? 'Tap to open on YouTube' : 'Add video ID in CravingsScreen.js'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: { padding: 8 },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6C5CE7',
    textAlign: 'center',
  },
  headerSpacer: { width: 40 },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 90 },
  pageHeading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D3436',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 28,
    lineHeight: 30,
    paddingHorizontal: 12,
  },
  faqSection: { marginBottom: 28 },
  mealsSection: { marginBottom: 28 },
  videoSection: { marginBottom: 20 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginLeft: 10,
  },
  faqItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  faqItemOpen: {
    borderWidth: 1,
    borderColor: '#F3E5F5',
  },
  faqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3436',
    marginRight: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#636E72',
    lineHeight: 22,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  mealsIntro: {
    fontSize: 14,
    color: '#636E72',
    marginBottom: 14,
    lineHeight: 20,
  },
  mealCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  mealIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  mealTextWrap: { flex: 1 },
  mealTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 4,
  },
  mealDesc: {
    fontSize: 13,
    color: '#636E72',
    lineHeight: 19,
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
  videoIconWrap: { marginBottom: 10 },
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
  videoCardPlaceholder: {
    opacity: 0.85,
  },
  bottomSpacer: { height: 24 },
});

export default CravingsScreen;

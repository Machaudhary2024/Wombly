import React from 'react';
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

const REMEDIES = [
  {
    id: 'ajwain',
    title: 'Ajwain (carom seeds)',
    icon: 'leaf-maple',
    color: '#43A047',
    short: 'Used for digestion and gas—common in Pakistani homes.',
    tips: [
      'A pinch in warm water or sprinkled on food can ease bloating.',
      'Avoid large amounts; a little goes a long way.',
      'Check with your doctor if you have any pregnancy complications.',
    ],
  },
  {
    id: 'saunf',
    title: 'Saunf (fennel)',
    icon: 'flower-tulip',
    color: '#9C27B0',
    short: 'Often chewed or brewed as tea after meals for digestion and freshness.',
    tips: [
      'Chewing a few seeds or sipping saunf tea may help with nausea and heartburn.',
      'Use in moderation; it\'s not a substitute for medical advice.',
    ],
  },
  {
    id: 'ginger',
    title: 'Adrak (ginger)',
    icon: 'food-apple',
    color: '#FF9800',
    short: 'A go-to for morning sickness in many Pakistani households.',
    tips: [
      'Ginger chai (with limited caffeine), fresh ginger in food, or crystallised ginger can help.',
      'Small amounts are generally safe; avoid very high doses or supplements without asking your doctor.',
    ],
  },
  {
    id: 'dates',
    title: 'Khajoor (dates)',
    icon: 'fruit-cherries',
    color: '#8D6E63',
    short: 'Traditionally eaten in the third trimester for strength and energy.',
    tips: [
      'Dates are rich in fibre, iron, and natural sugars—a few per day can be part of a balanced diet.',
      'If you have gestational diabetes, discuss portion size with your doctor.',
    ],
  },
  {
    id: 'dryfruit',
    title: 'Dry fruit (badam, akhrot)',
    icon: 'nuts',
    color: '#795548',
    short: 'Almonds and walnuts are often given for "brain and strength" for the baby.',
    tips: [
      'A small handful of unsalted nuts gives healthy fats and protein.',
      'Soaked almonds are easier to digest; avoid mouldy or old stock.',
    ],
  },
  {
    id: 'rest',
    title: 'Rest & family support',
    icon: 'hand-heart',
    color: '#6C5CE7',
    short: 'Taking it easy and letting family help is a big part of desi pregnancy care.',
    tips: [
      'Rest when you\'re tired; don\'t push through exhaustion.',
      'Accept help with cooking, chores, and errands—it\'s good for you and the baby.',
      'Emotional support from family can ease stress; talk to someone if you feel low.',
    ],
  },
];

const CULTURAL_VIDEOS = [
  { id: 'REPLACE_WITH_VIDEO_ID_1', title: 'Pakistani pregnancy remedies & tips' },
  { id: 'REPLACE_WITH_VIDEO_ID_2', title: 'Traditional foods during pregnancy' },
];

function openYouTube(videoId) {
  if (!videoId || videoId.startsWith('REPLACE_')) return;
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  Linking.openURL(url).catch(() => {});
}

const CulturalRemediesScreen = ({ navigation }) => {
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
        <Text style={styles.headerTitle}>Cultural remedies</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageHeading}>
          Remedies from Pakistani homes during pregnancy
        </Text>
        <Text style={styles.intro}>
          Many families use gentle, food-based remedies passed down through generations. Here are some common ones—enjoy them in moderation and always check with your doctor, especially if you have any health conditions or complications.
        </Text>

        {REMEDIES.map((r) => (
          <View key={r.id} style={styles.remedyCard}>
            <View style={[styles.remedyIconWrap, { backgroundColor: r.color + '22' }]}>
              <MaterialCommunityIcons name={r.icon} size={28} color={r.color} />
            </View>
            <View style={styles.remedyBody}>
              <Text style={styles.remedyTitle}>{r.title}</Text>
              <Text style={styles.remedyShort}>{r.short}</Text>
              {r.tips.map((tip, i) => (
                <View key={i} style={styles.tipRow}>
                  <MaterialCommunityIcons name="check-circle" size={16} color={r.color} />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.noteCard}>
          <MaterialCommunityIcons name="doctor" size={24} color="#6C5CE7" />
          <Text style={styles.noteText}>
            These are shared for cultural context and general interest. They are not a replacement for your doctor\'s advice. If you\'re unsure about any remedy or supplement, ask your healthcare provider.
          </Text>
        </View>

        <View style={styles.videoSection}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="youtube" size={24} color="#FF0000" />
            <Text style={styles.sectionTitle}>Videos</Text>
          </View>
          <Text style={styles.videoIntro}>
            Add your chosen YouTube video IDs in CulturalRemediesScreen.js (CULTURAL_VIDEOS) to show links here. Tap a card to open on YouTube.
          </Text>
          {CULTURAL_VIDEOS.map((v, i) => {
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
                  <MaterialCommunityIcons
                    name="play-circle"
                    size={48}
                    color={canOpen ? '#FF0000' : '#BBB'}
                  />
                </View>
                <Text style={styles.videoTitle}>{v.title}</Text>
                <Text style={styles.videoSub}>
                  {canOpen ? 'Tap to open on YouTube' : 'Add video ID in CulturalRemediesScreen.js'}
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
  container: { flex: 1, backgroundColor: '#F8F8F8' },
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
  scrollContent: { padding: 20, paddingBottom: 40 },
  pageHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3436',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 28,
  },
  intro: {
    fontSize: 14,
    color: '#636E72',
    lineHeight: 22,
    marginBottom: 24,
  },
  remedyCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  remedyIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  remedyBody: { flex: 1 },
  remedyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 6,
  },
  remedyShort: {
    fontSize: 14,
    color: '#636E72',
    lineHeight: 20,
    marginBottom: 10,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#2D3436',
    lineHeight: 19,
    marginLeft: 8,
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E8D5FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 28,
    borderLeftWidth: 4,
    borderLeftColor: '#6C5CE7',
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    color: '#2D3436',
    lineHeight: 21,
    marginLeft: 12,
  },
  videoSection: { marginBottom: 20 },
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
  videoCardPlaceholder: { opacity: 0.85 },
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
  bottomSpacer: { height: 24 },
});

export default CulturalRemediesScreen;

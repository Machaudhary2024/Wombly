import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FloatingChatButton from './components/FloatingChatButton';

const TRIMESTERS = [
  {
    id: '1',
    weeks: 'Weeks 1–12',
    tagline: 'Foundation & early development',
    color: '#FF6B9D',
    bg: '#FFE5F1',
    modules: [
      {
        title: 'Folic acid & early development',
        icon: 'leaf',
        focus: 'Your baby\'s neural tube is forming. What you eat now supports their brain and spine.',
        points: [
          'Take a prenatal with 400–800 mcg folic acid daily; start before pregnancy if possible.',
          'Eat folate-rich foods: leafy greens, lentils, chickpeas, fortified bread/cereal.',
          'Small, frequent meals help if you\'re nauseous—don\'t force large portions.',
        ],
      },
      {
        title: 'Managing nausea with food',
        icon: 'food-apple',
        focus: 'Morning sickness is common. Smart food choices can ease it.',
        points: [
          'Keep plain crackers or dry toast by the bed; eat a little before getting up.',
          'Ginger (tea, biscuits, crystallised) and cold fruits often help.',
          'Avoid strong smells and fatty or spicy foods if they trigger nausea.',
        ],
      },
      {
        title: 'Food safety basics',
        icon: 'shield-check',
        focus: 'Lower infection risk from the start.',
        points: [
          'Avoid raw or undercooked meat, eggs, and unpasteurised dairy.',
          'Wash fruits and vegetables; use separate boards for raw meat.',
          'Skip cold deli meats and pâté unless reheated until steaming.',
        ],
      },
    ],
  },
  {
    id: '2',
    weeks: 'Weeks 13–26',
    tagline: 'Energy, growth & nutrients',
    color: '#9C27B0',
    bg: '#F3E5F5',
    modules: [
      {
        title: 'Iron & energy',
        icon: 'blood-bag',
        focus: 'Your blood volume grows; iron helps you and your baby stay strong.',
        points: [
          'Include iron-rich foods: lean meat, chicken, lentils, beans, leafy greens.',
          'Pair with vitamin C (lemon, tomato, citrus) to absorb iron better.',
          'Tea or coffee with meals can reduce iron absorption—have them between meals.',
        ],
      },
      {
        title: 'Calcium & baby\'s bones',
        icon: 'bone',
        focus: 'Baby\'s skeleton is building. Calcium supports bones and teeth.',
        points: [
          'Aim for 3 servings of dairy or fortified alternatives (milk, dahi, paneer).',
          'Dark leafy greens and fortified foods add calcium too.',
          'Space out calcium and iron—they compete for absorption if taken together.',
        ],
      },
      {
        title: 'Balanced growth & variety',
        icon: 'chart-timeline-variant',
        focus: 'Steady weight gain and variety keep you and baby nourished.',
        points: [
          'Eat a mix of whole grains, protein, vegetables, and healthy fats.',
          'About 300 extra calories per day is usually enough—quality over quantity.',
          'Stay hydrated; include fibre to ease constipation.',
        ],
      },
    ],
  },
  {
    id: '3',
    weeks: 'Weeks 27–40',
    tagline: 'Final growth & preparation',
    color: '#6C5CE7',
    bg: '#E8D5FF',
    modules: [
      {
        title: 'Brain & final growth',
        icon: 'brain',
        focus: 'Baby\'s brain is developing fast. Omega-3 and good fats matter.',
        points: [
          'Eat 1–2 portions of low-mercury fish per week (e.g. salmon, small tinned fish).',
          'Include nuts, seeds, and cooking oils for healthy fats.',
          'Keep taking your prenatal and eating a varied diet.',
        ],
      },
      {
        title: 'Comfort & digestion',
        icon: 'stomach',
        focus: 'Less room in your tummy—eat in a way that feels good.',
        points: [
          'Small, frequent meals reduce heartburn and fullness.',
          'Avoid lying down right after eating; prop yourself up at night if needed.',
          'Fibre and fluids help with constipation—keep fruits, veggies, and water up.',
        ],
      },
      {
        title: 'Ready for feeding',
        icon: 'baby-face-outline',
        focus: 'Your body is getting ready to feed your baby.',
        points: [
          'Eat enough calories and protein; no need to "eat for two" in size.',
          'Stay hydrated; it supports milk supply later.',
          'If you plan to breastfeed, no special diet now—just keep eating well.',
        ],
      },
    ],
  },
];

const TrimesterNutritionScreen = ({ navigation, route }) => {
  const pregnancyWeek = route.params?.pregnancyWeek;
  const [expandedModule, setExpandedModule] = useState(null);

  const getCurrentTrimester = () => {
    if (!pregnancyWeek) return null;
    if (pregnancyWeek <= 12) return '1';
    if (pregnancyWeek <= 26) return '2';
    return '3';
  };

  const currentTri = getCurrentTrimester();

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
        <Text style={styles.headerTitle}>Trimester nutrition</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {currentTri && (
          <View style={styles.youAreHere}>
            <MaterialCommunityIcons name="map-marker" size={20} color="#6C5CE7" />
            <Text style={styles.youAreHereText}>
              You\'re in Trimester {currentTri} (week {pregnancyWeek})
            </Text>
          </View>
        )}

        {TRIMESTERS.map((tri) => (
          <View key={tri.id} style={[styles.trimesterBlock, { borderLeftColor: tri.color }]}>
            <View style={styles.trimesterHeader}>
              <View style={[styles.trimesterBadge, { backgroundColor: tri.bg }]}>
                <Text style={[styles.trimesterWeeks, { color: tri.color }]}>{tri.weeks}</Text>
                <Text style={styles.trimesterTagline}>{tri.tagline}</Text>
              </View>
            </View>
            {tri.modules.map((mod, idx) => {
              const key = `${tri.id}-${idx}`;
              const isOpen = expandedModule === key;
              return (
                <TouchableOpacity
                  key={key}
                  style={[styles.moduleCard, isOpen && styles.moduleCardOpen]}
                  onPress={() => setExpandedModule(isOpen ? null : key)}
                  activeOpacity={0.9}
                >
                  <View style={styles.moduleHeader}>
                    <View style={[styles.moduleIconWrap, { backgroundColor: tri.bg }]}>
                      <MaterialCommunityIcons name={mod.icon} size={24} color={tri.color} />
                    </View>
                    <View style={styles.moduleTitleWrap}>
                      <Text style={styles.moduleTitle}>{mod.title}</Text>
                      <Text style={styles.moduleFocus} numberOfLines={isOpen ? 10 : 2}>
                        {mod.focus}
                      </Text>
                    </View>
                    <MaterialCommunityIcons
                      name={isOpen ? 'chevron-up' : 'chevron-down'}
                      size={24}
                      color={tri.color}
                    />
                  </View>
                  {isOpen && (
                    <View style={styles.moduleBody}>
                      {mod.points.map((point, i) => (
                        <View key={i} style={styles.pointRow}>
                          <MaterialCommunityIcons name="check-circle" size={18} color={tri.color} />
                          <Text style={styles.pointText}>{point}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
        <View style={styles.bottomSpacer} />
      </ScrollView>
      <FloatingChatButton navigation={navigation} />
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
  scrollContent: { padding: 20, paddingBottom: 90 },
  youAreHere: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8D5FF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  youAreHereText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6C5CE7',
    marginLeft: 8,
  },
  trimesterBlock: {
    marginBottom: 28,
    borderLeftWidth: 4,
    paddingLeft: 16,
  },
  trimesterHeader: { marginBottom: 14 },
  trimesterBadge: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  trimesterWeeks: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  trimesterTagline: {
    fontSize: 13,
    color: '#636E72',
    marginTop: 2,
  },
  moduleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  moduleCardOpen: {
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  moduleIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  moduleTitleWrap: { flex: 1 },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 4,
  },
  moduleFocus: {
    fontSize: 13,
    color: '#636E72',
    lineHeight: 19,
  },
  moduleBody: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  pointText: {
    flex: 1,
    fontSize: 14,
    color: '#2D3436',
    lineHeight: 20,
    marginLeft: 10,
  },
  bottomSpacer: { height: 24 },
});

export default TrimesterNutritionScreen;

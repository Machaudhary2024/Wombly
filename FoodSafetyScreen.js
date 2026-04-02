import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FloatingChatButton from './components/FloatingChatButton';

const SECTIONS = [
  {
    id: 'alcohol',
    title: 'Alcohol',
    icon: 'glass-wine',
    color: '#E53935',
    avoid: ['No amount of alcohol is safe during pregnancy. It can harm your baby. Avoid alcohol completely. If you need help to stop drinking, talk to your doctor or midwife.'],
    eat: [],
    limit: [],
  },
  {
    id: 'caffeine',
    title: 'Caffeine',
    icon: 'coffee',
    color: '#8D6E63',
    limit: ['Limit to about 200 mg per day. That\'s roughly: 1–2 cups of espresso, 2–3 cups of instant coffee, or 3–5 cups of tea (depending on strength). Too much may increase the risk of miscarriage or low birth weight.'],
    avoid: ['Energy drinks (e.g. Red Bull, V) that contain caffeine or guarana—best avoided when pregnant.'],
    eat: [],
  },
  {
    id: 'fish',
    title: 'Mercury & fish',
    icon: 'fish',
    color: '#26A69A',
    eat: ['1–3 serves of fish per week (about 150 g per serve). Small tins of tuna or salmon count as less than half a serve and are safe several times a week.', 'Freshly cooked seafood, including prawns and shellfish, is generally safe. Canned seafood is safe.'],
    avoid: ['Raw or undercooked fish and seafood.', 'Pre-cooked prawns that may not be freshly cooked.', 'Uncooked or smoked seafood (e.g. smoked salmon) unless it\'s canned.'],
    limit: ['Limit high-mercury fish: shark (flake), marlin, broadbill, swordfish, orange roughy, catfish. If you eat these, have them only once a fortnight (and no other fish that time) or once a week for orange roughy and catfish.'],
  },
  {
    id: 'liver',
    title: 'Vitamin A & liver',
    icon: 'food-drumstick',
    color: '#FF9800',
    eat: ['Other foods with vitamin A are safe. Pregnancy multivitamins use a safe form (e.g. beta carotene).'],
    avoid: [],
    limit: ['Liver has high retinol (vitamin A), which can harm the baby. Limit liver to no more than 50 g per week. Check non-pregnancy multivitamins for retinol—ask your pharmacist.'],
  },
  {
    id: 'listeria',
    title: 'Listeria (food infection)',
    icon: 'bacteria',
    color: '#7B1FA2',
    eat: ['Freshly prepared foods.', 'Cooked or reheated food until it\'s steaming hot.', 'Soft cheeses only when cooked in a dish (e.g. in a hot sauce).', 'Pâté and meat pastes in cans or jars are safe until opened; then refrigerate.'],
    avoid: ['Refrigerated ready-to-eat foods stored a long time.', 'Cold deli meats (ham, salami), cold cooked chicken—unless reheated until steaming hot (e.g. on a pizza).', 'Pre-prepared salads, coleslaws, fruit salads unless you know they\'re fresh.', 'Soft cheeses (brie, camembert, ricotta, feta, blue) unless cooked.', 'Soft-serve ice cream; unpasteurised dairy.', 'Raw or smoked seafood; pre-cooked prawns.'],
    limit: [],
  },
  {
    id: 'salmonella',
    title: 'Salmonella (eggs & sesame)',
    icon: 'egg',
    color: '#F9A825',
    eat: ['Eggs cooked until the yolk is firm.', 'Sesame that\'s been heated (e.g. sesame oil, seeds on bread).', 'Store-bought mayonnaise kept in the fridge and used by date.'],
    avoid: ['Raw or runny eggs.', 'Foods with raw egg (e.g. homemade mayo, aioli, mousse, uncooked cake batter).', 'Raw sesame seeds and products (tahini, halva, hummus) unless heat-treated.', 'Cracked eggs.'],
    limit: [],
  },
  {
    id: 'toxoplasmosis',
    title: 'Toxoplasmosis',
    icon: 'cat',
    color: '#43A047',
    eat: ['Meat cooked thoroughly.', 'Washed fruit and vegetables.'],
    avoid: ['Handling cat litter if possible—or wear gloves and wash hands well after.', 'Unwashed produce; raw or undercooked meat.'],
    limit: [],
  },
  {
    id: 'handling',
    title: 'Safe food handling',
    icon: 'hand-wash',
    color: '#1E88E5',
    eat: [
      'Wash hands before preparing or eating food.',
      'Use separate chopping boards for raw and cooked foods.',
      'Cook foods thoroughly; reheat leftovers until steaming hot.',
      'Refrigerate hot food as soon as it stops steaming; don\'t leave it on the bench.',
      'Eat refrigerated food within 2–4 hours of taking it out; if out 4+ hours, throw it out.',
      'Eat leftovers within 24 hours; reheat until steaming.',
      'Keep the fridge below 5°C; keep it clean; cover stored foods.',
      'Thaw frozen food in the fridge or microwave, not at room temperature.',
      'Store raw meat below other foods so juices don\'t drip.',
      'Keep eggs in the fridge. Check use-by dates.',
    ],
    avoid: [],
    limit: [],
  },
];

const FoodSafetyScreen = ({ navigation }) => {
  const [openId, setOpenId] = useState(null);

  return (
    <View style={styles.container}>
      <FloatingChatButton navigation={navigation} />
      <LinearGradient
        colors={['#FFE5F1', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#6C5CE7" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Food safety & hygiene</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>
          When you\'re pregnant, choosing and handling food carefully helps protect you and your baby. This guide is based on expert advice from the Royal Women\'s Hospital and the NHS.
        </Text>

        {SECTIONS.map((section) => {
          const isOpen = openId === section.id;
          const hasContent =
            section.eat.length > 0 || section.avoid.length > 0 || section.limit.length > 0;
          return (
            <View key={section.id} style={styles.sectionCard}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => setOpenId(isOpen ? null : section.id)}
                activeOpacity={0.85}
              >
                <View style={[styles.sectionIconWrap, { backgroundColor: section.color + '22' }]}>
                  <MaterialCommunityIcons name={section.icon} size={26} color={section.color} />
                </View>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <MaterialCommunityIcons
                  name={isOpen ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color="#636E72"
                />
              </TouchableOpacity>
              {isOpen && hasContent && (
                <View style={styles.sectionBody}>
                  {section.avoid.length > 0 && (
                    <View style={styles.block}>
                      <View style={styles.blockHeader}>
                        <MaterialCommunityIcons name="close-circle" size={20} color="#E53935" />
                        <Text style={[styles.blockTitle, { color: '#E53935' }]}>Avoid</Text>
                      </View>
                      {section.avoid.map((item, i) => (
                        <Text key={i} style={styles.blockItem}>• {item}</Text>
                      ))}
                    </View>
                  )}
                  {section.limit.length > 0 && (
                    <View style={styles.block}>
                      <View style={styles.blockHeader}>
                        <MaterialCommunityIcons name="alert-circle" size={20} color="#F9A825" />
                        <Text style={[styles.blockTitle, { color: '#F9A825' }]}>Limit</Text>
                      </View>
                      {section.limit.map((item, i) => (
                        <Text key={i} style={styles.blockItem}>• {item}</Text>
                      ))}
                    </View>
                  )}
                  {section.eat.length > 0 && (
                    <View style={styles.block}>
                      <View style={styles.blockHeader}>
                        <MaterialCommunityIcons name="check-circle" size={20} color="#43A047" />
                        <Text style={[styles.blockTitle, { color: '#43A047' }]}>Eat / Do</Text>
                      </View>
                      {section.eat.map((item, i) => (
                        <Text key={i} style={styles.blockItem}>• {item}</Text>
                      ))}
                    </View>
                  )}
                </View>
              )}
            </View>
          );
        })}

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
  intro: {
    fontSize: 15,
    color: '#2D3436',
    lineHeight: 22,
    marginBottom: 24,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  sectionIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#2D3436',
  },
  sectionBody: { paddingHorizontal: 16, paddingBottom: 16 },
  block: { marginTop: 14 },
  blockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  blockTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
  blockItem: {
    fontSize: 14,
    color: '#2D3436',
    lineHeight: 21,
    marginLeft: 28,
    marginBottom: 4,
  },
  bottomSpacer: { height: 24 },
});

export default FoodSafetyScreen;

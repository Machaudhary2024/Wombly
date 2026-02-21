import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FloatingChatButton from './components/FloatingChatButton';

const ToddlerMealsScreen = ({ navigation }) => {

  const trimesters = [
    {
      id: 1,
      title: 'Trimester 1',
      ageRange: '0-4 Months',
      icon: 'baby-bottle',
      color: '#FFE5F1',
      iconColor: '#FF6B9D',
      description: 'Milk-based nutrition - Foundation building phase',
    },
    {
      id: 2,
      title: 'Trimester 2',
      ageRange: '5-8 Months',
      icon: 'bowl-mix',
      color: '#D4E6F1',
      iconColor: '#3498DB',
      description: 'Introduction to solids - Exploration phase',
    },
    {
      id: 3,
      title: 'Trimester 3',
      ageRange: '9-12+ Months',
      icon: 'nutrition',
      color: '#D5F4E6',
      iconColor: '#27AE60',
      description: 'Diverse foods - Independence building phase',
    },
  ];

  const mealPlans = {
    1: {
      title: 'Trimester 1: 0-4 Months',
      subtitle: 'Pure Nutrition & Bonding',
      meals: [
        {
          id: 1,
          name: 'Breast Milk or Formula',
          icon: 'baby-bottle',
          frequency: '8-12 times daily',
          benefits: ['Complete nutrition', 'Antibodies & immunity', 'Brain development', 'Perfect digestion'],
          foods: [
            'Breast milk (recommended)',
            'Iron-fortified infant formula',
            'Vitamin D supplements (if needed)',
          ],
          tips: 'Feed on demand. Signs of hunger: rooting, hand to mouth, fussiness',
        },
        {
          id: 2,
          name: 'Hydration',
          icon: 'water-outline',
          frequency: 'On demand with feeding',
          benefits: ['Supports digestion', 'Temperature regulation', 'Kidney function'],
          foods: [
            'Water in breast milk/formula',
            'No additional water needed before 6 months',
          ],
          tips: 'Mother should drink plenty of water. Watch for proper wet diapers.',
        },
      ],
      healthTips: [
        'Iron Content: Breast milk provides 0.3mg/L iron; formula has 4-12mg/L. Essential for brain development and oxygen transport',
        'Calcium & Vitamin D: Breast milk has 200-300mg/L calcium. Vitamin D is crucial for bone development - supplement if needed',
        'DHA & Omega-3s: Present in breast milk; supports 60% of brain growth. Mother should eat fatty fish 2-3 times weekly if breastfeeding',
        'Protein Quality: Breast milk proteins are perfectly balanced (60% whey, 40% casein) for easy digestion and immunity',
        'Hydration & Electrolytes: Breast milk/formula contains optimal sodium, potassium ratios. Monitor wet diapers (6-8 daily)',
      ],
    },
    2: {
      title: 'Trimester 2: 5-8 Months',
      subtitle: 'Solids Introduction - Soft Foods Begin',
      meals: [
        {
          id: 1,
          name: 'Breast Milk or Formula (Primary)',
          icon: 'baby-bottle',
          frequency: '4-6 times daily',
          benefits: ['Still primary nutrition source', 'Immune support', 'Bonding'],
          foods: [
            'Breast milk (25-35 oz daily)',
            'Iron-fortified formula (25-35 oz daily)',
          ],
          tips: 'Continue breast/formula feeding as main nutrition',
        },
        {
          id: 2,
          name: 'Iron-Fortified Infant Cereal',
          icon: 'grain',
          frequency: 'Once daily, gradually increase',
          benefits: ['Essential iron source', 'Smooth texture easy to swallow', 'Introduction to flavors'],
          foods: [
            'Rice cereal (least allergenic)',
            'Oatmeal cereal',
            'Barley cereal',
          ],
          tips: 'Start with 1 tablespoon mixed with breast milk/formula. Increase thickness gradually.',
        },
        {
          id: 3,
          name: 'Soft Vegetable Purees',
          icon: 'leaf',
          frequency: '1-2 times daily',
          benefits: ['Vitamins & minerals', 'Early taste exploration', 'Gut health'],
          foods: [
            'Sweet potato (beta-carotene rich)',
            'Carrots (cooked, soft)',
            'Pumpkin (vitamin A)',
            'Squash (mild, digestible)',
            'Peas (protein & fiber)',
            'Green beans (gentle)',
          ],
          tips: 'Introduce one vegetable at a time. Wait 3-5 days before new food.',
        },
        {
          id: 4,
          name: 'Soft Fruit Purees',
          icon: 'apple',
          frequency: '1 time daily',
          benefits: ['Natural sugars for energy', 'Vitamin C for immunity', 'Fiber for digestion'],
          foods: [
            'Apple (iron content)',
            'Banana (potassium, easy to digest)',
            'Pear (natural laxative)',
            'Avocado (healthy fats)',
            'Peach (vitamin A)',
            'Prune (prevents constipation)',
          ],
          tips: 'Puree until smooth. Serve at room temperature.',
        },
      ],
      healthTips: [
        'Iron Fortification: Iron-fortified cereals provide 4-16mg/serving. Introduce by 6 months to prevent anemia. Continue breast milk as primary source',
        'Vitamin C for Iron Absorption: Pair iron-fortified cereals with fruit purees (apple, pear) to enhance iron absorption by 3-4x',
        'Calcium Introduction: Root vegetables like sweet potato, carrots provide 20-30mg calcium. Aim for 200-260mg daily from mixed sources',
        'Protein Development: Start with mild proteins from vegetables. Lentils (later) provide 9g protein/cooked cup. Rotate food sources daily',
        'Allergenic Foods: Introduce common allergens (soy, wheat, eggs) during this window for better tolerance building. Probiotics support gut health',
      ],
    },
    3: {
      title: 'Trimester 3: 9-12+ Months',
      subtitle: 'Advanced Nutrition - Self-Feeding Begins',
      meals: [
        {
          id: 1,
          name: 'Breast Milk or Formula (Reduced)',
          icon: 'baby-bottle',
          frequency: '2-3 times daily',
          benefits: ['Continued nutrition', 'Immune protection', 'Comfort & bonding'],
          foods: [
            'Breast milk (16-24 oz daily)',
            'Fortified formula (16-24 oz daily)',
          ],
          tips: 'Gradually reduce as solid food intake increases',
        },
        {
          id: 2,
          name: 'Soft Grains & Cereals',
          icon: 'bread-slice',
          frequency: '2-3 times daily',
          benefits: ['Energy source', 'B vitamins', 'Sustained fullness'],
          foods: [
            'Oatmeal (antioxidants)',
            'Wheat porridge',
            'Barley (mineral rich)',
            'Millet (hypoallergenic)',
            'Soft bread (small pieces)',
            'Pasta (small shapes)',
          ],
          tips: 'Offer soft, mashable pieces. Let baby self-feed with support.',
        },
        {
          id: 3,
          name: 'Protein-Rich Foods',
          icon: 'egg',
          frequency: '1-2 times daily',
          benefits: ['Muscle & brain development', 'Iron absorption', 'Growth support'],
          foods: [
            'Soft-cooked egg yolks (iron & choline)',
            'Yogurt (probiotics, calcium)',
            'Cheese (calcium, fat)',
            'Lentils (plant protein, fiber)',
            'Soft-cooked chicken (shredded)',
            'Tofu (easily digestible protein)',
            'Fish (omega-3 for brain)',
          ],
          tips: 'Start with egg yolk only. Introduce white after 12 months.',
        },
        {
          id: 4,
          name: 'Diverse Vegetables',
          icon: 'carrot',
          frequency: '2-3 times daily',
          benefits: ['Phytonutrients', 'Micronutrients', 'Digestive health'],
          foods: [
            'Broccoli (florets, soft)',
            'Spinach (iron fortified)',
            'Corn (vitamin C)',
            'Peas (protein & fiber)',
            'Tomato (lycopene)',
            'Zucchini (mild, easy digest)',
            'Beans (legumes, proteins)',
          ],
          tips: 'Steam vegetables until tender. Offer variety of colors.',
        },
        {
          id: 5,
          name: 'Fresh Fruits',
          icon: 'fruit-watermelon',
          frequency: '2 times daily',
          benefits: ['Natural vitamins', 'Antioxidants', 'Hydration'],
          foods: [
            'Orange slices (vitamin C immunity)',
            'Strawberries (antioxidants)',
            'Mango (vitamin A)',
            'Blueberries (brain health)',
            'Kiwi (digestion)',
            'Grapes (cut in quarters)',
            'Melon (hydration)',
          ],
          tips: 'Remove seeds, cut into safe sizes. Offer fresh, ripe fruits.',
        },
        {
          id: 6,
          name: 'Healthy Fats & Oils',
          icon: 'oil-can',
          frequency: 'Daily (small amounts)',
          benefits: ['Brain development', 'Vitamin absorption', 'Energy'],
          foods: [
            'Olive oil (omega-9)',
            'Coconut oil (immune support)',
            'Avocado (healthy fats)',
            'Ghee/butter (traditional)',
            'Nut butters (no whole nuts)',
          ],
          tips: 'Add small amounts to meals. No high-heat cooking.',
        },
      ],
      healthTips: [
        'Iron Sources Diversification: Combine plant iron (lentils 6.6mg/cup) with vitamin C. Eggs (7mg/100g) introduce heme iron. Reach 11mg daily by 12 months',
        'Calcium & Bone Health: Yogurt (110mg/100g), cheese (200-700mg/100g), leafy greens. Target 700mg daily for bone density and tooth development',
        'Protein Complete Chain: Eggs, yogurt, lentils, chicken. 13-19g daily. Combine plant + animal proteins for complete amino acid profile',
        'Healthy Fats for Brain: Avocado (3g omega-3/100g), fish oils, olive oil. Brain size increases 175% in first year - fats are critical',
        'Micronutrient Spectrum: Zinc (immunity), Selenium (antioxidants), B vitamins (energy). Rotate 20+ food colors weekly to ensure variety',
        'Sugar & Salt Prevention: <1g salt daily, no added sugar. Natural fruits provide adequate sugars for energy and development',
        'Transition Nutrition: At 12 months, baby needs 800-900 calories/day. Continue formula/breast milk (400-600 cal) + varied solids (300-400 cal)',
      ],
    },
  };

  const renderMealItem = ({ item }) => (
    <View style={styles.mealCard}>
      <LinearGradient
        colors={['#FFFFFF', '#F9F9F9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.mealGradient}
      >
        <View style={styles.mealHeader}>
          <View style={styles.mealIconContainer}>
            <MaterialCommunityIcons name={item.icon} size={32} color="#FF6B9D" />
          </View>
          <View style={styles.mealTitleContainer}>
            <Text style={styles.mealName}>{item.name}</Text>
            <Text style={styles.mealFrequency}>{item.frequency}</Text>
          </View>
        </View>

        <View style={styles.mealContent}>
          <Text style={styles.sectionTitle}>Benefits:</Text>
          <View style={styles.benefitsList}>
            {item.benefits.map((benefit, idx) => (
              <View key={idx} style={styles.benefitItem}>
                <MaterialCommunityIcons name="check-circle" size={16} color="#27AE60" />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Healthy Foods:</Text>
          <View style={styles.foodsList}>
            {item.foods.map((food, idx) => (
              <View key={idx} style={styles.foodItem}>
                <View style={styles.foodDot} />
                <Text style={styles.foodText}>{food}</Text>
              </View>
            ))}
          </View>

          <View style={styles.tipsContainer}>
            <MaterialCommunityIcons name="lightbulb" size={18} color="#F39C12" />
            <Text style={styles.tipsText}>{item.tips}</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  const handleTrimesterPress = (trimesterId) => {
    const trimesterData = trimesters.find(t => t.id === trimesterId);
    const mealPlanData = mealPlans[trimesterId];
    
    navigation.navigate('TrimesterDetails', {
      trimesterId,
      trimesterData,
      mealPlanData,
    });
  };

  const renderTrimesterCard = ({ item }) => (
    <TouchableOpacity
      style={styles.trimesterCard}
      onPress={() => handleTrimesterPress(item.id)}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={[item.color, item.color]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.trimesterGradient}
      >
        <View style={styles.trimesterContent}>
          <MaterialCommunityIcons 
            name={item.icon} 
            size={40} 
            color={item.iconColor}
            style={styles.trimesterIcon}
          />
          <View style={styles.trimesterTextContainer}>
            <Text style={styles.trimesterTitle}>{item.title}</Text>
            <Text style={styles.trimesterAge}>{item.ageRange}</Text>
            <Text style={styles.trimesterDesc}>{item.description}</Text>
          </View>
          <MaterialCommunityIcons 
            name="chevron-right" 
            size={24} 
            color={item.iconColor}
          />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF6B9D', '#9C27B0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Toddler Meal Plans</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.introSection}>
          <MaterialCommunityIcons name="food-apple" size={40} color="#FF6B9D" />
          <Text style={styles.introTitle}>Healthy Growth Through Nutrition</Text>
          <Text style={styles.introText}>
            Tap on any trimester to explore age-appropriate meal plans designed to support your baby's development
          </Text>
        </View>

        <View style={styles.trimesterContainer}>
          <Text style={styles.trimesterLabel}>Choose Your Baby's Stage</Text>
          <FlatList
            data={trimesters}
            renderItem={renderTrimesterCard}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </View>

        <View style={styles.infoSection}>
          <LinearGradient
            colors={['#E8D5FF', '#F3E5F5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.infoGradient}
          >
            <MaterialCommunityIcons name="information-outline" size={28} color="#FF6B9D" />
            <Text style={styles.infoTitle}>Quick Tips</Text>
            <Text style={styles.infoText}>
              Every baby is unique. Watch for your baby's hunger and fullness cues. Consult with your pediatrician before introducing new foods.
            </Text>
          </LinearGradient>
        </View>
      </ScrollView>
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
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 34,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  introSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 25,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3436',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  introText: {
    fontSize: 14,
    color: '#636E72',
    textAlign: 'center',
    lineHeight: 20,
  },
  trimesterContainer: {
    paddingHorizontal: 15,
    marginTop: 25,
    marginBottom: 20,
  },
  trimesterLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  trimesterCard: {
    marginBottom: 14,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  trimesterGradient: {
    padding: 0,
  },
  trimesterContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  trimesterIcon: {
    marginRight: 12,
  },
  trimesterTextContainer: {
    flex: 1,
  },
  trimesterTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 4,
  },
  trimesterAge: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF6B9D',
    marginBottom: 6,
  },
  trimesterDesc: {
    fontSize: 13,
    color: '#636E72',
    lineHeight: 18,
  },
  infoSection: {
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  infoGradient: {
    padding: 16,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B9D',
    marginTop: 10,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#6C5CE7',
    textAlign: 'center',
    lineHeight: 18,
  },
  mealCard: {
    marginBottom: 14,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mealGradient: {
    padding: 16,
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFE5F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  mealTitleContainer: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3436',
  },
  mealFrequency: {
    fontSize: 12,
    color: '#FF6B9D',
    marginTop: 2,
    fontWeight: '600',
  },
  mealContent: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6C5CE7',
    marginBottom: 8,
    marginTop: 10,
  },
  benefitsList: {
    marginLeft: 0,
    marginBottom: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  benefitText: {
    fontSize: 13,
    color: '#2D3436',
    marginLeft: 8,
  },
  foodsList: {
    marginBottom: 8,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  foodDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF6B9D',
    marginRight: 10,
  },
  foodText: {
    fontSize: 13,
    color: '#2D3436',
  },
  tipsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF9E6',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  tipsText: {
    fontSize: 12,
    color: '#856404',
    marginLeft: 8,
    flex: 1,
    fontStyle: 'italic',
  },
  tipsSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  tipsGradient: {
    borderRadius: 12,
    padding: 16,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipsSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F39C12',
    marginLeft: 10,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F39C12',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  tipNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tipItemText: {
    fontSize: 13,
    color: '#2D3436',
    flex: 1,
    lineHeight: 18,
  },
  nutritionGuideSection: {
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  nutritionGradient: {
    padding: 16,
    alignItems: 'center',
  },
  nutritionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B9D',
    marginTop: 10,
    marginBottom: 8,
  },
  nutritionText: {
    fontSize: 13,
    color: '#6C5CE7',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default ToddlerMealsScreen;

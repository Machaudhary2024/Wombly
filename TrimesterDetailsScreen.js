import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FloatingChatButton from './components/FloatingChatButton';

const TrimesterDetailsScreen = ({ navigation, route }) => {
  const { trimesterId, trimesterData, mealPlanData } = route.params;

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
        <Text style={styles.headerTitle}>Meal Plans</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Trimester Info Card */}
        <View style={styles.trimesterInfoCard}>
          <LinearGradient
            colors={['#E8D5FF', '#F3E5F5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.trimesterInfoGradient}
          >
            <MaterialCommunityIcons name="information-outline" size={32} color="#FF6B9D" />
            <Text style={styles.trimesterTitle}>{trimesterData.title}</Text>
            <Text style={styles.trimesterAgeRange}>{trimesterData.ageRange}</Text>
            <Text style={styles.trimesterDescription}>{trimesterData.description}</Text>
          </LinearGradient>
        </View>

        {/* Meal Plans Section */}
        <View style={styles.mealsSection}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="food-fork-drink" size={24} color="#FF6B9D" />
            <Text style={styles.planTitle}>{mealPlanData.title}</Text>
          </View>
          <Text style={styles.planSubtitle}>{mealPlanData.subtitle}</Text>

          <FlatList
            data={mealPlanData.meals}
            renderItem={renderMealItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </View>

        {/* Health Tips Section */}
        <View style={styles.tipsSection}>
          <LinearGradient
            colors={['#FFF9E6', '#FFF3CC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.tipsGradient}
          >
            <View style={styles.tipsHeader}>
              <MaterialCommunityIcons name="lightbulb-outline" size={24} color="#F39C12" />
              <Text style={styles.tipsSectionTitle}>Health Tips for This Stage</Text>
            </View>
            {mealPlanData.healthTips.map((tip, idx) => (
              <View key={idx} style={styles.tipItem}>
                <View style={styles.tipNumber}>
                  <Text style={styles.tipNumberText}>{idx + 1}</Text>
                </View>
                <Text style={styles.tipItemText}>{tip}</Text>
              </View>
            ))}
          </LinearGradient>
        </View>

        {/* Nutrition Guide */}
        <View style={styles.nutritionGuideSection}>
          <LinearGradient
            colors={['#E8D5FF', '#F3E5F5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.nutritionGradient}
          >
            <MaterialCommunityIcons name="heart-outline" size={28} color="#FF6B9D" />
            <Text style={styles.nutritionTitle}>Nutrition Guidelines</Text>
            <Text style={styles.nutritionText}>
              Every baby is unique. Watch for your baby's hunger and fullness cues. Consult with your pediatrician before introducing new foods, especially if there's a family history of allergies.
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
  trimesterInfoCard: {
    margin: 15,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  trimesterInfoGradient: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  trimesterTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2D3436',
    marginTop: 12,
    marginBottom: 6,
    textAlign: 'center',
  },
  trimesterAgeRange: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B9D',
    marginBottom: 12,
  },
  trimesterDescription: {
    fontSize: 14,
    color: '#636E72',
    textAlign: 'center',
    lineHeight: 20,
  },
  mealsSection: {
    paddingHorizontal: 15,
    marginTop: 10,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  planTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2D3436',
    marginLeft: 12,
  },
  planSubtitle: {
    fontSize: 14,
    color: '#FF6B9D',
    marginBottom: 16,
    fontWeight: '500',
    paddingHorizontal: 5,
  },
  mealCard: {
    marginBottom: 14,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
    marginHorizontal: 15,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
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

export default TrimesterDetailsScreen;

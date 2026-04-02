import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FloatingChatButton from './components/FloatingChatButton';

const buttons = [
  { title: 'Trimester Guide', icon: 'calendar-heart', color: '#9C27B0' },
  { title: 'Cultural Remedies', icon: 'hand-heart', color: '#6C5CE7' },
  { title: 'Cravings', icon: 'emoticon-happy-outline', color: '#FFA726' },
  { title: 'Food Safety & Hygiene', icon: 'shield-check', color: '#26A69A' },
];

const NutritionGuideScreen = ({ navigation, route }) => {
  const pregnancyWeek = route.params?.pregnancyWeek;
  const userEmail = route.params?.userEmail;

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
        <Text style={styles.headerTitle}>Get Nutrition Guidance</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.introLine}>
          Eat well for you and your baby—pick a topic below.
        </Text>
        {buttons.map((btn) => (
          <TouchableOpacity
            key={btn.title}
            style={styles.card}
            onPress={() => {
              if (btn.title === 'Cravings') {
                navigation.navigate('Cravings', { pregnancyWeek, userEmail });
              } else if (btn.title === 'Trimester Guide') {
                navigation.navigate('TrimesterNutrition', { pregnancyWeek, userEmail });
              } else if (btn.title === 'Food Safety & Hygiene') {
                navigation.navigate('FoodSafety');
              } else if (btn.title === 'Cultural Remedies') {
                navigation.navigate('CulturalRemedies');
              }
            }}
          >
            <View style={[styles.iconCircle, { backgroundColor: btn.color + '22' }]}>
              <MaterialCommunityIcons name={btn.icon} size={24} color={btn.color} />
            </View>
            <Text style={styles.cardTitle}>{btn.title}</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#636E72" />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FloatingChatButton navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#6C5CE7', flex: 1, textAlign: 'center' },
  headerSpacer: { width: 24 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 90 },
  introLine: {
    fontSize: 15,
    color: '#636E72',
    marginBottom: 18,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: '#2D3436' },
});

export default NutritionGuideScreen;

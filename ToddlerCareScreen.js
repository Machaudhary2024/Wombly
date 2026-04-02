import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FloatingChatButton from './components/FloatingChatButton';

const ToddlerCareScreen = ({ navigation, route }) => {
  const userName = route.params?.userName || '';
  const userEmail = route.params?.userEmail;
  const features = [
    {
      id: 1,
      title: 'View Toddler Meals',
      description: 'Healthy and nutritious meal plans for your toddler',
      icon: 'food-fork-drink',
      color: '#FFE5F1',
      iconColor: '#FF6B9D',
      screen: 'ToddlerMeals',
    },
    {
      id: 2,
      title: 'Get Hygiene Guidance',
      description: 'Learn best practices for keeping your toddler clean and healthy',
      icon: 'water-opacity',
      color: '#D4E6F1',
      iconColor: '#3498DB',
      screen: 'HygieneGuidance',
    },
    {
      id: 3,
      title: 'First Aid Guidance',
      description: 'Emergency response tips and first aid techniques for toddlers',
      icon: 'medical-bag',
      color: '#FADBD8',
      iconColor: '#E74C3C',
      screen: 'FirstAidGuidance',
    },
    {
      id: 4,
      title: 'Entertainment Module',
      description: 'Fun games, activities, and learning resources for your toddler',
      icon: 'gamepad-variant',
      color: '#F9E79F',
      iconColor: '#F39C12',
      screen: 'EntertainmentModule',
    },
  ];

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
        <Text style={styles.headerTitle}>Toddler Care</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      {/* Subtle welcome banner consistent with HomeScreen */}
      {userName ? (
        <View style={styles.subBannerWrap}>
          <LinearGradient
            colors={['#1E5DAB', '#2E7BC4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.subBanner}
          >
            <Text style={styles.subBannerText}>Welcome, {userName}!</Text>
          </LinearGradient>
        </View>
      ) : null}

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>
          Everything you need to care for and nurture your toddler
        </Text>

        {features.map((feature) => (
          <TouchableOpacity
            key={feature.id}
            style={styles.featureCard}
            activeOpacity={0.85}
            onPress={() => {
              if (feature.screen === 'EntertainmentModule') {
                navigation.navigate('EntertainmentModule', { userEmail, userName });
              } else if (feature.screen === 'ToddlerMeals') {
                navigation.navigate('ToddlerMeals', { userEmail, userName });
              } else if (feature.screen === 'FirstAidGuidance') {
                navigation.navigate('FirstAidGuidance', { userEmail, userName });
              } else if (feature.screen === 'HygieneGuidance') {
                navigation.navigate('HygieneGuidance', { userEmail, userName });
              }
              console.log(`Navigate to ${feature.screen}`);
            }}
          >
            <LinearGradient
              colors={['#FFFFFF', '#F8FAFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardGradient}
            >
              <View style={styles.cardContent}>
                <View style={[styles.iconCircle, { backgroundColor: feature.color }]}> 
                  <MaterialCommunityIcons 
                    name={feature.icon} 
                    size={40} 
                    color={feature.iconColor} 
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
                <MaterialCommunityIcons 
                  name="chevron-right" 
                  size={24} 
                  color={feature.iconColor}
                  style={styles.chevron}
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}

        {/* Motivational Section */}
        <View style={styles.motivationalCard}>
          <LinearGradient
            colors={['#FFE5F1', '#F3E5F5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.motivationalGradient}
          >
            <MaterialCommunityIcons name="heart" size={32} color="#FF6B9D" />
            <Text style={styles.motivationalText}>
              "Every stage of your toddler's growth is special. Cherish every moment!"
            </Text>
          </LinearGradient>
        </View>
      </ScrollView>
      <FloatingChatButton navigation={navigation} userEmail={userEmail} userName={userName} />
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
    padding: 20,
    paddingBottom: 90,
  },
  subtitle: {
    fontSize: 16,
    color: '#6C5CE7',
    textAlign: 'center',
    marginBottom: 25,
    fontWeight: '500',
  },
  subBannerWrap: {
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 8,
  },
  subBanner: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  subBannerText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  featureCard: {
    marginBottom: 15,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardGradient: {
    padding: 12,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 13,
    color: '#636E72',
    lineHeight: 18,
  },
  chevron: {
    marginLeft: 10,
  },
  motivationalCard: {
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  motivationalGradient: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  motivationalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6C5CE7',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
  },
});

export default ToddlerCareScreen;

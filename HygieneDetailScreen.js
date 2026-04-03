import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { API_BASE_URL } from './apiConfig';

const { width } = Dimensions.get('window');
const isTablet = width > 600;

const HygieneDetailScreen = ({ navigation, route }) => {
  const { categoryId, categoryTitle, categoryTips } = route.params;

  return (
    <View style={styles.container}>
      {/* Green Header with Back Button */}
      <LinearGradient
        colors={['#27AE60', '#229954']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{categoryTitle}</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tips */}
        {categoryTips && categoryTips.map((tip) => (
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
                <MaterialCommunityIcons name={tip.icon} size={22} color="#16A085" />
              </View>

              <Text style={styles.tipDescription}>{tip.description}</Text>

              {/* Details Box */}
              <View style={styles.detailsBox}>
                <View style={styles.detailsHeader}>
                  <MaterialCommunityIcons name="information" size={16} color="#16A085" />
                  <Text style={styles.detailsBoxTitle}>Key Details:</Text>
                </View>
                {tip.details && tip.details.map((detail, index) => (
                  <Text key={index} style={styles.detailItem}>
                    • {detail}
                  </Text>
                ))}
              </View>
            </LinearGradient>
          </View>
        ))}
      </ScrollView>
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
    fontSize: isTablet ? 22 : 18,
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
    padding: 20,
    paddingBottom: 30,
  },
  tipCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  tipGradient: {
    padding: 12,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tipNumberCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#16A085',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  tipNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tipTitleContainer: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 1,
  },
  tipDescription: {
    fontSize: 12,
    color: '#16A085',
    fontStyle: 'italic',
    marginBottom: 8,
    lineHeight: 18,
  },
  detailsBox: {
    backgroundColor: '#E8F8F5',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#16A085',
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailsBoxTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0B5345',
    marginLeft: 6,
  },
  detailItem: {
    fontSize: 12,
    color: '#145A32',
    marginBottom: 4,
    lineHeight: 16,
  },
  importantCard: {
    marginTop: 20,
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  importantGradient: {
    padding: 18,
  },
  noteIcon: {
    marginBottom: 10,
  },
  importantTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B8860B',
    marginBottom: 10,
  },
  importantText: {
    fontSize: 14,
    color: '#8B6914',
    lineHeight: 22,
  },
  doctorCard: {
    marginBottom: 30,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  doctorGradient: {
    padding: 18,
  },
  phoneIcon: {
    marginBottom: 10,
  },
  doctorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A93226',
    marginBottom: 10,
  },
  doctorText: {
    fontSize: 14,
    color: '#78281F',
    lineHeight: 22,
  },
});

export default HygieneDetailScreen;

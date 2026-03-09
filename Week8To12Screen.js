import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const Week8To12Screen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF6B9D', '#9C27B0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Weeks 8-12</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={['#E3F2FD', '#BBDEFB']}
              style={styles.heroIconBg}
            >
              <MaterialCommunityIcons name="calendar-month" size={50} color="#2196F3" />
            </LinearGradient>
          </View>
          <Text style={styles.heroTitle}>First Trimester</Text>
          <Text style={styles.heroSubtitle}>
            Weeks 8-12: Baby grows quickly and important tests take place
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBg, { backgroundColor: '#E8F5E9' }]}>
              <MaterialCommunityIcons name="baby-bottle" size={24} color="#4CAF50" />
            </View>
            <Text style={styles.sectionTitle}>About your baby</Text>
          </View>

          <Text style={styles.checklistText}>
            By 8–12 weeks your baby's main organs are forming and the heart is beating. Tiny arms and legs start to grow and the baby becomes more clearly an early fetus.
          </Text>

          <View style={[styles.sectionHeader, { marginTop: 20 }]}>
            <View style={[styles.sectionIconBg, { backgroundColor: '#FFF3E0' }]}>
              <MaterialCommunityIcons name="medal" size={24} color="#FF9800" />
            </View>
            <Text style={styles.sectionTitle}>Simple things you can do</Text>
          </View>

          <View style={styles.checklistItem}>
            <MaterialCommunityIcons name="hospital-box" size={20} color="#4CAF50" />
            <Text style={styles.checklistItemText}>Attend the antenatal booking appointment and do recommended blood tests and scans.</Text>
          </View>

          <View style={styles.checklistItem}>
            <MaterialCommunityIcons name="food-apple" size={20} color="#4CAF50" />
            <Text style={styles.checklistItemText}>Continue folic acid and eat a healthy, balanced diet.</Text>
          </View>

          <View style={styles.checklistItem}>
            <MaterialCommunityIcons name="alert-circle" size={20} color="#4CAF50" />
            <Text style={styles.checklistItemText}>Avoid raw or undercooked foods and limit caffeine.</Text>
          </View>

          <View style={styles.checklistItem}>
            <MaterialCommunityIcons name="pill" size={20} color="#4CAF50" />
            <Text style={styles.checklistItemText}>Talk to your healthcare provider about any medicines you take.</Text>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
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
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
  },
  iconContainer: {
    marginBottom: 15,
  },
  heroIconBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#636E72',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  checklistItemText: {
    flex: 1,
    fontSize: 15,
    color: '#2D3436',
    lineHeight: 22,
    marginLeft: 12,
  },
  checklistText: {
    fontSize: 15,
    color: '#2D3436',
    lineHeight: 24,
  },
  bottomSpacer: {
    height: 20,
  },
});

export default Week8To12Screen;

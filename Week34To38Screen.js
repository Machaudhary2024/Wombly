import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const Week34To38Screen = ({ navigation }) => {
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
        <Text style={styles.headerTitle}>Weeks 34-38</Text>
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
              colors={['#EDE7F6', '#D1C4E9']}
              style={styles.heroIconBg}
            >
              <MaterialCommunityIcons name="baby-face-outline" size={50} color="#673AB7" />
            </LinearGradient>
          </View>
          <Text style={styles.heroTitle}>Final Weeks</Text>
          <Text style={styles.heroSubtitle}>
            Weeks 34-38: Baby gets ready for birth — final checks and planning
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBg, { backgroundColor: '#E8D5FF' }]}>
              <MaterialCommunityIcons name="home-heart" size={24} color="#6C5CE7" />
            </View>
            <Text style={styles.sectionTitle}>About your baby</Text>
          </View>

          <Text style={styles.checklistText}>
            In the final weeks your baby continues to gain weight and move into position for birth. Organs finish maturing and your baby is preparing for life outside the womb.
          </Text>

          <View style={[styles.sectionHeader, { marginTop: 20 }]}>
            <View style={[styles.sectionIconBg, { backgroundColor: '#FFEBEE' }]}>
              <MaterialCommunityIcons name="phone" size={24} color="#F44336" />
            </View>
            <Text style={styles.sectionTitle}>Simple things you can do</Text>
          </View>

          <View style={styles.checklistItem}>
            <MaterialCommunityIcons name="alert-circle" size={20} color="#F44336" />
            <Text style={styles.checklistItemText}>Know labour signs and when to call your midwife or hospital.</Text>
          </View>

          <View style={styles.checklistItem}>
            <MaterialCommunityIcons name="phone" size={20} color="#F44336" />
            <Text style={styles.checklistItemText}>Keep your phone charged and have essential phone numbers ready.</Text>
          </View>

          <View style={styles.checklistItem}>
            <MaterialCommunityIcons name="bed" size={20} color="#F44336" />
            <Text style={styles.checklistItemText}>Rest, eat well and try to keep activity gentle; avoid long travel late in pregnancy.</Text>
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
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
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

export default Week34To38Screen;

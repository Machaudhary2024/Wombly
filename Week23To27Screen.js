import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const Week23To27Screen = ({ navigation }) => {
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
        <Text style={styles.headerTitle}>Weeks 23-27</Text>
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
              colors={['#FFF3E0', '#FFE0B2']}
              style={styles.heroIconBg}
            >
              <MaterialCommunityIcons name="baby-buggy" size={50} color="#FF9800" />
            </LinearGradient>
          </View>
          <Text style={styles.heroTitle}>Late Second Trimester</Text>
          <Text style={styles.heroSubtitle}>
            Weeks 23-27: Baby grows and prepares the lungs and muscles
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBg, { backgroundColor: '#FFFDE7' }]}>
              <MaterialCommunityIcons name="baby-bottle" size={24} color="#FFC107" />
            </View>
            <Text style={styles.sectionTitle}>About your baby</Text>
          </View>

          <Text style={styles.checklistText}>
            In weeks 23–27 your baby becomes stronger, adds weight and their lungs and nervous system mature further.
          </Text>

          <View style={[styles.sectionHeader, { marginTop: 20 }]}>
            <View style={[styles.sectionIconBg, { backgroundColor: '#E8F5E9' }]}>
              <MaterialCommunityIcons name="clipboard-check" size={24} color="#4CAF50" />
            </View>
            <Text style={styles.sectionTitle}>Simple things you can do</Text>
          </View>

          <View style={styles.checklistItem}>
            <MaterialCommunityIcons name="hospital-box" size={20} color="#FFC107" />
            <Text style={styles.checklistItemText}>Attend glucose screening and other routine tests if your clinic advises.</Text>
          </View>

          <View style={styles.checklistItem}>
            <MaterialCommunityIcons name="alert-circle" size={20} color="#FFC107" />
            <Text style={styles.checklistItemText}>Watch for swelling or severe headaches and report them.</Text>
          </View>

          <View style={styles.checklistItem}>
            <MaterialCommunityIcons name="baby-bottle" size={20} color="#FFC107" />
            <Text style={styles.checklistItemText}>Start planning breastfeeding and postnatal support.</Text>
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
    backgroundColor: '#FFFDE7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
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

export default Week23To27Screen;

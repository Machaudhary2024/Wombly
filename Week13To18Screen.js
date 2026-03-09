import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const Week13To18Screen = ({ navigation }) => {
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
        <Text style={styles.headerTitle}>Weeks 13-18</Text>
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
              colors={['#F3E5F5', '#E1BEE7']}
              style={styles.heroIconBg}
            >
              <MaterialCommunityIcons name="baby-face-outline" size={50} color="#9C27B0" />
            </LinearGradient>
          </View>

          <Text style={styles.heroTitle}>Second Trimester</Text>
          <Text style={styles.heroSubtitle}>
            Weeks 13-18: Baby grows quickly and you may feel changes
          </Text>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconBg, { backgroundColor: '#E1F5FE' }]}>
                <MaterialCommunityIcons name="emoticon-happy" size={24} color="#03A9F4" />
              </View>
              <Text style={styles.sectionTitle}>About your baby</Text>
            </View>

            <Text style={styles.checklistText}>
              In weeks 13–18 your baby grows quickly and becomes more active. Organs continue to develop and movements may start to be noticeable later in this period.
            </Text>

            <View style={[styles.sectionHeader, { marginTop: 20 }]}>
              <View style={[styles.sectionIconBg, { backgroundColor: '#E8F5E9' }]}>
                <MaterialCommunityIcons name="run" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.sectionTitle}>Simple things you can do</Text>
            </View>

            <View style={styles.checklistItem}>
              <MaterialCommunityIcons name="calendar-check" size={20} color="#03A9F4" />
              <Text style={styles.checklistItemText}>Keep up with antenatal appointments and scans as arranged by your clinic.</Text>
            </View>

            <View style={styles.checklistItem}>
              <MaterialCommunityIcons name="run" size={20} color="#03A9F4" />
              <Text style={styles.checklistItemText}>Stay active with gentle exercise, eat well and drink plenty of fluids.</Text>
            </View>

            <View style={styles.checklistItem}>
              <MaterialCommunityIcons name="pill" size={20} color="#03A9F4" />
              <Text style={styles.checklistItemText}>Continue any supplements (iron, folic acid) your provider recommends.</Text>
            </View>

            <View style={styles.checklistItem}>
              <MaterialCommunityIcons name="syringe" size={20} color="#03A9F4" />
              <Text style={styles.checklistItemText}>Ask your midwife or doctor about any vaccinations or tests recommended at this stage.</Text>
            </View>
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
    backgroundColor: '#E1F5FE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#03A9F4',
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

export default Week13To18Screen;

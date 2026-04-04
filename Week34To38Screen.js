import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const Week34To38Screen = ({ navigation }) => {
  console.log('Week34To38Screen rendered!', navigation ? 'Navigation available' : 'No navigation');
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#f0cfe3', '#de81fa']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#961e46" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Weeks 34-38</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
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
            Weeks 34-38: Almost there!
          </Text>
        </View>

        {/* Essentials Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBg, { backgroundColor: '#E8F5E9' }]}>
              <MaterialCommunityIcons name="check-circle" size={24} color="#4CAF50" />
            </View>
            <Text style={styles.sectionTitle}>Essentials</Text>
          </View>

          {/* Non-Critical Titers Card */}
          <View style={styles.titerCard}>
            <View style={styles.titerHeader}>
              <MaterialCommunityIcons name="test-tube" size={28} color="#2196F3" />
              <Text style={styles.titerTitle}>If Your Titers Are Not Critical</Text>
            </View>
            <Text style={styles.titerText}>
              Beginning at <Text style={styles.boldText}>36 weeks</Text>, titers are drawn <Text style={styles.boldText}>every week</Text> until delivery.
            </Text>
          </View>

          {/* Critical Titers Card */}
          <View style={styles.criticalCard}>
            <View style={styles.criticalHeader}>
              <MaterialCommunityIcons name="alert-circle" size={28} color="#FF6B9D" />
              <Text style={styles.criticalTitle}>If Your Titers Are Critical</Text>
            </View>
            <View style={styles.mcaScanCard}>
              <MaterialCommunityIcons name="ultrasound" size={24} color="#2196F3" />
              <Text style={styles.mcaScanText}>
                Continue having <Text style={styles.boldText}>weekly MCA scans</Text>.
              </Text>
            </View>
          </View>

          {/* Everyone Section */}
          <View style={styles.everyoneCard}>
            <View style={styles.everyoneHeader}>
              <MaterialCommunityIcons name="account-group" size={28} color="#6C5CE7" />
              <Text style={styles.everyoneTitle}>For Everyone</Text>
            </View>
            
            <View style={styles.checklistItem}>
              <MaterialCommunityIcons name="heart" size={24} color="#4CAF50" />
              <View style={styles.checklistContent}>
                <Text style={styles.checklistTitle}>Weekly Nonstress Tests (NST) and Biophysical Profiles (BPP)</Text>
                <Text style={styles.checklistText}>
                  Begin weekly nonstress tests (NST) and biophysical profiles (BPP).
                </Text>
              </View>
            </View>

            <View style={styles.checklistItem}>
              <MaterialCommunityIcons name="calendar-check" size={24} color="#673AB7" />
              <View style={styles.checklistContent}>
                <Text style={styles.checklistTitle}>Delivery Plan Discussion</Text>
                <Text style={styles.checklistText}>
                  Discuss your delivery plan with your MFM and OB.
                </Text>
              </View>
            </View>

            <View style={styles.checklistItem}>
              <MaterialCommunityIcons name="hospital-building" size={24} color="#FF9800" />
              <View style={styles.checklistContent}>
                <Text style={styles.checklistTitle}>NICU Tour</Text>
                <Text style={styles.checklistText}>
                  Take a tour of the NICU if you haven't already.
                </Text>
              </View>
            </View>

            <View style={styles.checklistItem}>
              <MaterialCommunityIcons name="bag-personal" size={24} color="#E91E63" />
              <View style={styles.checklistContent}>
                <Text style={styles.checklistTitle}>Pack and Bring Your Bags</Text>
                <Text style={styles.checklistText}>
                  Double check that your bags are all packed and ready to go. Bring your bag with you when you go to every appointment.
                </Text>
              </View>
            </View>

            <View style={styles.checklistItem}>
              <MaterialCommunityIcons name="book-open-variant" size={24} color="#2196F3" />
              <View style={styles.checklistContent}>
                <Text style={styles.checklistTitle}>Learn About Baby's Care</Text>
                <Text style={styles.checklistText}>
                  Begin reading about the care and testing that baby will need after birth.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Be Aware Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBg, { backgroundColor: '#FFF3E0' }]}>
              <MaterialCommunityIcons name="alert" size={24} color="#FF9800" />
            </View>
            <Text style={styles.sectionTitle}>Be Aware</Text>
          </View>
          
          <View style={styles.deliveryWarningCard}>
            <MaterialCommunityIcons name="information" size={28} color="#FF9800" />
            <View style={styles.deliveryWarningContent}>
              <Text style={styles.deliveryWarningTitle}>MCA Scans and Delivery Timing</Text>
              
              <View style={styles.mcaReliabilityBox}>
                <MaterialCommunityIcons name="alert-circle" size={24} color="#F44336" />
                <Text style={styles.mcaReliabilityText}>
                  MCA scans become <Text style={styles.boldText}>less reliable after 38 weeks</Text>.
                </Text>
              </View>

              <View style={styles.recommendationBox}>
                <MaterialCommunityIcons name="hospital" size={28} color="#673AB7" />
                <View style={styles.recommendationContent}>
                  <Text style={styles.recommendationTitle}>Delivery Recommendation</Text>
                  <Text style={styles.recommendationText}>
                    <Text style={styles.boldText}>ACOG, RCOG, and SMFM</Text> recommend for all alloimmunized women regardless of titers, to deliver by <Text style={styles.boldText}>37-38 weeks</Text> unless baby is antigen negative.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Silver Lining Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBg, { backgroundColor: '#E1F5FE' }]}>
              <MaterialCommunityIcons name="weather-sunny" size={24} color="#03A9F4" />
            </View>
            <Text style={styles.sectionTitle}>Silver Lining</Text>
          </View>
          
          <View style={styles.successCard}>
            <MaterialCommunityIcons name="trophy" size={40} color="#FFC107" />
            <View style={styles.successContent}>
              <Text style={styles.successTitle}>You Made It!</Text>
              <Text style={styles.successText}>
                Your baby can now be delivered with <Text style={styles.boldText}>little to no preemie issues</Text> to deal with. You made it!
              </Text>
            </View>
          </View>
        </View>

        {/* Visual Elements */}
        <View style={styles.visualSection}>
          <View style={styles.visualCard}>
            <MaterialCommunityIcons name="heart" size={40} color="#4CAF50" />
            <Text style={styles.visualTitle}>Weekly Tests</Text>
            <Text style={styles.visualText}>
              NST and BPP begin this period
            </Text>
          </View>
          
          <View style={styles.visualCard}>
            <MaterialCommunityIcons name="hospital" size={40} color="#673AB7" />
            <Text style={styles.visualTitle}>Delivery Ready</Text>
            <Text style={styles.visualText}>
              Recommended delivery by 37-38 weeks
            </Text>
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
  titerCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  titerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  titerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginLeft: 10,
  },
  titerText: {
    fontSize: 15,
    color: '#2D3436',
    lineHeight: 24,
  },
  criticalCard: {
    backgroundColor: '#FFF5F7',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B9D',
  },
  criticalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  criticalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginLeft: 10,
  },
  mcaScanCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mcaScanText: {
    flex: 1,
    fontSize: 15,
    color: '#2D3436',
    lineHeight: 24,
    marginLeft: 12,
  },
  everyoneCard: {
    backgroundColor: '#F3E5F5',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
  },
  everyoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  everyoneTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginLeft: 10,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
  },
  checklistContent: {
    flex: 1,
    marginLeft: 12,
  },
  checklistTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 6,
  },
  checklistText: {
    fontSize: 14,
    color: '#2D3436',
    lineHeight: 22,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#FF6B9D',
  },
  deliveryWarningCard: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 18,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  deliveryWarningContent: {
    flex: 1,
    marginLeft: 12,
  },
  deliveryWarningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 15,
  },
  mcaReliabilityBox: {
    backgroundColor: '#FFEBEE',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F44336',
  },
  mcaReliabilityText: {
    flex: 1,
    fontSize: 15,
    color: '#2D3436',
    lineHeight: 24,
    marginLeft: 12,
  },
  recommendationBox: {
    backgroundColor: '#EDE7F6',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 2,
    borderColor: '#673AB7',
  },
  recommendationContent: {
    flex: 1,
    marginLeft: 12,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 15,
    color: '#2D3436',
    lineHeight: 24,
  },
  successCard: {
    backgroundColor: '#FFF9C4',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  successContent: {
    flex: 1,
    marginLeft: 12,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 8,
  },
  successText: {
    fontSize: 16,
    color: '#2D3436',
    lineHeight: 24,
  },
  visualSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 20,
  },
  visualCard: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  visualTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
    marginTop: 10,
    marginBottom: 6,
  },
  visualText: {
    fontSize: 12,
    color: '#636E72',
    textAlign: 'center',
    lineHeight: 18,
  },
  bottomSpacer: {
    height: 20,
  },
});

export default Week34To38Screen;

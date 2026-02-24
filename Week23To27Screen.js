import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import FloatingChatButton from './components/FloatingChatButton';

const Week23To27Screen = ({ navigation }) => {
  console.log('Week23To27Screen rendered!', navigation ? 'Navigation available' : 'No navigation');
  
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
        <Text style={styles.headerTitle}>Weeks 23-27</Text>
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
              colors={['#FFF3E0', '#FFE0B2']}
              style={styles.heroIconBg}
            >
              <MaterialCommunityIcons name="baby-buggy" size={50} color="#FF9800" />
            </LinearGradient>
          </View>
          <Text style={styles.heroTitle}>Viability Milestone</Text>
          <Text style={styles.heroSubtitle}>
            Weeks 23-27: Baby is now viable
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
            <View style={styles.titerContent}>
              <Text style={styles.titerText}>
                Titer assessments should increase to <Text style={styles.boldText}>every 2 weeks</Text> starting at <Text style={styles.boldText}>24 weeks</Text>.
              </Text>
            </View>
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
            
            <View style={styles.nicuCard}>
              <MaterialCommunityIcons name="hospital-building" size={32} color="#FF9800" />
              <View style={styles.nicuContent}>
                <Text style={styles.nicuTitle}>NICU Tour</Text>
                <Text style={styles.nicuText}>
                  Consider setting up a tour of the NICU if you think one might help prepare you for your baby's possible NICU stay.
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
          
          <View style={styles.steroidsCard}>
            <MaterialCommunityIcons name="information" size={28} color="#FF9800" />
            <View style={styles.steroidsContent}>
              <Text style={styles.steroidsTitle}>Steroids and MCA Scans</Text>
              <Text style={styles.steroidsText}>
                Now that the baby is viable, your MFMs might be considering using <Text style={styles.boldText}>steroids</Text> to help develop the baby's lungs if the baby starts showing signs of fetal anemia or if an IUT is coming up.
              </Text>
              
              <View style={styles.warningBox}>
                <MaterialCommunityIcons name="alert-circle" size={24} color="#F44336" />
                <View style={styles.warningBoxContent}>
                  <Text style={styles.warningBoxTitle}>Important Warning</Text>
                  <Text style={styles.warningBoxText}>
                    Be aware that <Text style={styles.boldText}>steroids can artificially lower MCA scan results</Text>.
                  </Text>
                  <Text style={styles.warningBoxRecommendation}>
                    The best course of action is to only administer steroids <Text style={styles.boldText}>after the decision to have an IUT has been made</Text>.
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
          
          <View style={styles.viabilityCard}>
            <MaterialCommunityIcons name="trophy" size={40} color="#FFC107" />
            <View style={styles.viabilityContent}>
              <Text style={styles.viabilityTitle}>Viability Milestone Achieved!</Text>
              <Text style={styles.viabilityText}>
                Your baby is now considered <Text style={styles.boldText}>viable</Text> and could possibly survive outside of the womb if born now. This is a huge milestone to be celebrated!
              </Text>
            </View>
          </View>

          <View style={styles.survivalCard}>
            <MaterialCommunityIcons name="chart-line" size={32} color="#4CAF50" />
            <View style={styles.survivalContent}>
              <Text style={styles.survivalTitle}>Every Week Counts</Text>
              <Text style={styles.survivalText}>
                Every week longer in the womb means a <Text style={styles.boldText}>higher survival rate</Text> for the baby.
              </Text>
            </View>
          </View>
        </View>

        {/* Visual Elements */}
        <View style={styles.visualSection}>
          <View style={styles.visualCard}>
            <MaterialCommunityIcons name="calendar-clock" size={40} color="#FF9800" />
            <Text style={styles.visualTitle}>More Frequent Tests</Text>
            <Text style={styles.visualText}>
              Titer tests increase to every 2 weeks at 24 weeks
            </Text>
          </View>
          
          <View style={styles.visualCard}>
            <MaterialCommunityIcons name="hospital-building" size={40} color="#2196F3" />
            <Text style={styles.visualTitle}>NICU Prep</Text>
            <Text style={styles.visualText}>
              Consider touring the NICU to prepare
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
      <FloatingChatButton navigation={navigation} />
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
  titerContent: {
    marginTop: 8,
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
  nicuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  nicuContent: {
    flex: 1,
    marginLeft: 12,
  },
  nicuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 8,
  },
  nicuText: {
    fontSize: 15,
    color: '#2D3436',
    lineHeight: 24,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#FF6B9D',
  },
  steroidsCard: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 18,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  steroidsContent: {
    flex: 1,
    marginLeft: 12,
  },
  steroidsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 10,
  },
  steroidsText: {
    fontSize: 15,
    color: '#2D3436',
    lineHeight: 24,
    marginBottom: 15,
  },
  warningBox: {
    backgroundColor: '#FFEBEE',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 2,
    borderColor: '#F44336',
  },
  warningBoxContent: {
    flex: 1,
    marginLeft: 12,
  },
  warningBoxTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C62828',
    marginBottom: 8,
  },
  warningBoxText: {
    fontSize: 14,
    color: '#2D3436',
    lineHeight: 22,
    marginBottom: 8,
  },
  warningBoxRecommendation: {
    fontSize: 14,
    color: '#2D3436',
    lineHeight: 22,
    fontWeight: '600',
  },
  viabilityCard: {
    backgroundColor: '#FFF9C4',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  viabilityContent: {
    flex: 1,
    marginLeft: 12,
  },
  viabilityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 8,
  },
  viabilityText: {
    fontSize: 15,
    color: '#2D3436',
    lineHeight: 24,
  },
  survivalCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  survivalContent: {
    flex: 1,
    marginLeft: 12,
  },
  survivalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 8,
  },
  survivalText: {
    fontSize: 15,
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

export default Week23To27Screen;

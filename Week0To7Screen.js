import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const Week0To7Screen = ({ navigation }) => {
  console.log('Week0To7Screen rendered!', navigation ? 'Navigation available' : 'No navigation');
  
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
        <Text style={styles.headerTitle}>Weeks 0-7</Text>
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
              colors={['#FFE5F1', '#F3E5F5']}
              style={styles.heroIconBg}
            >
              <MaterialCommunityIcons name="calendar-start" size={50} color="#FF6B9D" />
            </LinearGradient>
          </View>
          <Text style={styles.heroTitle}>Early Pregnancy</Text>
          <Text style={styles.heroSubtitle}>
            Weeks 0-7: Your journey begins
          </Text>
        </View>

        {/* Essentials Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBg, { backgroundColor: '#FFE5F1' }]}>
              <MaterialCommunityIcons name="check-circle" size={24} color="#FF6B9D" />
            </View>
            <Text style={styles.sectionTitle}>Essentials</Text>
          </View>

          {/* High-Risk Group Card */}
          <View style={styles.highRiskCard}>
            <View style={styles.highRiskHeader}>
              <MaterialCommunityIcons name="alert-circle" size={28} color="#FF6B9D" />
              <Text style={styles.highRiskTitle}>High-Risk Situations</Text>
            </View>
            <Text style={styles.highRiskText}>
              If you have had a previous pregnancy that was severely affected, have lost a baby to HDFN, or if your titers are in the hundreds/thousands:
            </Text>
            <View style={styles.recommendationCard}>
              <MaterialCommunityIcons name="hospital-box" size={24} color="#4CAF50" />
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationTitle}>Early MFM Appointment Recommended</Text>
                <Text style={styles.recommendationText}>
                  It is recommended that you have your first appointment with your MFM as early as possible. Certain treatments such as{' '}
                  <Text style={styles.boldText}>plasmapheresis</Text> and <Text style={styles.boldText}>IVIG</Text>, must be scheduled during this time period and can take weeks to be approved by insurance companies.
                </Text>
                <Text style={styles.recommendationSubtext}>
                  Because these treatments are very time sensitive and are the most effective when started by a certain gestation, getting in to see your MFM early in the pregnancy is a great way to keep your baby safe.
                </Text>
              </View>
            </View>
          </View>

          {/* Everyone Section */}
          <View style={styles.everyoneCard}>
            <View style={styles.everyoneHeader}>
              <MaterialCommunityIcons name="account-group" size={28} color="#6C5CE7" />
              <Text style={styles.everyoneTitle}>For Everyone</Text>
            </View>
            
            <View style={styles.checklistItem}>
              <MaterialCommunityIcons name="test-tube" size={24} color="#4CAF50" />
              <View style={styles.checklistContent}>
                <Text style={styles.checklistTitle}>Antibody Screen and Titer Check</Text>
                <Text style={styles.checklistText}>
                  You should be given an antibody screen and your titers should be checked.
                </Text>
              </View>
            </View>

            <View style={styles.checklistItem}>
              <MaterialCommunityIcons name="ultrasound" size={24} color="#2196F3" />
              <View style={styles.checklistContent}>
                <Text style={styles.checklistTitle}>Dating Ultrasound</Text>
                <Text style={styles.checklistText}>
                  Early ultrasounds are the most accurate for dating purposes so it is helpful to have a dating ultrasound, especially if you aren't sure about the dates of conception or your last menstrual period.
                </Text>
                <Text style={styles.checklistSubtext}>
                  Knowing the baby's accurate due date is very important during an alloimmunized pregnancy since many of the essential monitoring protocols and treatments are based on gestational age.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Be Aware Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBg, { backgroundColor: '#F3E5F5' }]}>
              <MaterialCommunityIcons name="alert" size={24} color="#9C27B0" />
            </View>
            <Text style={styles.sectionTitle}>Be Aware</Text>
          </View>
          
          <View style={styles.warningCard}>
            <MaterialCommunityIcons name="information" size={28} color="#FF9800" />
            <View style={styles.warningContent}>
              <Text style={styles.warningText}>
                <Text style={styles.boldText}>Miscarriages at this stage can sensitize a woman to develop alloantibodies.</Text>
              </Text>
              <Text style={styles.warningSubtext}>
                First trimester bleeding for any reason requires <Text style={styles.boldText}>Rh Immune Globulin (RhoGAM)</Text> if you are Rh negative, unless you already have anti-D antibodies.
              </Text>
            </View>
          </View>
        </View>

        {/* Silver Lining Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBg, { backgroundColor: '#E8D5FF' }]}>
              <MaterialCommunityIcons name="weather-sunny" size={24} color="#6C5CE7" />
            </View>
            <Text style={styles.sectionTitle}>Silver Lining</Text>
          </View>
          
          <View style={styles.positiveCard}>
            <MaterialCommunityIcons name="shield-check" size={40} color="#4CAF50" />
            <View style={styles.positiveContent}>
              <Text style={styles.positiveTitle}>Your Baby is Safe</Text>
              <Text style={styles.positiveText}>
                Your baby is completely safe from your antibodies at this point. Red cell antibodies cannot harm the baby during this time period so rest in the fact that your baby is safe from your antibodies right now.
              </Text>
            </View>
          </View>
        </View>

        {/* Visual Elements */}
        <View style={styles.visualSection}>
          <View style={styles.visualCard}>
            <MaterialCommunityIcons name="clock-fast" size={40} color="#FF6B9D" />
            <Text style={styles.visualTitle}>Time Sensitive</Text>
            <Text style={styles.visualText}>
              Early appointments and treatments are crucial for high-risk pregnancies
            </Text>
          </View>
          
          <View style={styles.visualCard}>
            <MaterialCommunityIcons name="heart" size={40} color="#4CAF50" />
            <Text style={styles.visualTitle}>Safe Period</Text>
            <Text style={styles.visualText}>
              Your baby is protected from antibodies during these early weeks
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
    backgroundColor: '#F5F0FF',
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
    color: '#961e46',
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
  highRiskCard: {
    backgroundColor: '#FFF5F7',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B9D',
  },
  highRiskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  highRiskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginLeft: 10,
  },
  highRiskText: {
    fontSize: 15,
    color: '#2D3436',
    lineHeight: 24,
    marginBottom: 15,
  },
  recommendationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  recommendationContent: {
    flex: 1,
    marginLeft: 12,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: '#2D3436',
    lineHeight: 22,
    marginBottom: 8,
  },
  recommendationSubtext: {
    fontSize: 13,
    color: '#636E72',
    lineHeight: 20,
    fontStyle: 'italic',
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
    marginBottom: 15,
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
  checklistSubtext: {
    fontSize: 13,
    color: '#636E72',
    lineHeight: 20,
    marginTop: 6,
    fontStyle: 'italic',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#FF6B9D',
  },
  warningCard: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 18,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  warningContent: {
    flex: 1,
    marginLeft: 12,
  },
  warningText: {
    fontSize: 15,
    color: '#2D3436',
    lineHeight: 24,
    marginBottom: 8,
  },
  warningSubtext: {
    fontSize: 14,
    color: '#636E72',
    lineHeight: 22,
  },
  positiveCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  positiveContent: {
    flex: 1,
    marginLeft: 12,
  },
  positiveTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 8,
  },
  positiveText: {
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

export default Week0To7Screen;

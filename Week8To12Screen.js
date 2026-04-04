import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const Week8To12Screen = ({ navigation }) => {
  console.log('Week8To12Screen rendered!', navigation ? 'Navigation available' : 'No navigation');
  
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
        <Text style={styles.headerTitle}>Weeks 8-12</Text>
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
              colors={['#E3F2FD', '#BBDEFB']}
              style={styles.heroIconBg}
            >
              <MaterialCommunityIcons name="calendar-month" size={50} color="#2196F3" />
            </LinearGradient>
          </View>
          <Text style={styles.heroTitle}>First Trimester</Text>
          <Text style={styles.heroSubtitle}>
            Weeks 8-12: Important testing and monitoring
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
              You should be having your first or second titer test now.
            </Text>
          </View>

          {/* Critical Titers Card */}
          <View style={styles.criticalCard}>
            <View style={styles.criticalHeader}>
              <MaterialCommunityIcons name="alert-circle" size={28} color="#FF6B9D" />
              <Text style={styles.criticalTitle}>If Your Titers Are Critical</Text>
            </View>
            <Text style={styles.criticalText}>
              For those having plasmapheresis and IVIG treatments:
            </Text>
            
            <View style={styles.treatmentTimeline}>
              <View style={styles.treatmentItem}>
                <View style={styles.treatmentIconBg}>
                  <MaterialCommunityIcons name="water" size={24} color="#2196F3" />
                </View>
                <View style={styles.treatmentContent}>
                  <Text style={styles.treatmentTitle}>Plasmapheresis</Text>
                  <Text style={styles.treatmentText}>
                    Recommended between <Text style={styles.boldText}>10-11 weeks</Text>
                  </Text>
                </View>
              </View>

              <View style={styles.treatmentItem}>
                <View style={[styles.treatmentIconBg, { backgroundColor: '#FFE5F1' }]}>
                  <MaterialCommunityIcons name="needle" size={24} color="#FF6B9D" />
                </View>
                <View style={styles.treatmentContent}>
                  <Text style={styles.treatmentTitle}>IVIG</Text>
                  <Text style={styles.treatmentText}>
                    Should start immediately after plasmapheresis is finished (<Text style={styles.boldText}>11-12 weeks</Text>)
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.portInfoCard}>
              <MaterialCommunityIcons name="hospital-building" size={24} color="#6C5CE7" />
              <Text style={styles.portInfoText}>
                Some women have a <Text style={styles.boldText}>port</Text> or a <Text style={styles.boldText}>permacath</Text> (or both) surgically implanted before starting treatments.
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
              <MaterialCommunityIcons name="account-heart" size={24} color="#FF6B9D" />
              <View style={styles.checklistContent}>
                <Text style={styles.checklistTitle}>Partner's Blood Testing</Text>
                <Text style={styles.checklistText}>
                  If this is your first sensitized pregnancy, or first pregnancy with your partner, now is the time to have your partner's blood tested for the antigens.
                </Text>
                <Text style={styles.checklistSubtext}>
                  The baby's father should be <Text style={styles.boldText}>phenotyped</Text> for any of the matching antigens that you have antibodies to. For example, if you tested positive for anti-Kell antibodies, your partner needs to be tested for the Kell antigen.
                </Text>
                <Text style={styles.checklistNote}>
                  This test can be done by your MFM, regular OB or your partner's regular doctor.
                </Text>
              </View>
            </View>

            <View style={styles.checklistItem}>
              <MaterialCommunityIcons name="calendar-clock" size={24} color="#2196F3" />
              <View style={styles.checklistContent}>
                <Text style={styles.checklistTitle}>First MFM Appointment</Text>
                <Text style={styles.checklistText}>
                  You should be arranging your first MFM appointment now.
                </Text>
              </View>
            </View>

            <View style={styles.checklistItem}>
              <MaterialCommunityIcons name="dna" size={24} color="#4CAF50" />
              <View style={styles.checklistContent}>
                <Text style={styles.checklistTitle}>Cell Free Fetal DNA Testing</Text>
                <Text style={styles.checklistText}>
                  You can have <Text style={styles.boldText}>cell free fetal DNA (cffDNA)</Text> testing to determine fetal antigen status.
                </Text>
                <Text style={styles.checklistLink}>More information here</Text>
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
          
          <View style={styles.warningCard}>
            <MaterialCommunityIcons name="information" size={28} color="#FF9800" />
            <View style={styles.warningContent}>
              <Text style={styles.warningTitle}>Important: Antigen vs Antibody Testing</Text>
              <Text style={styles.warningText}>
                Sometimes even medical professionals get confused about the difference between antigens and antibodies.
              </Text>
              <View style={styles.importantBox}>
                <Text style={styles.importantBoxText}>
                  <Text style={styles.boldText}>MAKE SURE</Text> that the baby's father is tested for the <Text style={styles.boldText}>antigen</Text>, NOT the <Text style={styles.boldText}>antibody</Text>.
                </Text>
              </View>
              <Text style={styles.warningSubtext}>
                The best practice is to ask for his test results either on paper or through an online patient portal so that you can see for certain that he was given the right test.
              </Text>
              <Text style={styles.warningNote}>
                Future monitoring and treatment procedures are based on the results of the father's antigen test, so it is very important that he receives the correct test.
              </Text>
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
          
          <View style={styles.positiveCard}>
            <MaterialCommunityIcons name="shield-check" size={40} color="#4CAF50" />
            <View style={styles.positiveContent}>
              <Text style={styles.positiveTitle}>Your Baby is Still Safe</Text>
              <Text style={styles.positiveText}>
                It is still too early for your baby to be affected by your antibodies, so try not to worry about whether your antibodies are hurting baby or not.
              </Text>
            </View>
          </View>
        </View>

        {/* Visual Elements */}
        <View style={styles.visualSection}>
          <View style={styles.visualCard}>
            <MaterialCommunityIcons name="test-tube" size={40} color="#2196F3" />
            <Text style={styles.visualTitle}>Testing Time</Text>
            <Text style={styles.visualText}>
              Critical period for titer tests and partner phenotyping
            </Text>
          </View>
          
          <View style={styles.visualCard}>
            <MaterialCommunityIcons name="calendar-check" size={40} color="#4CAF50" />
            <Text style={styles.visualTitle}>Schedule Now</Text>
            <Text style={styles.visualText}>
              Arrange your first MFM appointment during this period
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
    marginBottom: 12,
  },
  criticalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginLeft: 10,
  },
  criticalText: {
    fontSize: 15,
    color: '#2D3436',
    lineHeight: 24,
    marginBottom: 15,
  },
  treatmentTimeline: {
    marginBottom: 15,
  },
  treatmentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
  },
  treatmentIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  treatmentContent: {
    flex: 1,
  },
  treatmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 4,
  },
  treatmentText: {
    fontSize: 14,
    color: '#2D3436',
    lineHeight: 22,
  },
  portInfoCard: {
    backgroundColor: '#F3E5F5',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  portInfoText: {
    flex: 1,
    fontSize: 14,
    color: '#2D3436',
    lineHeight: 22,
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
  },
  checklistNote: {
    fontSize: 13,
    color: '#636E72',
    lineHeight: 20,
    marginTop: 6,
    fontStyle: 'italic',
  },
  checklistLink: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
    textDecorationLine: 'underline',
    marginTop: 6,
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
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 15,
    color: '#2D3436',
    lineHeight: 24,
    marginBottom: 12,
  },
  importantBox: {
    backgroundColor: '#FFE0B2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#FF9800',
  },
  importantBoxText: {
    fontSize: 15,
    color: '#2D3436',
    lineHeight: 24,
    fontWeight: '600',
  },
  warningSubtext: {
    fontSize: 14,
    color: '#636E72',
    lineHeight: 22,
    marginBottom: 8,
  },
  warningNote: {
    fontSize: 13,
    color: '#636E72',
    lineHeight: 20,
    fontStyle: 'italic',
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

export default Week8To12Screen;

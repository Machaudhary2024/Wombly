import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const Week13To18Screen = ({ navigation }) => {
  console.log('Week13To18Screen rendered!', navigation ? 'Navigation available' : 'No navigation');
  
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
        <Text style={styles.headerTitle}>Weeks 13-18</Text>
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
              colors={['#F3E5F5', '#E1BEE7']}
              style={styles.heroIconBg}
            >
              <MaterialCommunityIcons name="baby-face-outline" size={50} color="#9C27B0" />
            </LinearGradient>
          </View>
          <Text style={styles.heroTitle}>Second Trimester</Text>
          <Text style={styles.heroSubtitle}>
            Weeks 13-18: Monitoring and MCA scans begin
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
              Continue having your titers drawn every 4 weeks.
            </Text>
          </View>

          {/* Critical Titers Card */}
          <View style={styles.criticalCard}>
            <View style={styles.criticalHeader}>
              <MaterialCommunityIcons name="alert-circle" size={28} color="#FF6B9D" />
              <Text style={styles.criticalTitle}>If Your Titers Are Critical</Text>
            </View>
            <Text style={styles.criticalText}>
              You should be having weekly MCA scans starting by 18 weeks at the latest.
            </Text>
          </View>

          {/* First MFM Appointment */}
          <View style={styles.appointmentCard}>
            <MaterialCommunityIcons name="calendar-check" size={28} color="#9C27B0" />
            <View style={styles.appointmentContent}>
              <Text style={styles.appointmentTitle}>First MFM Appointment</Text>
              <Text style={styles.appointmentText}>
                By the end of this time period you should have already had your first appointment with your MFM.
              </Text>
            </View>
          </View>

          {/* MCA Scans Card */}
          <View style={styles.mcaCard}>
            <View style={styles.mcaHeader}>
              <MaterialCommunityIcons name="ultrasound" size={32} color="#2196F3" />
              <Text style={styles.mcaTitle}>First MCA Scan</Text>
            </View>
            <Text style={styles.mcaSubtitle}>
              Probably the most important essential for this gestation is the start of MCA scans.
            </Text>
            
            <View style={styles.mcaInfoBox}>
              <MaterialCommunityIcons name="information" size={24} color="#2196F3" />
              <View style={styles.mcaInfoContent}>
                <Text style={styles.mcaInfoText}>
                  If you have a <Text style={styles.boldText}>critical titer</Text> you should start weekly MCA scans by <Text style={styles.boldText}>16-18 weeks</Text>.
                </Text>
                <Text style={styles.mcaInfoSubtext}>
                  If you have <Text style={styles.boldText}>anti-Kell</Text> it is a good idea to still have MCA scans even without a critical titer since Kell has been known to affect the fetus even with low titers.
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
              <MaterialCommunityIcons name="account-heart" size={24} color="#FF6B9D" />
              <View style={styles.checklistContent}>
                <Text style={styles.checklistTitle}>Father's Antigen Status</Text>
                <Text style={styles.checklistText}>
                  You should know or find out baby's father's antigen status.
                </Text>
                <View style={styles.statusQuestions}>
                  <Text style={styles.statusQuestion}>• Is he positive or negative for the antigen?</Text>
                  <Text style={styles.statusQuestion}>• Homozygous or heterozygous for the antigen?</Text>
                </View>
              </View>
            </View>

            <View style={styles.checklistItem}>
              <MaterialCommunityIcons name="dna" size={24} color="#4CAF50" />
              <View style={styles.checklistContent}>
                <Text style={styles.checklistTitle}>Cell Free Fetal DNA Testing (cffDNA)</Text>
                <Text style={styles.checklistText}>
                  Can be done as early as <Text style={styles.boldText}>10 weeks</Text>. It is a reliable, non-invasive way to find out your baby's antigen status.
                </Text>
                <View style={styles.cffDNAInfo}>
                  <View style={styles.cffDNAItem}>
                    <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" />
                    <Text style={styles.cffDNAText}>
                      If baby is <Text style={styles.boldText}>antigen negative</Text>, then your antibodies cannot harm your baby.
                    </Text>
                  </View>
                  <View style={styles.cffDNAItem}>
                    <MaterialCommunityIcons name="alert-circle" size={20} color="#FF9800" />
                    <Text style={styles.cffDNAText}>
                      If baby is <Text style={styles.boldText}>antigen positive</Text>, you and your MFM will know to keep a closer eye on baby throughout the pregnancy.
                    </Text>
                  </View>
                </View>
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
              <Text style={styles.warningTitle}>Critical Period Begins</Text>
              <Text style={styles.warningText}>
                This is when the baby could become affected by maternal antibodies in the most extreme cases. Be aware that babies who become severely anemic at this gestation rarely show signs of fetal hydrops. This is why MCA scans are so important.
              </Text>
              
              <View style={styles.misconceptionsBox}>
                <Text style={styles.misconceptionsTitle}>Common Misconceptions:</Text>
                <View style={styles.misconceptionItem}>
                  <MaterialCommunityIcons name="close-circle" size={20} color="#F44336" />
                  <Text style={styles.misconceptionText}>
                    "Babies can't be affected by the antibodies before 19/20 weeks."
                  </Text>
                </View>
                <View style={styles.misconceptionItem}>
                  <MaterialCommunityIcons name="close-circle" size={20} color="#F44336" />
                  <Text style={styles.misconceptionText}>
                    "Nothing can be done to help anemic babies before 19/20 weeks anyway so there's no point in scanning that early."
                  </Text>
                </View>
                <View style={styles.misconceptionItem}>
                  <MaterialCommunityIcons name="close-circle" size={20} color="#F44336" />
                  <Text style={styles.misconceptionText}>
                    "Scans before 18 weeks are not accurate or are too difficult to perform."
                  </Text>
                </View>
                <View style={styles.misconceptionItem}>
                  <MaterialCommunityIcons name="close-circle" size={20} color="#F44336" />
                  <Text style={styles.misconceptionText}>
                    "The MCA-PSV calculator only starts at 18 weeks, therefore no need to start MCA scans earlier."
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
          
          <View style={styles.positiveCard}>
            <MaterialCommunityIcons name="trophy" size={40} color="#FFC107" />
            <View style={styles.positiveContent}>
              <Text style={styles.positiveTitle}>Second Trimester Milestone!</Text>
              <Text style={styles.positiveText}>
                You have made it to the second trimester! This is a big milestone to celebrate! The risk of having a miscarriage (unrelated to the antibodies) is much lower now that you are out of the first trimester.
              </Text>
            </View>
          </View>

          <View style={styles.treatmentCard}>
            <MaterialCommunityIcons name="medical-bag" size={32} color="#4CAF50" />
            <View style={styles.treatmentContent}>
              <Text style={styles.treatmentTitle}>Treatment Options Available</Text>
              <Text style={styles.treatmentText}>
                By the time you reach <Text style={styles.boldText}>15 or 16 weeks</Text>, there are treatment options for babies who become anemic in utero. Even though the risks are higher at such early gestations, <Text style={styles.boldText}>IPTs (intraperitoneal transfusions)</Text> can be performed by experienced professionals as early as 15 weeks.
              </Text>
            </View>
          </View>

          <View style={styles.reliefCard}>
            <MaterialCommunityIcons name="heart" size={32} color="#2196F3" />
            <View style={styles.reliefContent}>
              <Text style={styles.reliefTitle}>MCA Scans Provide Clarity</Text>
              <Text style={styles.reliefText}>
                MCA Scans can now be performed so you and your doctor can now know whether baby is being affected by the antibodies or not. It is a relief to know exactly how your baby is doing and whether he is anemic or not.
              </Text>
            </View>
          </View>
        </View>

        {/* Visual Elements */}
        <View style={styles.visualSection}>
          <View style={styles.visualCard}>
            <MaterialCommunityIcons name="ultrasound" size={40} color="#2196F3" />
            <Text style={styles.visualTitle}>MCA Scans</Text>
            <Text style={styles.visualText}>
              Weekly scans start during this period for critical titers
            </Text>
          </View>
          
          <View style={styles.visualCard}>
            <MaterialCommunityIcons name="medical-bag" size={40} color="#4CAF50" />
            <Text style={styles.visualTitle}>Treatment Ready</Text>
            <Text style={styles.visualText}>
              IPT options available from 15-16 weeks
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
    marginBottom: 10,
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
  },
  appointmentCard: {
    backgroundColor: '#F3E5F5',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  appointmentContent: {
    flex: 1,
    marginLeft: 12,
  },
  appointmentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 8,
  },
  appointmentText: {
    fontSize: 15,
    color: '#2D3436',
    lineHeight: 24,
  },
  mcaCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  mcaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  mcaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3436',
    marginLeft: 10,
  },
  mcaSubtitle: {
    fontSize: 15,
    color: '#2D3436',
    lineHeight: 24,
    marginBottom: 15,
    fontWeight: '600',
  },
  mcaInfoBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  mcaInfoContent: {
    flex: 1,
    marginLeft: 12,
  },
  mcaInfoText: {
    fontSize: 14,
    color: '#2D3436',
    lineHeight: 22,
    marginBottom: 8,
  },
  mcaInfoSubtext: {
    fontSize: 13,
    color: '#636E72',
    lineHeight: 20,
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
  statusQuestions: {
    marginTop: 8,
  },
  statusQuestion: {
    fontSize: 14,
    color: '#636E72',
    lineHeight: 22,
    marginBottom: 4,
  },
  cffDNAInfo: {
    marginTop: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
  },
  cffDNAItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  cffDNAText: {
    flex: 1,
    fontSize: 13,
    color: '#2D3436',
    lineHeight: 20,
    marginLeft: 8,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 10,
  },
  warningText: {
    fontSize: 15,
    color: '#2D3436',
    lineHeight: 24,
    marginBottom: 15,
  },
  misconceptionsBox: {
    backgroundColor: '#FFEBEE',
    borderRadius: 10,
    padding: 15,
    borderWidth: 2,
    borderColor: '#F44336',
  },
  misconceptionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C62828',
    marginBottom: 12,
  },
  misconceptionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  misconceptionText: {
    flex: 1,
    fontSize: 14,
    color: '#2D3436',
    lineHeight: 22,
    marginLeft: 8,
    fontStyle: 'italic',
  },
  positiveCard: {
    backgroundColor: '#FFF9C4',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
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
  treatmentCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  treatmentContent: {
    flex: 1,
    marginLeft: 12,
  },
  treatmentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 8,
  },
  treatmentText: {
    fontSize: 15,
    color: '#2D3436',
    lineHeight: 24,
  },
  reliefCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  reliefContent: {
    flex: 1,
    marginLeft: 12,
  },
  reliefTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 8,
  },
  reliefText: {
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

export default Week13To18Screen;

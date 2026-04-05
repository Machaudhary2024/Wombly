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
        <View style={styles.heroSection}>
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={['#E3F2FD', '#BBDEFB']}
              style={styles.heroIconBg}
            >
              <MaterialCommunityIcons name="calendar-month" size={50} color="#2196F3" />
            </LinearGradient>
          </View>
          <Text style={styles.heroTitle}>First trimester</Text>
          <Text style={styles.heroSubtitle}>
            Weeks 8–12: your baby is growing quickly. The brain, heart, and other organs are forming. You may still feel sick or very tired—that is common.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBg, { backgroundColor: '#E8F5E9' }]}>
              <MaterialCommunityIcons name="check-circle" size={24} color="#4CAF50" />
            </View>
            <Text style={styles.sectionTitle}>Essentials</Text>
          </View>

          <View style={styles.titerCard}>
            <View style={styles.titerHeader}>
              <MaterialCommunityIcons name="test-tube" size={28} color="#2196F3" />
              <Text style={styles.titerTitle}>Routine visits</Text>
            </View>
            <Text style={styles.titerText}>
              Keep your scheduled antenatal visits. Your team may repeat blood or urine tests and check your blood pressure and weight. Ask what screening tests are offered in your area around the end of the first trimester.
            </Text>
          </View>

          <View style={styles.criticalCard}>
            <View style={styles.criticalHeader}>
              <MaterialCommunityIcons name="alert-circle" size={28} color="#FF6B9D" />
              <Text style={styles.criticalTitle}>Morning sickness and food</Text>
            </View>
            <Text style={styles.criticalText}>
              Small, frequent meals, plenty of fluids, and rest can help nausea. If you cannot keep fluids down, lose weight, or feel faint, seek medical help—severe sickness can be treated.
            </Text>
            
            <View style={styles.treatmentTimeline}>
              <View style={styles.treatmentItem}>
                <View style={styles.treatmentIconBg}>
                  <MaterialCommunityIcons name="water" size={24} color="#2196F3" />
                </View>
                <View style={styles.treatmentContent}>
                  <Text style={styles.treatmentTitle}>Fluids</Text>
                  <Text style={styles.treatmentText}>
                    Sip water or oral rehydration drinks through the day. Ice chips or clear soups can help if your stomach is sensitive.
                  </Text>
                </View>
              </View>

              <View style={styles.treatmentItem}>
                <View style={[styles.treatmentIconBg, { backgroundColor: '#FFE5F1' }]}>
                  <MaterialCommunityIcons name="needle" size={24} color="#FF6B9D" />
                </View>
                <View style={styles.treatmentContent}>
                  <Text style={styles.treatmentTitle}>Gentle foods</Text>
                  <Text style={styles.treatmentText}>
                    Plain foods like crackers, rice, or toast are often easier. Avoid foods you are told to skip in pregnancy (for example undercooked meat or unpasteurised dairy).
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.portInfoCard}>
              <MaterialCommunityIcons name="hospital-building" size={24} color="#6C5CE7" />
              <Text style={styles.portInfoText}>
                Your doctor can suggest safe medicines for nausea or heartburn if simple measures are not enough.
              </Text>
            </View>
          </View>

          <View style={styles.everyoneCard}>
            <View style={styles.everyoneHeader}>
              <MaterialCommunityIcons name="account-group" size={28} color="#6C5CE7" />
              <Text style={styles.everyoneTitle}>For everyone</Text>
            </View>
            
            <View style={styles.checklistItem}>
              <MaterialCommunityIcons name="account-heart" size={24} color="#FF6B9D" />
              <View style={styles.checklistContent}>
                <Text style={styles.checklistTitle}>Screening choices</Text>
                <Text style={styles.checklistText}>
                  Many services offer optional screening for certain chromosome conditions, often using a blood test from you and sometimes an ultrasound. It is your choice whether to have these tests.
                </Text>
                <Text style={styles.checklistSubtext}>
                  Ask what is available, what results can and cannot tell you, and what follow-up might be offered.
                </Text>
                <Text style={styles.checklistNote}>
                  Information should be in a language you understand; ask for an interpreter if that helps.
                </Text>
              </View>
            </View>

            <View style={styles.checklistItem}>
              <MaterialCommunityIcons name="calendar-clock" size={24} color="#2196F3" />
              <View style={styles.checklistContent}>
                <Text style={styles.checklistTitle}>Dental and gum care</Text>
                <Text style={styles.checklistText}>
                  Hormone changes can make gums tender. Keep brushing, floss if you can, and see a dentist for routine care—tell them you are pregnant.
                </Text>
              </View>
            </View>

            <View style={styles.checklistItem}>
              <MaterialCommunityIcons name="dna" size={24} color="#4CAF50" />
              <View style={styles.checklistContent}>
                <Text style={styles.checklistTitle}>Vitamins</Text>
                <Text style={styles.checklistText}>
                  Continue folic acid and any supplements your clinician recommended. Do not start new tablets or herbal products without checking first.
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBg, { backgroundColor: '#FFF3E0' }]}>
              <MaterialCommunityIcons name="alert" size={24} color="#FF9800" />
            </View>
            <Text style={styles.sectionTitle}>Be aware</Text>
          </View>
          
          <View style={styles.warningCard}>
            <MaterialCommunityIcons name="information" size={28} color="#FF9800" />
            <View style={styles.warningContent}>
              <Text style={styles.warningTitle}>When to get help quickly</Text>
              <Text style={styles.warningText}>
                Call your maternity service or emergency line if you have severe tummy pain, heavy bleeding, a high fever, bad headaches with vision changes, or think you may harm yourself.
              </Text>
              <View style={styles.importantBox}>
                <Text style={styles.importantBoxText}>
                  <Text style={styles.boldText}>Stress matters too.</Text> It is okay to ask for mental health support at any stage.
                </Text>
              </View>
              <Text style={styles.warningSubtext}>
                Miscarriage is still more common before 12 weeks. Light spotting can happen for other reasons, but always tell your clinic so they can advise you.
              </Text>
              <Text style={styles.warningNote}>
                Sources such as public hospital week-by-week guides describe similar symptoms and checks; use them together with your own doctor’s advice.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBg, { backgroundColor: '#E1F5FE' }]}>
              <MaterialCommunityIcons name="weather-sunny" size={24} color="#03A9F4" />
            </View>
            <Text style={styles.sectionTitle}>Silver lining</Text>
          </View>
          
          <View style={styles.positiveCard}>
            <MaterialCommunityIcons name="shield-check" size={40} color="#4CAF50" />
            <View style={styles.positiveContent}>
              <Text style={styles.positiveTitle}>Nausea often eases</Text>
              <Text style={styles.positiveText}>
                For many women, morning sickness starts to improve toward the end of the first trimester, and energy slowly returns. Week 12 is a common time to share news with others if you wish.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.visualSection}>
          <View style={styles.visualCard}>
            <MaterialCommunityIcons name="test-tube" size={40} color="#2196F3" />
            <Text style={styles.visualTitle}>Stay in touch</Text>
            <Text style={styles.visualText}>
              Write down questions before each visit so you do not forget them
            </Text>
          </View>
          
          <View style={styles.visualCard}>
            <MaterialCommunityIcons name="calendar-check" size={40} color="#4CAF50" />
            <Text style={styles.visualTitle}>Growing fast</Text>
            <Text style={styles.visualText}>
              Your baby is now roughly the size health sites compare to a small fruit—every week brings new milestones
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

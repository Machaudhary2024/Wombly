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
        <View style={styles.heroSection}>
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={['#F3E5F5', '#E1BEE7']}
              style={styles.heroIconBg}
            >
              <MaterialCommunityIcons name="baby-face-outline" size={50} color="#9C27B0" />
            </LinearGradient>
          </View>
          <Text style={styles.heroTitle}>Second trimester</Text>
          <Text style={styles.heroSubtitle}>
            Weeks 13–18: welcome to the “middle” part of pregnancy. Many people feel more energetic and less sick. Your baby is moving more, even before you can feel it.
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
              <Text style={styles.titerTitle}>Healthy weight gain</Text>
            </View>
            <Text style={styles.titerText}>
              Steady, gradual weight gain is normal. Your team will guide you—gaining some weight supports your baby, but very fast gain can be worth discussing. Gentle daily activity is usually fine if your doctor agrees.
            </Text>
          </View>

          <View style={styles.criticalCard}>
            <View style={styles.criticalHeader}>
              <MaterialCommunityIcons name="alert-circle" size={28} color="#FF6B9D" />
              <Text style={styles.criticalTitle}>The detailed ultrasound</Text>
            </View>
            <Text style={styles.criticalText}>
              Between about 18 and 20 weeks many hospitals offer a morphology (anatomy) scan. It looks at how your baby’s body is developing. You may be told the baby’s sex if you want to know and if it can be seen.
            </Text>
          </View>

          <View style={styles.appointmentCard}>
            <MaterialCommunityIcons name="calendar-check" size={28} color="#9C27B0" />
            <View style={styles.appointmentContent}>
              <Text style={styles.appointmentTitle}>Regular checkups</Text>
              <Text style={styles.appointmentText}>
                Visits may include listening to the baby’s heart, measuring your bump, and checking blood pressure and urine. These simple checks help spot issues early.
              </Text>
            </View>
          </View>

          <View style={styles.mcaCard}>
            <View style={styles.mcaHeader}>
              <MaterialCommunityIcons name="ultrasound" size={32} color="#2196F3" />
              <Text style={styles.mcaTitle}>Baby’s growth</Text>
            </View>
            <Text style={styles.mcaSubtitle}>
              Your baby is gaining weight and fat. Eyelids stay closed for a while, then begin to open later in pregnancy. Fingerprints are forming.
            </Text>
            
            <View style={styles.mcaInfoBox}>
              <MaterialCommunityIcons name="information" size={24} color="#2196F3" />
              <View style={styles.mcaInfoContent}>
                <Text style={styles.mcaInfoText}>
                  You might start to feel light flutters (<Text style={styles.boldText}>quickening</Text>) toward the end of this range, especially if this is not your first baby.
                </Text>
                <Text style={styles.mcaInfoSubtext}>
                  If you feel nothing yet, that can still be normal—every pregnancy is different.
                </Text>
              </View>
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
                <Text style={styles.checklistTitle}>Skin and body changes</Text>
                <Text style={styles.checklistText}>
                  A “baby bump” often shows more now. Stretch marks, darker skin on the face, or a line on the tummy are common and harmless for most people.
                </Text>
                <View style={styles.statusQuestions}>
                  <Text style={styles.statusQuestion}>• Use sunscreen and moisturiser if your skin is sensitive.</Text>
                  <Text style={styles.statusQuestion}>• Supportive bras and comfortable shoes can help as your shape changes.</Text>
                </View>
              </View>
            </View>

            <View style={styles.checklistItem}>
              <MaterialCommunityIcons name="dna" size={24} color="#4CAF50" />
              <View style={styles.checklistContent}>
                <Text style={styles.checklistTitle}>Heartburn and digestion</Text>
                <Text style={styles.checklistText}>
                  Smaller meals, sitting up after eating, and avoiding very spicy or greasy foods can ease reflux. Your clinician can suggest safe antacids if needed.
                </Text>
                <View style={styles.cffDNAInfo}>
                  <View style={styles.cffDNAItem}>
                    <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" />
                    <Text style={styles.cffDNAText}>
                      Drink water and include fibre (fruit, vegetables, whole grains) to help <Text style={styles.boldText}>constipation</Text>, which is common in pregnancy.
                    </Text>
                  </View>
                  <View style={styles.cffDNAItem}>
                    <MaterialCommunityIcons name="alert-circle" size={20} color="#FF9800" />
                    <Text style={styles.cffDNAText}>
                      Do not take laxatives or herbal remedies without checking—they are not all safe in pregnancy.
                    </Text>
                  </View>
                </View>
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
              <Text style={styles.warningTitle}>Blood pressure and headaches</Text>
              <Text style={styles.warningText}>
                High blood pressure in pregnancy needs attention. Seek urgent advice for severe headache, vision changes, upper tummy pain, or sudden swelling of face, hands, or feet—these can be signs of pre-eclampsia, which is usually checked for at visits.
              </Text>
              
              <View style={styles.misconceptionsBox}>
                <Text style={styles.misconceptionsTitle}>Simple facts</Text>
                <View style={styles.misconceptionItem}>
                  <MaterialCommunityIcons name="close-circle" size={20} color="#F44336" />
                  <Text style={styles.misconceptionText}>
                    Myth: “If I feel fine, I can skip a visit.” Care is partly about tests you cannot feel—keep scheduled appointments.
                  </Text>
                </View>
                <View style={styles.misconceptionItem}>
                  <MaterialCommunityIcons name="close-circle" size={20} color="#F44336" />
                  <Text style={styles.misconceptionText}>
                    Myth: “I should eat for two full adults.” Most people need only a modest extra amount of healthy food in later pregnancy.
                  </Text>
                </View>
                <View style={styles.misconceptionItem}>
                  <MaterialCommunityIcons name="close-circle" size={20} color="#F44336" />
                  <Text style={styles.misconceptionText}>
                    Myth: “Exercise is dangerous.” Gentle activity is usually encouraged unless your doctor has told you otherwise.
                  </Text>
                </View>
                <View style={styles.misconceptionItem}>
                  <MaterialCommunityIcons name="close-circle" size={20} color="#F44336" />
                  <Text style={styles.misconceptionText}>
                    Trust your team over general advice online—including this screen—when they disagree.
                  </Text>
                </View>
              </View>
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
            <MaterialCommunityIcons name="trophy" size={40} color="#FFC107" />
            <View style={styles.positiveContent}>
              <Text style={styles.positiveTitle}>Second trimester milestone</Text>
              <Text style={styles.positiveText}>
                The chance of miscarriage drops a lot after the first trimester. Many parents relax a little and enjoy planning for the baby.
              </Text>
            </View>
          </View>

          <View style={styles.treatmentCard}>
            <MaterialCommunityIcons name="medical-bag" size={32} color="#4CAF50" />
            <View style={styles.treatmentContent}>
              <Text style={styles.treatmentTitle}>Bonding</Text>
              <Text style={styles.treatmentText}>
                Talking, reading, or playing music to your bump is optional but many families enjoy it. Your baby can start to hear muffled sounds from the outside world around the middle of pregnancy.
              </Text>
            </View>
          </View>

          <View style={styles.reliefCard}>
            <MaterialCommunityIcons name="heart" size={32} color="#2196F3" />
            <View style={styles.reliefContent}>
              <Text style={styles.reliefTitle}>Energy and appetite</Text>
              <Text style={styles.reliefText}>
                Nausea often fades and hunger may return. Choose nutritious snacks and meals to support you both.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.visualSection}>
          <View style={styles.visualCard}>
            <MaterialCommunityIcons name="ultrasound" size={40} color="#2196F3" />
            <Text style={styles.visualTitle}>Anatomy scan</Text>
            <Text style={styles.visualText}>
              A detailed look at your baby’s structure, usually in mid-pregnancy
            </Text>
          </View>
          
          <View style={styles.visualCard}>
            <MaterialCommunityIcons name="medical-bag" size={40} color="#4CAF50" />
            <Text style={styles.visualTitle}>Growing bump</Text>
            <Text style={styles.visualText}>
              Your uterus rises above the pelvis—maternity clothes may fit better now
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

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
        <View style={styles.heroSection}>
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={['#FFE5F1', '#F3E5F5']}
              style={styles.heroIconBg}
            >
              <MaterialCommunityIcons name="calendar-start" size={50} color="#FF6B9D" />
            </LinearGradient>
          </View>
          <Text style={styles.heroTitle}>Early pregnancy</Text>
          <Text style={styles.heroSubtitle}>
            Weeks 1–7 (from your last period): your body is preparing and the pregnancy is very new. Care is usually counted from the first day of your last period, not the day you conceived.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBg, { backgroundColor: '#FFE5F1' }]}>
              <MaterialCommunityIcons name="check-circle" size={24} color="#FF6B9D" />
            </View>
            <Text style={styles.sectionTitle}>Essentials</Text>
          </View>

          <View style={styles.highRiskCard}>
            <View style={styles.highRiskHeader}>
              <MaterialCommunityIcons name="alert-circle" size={28} color="#FF6B9D" />
              <Text style={styles.highRiskTitle}>Book care early</Text>
            </View>
            <Text style={styles.highRiskText}>
              Arrange your first antenatal visit as soon as you can. Your doctor or midwife can confirm the pregnancy, talk about folic acid and any vaccines you may need, and plan routine tests.
            </Text>
            <View style={styles.recommendationCard}>
              <MaterialCommunityIcons name="hospital-box" size={24} color="#4CAF50" />
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationTitle}>Why early visits help</Text>
                <Text style={styles.recommendationText}>
                  Starting care early means questions about diet, medicines, nausea, and safety can be answered sooner. If you have pain, heavy bleeding, fever, or severe vomiting, seek advice the same day.
                </Text>
                <Text style={styles.recommendationSubtext}>
                  This app is for general education only. Always follow the plan from your own clinician.
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
              <MaterialCommunityIcons name="test-tube" size={24} color="#4CAF50" />
              <View style={styles.checklistContent}>
                <Text style={styles.checklistTitle}>Routine tests</Text>
                <Text style={styles.checklistText}>
                  Your clinic may offer blood and urine tests to check your health and screen for conditions that matter in pregnancy. What you are offered depends on where you live and your history.
                </Text>
              </View>
            </View>

            <View style={styles.checklistItem}>
              <MaterialCommunityIcons name="ultrasound" size={24} color="#2196F3" />
              <View style={styles.checklistContent}>
                <Text style={styles.checklistTitle}>Dating scan</Text>
                <Text style={styles.checklistText}>
                  An early ultrasound can help confirm how far along you are, especially if your periods are irregular or you are unsure of dates.
                </Text>
                <Text style={styles.checklistSubtext}>
                  A clear due date helps your team time future checks and scans.
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBg, { backgroundColor: '#F3E5F5' }]}>
              <MaterialCommunityIcons name="alert" size={24} color="#9C27B0" />
            </View>
            <Text style={styles.sectionTitle}>Be aware</Text>
          </View>
          
          <View style={styles.warningCard}>
            <MaterialCommunityIcons name="information" size={28} color="#FF9800" />
            <View style={styles.warningContent}>
              <Text style={styles.warningText}>
                <Text style={styles.boldText}>Common early signs</Text> include a missed period, nausea, sore breasts, tiredness, and needing to pass urine more often. Not everyone has all of these.
              </Text>
              <Text style={styles.warningSubtext}>
                Many pregnancies end in miscarriage in the first trimester; it is common and not your fault. If you have bleeding or cramping, contact your clinic or an urgent care service for advice. If you are Rh negative, your team may recommend an injection after some bleeds—ask them what applies to you.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBg, { backgroundColor: '#E8D5FF' }]}>
              <MaterialCommunityIcons name="weather-sunny" size={24} color="#6C5CE7" />
            </View>
            <Text style={styles.sectionTitle}>Silver lining</Text>
          </View>
          
          <View style={styles.positiveCard}>
            <MaterialCommunityIcons name="shield-check" size={40} color="#4CAF50" />
            <View style={styles.positiveContent}>
              <Text style={styles.positiveTitle}>Tiny but busy</Text>
              <Text style={styles.positiveText}>
                In these weeks the fertilised egg implants, the placenta starts to form, and major organs begin to develop. Small steps in your body add up to big growth for your baby.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.visualSection}>
          <View style={styles.visualCard}>
            <MaterialCommunityIcons name="clock-fast" size={40} color="#FF6B9D" />
            <Text style={styles.visualTitle}>Start simple habits</Text>
            <Text style={styles.visualText}>
              Folic acid as advised, balanced food, rest, and no smoking or alcohol unless your doctor says otherwise
            </Text>
          </View>
          
          <View style={styles.visualCard}>
            <MaterialCommunityIcons name="heart" size={40} color="#4CAF50" />
            <Text style={styles.visualTitle}>One step at a time</Text>
            <Text style={styles.visualText}>
              It is normal to feel excited or anxious; your care team is there to support you
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

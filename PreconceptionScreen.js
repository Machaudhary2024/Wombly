import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const PreconceptionScreen = ({ navigation }) => {
  console.log('PreconceptionScreen rendered!', navigation ? 'Navigation available' : 'No navigation');
  
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
        <Text style={styles.headerTitle}>Preconception Care</Text>
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
              colors={['#FFE5F1', '#FFB8D1']}
              style={styles.heroIconBg}
            >
              <MaterialCommunityIcons name="account-heart" size={50} color="#FF6B9D" />
            </LinearGradient>
          </View>
          <Text style={styles.heroTitle}>Preconception Planning</Text>
          <Text style={styles.heroSubtitle}>
            Preparing for a healthy pregnancy with expert guidance
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
          
          <View style={styles.contentCard}>
            <Text style={styles.contentText}>
              For those who have had a previously affected pregnancy, or receive their diagnosis before attempting pregnancy, a{' '}
              <Text style={styles.highlightText}>preconception appointment</Text> with your MFM (Maternal-Fetal Medicine specialist), or potential MFM, can be helpful.
            </Text>
          </View>

          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <MaterialCommunityIcons name="chat-outline" size={24} color="#6C5CE7" />
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>Discuss Questions & Concerns</Text>
                <Text style={styles.benefitText}>
                  During your preconception appointment you can discuss any questions or concerns you may have about a future pregnancy.
                </Text>
              </View>
            </View>

            <View style={styles.benefitItem}>
              <MaterialCommunityIcons name="file-document-edit-outline" size={24} color="#6C5CE7" />
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>Create a Care Plan</Text>
                <Text style={styles.benefitText}>
                  You can work together with your MFM to create a care plan that you and your partner feel confident about.
                </Text>
              </View>
            </View>

            <View style={styles.benefitItem}>
              <MaterialCommunityIcons name="account-heart-outline" size={24} color="#6C5CE7" />
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>Evaluate Bedside Manner</Text>
                <Text style={styles.benefitText}>
                  Having a face to face meeting also helps you get a feel for the MFM's bedside manner and how you both interact with each other.
                </Text>
              </View>
            </View>

            <View style={styles.benefitItem}>
              <MaterialCommunityIcons name="help-circle-outline" size={24} color="#6C5CE7" />
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>See How They Handle Questions</Text>
                <Text style={styles.benefitText}>
                  It is also helpful to see how your MFM handles questions from you since you will be asking lots of questions during a future pregnancy.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.importantCard}>
            <MaterialCommunityIcons name="heart-broken" size={32} color="#FF6B9D" />
            <View style={styles.importantContent}>
              <Text style={styles.importantTitle}>For Those Who Have Lost a Baby</Text>
              <Text style={styles.importantText}>
                For those who have lost a baby to HDFN, the preconception appointment is a good time to ask your MFM questions about your experience and discuss ways to prevent another loss.
              </Text>
            </View>
          </View>

          <View style={styles.resourceCard}>
            <MaterialCommunityIcons name="clipboard-check-outline" size={28} color="#4CAF50" />
            <View style={styles.resourceContent}>
              <Text style={styles.resourceTitle}>Checklist for Excellent Care</Text>
              <Text style={styles.resourceText}>
                Click here to see our Checklist for Excellent Care, which demonstrates what The Allo Hope Foundation looks for in excellent doctors with specific expertise in treating maternal alloimmunization and HDFN. Consider this resource when you are finding the right high risk doctor for your needs.
              </Text>
            </View>
          </View>

          <View style={styles.warningCard}>
            <MaterialCommunityIcons name="alert-circle" size={28} color="#F44336" />
            <View style={styles.warningContent}>
              <Text style={styles.warningTitle}>Strong Recommendation</Text>
              <Text style={styles.warningText}>
                If you had a severely affected pregnancy or lost a baby to HDFN in the past we{' '}
                <Text style={styles.boldText}>strongly recommend</Text> having a preconception appointment with an MFM before attempting another pregnancy.
              </Text>
            </View>
          </View>
        </View>

        {/* Beware Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBg, { backgroundColor: '#FFF3E0' }]}>
              <MaterialCommunityIcons name="alert" size={24} color="#FF9800" />
            </View>
            <Text style={styles.sectionTitle}>Beware</Text>
          </View>
          
          <View style={styles.warningCard}>
            <MaterialCommunityIcons name="information" size={28} color="#FF9800" />
            <View style={styles.warningContent}>
              <Text style={styles.warningText}>
                It can be helpful to check your antibody titer during your preconception appointment, just to get a starting point, but be aware that{' '}
                <Text style={styles.boldText}>titers often change once a woman becomes pregnant</Text>.
              </Text>
              <Text style={styles.warningSubtext}>
                Your titer before pregnancy is not always an accurate predictor of how your pregnancy will go or how affected your baby might be.
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
              <Text style={styles.positiveTitle}>Time to Plan</Text>
              <Text style={styles.positiveText}>
                You have time to focus on a preconception plan you feel comfortable with. You can choose an MFM that you feel confident in and who has experience managing HDFN.
              </Text>
            </View>
          </View>
        </View>

        {/* Visual Elements */}
        <View style={styles.visualSection}>
          <View style={styles.visualCard}>
            <MaterialCommunityIcons name="calendar-heart" size={40} color="#6C5CE7" />
            <Text style={styles.visualTitle}>Plan Ahead</Text>
            <Text style={styles.visualText}>
              Take time to prepare and make informed decisions
            </Text>
          </View>
          
          <View style={styles.visualCard}>
            <MaterialCommunityIcons name="doctor" size={40} color="#4CAF50" />
            <Text style={styles.visualTitle}>Find the Right Doctor</Text>
            <Text style={styles.visualText}>
              Choose an MFM with experience in HDFN management
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
    backgroundColor: '#F5F5F5',
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
    paddingTop: 20,
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#636E72',
    textAlign: 'center',
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
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentText: {
    fontSize: 16,
    color: '#2D3436',
    lineHeight: 24,
  },
  highlightText: {
    fontWeight: 'bold',
    color: '#6C5CE7',
  },
  benefitsList: {
    marginBottom: 15,
  },
  benefitItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  benefitContent: {
    flex: 1,
    marginLeft: 12,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 4,
  },
  benefitText: {
    fontSize: 14,
    color: '#636E72',
    lineHeight: 20,
  },
  importantCard: {
    flexDirection: 'row',
    backgroundColor: '#FFE5F1',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B9D',
  },
  importantContent: {
    flex: 1,
    marginLeft: 12,
  },
  importantTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B9D',
    marginBottom: 8,
  },
  importantText: {
    fontSize: 15,
    color: '#2D3436',
    lineHeight: 22,
  },
  resourceCard: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  resourceContent: {
    flex: 1,
    marginLeft: 12,
  },
  resourceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  resourceText: {
    fontSize: 15,
    color: '#2D3436',
    lineHeight: 22,
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  warningContent: {
    flex: 1,
    marginLeft: 12,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF9800',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 15,
    color: '#2D3436',
    lineHeight: 22,
    marginBottom: 8,
  },
  warningSubtext: {
    fontSize: 14,
    color: '#636E72',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  boldText: {
    fontWeight: 'bold',
  },
  positiveCard: {
    flexDirection: 'row',
    backgroundColor: '#E1F5FE',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#03A9F4',
  },
  positiveContent: {
    flex: 1,
    marginLeft: 15,
  },
  positiveTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#03A9F4',
    marginBottom: 10,
  },
  positiveText: {
    fontSize: 16,
    color: '#2D3436',
    lineHeight: 24,
  },
  visualSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
  visualCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  visualTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  visualText: {
    fontSize: 13,
    color: '#636E72',
    textAlign: 'center',
    lineHeight: 18,
  },
  bottomSpacer: {
    height: 20,
  },
});

export default PreconceptionScreen;

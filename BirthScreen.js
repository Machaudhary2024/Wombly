import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import FloatingChatButton from './components/FloatingChatButton';

const BirthScreen = ({ navigation }) => {
  console.log('BirthScreen rendered!', navigation ? 'Navigation available' : 'No navigation');
  
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
        <Text style={styles.headerTitle}>Birth & Postpartum</Text>
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
              colors={['#FCE4EC', '#F8BBD0']}
              style={styles.heroIconBg}
            >
              <MaterialCommunityIcons name="baby" size={50} color="#E91E63" />
            </LinearGradient>
          </View>
          <Text style={styles.heroTitle}>Welcome Baby!</Text>
          <Text style={styles.heroSubtitle}>
            Your baby's care journey continues after birth
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

          {/* Care Transition Card */}
          <View style={styles.transitionCard}>
            <MaterialCommunityIcons name="account-switch" size={32} color="#E91E63" />
            <View style={styles.transitionContent}>
              <Text style={styles.transitionTitle}>Care Transition</Text>
              <Text style={styles.transitionText}>
                At the time of delivery your baby's care shifts from the MFM to the <Text style={styles.boldText}>neonatologist/pediatrician</Text>. This can sometimes come as a sudden jolt after being cared for by your MFM for months.
              </Text>
            </View>
          </View>

          {/* Advocacy Card */}
          <View style={styles.advocacyCard}>
            <MaterialCommunityIcons name="account-heart" size={32} color="#FF6B9D" />
            <View style={styles.advocacyContent}>
              <Text style={styles.advocacyTitle}>Be Your Baby's Advocate</Text>
              <Text style={styles.advocacyText}>
                Many specialists and clinicians have little experience treating babies with HDFN since it is rare. <Text style={styles.boldText}>Go in expecting to be an advocate for your baby</Text>.
              </Text>
            </View>
          </View>

          {/* Medical Record Card */}
          <View style={styles.recordCard}>
            <MaterialCommunityIcons name="clipboard-text" size={32} color="#2196F3" />
            <View style={styles.recordContent}>
              <Text style={styles.recordTitle}>You Are Your Baby's Medical Record</Text>
              <Text style={styles.recordText}>
                Even though your baby has received months of monitoring and possibly treatment in utero, your baby is born without a medical record. <Text style={styles.boldText}>YOU have to be your child's medical record</Text>.
              </Text>
            </View>
          </View>

          {/* Reminders Card */}
          <View style={styles.remindersCard}>
            <MaterialCommunityIcons name="bell-alert" size={28} color="#FF9800" />
            <View style={styles.remindersContent}>
              <Text style={styles.remindersTitle}>Important Reminders for Physicians</Text>
              <View style={styles.reminderList}>
                <View style={styles.reminderItem}>
                  <MaterialCommunityIcons name="check" size={20} color="#4CAF50" />
                  <Text style={styles.reminderText}>
                    Remind your baby's physicians that they are dealing with <Text style={styles.boldText}>hemolytic disease of the fetus and newborn</Text>.
                  </Text>
                </View>
                <View style={styles.reminderItem}>
                  <MaterialCommunityIcons name="check" size={20} color="#4CAF50" />
                  <Text style={styles.reminderText}>
                    Remind the physicians that the journey your baby just took in utero does have an effect on what type of care is required after birth to keep your baby safe.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Everyone Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBg, { backgroundColor: '#E8F5E9' }]}>
              <MaterialCommunityIcons name="account-group" size={24} color="#4CAF50" />
            </View>
            <Text style={styles.sectionTitle}>For Everyone</Text>
          </View>

          {/* Testing Card */}
          <View style={styles.testingCard}>
            <MaterialCommunityIcons name="test-tube" size={32} color="#4CAF50" />
            <View style={styles.testingContent}>
              <Text style={styles.testingTitle}>Required Testing</Text>
              <Text style={styles.testingText}>
                All infants born to mothers with alloimmunization need to have the following run from the umbilical cord blood:
              </Text>
              <View style={styles.testList}>
                <View style={styles.testItem}>
                  <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" />
                  <Text style={styles.testText}>Direct Agglutination Test (DAT)</Text>
                </View>
                <View style={styles.testItem}>
                  <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" />
                  <Text style={styles.testText}>Hemoglobin</Text>
                </View>
                <View style={styles.testItem}>
                  <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" />
                  <Text style={styles.testText}>Bilirubin</Text>
                </View>
              </View>
              <Text style={styles.testingNote}>
                Depending on these results, follow up testing will be needed.
              </Text>
            </View>
          </View>
        </View>

        {/* Visual Elements */}
        <View style={styles.visualSection}>
          <View style={styles.visualCard}>
            <MaterialCommunityIcons name="account-heart" size={40} color="#E91E63" />
            <Text style={styles.visualTitle}>Be an Advocate</Text>
            <Text style={styles.visualText}>
              You know your baby's journey best
            </Text>
          </View>
          
          <View style={styles.visualCard}>
            <MaterialCommunityIcons name="test-tube" size={40} color="#4CAF50" />
            <Text style={styles.visualTitle}>Required Tests</Text>
            <Text style={styles.visualText}>
              DAT, hemoglobin, and bilirubin from cord blood
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
  transitionCard: {
    backgroundColor: '#FCE4EC',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: '#E91E63',
  },
  transitionContent: {
    flex: 1,
    marginLeft: 12,
  },
  transitionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 8,
  },
  transitionText: {
    fontSize: 15,
    color: '#2D3436',
    lineHeight: 24,
  },
  advocacyCard: {
    backgroundColor: '#FFF5F7',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B9D',
  },
  advocacyContent: {
    flex: 1,
    marginLeft: 12,
  },
  advocacyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 8,
  },
  advocacyText: {
    fontSize: 15,
    color: '#2D3436',
    lineHeight: 24,
  },
  recordCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  recordContent: {
    flex: 1,
    marginLeft: 12,
  },
  recordTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 8,
  },
  recordText: {
    fontSize: 15,
    color: '#2D3436',
    lineHeight: 24,
  },
  remindersCard: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  remindersContent: {
    flex: 1,
    marginLeft: 12,
  },
  remindersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 12,
  },
  reminderList: {
    marginTop: 8,
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reminderText: {
    flex: 1,
    fontSize: 14,
    color: '#2D3436',
    lineHeight: 22,
    marginLeft: 10,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#FF6B9D',
  },
  resourcesCard: {
    backgroundColor: '#F3E5F5',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
  },
  resourcesContent: {
    marginTop: 8,
  },
  resourcesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 10,
  },
  resourcesText: {
    fontSize: 15,
    color: '#2D3436',
    lineHeight: 24,
    marginBottom: 15,
  },
  foundationBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  foundationContent: {
    flex: 1,
    marginLeft: 12,
  },
  foundationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 6,
  },
  foundationText: {
    fontSize: 14,
    color: '#2D3436',
    lineHeight: 22,
    marginBottom: 6,
  },
  foundationLink: {
    fontSize: 14,
    color: '#E91E63',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  calculatorBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  calculatorText: {
    flex: 1,
    fontSize: 14,
    color: '#2D3436',
    lineHeight: 22,
    marginLeft: 12,
  },
  testingCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  testingContent: {
    marginTop: 8,
  },
  testingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 10,
  },
  testingText: {
    fontSize: 15,
    color: '#2D3436',
    lineHeight: 24,
    marginBottom: 15,
  },
  testList: {
    marginBottom: 12,
  },
  testItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
  },
  testText: {
    flex: 1,
    fontSize: 15,
    color: '#2D3436',
    marginLeft: 10,
    fontWeight: '500',
  },
  testingNote: {
    fontSize: 14,
    color: '#636E72',
    lineHeight: 22,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  testingLink: {
    fontSize: 14,
    color: '#2196F3',
    lineHeight: 22,
    textDecorationLine: 'underline',
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

export default BirthScreen;

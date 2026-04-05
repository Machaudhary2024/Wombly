import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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
        <View style={styles.heroSection}>
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={['#FFF3E0', '#FFE0B2']}
              style={styles.heroIconBg}
            >
              <MaterialCommunityIcons name="baby-buggy" size={50} color="#FF9800" />
            </LinearGradient>
          </View>
          <Text style={styles.heroTitle}>Late second trimester</Text>
          <Text style={styles.heroSubtitle}>
            Weeks 23–27: your baby is gaining weight and fat. Lungs are still maturing, but many hospitals can support babies born around this time with specialist care if needed.
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
              <Text style={styles.titerTitle}>Gestational diabetes screening</Text>
            </View>
            <View style={styles.titerContent}>
              <Text style={styles.titerText}>
                Between about <Text style={styles.boldText}>24 and 28 weeks</Text> many services test for diabetes that only appears in pregnancy. You may drink a sweet drink and have a blood test. If the result is high, diet changes or treatment can protect you and your baby.
              </Text>
            </View>
          </View>

          <View style={styles.criticalCard}>
            <View style={styles.criticalHeader}>
              <MaterialCommunityIcons name="alert-circle" size={28} color="#FF6B9D" />
              <Text style={styles.criticalTitle}>Pelvic floor and posture</Text>
            </View>
            <View style={styles.mcaScanCard}>
              <MaterialCommunityIcons name="ultrasound" size={24} color="#2196F3" />
              <Text style={styles.mcaScanText}>
                Gentle pelvic floor squeezes (as taught by a physiotherapist) may help later recovery. Avoid standing for very long without a break; change position often and rest with feet up when you can.
              </Text>
            </View>
          </View>

          <View style={styles.everyoneCard}>
            <View style={styles.everyoneHeader}>
              <MaterialCommunityIcons name="account-group" size={28} color="#6C5CE7" />
              <Text style={styles.everyoneTitle}>For everyone</Text>
            </View>
            
            <View style={styles.nicuCard}>
              <MaterialCommunityIcons name="hospital-building" size={32} color="#FF9800" />
              <View style={styles.nicuContent}>
                <Text style={styles.nicuTitle}>Hospital tour (optional)</Text>
                <Text style={styles.nicuText}>
                  Some hospitals offer birth suite tours or classes. Seeing where you might give birth can feel less scary. Neonatal units sometimes allow visits if your pregnancy is higher risk—ask your team.
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
          
          <View style={styles.steroidsCard}>
            <MaterialCommunityIcons name="information" size={28} color="#FF9800" />
            <View style={styles.steroidsContent}>
              <Text style={styles.steroidsTitle}>Breathlessness</Text>
              <Text style={styles.steroidsText}>
                Your womb pushes up under your ribs, so mild shortness of breath can be normal. Sit upright, slow down, and rest. If breathlessness is sudden or severe, or you have chest pain, seek urgent help.
              </Text>
              
              <View style={styles.warningBox}>
                <MaterialCommunityIcons name="alert-circle" size={24} color="#F44336" />
                <View style={styles.warningBoxContent}>
                  <Text style={styles.warningBoxTitle}>Medicines and steroids</Text>
                  <Text style={styles.warningBoxText}>
                    If doctors think your baby might be born early, they may offer <Text style={styles.boldText}>steroid injections</Text> to help the baby’s lungs. Only take prescribed medicines; ask before any new tablet or cream.
                  </Text>
                  <Text style={styles.warningBoxRecommendation}>
                    Always tell any doctor or dentist that you are pregnant.
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
          
          <View style={styles.viabilityCard}>
            <MaterialCommunityIcons name="trophy" size={40} color="#FFC107" />
            <View style={styles.viabilityContent}>
              <Text style={styles.viabilityTitle}>A big milestone</Text>
              <Text style={styles.viabilityText}>
                Each week your baby’s lungs and brain mature. Staying pregnant longer usually means fewer breathing and feeding problems after birth.
              </Text>
            </View>
          </View>

          <View style={styles.survivalCard}>
            <MaterialCommunityIcons name="chart-line" size={32} color="#4CAF50" />
            <View style={styles.survivalContent}>
              <Text style={styles.survivalTitle}>Rhythm of movement</Text>
              <Text style={styles.survivalText}>
                You may notice sleep–wake patterns. Many babies move more in the evening when you are resting.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.visualSection}>
          <View style={styles.visualCard}>
            <MaterialCommunityIcons name="calendar-clock" size={40} color="#FF9800" />
            <Text style={styles.visualTitle}>More visits</Text>
            <Text style={styles.visualText}>
              Checkups may become a little more frequent as you approach the third trimester
            </Text>
          </View>
          
          <View style={styles.visualCard}>
            <MaterialCommunityIcons name="hospital-building" size={40} color="#2196F3" />
            <Text style={styles.visualTitle}>Baby’s weight</Text>
            <Text style={styles.visualText}>
              Around 1 kg or a bit more is typical by the end of this range for many babies
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

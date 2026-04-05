import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const Week28To33Screen = ({ navigation }) => {
  console.log('Week28To33Screen rendered!', navigation ? 'Navigation available' : 'No navigation');
  
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
        <Text style={styles.headerTitle}>Weeks 28-33</Text>
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
              colors={['#FCE4EC', '#F8BBD0']}
              style={styles.heroIconBg}
            >
              <MaterialCommunityIcons name="baby" size={50} color="#E91E63" />
            </LinearGradient>
          </View>
          <Text style={styles.heroTitle}>Third trimester</Text>
          <Text style={styles.heroSubtitle}>
            Weeks 28–33: welcome to the home stretch. Your baby is plumper, brain and lungs are still maturing, and you may feel more tired, heavy, or breathless at times.
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
              <Text style={styles.titerTitle}>Regular checkups</Text>
            </View>
            <Text style={styles.titerText}>
              Visits often include blood pressure, urine, measuring your bump, and listening to the baby. From around 28 weeks your team may suggest extra growth scans if needed. Always ask what is planned for you.
            </Text>
          </View>

          <View style={styles.criticalCard}>
            <View style={styles.criticalHeader}>
              <MaterialCommunityIcons name="alert-circle" size={28} color="#FF6B9D" />
              <Text style={styles.criticalTitle}>Braxton Hicks vs labour</Text>
            </View>
            <View style={styles.mcaScanCard}>
              <MaterialCommunityIcons name="ultrasound" size={24} color="#2196F3" />
              <Text style={styles.mcaScanText}>
                Practice tightenings (<Text style={styles.boldText}>Braxton Hicks</Text>) are irregular and often ease if you move or rest. True labour contractions get stronger, longer, and closer together. If unsure, call your maternity line.
              </Text>
            </View>
          </View>

          <View style={styles.everyoneCard}>
            <View style={styles.everyoneHeader}>
              <MaterialCommunityIcons name="account-group" size={28} color="#6C5CE7" />
              <Text style={styles.everyoneTitle}>For everyone</Text>
            </View>
            
            <View style={styles.deliveryCard}>
              <MaterialCommunityIcons name="calendar-check" size={28} color="#E91E63" />
              <View style={styles.deliveryContent}>
                <Text style={styles.deliveryTitle}>Birth preferences</Text>
                <Text style={styles.deliveryText}>
                  Talk through pain relief options, who you want with you, and any cultural or religious wishes. Plans can change for safety—flexibility helps.
                </Text>
              </View>
            </View>

            <View style={styles.bagCard}>
              <MaterialCommunityIcons name="bag-personal" size={28} color="#FF9800" />
              <View style={styles.bagContent}>
                <Text style={styles.bagTitle}>Hospital bag</Text>
                <Text style={styles.bagText}>
                  Pack clothes for you and baby, toiletries, chargers, snacks, and important documents. Keep the bag somewhere easy to grab.
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
          
          <View style={styles.mcaWarningCard}>
            <MaterialCommunityIcons name="information" size={28} color="#FF9800" />
            <View style={styles.mcaWarningContent}>
              <Text style={styles.mcaWarningTitle}>Baby’s position</Text>
              <Text style={styles.mcaWarningText}>
                Many babies lie head down by now, but some are bottom or feet first. Your team will check; most who stay breech near full term are offered a plan (sometimes turning the baby or a caesarean birth).
              </Text>
              
              <View style={styles.misconceptionBox}>
                <MaterialCommunityIcons name="alert-circle" size={24} color="#F44336" />
                <View style={styles.misconceptionContent}>
                  <Text style={styles.misconceptionTitle}>Reduced movements</Text>
                  <Text style={styles.misconceptionText}>
                    Do not wait until tomorrow if movements feel less than usual. Lie on your left side, have a cold drink, and if still not normal, get checked the same day.
                  </Text>
                </View>
              </View>

              <View style={styles.criticalInfoBox}>
                <MaterialCommunityIcons name="clock-alert" size={24} color="#E91E63" />
                <View style={styles.criticalInfoContent}>
                  <Text style={styles.criticalInfoTitle}>Pre-eclampsia reminder</Text>
                  <Text style={styles.criticalInfoText}>
                    Watch for bad headache, vision changes, sudden swelling, or pain under the ribs. These need urgent review even if your last visit was fine.
                  </Text>
                  <Text style={styles.criticalInfoReminder}>
                    Sleep on your side if you can—current advice favours side lying for blood flow in late pregnancy.
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
          
          <View style={styles.trimesterCard}>
            <MaterialCommunityIcons name="trophy" size={40} color="#FFC107" />
            <View style={styles.trimesterContent}>
              <Text style={styles.trimesterTitle}>Third trimester milestone</Text>
              <Text style={styles.trimesterText}>
                If born from around 28 weeks onward, babies have a much better chance with modern neonatal care—but every extra week inside still helps.
              </Text>
            </View>
          </View>

          <View style={styles.reliefCard}>
            <MaterialCommunityIcons name="heart" size={32} color="#E91E63" />
            <View style={styles.reliefContent}>
              <Text style={styles.reliefTitle}>Nesting and planning</Text>
              <Text style={styles.reliefText}>
                Many people enjoy preparing the nursery, washing baby clothes, or freezing simple meals. Rest when you need to—growing a full-term baby is hard work.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.visualSection}>
          <View style={styles.visualCard}>
            <MaterialCommunityIcons name="calendar-check" size={40} color="#E91E63" />
            <Text style={styles.visualTitle}>Whooping cough vaccine</Text>
            <Text style={styles.visualText}>
              Many countries offer a booster in the third trimester to protect newborns—ask if it is due for you
            </Text>
          </View>
          
          <View style={styles.visualCard}>
            <MaterialCommunityIcons name="ultrasound" size={40} color="#2196F3" />
            <Text style={styles.visualTitle}>Baby’s sleep</Text>
            <Text style={styles.visualText}>
              Your baby may dream, blink, and respond to light through your tummy
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
  deliveryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  deliveryContent: {
    flex: 1,
    marginLeft: 12,
  },
  deliveryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 6,
  },
  deliveryText: {
    fontSize: 14,
    color: '#2D3436',
    lineHeight: 22,
  },
  bagCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bagContent: {
    flex: 1,
    marginLeft: 12,
  },
  bagTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 6,
  },
  bagText: {
    fontSize: 14,
    color: '#2D3436',
    lineHeight: 22,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#FF6B9D',
  },
  mcaWarningCard: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 18,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  mcaWarningContent: {
    flex: 1,
    marginLeft: 12,
  },
  mcaWarningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 10,
  },
  mcaWarningText: {
    fontSize: 15,
    color: '#2D3436',
    lineHeight: 24,
    marginBottom: 15,
  },
  misconceptionBox: {
    backgroundColor: '#FFEBEE',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F44336',
  },
  misconceptionContent: {
    flex: 1,
    marginLeft: 12,
  },
  misconceptionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#C62828',
    marginBottom: 6,
  },
  misconceptionText: {
    fontSize: 14,
    color: '#2D3436',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  criticalInfoBox: {
    backgroundColor: '#FCE4EC',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 2,
    borderColor: '#E91E63',
  },
  criticalInfoContent: {
    flex: 1,
    marginLeft: 12,
  },
  criticalInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C2185B',
    marginBottom: 8,
  },
  criticalInfoText: {
    fontSize: 14,
    color: '#2D3436',
    lineHeight: 22,
    marginBottom: 8,
  },
  criticalInfoReminder: {
    fontSize: 14,
    color: '#2D3436',
    lineHeight: 22,
    fontWeight: '600',
  },
  trimesterCard: {
    backgroundColor: '#FFF9C4',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  trimesterContent: {
    flex: 1,
    marginLeft: 12,
  },
  trimesterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 8,
  },
  trimesterText: {
    fontSize: 15,
    color: '#2D3436',
    lineHeight: 24,
  },
  reliefCard: {
    backgroundColor: '#FCE4EC',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: '#E91E63',
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

export default Week28To33Screen;

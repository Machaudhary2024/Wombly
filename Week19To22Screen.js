import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const Week19To22Screen = ({ navigation }) => {
  console.log('Week19To22Screen rendered!', navigation ? 'Navigation available' : 'No navigation');
  
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
        <Text style={styles.headerTitle}>Weeks 19-22</Text>
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
              colors={['#FFE5F1', '#FFB8D1']}
              style={styles.heroIconBg}
            >
              <MaterialCommunityIcons name="human-pregnant" size={50} color="#FF6B9D" />
            </LinearGradient>
          </View>
          <Text style={styles.heroTitle}>Mid-pregnancy</Text>
          <Text style={styles.heroSubtitle}>
            Weeks 19–22: your baby is about the length of a small banana to a carrot in many guides. You may feel clear kicks and rolls now, especially when you rest.
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
              <Text style={styles.titerTitle}>Feeling movement</Text>
            </View>
            <Text style={styles.titerText}>
              Most people feel regular movement by now. Get to know your baby’s usual pattern. If movements slow down a lot or stop, contact your maternity unit the same day—do not wait until your next routine visit.
            </Text>
          </View>

          <View style={styles.criticalCard}>
            <View style={styles.criticalHeader}>
              <MaterialCommunityIcons name="alert-circle" size={28} color="#FF6B9D" />
              <Text style={styles.criticalTitle}>Gums, teeth, and falls</Text>
            </View>
            
            <View style={styles.mcaScanCard}>
              <MaterialCommunityIcons name="ultrasound" size={24} color="#2196F3" />
              <Text style={styles.mcaScanText}>
                Hormones can make gums bleed more easily—keep brushing and see a dentist. <Text style={styles.boldText}>Wear flat, supportive shoes</Text> to reduce the risk of slips as your balance changes.
              </Text>
            </View>

            <View style={styles.iutDiscussionCard}>
              <MaterialCommunityIcons name="chat-question" size={28} color="#6C5CE7" />
              <Text style={styles.iutDiscussionTitle}>Questions worth asking your team</Text>
              <Text style={styles.iutDiscussionSubtitle}>
                Simple prompts you can use at your next visit:
              </Text>
              
              <View style={styles.questionsList}>
                <View style={styles.questionItem}>
                  <MaterialCommunityIcons name="help-circle" size={20} color="#6C5CE7" />
                  <Text style={styles.questionText}>
                    When should I have the <Text style={styles.boldText}>glucose (sugar) test</Text> for diabetes in pregnancy?
                  </Text>
                </View>
                <View style={styles.questionItem}>
                  <MaterialCommunityIcons name="doctor" size={20} color="#6C5CE7" />
                  <Text style={styles.questionText}>
                    What symptoms should make me call you between visits?
                  </Text>
                </View>
                <View style={styles.questionItem}>
                  <MaterialCommunityIcons name="hospital-building" size={20} color="#6C5CE7" />
                  <Text style={styles.questionText}>
                    Where do I go if I think labour has started or I have bleeding?
                  </Text>
                </View>
                <View style={styles.questionItem}>
                  <MaterialCommunityIcons name="chart-line" size={20} color="#6C5CE7" />
                  <Text style={styles.questionText}>
                    Are my vaccines up to date (for example whooping cough later in pregnancy)?
                  </Text>
                </View>
                <View style={styles.questionItem}>
                  <MaterialCommunityIcons name="trophy" size={20} color="#6C5CE7" />
                  <Text style={styles.questionText}>
                    Can I keep my usual exercise, work, and travel plans?
                  </Text>
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
          
          <View style={styles.viabilityCard}>
            <MaterialCommunityIcons name="information" size={28} color="#FF9800" />
            <View style={styles.viabilityContent}>
              <Text style={styles.viabilityTitle}>Premature birth</Text>
              <Text style={styles.viabilityText}>
                Babies born very early need specialist hospital care. Survival and health outcomes improve with each extra week in the womb. That is why teams work hard to prevent early birth when it is safe to do so.
              </Text>
              
              <View style={styles.planningBox}>
                <MaterialCommunityIcons name="clipboard-text" size={24} color="#FF6B9D" />
                <View style={styles.planningContent}>
                  <Text style={styles.planningTitle}>Know your hospital</Text>
                  <Text style={styles.planningText}>
                    Save the phone number for labour ward or triage in your phone. If you have tightening pains, fluid leaking, or bleeding before 37 weeks, call straight away.
                  </Text>
                  <Text style={styles.planningExample}>
                    It helps to know the route to hospital and what to bring in your bag.
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
            <MaterialCommunityIcons name="trending-up" size={32} color="#4CAF50" />
            <View style={styles.positiveContent}>
              <Text style={styles.positiveTitle}>Stronger movements</Text>
              <Text style={styles.positiveText}>
                Kicks and rolls are a reassuring sign for many parents. Partners and family can sometimes feel the baby from the outside now too.
              </Text>
            </View>
          </View>

          <View style={styles.survivalCard}>
            <MaterialCommunityIcons name="heart" size={32} color="#FF6B9D" />
            <View style={styles.survivalContent}>
              <Text style={styles.survivalTitle}>“Pregnancy glow”</Text>
              <Text style={styles.survivalText}>
                Extra blood flow can give warmer skin or fuller hair for some people. If you do not feel glowing, that is also completely normal.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.visualSection}>
          <View style={styles.visualCard}>
            <MaterialCommunityIcons name="ultrasound" size={40} color="#2196F3" />
            <Text style={styles.visualTitle}>Baby’s senses</Text>
            <Text style={styles.visualText}>
              Your baby can hear sounds from outside and may respond to voices or music
            </Text>
          </View>
          
          <View style={styles.visualCard}>
            <MaterialCommunityIcons name="medical-bag" size={40} color="#FF6B9D" />
            <Text style={styles.visualTitle}>Halfway there</Text>
            <Text style={styles.visualText}>
              Around 20 weeks is often called the midpoint of a full-term pregnancy
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
    marginBottom: 15,
  },
  mcaScanText: {
    flex: 1,
    fontSize: 15,
    color: '#2D3436',
    lineHeight: 24,
    marginLeft: 12,
  },
  iutDiscussionCard: {
    backgroundColor: '#F3E5F5',
    borderRadius: 10,
    padding: 18,
  },
  iutDiscussionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 10,
    marginTop: 8,
  },
  iutDiscussionSubtitle: {
    fontSize: 15,
    color: '#2D3436',
    lineHeight: 24,
    marginBottom: 15,
  },
  questionsList: {
    marginTop: 10,
  },
  questionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
  },
  questionText: {
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
  viabilityCard: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 18,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  viabilityContent: {
    flex: 1,
    marginLeft: 12,
  },
  viabilityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 10,
  },
  viabilityText: {
    fontSize: 15,
    color: '#2D3436',
    lineHeight: 24,
    marginBottom: 15,
  },
  planningBox: {
    backgroundColor: '#FFE5F1',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 2,
    borderColor: '#FF6B9D',
  },
  planningContent: {
    flex: 1,
    marginLeft: 12,
  },
  planningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 8,
  },
  planningText: {
    fontSize: 14,
    color: '#2D3436',
    lineHeight: 22,
    marginBottom: 6,
  },
  planningExample: {
    fontSize: 13,
    color: '#636E72',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  positiveCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
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
  survivalCard: {
    backgroundColor: '#FFE5F1',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B9D',
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

export default Week19To22Screen;

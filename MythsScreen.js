import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FloatingChatButton from './components/FloatingChatButton';

const MYTHS = [
  {
    id: '1',
    myth: 'You need to eat for two and double your calories.',
    fact: 'Most people only need about 300 extra calories per day in the second and third trimesters. Quality matters more than quantity.',
  },
  {
    id: '2',
    myth: 'You should not exercise during pregnancy.',
    fact: 'Moderate exercise is recommended for most pregnant women and can improve mood, sleep, and strength. Always check with your provider first.',
  },
  {
    id: '3',
    myth: 'Heartburn means your baby will have a lot of hair.',
    fact: 'Heartburn is caused by hormones and pressure on the stomach, not by the amount of baby hair. It\'s common and unrelated to hair growth.',
  },
  {
    id: '4',
    myth: 'Consuming large amounts of ghee or butter in the final month will make the baby "slippery" and ease childbirth.',
    fact: 'This is biologically incorrect. Ease of delivery is not linked to ghee or butter intake. Excess fat adds unnecessary calories; a balanced diet and staying active are what support a healthy pregnancy and labor.',
  },
  {
    id: '5',
    myth: 'A pregnant woman should stay in bed and rest as much as possible.',
    fact: 'Resting too much is counterproductive. Prolonged bed rest can increase the risk of blood clots and may complicate labor. Unless your provider advises it for a specific reason, moderate daily activity is healthier.',
  },
  {
    id: '6',
    myth: 'Certain diets (e.g. fair-colored foods) make the baby fairer-skinned (gora), while others make the baby dark.',
    fact: "Baby's skin tone is determined by genetics, not by what the mother eats. No food can change the baby's complexion.",
  },
  {
    id: '7',
    myth: 'Morning sickness only happens in the morning.',
    fact: 'Nausea and vomiting can happen any time of day. "Morning sickness" is a common name; for many it lasts all day, especially in the first trimester.',
  },
  {
    id: '8',
    myth: 'You must avoid cats completely.',
    fact: 'You should avoid changing cat litter (toxoplasmosis risk). You do not need to give away your cat; have someone else handle the litter and wash hands after petting.',
  },
  {
    id: '9',
    myth: 'Spicy food causes miscarriage.',
    fact: 'Spicy food does not cause miscarriage. It may trigger heartburn or nausea in some people, but it is not a cause of pregnancy loss.',
  },
  {
    id: '10',
    myth: "Belly shape or cravings predict the baby's gender.",
    fact: "Belly shape and cravings are not linked to sex. Only ultrasound, NIPT, or other medical tests can reliably indicate the baby's sex.",
  },
  {
    id: '11',
    myth: 'You cannot dye your hair while pregnant.',
    fact: 'Most evidence suggests using hair dye after the first trimester in a well-ventilated area is safe. Discuss with your provider if you have concerns.',
  },
  {
    id: '12',
    myth: 'Sleeping on your back will harm the baby.',
    fact: 'Later in pregnancy, sleeping on your side (especially left) is often recommended to improve blood flow. Short periods on your back are usually fine; your body will signal discomfort if needed.',
  },
];

const MythsScreen = ({ navigation, route }) => {
  const pregnancyWeek = route.params?.pregnancyWeek;
  const userEmail = route.params?.userEmail;

  const openChatbot = () => {
    navigation.navigate('AIChat', { pregnancyWeek, userEmail });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFE5F1', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#6C5CE7" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Myths Debunked</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>
          Common pregnancy myths and the facts behind them. Always follow your healthcare provider's advice.
        </Text>

        {MYTHS.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.mythRow}>
              <MaterialCommunityIcons name="close-circle-outline" size={22} color="#E53935" />
              <Text style={styles.mythLabel}>Myth</Text>
            </View>
            <Text style={styles.mythText}>{item.myth}</Text>
            <View style={styles.factRow}>
              <MaterialCommunityIcons name="check-circle-outline" size={22} color="#43A047" />
              <Text style={styles.factLabel}>Fact</Text>
            </View>
            <Text style={styles.factText}>{item.fact}</Text>
          </View>
        ))}

        <TouchableOpacity style={styles.chatbotCard} onPress={openChatbot} activeOpacity={0.85}>
          <LinearGradient
            colors={['#E8D5FF', '#D4B3FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.chatbotGradient}
          >
            <MaterialCommunityIcons name="robot-outline" size={48} color="#6C5CE7" />
            <Text style={styles.chatbotTitle}>Ask the AI Chatbot</Text>
            <Text style={styles.chatbotSubtitle}>Get instant answers to your pregnancy questions</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
      <FloatingChatButton navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6C5CE7',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 90,
  },
  intro: {
    fontSize: 15,
    color: '#636E72',
    marginBottom: 24,
    lineHeight: 22,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  mythRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  mythLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E53935',
    marginLeft: 8,
    textTransform: 'uppercase',
  },
  mythText: {
    fontSize: 15,
    color: '#2D3436',
    fontStyle: 'italic',
    marginBottom: 14,
    lineHeight: 22,
  },
  factRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  factLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#43A047',
    marginLeft: 8,
    textTransform: 'uppercase',
  },
  factText: {
    fontSize: 15,
    color: '#2D3436',
    lineHeight: 22,
  },
  chatbotCard: {
    marginTop: 12,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  chatbotGradient: {
    padding: 28,
    alignItems: 'center',
  },
  chatbotTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6C5CE7',
    marginTop: 12,
  },
  chatbotSubtitle: {
    fontSize: 14,
    color: '#5B4BB8',
    marginTop: 6,
  },
});

export default MythsScreen;

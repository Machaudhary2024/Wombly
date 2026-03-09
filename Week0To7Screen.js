import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const Week0To7Screen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF6B9D', '#9C27B0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
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
          <Text style={styles.heroTitle}>Early Pregnancy</Text>
          <Text style={styles.heroSubtitle}>
            Weeks 0-7: Baby starts to form — first important steps
          </Text>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBg, { backgroundColor: '#FFE5F1' }]}>
              <MaterialCommunityIcons name="baby" size={24} color="#FF6B9D" />
            </View>
            <Text style={styles.sectionTitle}>About your baby</Text>
          </View>

          <Text style={styles.checklistText}>
            In the first few weeks your baby is an embryo. Tiny cells are forming the beginnings of the brain, spine and heart. The baby is very small but developing fast.
          </Text>

          <View style={[styles.sectionHeader, { marginTop: 20 }]}>
            <View style={[styles.sectionIconBg, { backgroundColor: '#F3E5F5' }]}>
              <MaterialCommunityIcons name="shield" size={24} color="#9C27B0" />
            </View>
            <Text style={styles.sectionTitle}>Simple things you can do</Text>
          </View>

          <View style={styles.checklistItem}>
            <MaterialCommunityIcons name="pill" size={20} color="#FF6B9D" />
            <Text style={styles.checklistItemText}>Start taking folic acid if you haven't already.</Text>
          </View>

          <View style={styles.checklistItem}>
            <MaterialCommunityIcons name="smoking-off" size={20} color="#FF6B9D" />
            <Text style={styles.checklistItemText}>Avoid alcohol and smoking; limit caffeine.</Text>
          </View>

          <View style={styles.checklistItem}>
            <MaterialCommunityIcons name="hospital-box" size={20} color="#FF6B9D" />
            <Text style={styles.checklistItemText}>Check medicines with a doctor or pharmacist before taking them.</Text>
          </View>

          <View style={styles.checklistItem}>
            <MaterialCommunityIcons name="calendar-check" size={20} color="#FF6B9D" />
            <Text style={styles.checklistItemText}>Book your first antenatal appointment and follow clinic advice for blood tests.</Text>
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
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B9D',
  },
  checklistItemText: {
    flex: 1,
    fontSize: 15,
    color: '#2D3436',
    lineHeight: 22,
    marginLeft: 12,
  },
  checklistText: {
    fontSize: 15,
    color: '#2D3436',
    lineHeight: 24,
  },
  bottomSpacer: {
    height: 20,
  },
});

export default Week0To7Screen;

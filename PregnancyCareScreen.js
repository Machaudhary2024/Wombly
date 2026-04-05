import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const PregnancyCareScreen = ({ navigation, route }) => {
  const pregnancyWeek = route.params?.pregnancyWeek;
  const userEmail = route.params?.userEmail;
  const userName = route.params?.userName || '';
  const [showModal, setShowModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('');

  const showNotificationModal = (title, message, type) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const modules = [
    {
      id: 1,
      title: 'Track Pregnancy',
      subtitle: "Track your baby's growth week by week.",
      icon: 'heart-outline',
      iconColor: '#FF6B9D',
      iconBg: '#FFE5F1',
    },
    {
      id: 2,
      title: 'Get Nutrition Guide',
      subtitle: 'Essential nutrients for a healthy pregnancy.',
      icon: 'food-apple',
      iconColor: '#9C27B0',
      iconBg: '#F3E5F5',
    },
    {
      id: 3,
      title: 'Activity Tracker',
      subtitle: 'Track your steps and stay active safely.',
      icon: 'walk',
      iconColor: '#FF6B9D',
      iconBg: '#FFE5F1',
    },
    {
      id: 4,
      title: 'Dos & Don\'ts',
      subtitle: 'Safe foods and activities during pregnancy.',
      icon: 'check-circle-outline',
      iconColor: '#9C27B0',
      iconBg: '#F3E5F5',
    },
    {
      id: 5,
      title: 'Set Reminders',
      subtitle: 'Never miss an appointment or medication.',
      icon: 'bell-outline',
      iconColor: '#FF6B9D',
      iconBg: '#FFE5F1',
    },
    {
      id: 6,
      title: 'Get Postpartum Guidance',
      subtitle: 'Guidance for your body and mind after birth.',
      icon: 'account-heart',
      iconColor: '#9C27B0',
      iconBg: '#F3E5F5',
    },
    {
      id: 7,
      title: 'Myths',
      subtitle: 'Debunking common pregnancy myths.',
      icon: 'help-circle-outline',
      iconColor: '#FF6B9D',
      iconBg: '#FFE5F1',
    },
  ];

  const handleModulePress = (module) => {
    console.log('=== MODULE PRESSED ===', module.title);

    if (module.title === 'Track Pregnancy') {
      navigation.navigate('TrackPregnancy', {
        pregnancyWeek,
        userEmail: route.params?.userEmail
      });
    } else if (module.title === 'Get Nutrition Guide') {
      navigation.navigate('NutritionGuide');
    } else if (module.title === 'Activity Tracker') {
      navigation.navigate('ActivityTracking');
    } else if (module.title === 'Dos & Don\'ts') {
      navigation.navigate('DosDonts');
    } else if (module.title === 'Set Reminders') {
      navigation.navigate('SetReminders');
    } else if (module.title === 'Get Postpartum Guidance') {
      navigation.navigate('PostpartumRecovery');
    } else if (module.title === 'Myths') {
      navigation.navigate('Myths');
    } else {
      console.log('Other module pressed:', module.title);
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    showNotificationModal('Logout Successful', 'You have been logged out successfully.', 'success');
    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#f0cfe3', '#de81fa']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#961e46" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pregnancy</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      {/* Subtle welcome banner consistent with HomeScreen */}
      {userName ? (
        <View style={styles.subBannerWrap}>
          <LinearGradient
            colors={['#f0cfe3', '#de81fa']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.subBanner}
          >
            <Text style={styles.subBannerText}>Welcome, {userName}!</Text>
          </LinearGradient>
        </View>
      ) : null}

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {modules.map((module) => (
          <TouchableOpacity
            key={module.id}
            style={styles.moduleCard}
            activeOpacity={0.8}
            onPress={() => handleModulePress(module)}
          >
            <LinearGradient colors={['#FFFFFF', '#F8FAFF']} style={styles.moduleGradient}>
              <View style={styles.cardContent}>
                <View style={[styles.iconCircle, { backgroundColor: module.iconBg }]}>
                  <MaterialCommunityIcons
                    name={module.icon}
                    size={28}
                    color={module.iconColor}
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.moduleTitle}>{module.title}</Text>
                  <Text style={styles.moduleSubtitle}>{module.subtitle}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#636E72" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        transparent
        visible={showLogoutConfirm}
        animationType="fade"
        onRequestClose={() => setShowLogoutConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalBox}>
            <Text style={styles.confirmTitle}>Confirm Logout</Text>
            <Text style={styles.confirmMessage}>Are you sure you want to logout?</Text>
            <View style={styles.confirmButtonContainer}>
              <TouchableOpacity
                style={[styles.confirmButton, styles.cancelButton]}
                onPress={() => setShowLogoutConfirm(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton, styles.logoutButton]}
                onPress={confirmLogout}
              >
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success/Error Notification Modal */}
      <Modal
        transparent
        visible={showModal}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <MaterialCommunityIcons
              name={modalType === 'success' ? 'check-circle' : 'alert-circle'}
              size={50}
              color={modalType === 'success' ? '#00B894' : '#FF6B9D'}
              style={styles.modalIcon}
            />
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity
              style={[
                styles.modalButton,
                modalType === 'success' ? styles.successButton : styles.errorButton,
              ]}
              onPress={closeModal}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    padding: 15,
    paddingBottom: 90,
  },
  subBannerWrap: {
    paddingHorizontal: 15,
    marginTop: 12,
    marginBottom: 8,
  },
  subBanner: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  subBannerText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  moduleCard: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  moduleGradient: {
    padding: 12,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 4,
  },
  moduleSubtitle: {
    fontSize: 14,
    color: '#636E72',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmModalBox: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 12,
  },
  confirmMessage: {
    fontSize: 14,
    color: '#636E72',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  confirmButtonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E8E8E8',
  },
  cancelButtonText: {
    color: '#2D3436',
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#FF6B9D',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  modalBox: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalIcon: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    color: '#636E72',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  successButton: {
    backgroundColor: '#00B894',
  },
  errorButton: {
    backgroundColor: '#FF6B9D',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default PregnancyCareScreen;

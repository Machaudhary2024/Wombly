import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Dimensions, Modal, Platform, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation, route }) => {
  const userName = route.params?.userName || 'User';
  const userEmail = route.params?.userEmail;
  const showLoginSuccess = route.params?.showLoginSuccess || false;

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLoginSuccessModal, setShowLoginSuccessModal] = useState(false);

  // Animation refs for floating elements
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;

  // Start floating animations
  useEffect(() => {
    if (Platform.OS === 'android') {
      return;
    }

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim1, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim1, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim2, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim2, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim3, {
          toValue: 1,
          duration: 6000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim3, {
          toValue: 0,
          duration: 6000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim1, floatAnim2, floatAnim3]);

  // Show login success modal on first load
  useEffect(() => {
    if (showLoginSuccess) {
      setShowLoginSuccessModal(true);
      const timer = setTimeout(() => {
        setShowLoginSuccessModal(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showLoginSuccess]);

  const translateY1 = floatAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: Platform.OS === 'android' ? [0, 0] : [0, -15],
  });

  const translateY2 = floatAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: Platform.OS === 'android' ? [0, 0] : [0, -18],
  });

  const translateY3 = floatAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: Platform.OS === 'android' ? [0, 0] : [0, -12],
  });

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    navigation.navigate('Login');
  };

  const handleManageProfile = () => {
    navigation.navigate('AccountInfo', { userEmail });
  };

  return (
    <LinearGradient
      colors={['#E8D5FF', '#D4B3FF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      {/* Animated Background Elements - Mother Figure Concept */}
      <Animated.View
        style={[
          styles.backgroundElementLarge,
          { transform: [{ translateY: translateY1 }] },
        ]}
      >
        <View style={styles.motherFigureContainer}>
          <MaterialCommunityIcons name="human-pregnant" size={100} color="rgba(255, 107, 157, 0.15)" />
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.backgroundElementMedium,
          { transform: [{ translateY: translateY2 }] },
        ]}
      >
        <View style={styles.decorativeCircle1} />
      </Animated.View>

      <Animated.View
        style={[
          styles.backgroundElementSmall,
          { transform: [{ translateY: translateY3 }] },
        ]}
      >
        <View style={styles.decorativeCircle2} />
      </Animated.View>

      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
        <Text style={styles.appName}>WOMBLY</Text>
        <View style={styles.headerButtonsGroup}>
          <TouchableOpacity onPress={handleManageProfile} style={styles.profileButton}>
            <MaterialCommunityIcons name="account-circle" size={32} color="#FF6B9D" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleLogout} 
            style={[styles.profileButton, styles.logoutIconButton]}
          >
            <MaterialCommunityIcons name="logout" size={28} color="#FF6B9D" />
          </TouchableOpacity>
        </View>
      </View>

        {/* Welcome Banner */}
        <View style={styles.welcomeBannerContainer}>
          <LinearGradient
            colors={['#f0cfe3', '#de81fa']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.welcomeBanner}
          >
            <View style={styles.bannerContent}>
              <Text style={styles.bannerWelcome}>Welcome, <Text style={styles.userName}>{userName}</Text>! 👋</Text>
              <Text style={styles.bannerTitle}>Committed To Support You</Text>
              <Text style={styles.bannerSubtitle}>Through Your Journey To Motherhood</Text>
            </View>
            <MaterialCommunityIcons name="heart" size={40} color="#eb4a7a" style={styles.bannerIcon} />
          </LinearGradient>
        </View>

        <TouchableOpacity 
          style={styles.card} 
          activeOpacity={0.85}
          onPress={() => navigation.navigate('PregnancyCare', { 
            pregnancyWeek: route.params?.pregnancyWeek,
            userEmail: route.params?.userEmail
          })}
        >
          <LinearGradient
            colors={['#FFE5F1', '#FFD4E5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGradient}
          >
            <View style={styles.cardTop}>
              <View style={[styles.iconCircle, styles.pregnancyIconBg]}>
                <MaterialCommunityIcons name="human-pregnant" size={50} color="#FF6B9D" />
              </View>
              <View style={styles.badgeContainer}>
                <MaterialCommunityIcons name="star" size={16} color="#FFA500" />
              </View>
            </View>
            <Text style={styles.cardTitle}>Pregnancy Care</Text>
            <Text style={styles.cardDescription}>
              Track your journey week by week. Get trimester-specific tips and personalized guidance.
            </Text>
            <View style={styles.cardFooter}>
              <MaterialCommunityIcons name="arrow-right-circle" size={24} color="#FF6B9D" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card} 
          activeOpacity={0.85}
          onPress={() => navigation.navigate('ToddlerCare', { 
            userEmail: route.params?.userEmail,
            userName: userName,
          })}
        >
          <LinearGradient
            colors={['#E8D5FF', '#D9C5FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGradient}
          >
            <View style={styles.cardTop}>
              <View style={[styles.iconCircle, styles.toddlerIconBg]}>
                <MaterialCommunityIcons name="baby-carriage" size={50} color="#6C5CE7" />
              </View>
              <View style={styles.badgeContainer}>
                <MaterialCommunityIcons name="star" size={16} color="#FFA500" />
              </View>
            </View>
            <Text style={styles.cardTitle}>Toddler Care</Text>
            <Text style={styles.cardDescription}>
              Learn nurturing tips, meal plans, and developmental milestones for your little ones.
            </Text>
            <View style={styles.cardFooter}>
              <MaterialCommunityIcons name="arrow-right-circle" size={24} color="#6C5CE7" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card} 
          activeOpacity={0.85}
          onPress={() => navigation.navigate('AIChat', { 
            userEmail: route.params?.userEmail,
            userName: userName
          })}
        >
          <LinearGradient
            colors={['#C8F7DC', '#B3F5D1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGradient}
          >
            <View style={styles.cardTop}>
              <View style={[styles.iconCircle, styles.chatbotIconBg]}>
                <MaterialCommunityIcons name="chat-processing" size={50} color="#00B894" />
              </View>
              <View style={styles.badgeContainer}>
                <MaterialCommunityIcons name="star" size={16} color="#FFA500" />
              </View>
            </View>
            <Text style={styles.cardTitle}>AI Chatbot Assistant</Text>
            <Text style={styles.cardDescription}>
              Ask any question, anytime. Get instant expert guidance from our intelligent support assistant.
            </Text>
            <View style={styles.cardFooter}>
              <MaterialCommunityIcons name="arrow-right-circle" size={24} color="#00B894" />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* 
      Logout Confirmation Modal: We made a custom modal because the 
       The React Alert API has limitations and doesn't work reliably on all platforms.
       It was disabling the logout button overall. Same approach has been used in AIChatScreen
       P.S Kashaf <3
       */}
      <Modal
        transparent={true}
        visible={showLogoutModal}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <MaterialCommunityIcons name="logout" size={40} color="#FF6B9D" />
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to logout? You will need to sign in again to access your account.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonNo]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.modalButtonNoText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonYes]}
                onPress={confirmLogout}
              >
                <Text style={styles.modalButtonYesText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Login Success Modal */}
      <Modal
        transparent={true}
        visible={showLoginSuccessModal}
        animationType="fade"
        onRequestClose={() => setShowLoginSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <MaterialCommunityIcons name="check-circle" size={50} color="#00B894" />
            <Text style={styles.modalTitle}>Login Successful!</Text>
            <Text style={styles.modalMessage}>
              Welcome to Wombly. You're all set to start your journey.
            </Text>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  // Background animated elements
  backgroundElementLarge: {
    position: 'absolute',
    right: -40,
    top: 80,
    opacity: 1,
    zIndex: 0,
  },
  backgroundElementMedium: {
    position: 'absolute',
    left: -30,
    top: 300,
    opacity: 1,
    zIndex: 0,
  },
  backgroundElementSmall: {
    position: 'absolute',
    right: -20,
    bottom: 200,
    opacity: 1,
    zIndex: 0,
  },
  motherFigureContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  decorativeCircle1: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(212, 179, 255, 0.4)',
  },
  decorativeCircle2: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 107, 157, 0.3)',
  },
  // Header and navigation
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    zIndex: 10,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#961e46',
  },
  headerButtonsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  logoutIconButton: {
    paddingRight: 10,
  },
  // Welcome banner
  welcomeBannerContainer: {
    marginBottom: 25,
    marginTop: 10,
    borderRadius: 16,
    overflow: 'hidden',
  },
  welcomeBanner: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  bannerContent: {
    flex: 1,
    marginRight: 15,
  },
  bannerWelcome: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
    lineHeight: 22,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#eb4a7a',
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
    lineHeight: 20,
  },
  bannerSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#eb4a7a',
    lineHeight: 18,
  },
  bannerIcon: {
    marginLeft: 10,
  },
  // Scroll view
  scrollView: {
    flex: 1,
    marginTop: 10,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  // Cards
  card: {
    borderRadius: 20,
    marginBottom: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  cardGradient: {
    padding: 24,
    borderRadius: 20,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pregnancyIconBg: {
    backgroundColor: '#FFFFFF',
  },
  toddlerIconBg: {
    backgroundColor: '#FFFFFF',
  },
  chatbotIconBg: {
    backgroundColor: '#FFFFFF',
  },
  badgeContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: '#636E72',
    lineHeight: 21,
    marginBottom: 16,
  },
  cardFooter: {
    alignItems: 'flex-end',
  },
  // Logout button
  logoutButtonContainer: {
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center',
    borderRadius: 16,
    overflow: 'hidden',
  },
  logoutButton: {
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  // Logout Confirmation Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginTop: 12,
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: '#636E72',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  modalButton: {
    flex: 1,
    minWidth: 100,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonNo: {
    backgroundColor: '#F0F0F0',
  },
  modalButtonYes: {
    backgroundColor: '#FF6B9D',
  },
  modalButtonNoText: {
    color: '#2D3436',
    fontWeight: '600',
    fontSize: 15,
  },
  modalButtonYesText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
    textAlign: 'center',
  },
});

export default HomeScreen;

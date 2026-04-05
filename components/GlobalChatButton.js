// components/GlobalChatButton.js
// Single global floating chat button rendered once in App.js.
// Reads user info from UserContext (set at login) — works on every screen.
// Hidden on auth screens and on the AIChat screen itself.

import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated, Platform } from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../context/UserContext';

// Screens where the FAB should NOT appear
const HIDDEN_SCREENS = ['Login', 'SignUp', 'OTPVerification', 'ForgotPassword', 'ResetPassword', 'ChangePassword', 'AIChat', 'AccountInfo', 'Home'];

const GlobalChatButton = () => {
  const navigation = useNavigation();
  const { user } = useUser();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Get current route name from navigation state
  const routeName = useNavigationState((state) => {
    if (!state || !state.routes || state.routes.length === 0) return null;
    return state.routes[state.index]?.name;
  });
 
  // console.log('GlobalChatButton - Current Route:', routeName);

  // Hide on auth screens, AIChat, and when no user is logged in
  const shouldShow = routeName && !HIDDEN_SCREENS.includes(routeName) && !!user.email;

  useEffect(() => {
    if (Platform.OS === 'android') return;

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.1, duration: 1500, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ])
    );
    pulseLoop.start();
    return () => pulseLoop.stop();
  }, [scaleAnim]);

  if (!shouldShow) return null;

  const handlePress = () => {
    navigation.navigate('AIChat', {
      userEmail: user.email,
      userName: user.name || 'User',
    });
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity style={styles.button} onPress={handlePress} activeOpacity={0.8}>
        <LinearGradient
          colors={['#de81fa', '#b054d4']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <MaterialCommunityIcons name="chat-processing" size={28} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 100,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  gradient: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GlobalChatButton;

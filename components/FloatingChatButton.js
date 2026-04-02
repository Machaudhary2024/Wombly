import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated, Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const FloatingChatButton = ({ navigation, userEmail, userName }) => {
  const route = useRoute();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (Platform.OS === 'android') {
      return;
    }

    // Pulsing animation
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    pulseLoop.start();

    return () => {
      pulseLoop.stop();
    };
  }, [scaleAnim]);

  const handlePress = () => {
    const resolvedUserEmail = userEmail || route.params?.userEmail;
    const resolvedUserName = userName || route.params?.userName || 'User';

    navigation.navigate('AIChat', {
      userEmail: resolvedUserEmail || undefined,
      userName: resolvedUserName,
    });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.button}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#00B894', '#009E7F']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <MaterialCommunityIcons name="robot" size={28} color="#FFFFFF" />
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

export default FloatingChatButton;

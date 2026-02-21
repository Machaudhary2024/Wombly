import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Sensors from 'expo-sensors';

const { width } = Dimensions.get('window');

const ActivityTrackingScreen = ({ navigation, route }) => {
  const [steps, setSteps] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(5000);
  const [calories, setCalories] = useState(0);
  const [distance, setDistance] = useState(0);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [tempGoal, setTempGoal] = useState('5000');
  const [showSummary, setShowSummary] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [encouragementMessage, setEncouragementMessage] = useState('');
  const [isTracking, setIsTracking] = useState(true);
  
  const accelerometerSubscription = useRef(null);
  const stepCountRef = useRef(0);
  const lastStepTime = useRef(Date.now());
  const accelerationHistory = useRef([]);

  useEffect(() => {
    if (isTracking) {
      startStepTracking();
    } else {
      stopStepTracking();
    }
    return () => {
      stopStepTracking();
    };
  }, [isTracking]);

  useEffect(() => {
    updateMetrics();
    updateEncouragementMessage();
  }, [steps, dailyGoal]);

  const startStepTracking = async () => {
    try {
      const isAvailable = await Sensors.Accelerometer.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert(
          'Sensor Unavailable',
          'Your device does not support step tracking. Please use Google Fit or Apple Health integration.',
          [{ text: 'OK' }]
        );
        return;
      }

      Sensors.Accelerometer.setUpdateInterval(80);

      accelerometerSubscription.current = Sensors.Accelerometer.addListener(
        handleAccelerometerData
      );
    } catch (error) {
      console.error('Error starting step tracking:', error);
      Alert.alert('Error', 'Could not start step tracking. Please check permissions.');
    }
  };

  const stopStepTracking = () => {
    if (accelerometerSubscription.current) {
      accelerometerSubscription.current.remove();
      accelerometerSubscription.current = null;
    }
  };

  const handleAccelerometerData = ({ x, y, z }) => {
    const magnitude = Math.sqrt(x * x + y * y + z * z);
    const adjusted = Math.abs(magnitude - 1);
    const now = Date.now();

    accelerationHistory.current.push(adjusted);
    if (accelerationHistory.current.length > 25) {
      accelerationHistory.current.shift();
    }
    if (accelerationHistory.current.length < 12) return;

    const avg = accelerationHistory.current.reduce((sum, v) => sum + v, 0) / accelerationHistory.current.length;
    const variance = accelerationHistory.current.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / accelerationHistory.current.length;
    const dynamicThreshold = Math.max(0.08, Math.min(0.2, avg + Math.sqrt(variance) * 1.2));
    const timeSinceLastStep = now - lastStepTime.current;

    if (adjusted > dynamicThreshold && timeSinceLastStep > 250) {
      stepCountRef.current += 1;
      lastStepTime.current = now;
      setSteps(stepCountRef.current);
    }
  };

  const updateMetrics = () => {
    const avgStrideLength = 0.67;
    const distanceInMeters = steps * avgStrideLength;
    const distanceInKm = distanceInMeters / 1000;
    setDistance(parseFloat(distanceInKm.toFixed(2)));

    const caloriesPerStep = 0.04;
    const estimatedCalories = steps * caloriesPerStep;
    setCalories(Math.round(estimatedCalories));
  };

  const updateEncouragementMessage = () => {
    const percentage = (steps / dailyGoal) * 100;
    let message = '';

    if (percentage >= 100) {
      const messages = [
        'Amazing! You reached your goal today! 🌟',
        'You\'re doing wonderfully! Keep it up! 💪',
        'Fantastic progress! Your body will thank you! ✨',
      ];
      message = messages[Math.floor(Math.random() * messages.length)];
    } else if (percentage >= 75) {
      const messages = [
        'You\'re almost there! So close to your goal! 🌈',
        'Great job! Just a bit more to go! 💖',
        'You\'re doing great! Keep moving gently! 🌸',
      ];
      message = messages[Math.floor(Math.random() * messages.length)];
    } else if (percentage >= 50) {
      const messages = [
        'You\'re halfway there! Every step counts! 🌺',
        'Nice progress! Listen to your body and rest when needed. 🌿',
        'You\'re doing well! Take it at your own pace. 💕',
      ];
      message = messages[Math.floor(Math.random() * messages.length)];
    } else if (percentage >= 25) {
      const messages = [
        'Good start! Remember, gentle movement is best. 🌷',
        'Every step matters! Take breaks when you need them. 🌻',
        'You\'re on the right track! Listen to your body. 🌼',
      ];
      message = messages[Math.floor(Math.random() * messages.length)];
    } else {
      const messages = [
        'Getting started is the hardest part! You\'ve got this! 🌱',
        'Remember: any movement is good movement during pregnancy. 🌿',
        'Take it easy and listen to what your body needs. 💚',
      ];
      message = messages[Math.floor(Math.random() * messages.length)];
    }

    setEncouragementMessage(message);
  };

  const handleSetGoal = () => {
    const goal = parseInt(tempGoal);
    if (isNaN(goal) || goal < 1000 || goal > 15000) {
      Alert.alert('Invalid Goal', 'Please enter a goal between 1,000 and 15,000 steps.');
      return;
    }
    setDailyGoal(goal);
    setShowGoalModal(false);
    Alert.alert('Goal Updated', `Your daily goal is now ${goal.toLocaleString()} steps.`);
  };

  const resetDailySteps = () => {
    Alert.alert(
      'Reset Steps',
      'Are you sure you want to reset today\'s steps?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            stepCountRef.current = 0;
            setSteps(0);
            setCalories(0);
            setDistance(0);
          },
        },
      ]
    );
  };

  const getProgressColor = () => {
    const percentage = (steps / dailyGoal) * 100;
    if (percentage >= 100) return '#4CAF50';
    if (percentage >= 75) return '#8BC34A';
    if (percentage >= 50) return '#FFC107';
    if (percentage >= 25) return '#FF9800';
    return '#FF6B9D';
  };

  const progressPercentage = Math.min((steps / dailyGoal) * 100, 100);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFE5F1', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#6C5CE7" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Activity Tracker</Text>
          <TouchableOpacity
            onPress={() => setShowSummary(true)}
            style={styles.summaryButton}
          >
            <MaterialCommunityIcons name="chart-line" size={24} color="#6C5CE7" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mainCard}>
            <View style={styles.stepCounterContainer}>
              <Text style={styles.stepNumber}>{steps.toLocaleString()}</Text>
              <Text style={styles.stepLabel}>Steps Today</Text>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressBarBackground}>
                <LinearGradient
                  colors={[getProgressColor(), getProgressColor() + '80']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressBar, { width: `${progressPercentage}%` }]}
                />
              </View>
              <Text style={styles.goalText}>
                {steps.toLocaleString()} / {dailyGoal.toLocaleString()} steps
              </Text>
            </View>

            <View style={styles.encouragementContainer}>
              <MaterialCommunityIcons name="heart" size={20} color="#FF6B9D" />
              <Text style={styles.encouragementText}>{encouragementMessage}</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="fire" size={32} color="#FF9800" />
              <Text style={styles.statValue}>{calories}</Text>
              <Text style={styles.statLabel}>Calories</Text>
              <Text style={styles.statSubtext}>Energy spent</Text>
            </View>

            <View style={styles.statCard}>
              <MaterialCommunityIcons name="map-marker-distance" size={32} color="#9C27B0" />
              <Text style={styles.statValue}>{distance}</Text>
              <Text style={styles.statLabel}>Kilometers</Text>
              <Text style={styles.statSubtext}>Distance walked</Text>
            </View>
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowGoalModal(true)}
            >
              <MaterialCommunityIcons name="target" size={24} color="#6C5CE7" />
              <Text style={styles.actionButtonText}>Set Daily Goal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={() => setIsTracking(!isTracking)}
            >
              <MaterialCommunityIcons
                name={isTracking ? 'pause-circle' : 'play-circle'}
                size={24}
                color="#6C5CE7"
              />
              <Text style={styles.actionButtonText}>
                {isTracking ? 'Pause Tracking' : 'Resume Tracking'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.resetButton]}
              onPress={resetDailySteps}
            >
              <MaterialCommunityIcons name="refresh" size={24} color="#F44336" />
              <Text style={[styles.actionButtonText, styles.resetButtonText]}>
                Reset Today
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.disclaimerButton}
            onPress={() => setShowDisclaimer(true)}
          >
            <MaterialCommunityIcons name="information" size={20} color="#636E72" />
            <Text style={styles.disclaimerButtonText}>Health & Safety Information</Text>
          </TouchableOpacity>
        </ScrollView>

        <Modal
          visible={showGoalModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowGoalModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Set Daily Step Goal</Text>
              <Text style={styles.modalSubtitle}>
                Recommended: 5,000-7,000 steps for pregnant women
              </Text>
              <TextInput
                style={styles.goalInput}
                value={tempGoal}
                onChangeText={setTempGoal}
                keyboardType="numeric"
                placeholder="Enter goal (1,000 - 15,000)"
                placeholderTextColor="#999"
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowGoalModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleSetGoal}
                >
                  <Text style={styles.saveButtonText}>Save Goal</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showSummary}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowSummary(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Today's Summary</Text>
              <View style={styles.summaryStats}>
                <View style={styles.summaryStat}>
                  <MaterialCommunityIcons name="walk" size={40} color="#6C5CE7" />
                  <Text style={styles.summaryValue}>{steps.toLocaleString()}</Text>
                  <Text style={styles.summaryLabel}>Steps</Text>
                </View>
                <View style={styles.summaryStat}>
                  <MaterialCommunityIcons name="map-marker-distance" size={40} color="#9C27B0" />
                  <Text style={styles.summaryValue}>{distance}</Text>
                  <Text style={styles.summaryLabel}>Kilometers</Text>
                </View>
                <View style={styles.summaryStat}>
                  <MaterialCommunityIcons name="fire" size={40} color="#FF9800" />
                  <Text style={styles.summaryValue}>{calories}</Text>
                  <Text style={styles.summaryLabel}>Calories</Text>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={() => setShowSummary(false)}
              >
                <Text style={styles.saveButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showDisclaimer}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowDisclaimer(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.disclaimerModal}>
              <Text style={styles.disclaimerTitle}>Health & Safety Information</Text>
              <ScrollView style={styles.disclaimerContent}>
                <Text style={styles.disclaimerText}>
                  <Text style={styles.disclaimerBold}>Important:</Text> Always consult with your
                  healthcare provider before starting or continuing any exercise routine during
                  pregnancy.
                </Text>
                <Text style={styles.disclaimerText}>
                  <Text style={styles.disclaimerBold}>Listen to your body:</Text> If you experience
                  any discomfort, dizziness, shortness of breath, or unusual symptoms, stop
                  immediately and rest.
                </Text>
                <Text style={styles.disclaimerText}>
                  <Text style={styles.disclaimerBold}>Stay hydrated:</Text> Drink plenty of water
                  before, during, and after physical activity.
                </Text>
                <Text style={styles.disclaimerText}>
                  <Text style={styles.disclaimerBold}>Avoid overexertion:</Text> Gentle, moderate
                  activity is recommended. Avoid activities that involve jumping, sudden changes in
                  direction, or risk of falling.
                </Text>
                <Text style={styles.disclaimerText}>
                  <Text style={styles.disclaimerBold}>Step counting accuracy:</Text> Step counts
                  are estimates and may vary. This tool is for general wellness tracking, not
                  medical monitoring.
                </Text>
              </ScrollView>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={() => setShowDisclaimer(false)}
              >
                <Text style={styles.saveButtonText}>I Understand</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6C5CE7',
    flex: 1,
    textAlign: 'center',
  },
  summaryButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  stepCounterContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  stepNumber: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#6C5CE7',
    marginBottom: 10,
  },
  stepLabel: {
    fontSize: 18,
    color: '#636E72',
    fontWeight: '500',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    borderRadius: 6,
  },
  goalText: {
    fontSize: 14,
    color: '#636E72',
    textAlign: 'center',
  },
  encouragementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F5',
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  encouragementText: {
    fontSize: 14,
    color: '#6C5CE7',
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3436',
    marginTop: 10,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 5,
  },
  statSubtext: {
    fontSize: 12,
    color: '#636E72',
  },
  actionsContainer: {
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3E5F5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: '#E8D5FF',
  },
  resetButton: {
    backgroundColor: '#FFEBEE',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6C5CE7',
    marginLeft: 10,
  },
  resetButtonText: {
    color: '#F44336',
  },
  disclaimerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginTop: 10,
  },
  disclaimerButtonText: {
    fontSize: 14,
    color: '#636E72',
    marginLeft: 8,
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#636E72',
    marginBottom: 20,
    textAlign: 'center',
  },
  goalInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#F9F9F9',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#636E72',
  },
  saveButton: {
    backgroundColor: '#6C5CE7',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 30,
  },
  summaryStat: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
    marginTop: 10,
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#636E72',
  },
  disclaimerModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxHeight: '80%',
  },
  disclaimerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 20,
    textAlign: 'center',
  },
  disclaimerContent: {
    maxHeight: 400,
    marginBottom: 20,
  },
  disclaimerText: {
    fontSize: 14,
    color: '#2D3436',
    lineHeight: 22,
    marginBottom: 15,
  },
  disclaimerBold: {
    fontWeight: 'bold',
    color: '#6C5CE7',
  },
});

export default ActivityTrackingScreen;


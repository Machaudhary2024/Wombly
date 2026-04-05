import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const StatusModal = ({ visible, type = 'success', title, message, onClose, buttonText = 'OK' }) => {
  const isSuccess = type === 'success';
  const isError = type === 'error';
  const isWarning = type === 'warning';

  const getIcon = () => {
    if (isSuccess) return 'check-circle';
    if (isError) return 'alert-circle';
    if (isWarning) return 'alert';
    return 'information';
  };

  const getIconColor = () => {
    if (isSuccess) return '#10B981';
    if (isError) return '#EF4444';
    if (isWarning) return '#F59E0B';
    return '#3B82F6';
  };

  const getButtonColor = () => {
    if (isSuccess) return ['#FF6B9D', '#FF8FB3'];
    if (isError) return ['#EF4444', '#DC2626'];
    if (isWarning) return ['#F59E0B', '#D97706'];
    return ['#3B82F6', '#1D4ED8'];
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlayContainer}>
        <View style={styles.modalContent}>
          {/* Icon */}
          <View style={styles.iconWrapper}>
            <View style={[styles.iconCircle, { borderColor: getIconColor() }]}>
              <MaterialCommunityIcons name={getIcon()} size={44} color={getIconColor()} />
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Message */}
          <Text style={styles.message}>{message}</Text>

          {/* Button */}
          <TouchableOpacity activeOpacity={0.8} onPress={onClose} style={styles.buttonWrapper}>
            <LinearGradient colors={getButtonColor()} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.button}>
              <Text style={styles.buttonText}>{buttonText}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  iconWrapper: {
    marginBottom: 16,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 24,
  },
  buttonWrapper: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  button: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default StatusModal;

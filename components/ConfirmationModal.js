import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const ConfirmationModal = ({ visible, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel', type = 'warning' }) => {
  const getIconColor = () => {
    if (type === 'warning') return '#F59E0B';
    if (type === 'error') return '#EF4444';
    return '#3B82F6';
  };

  const getIcon = () => {
    if (type === 'warning') return 'alert';
    if (type === 'error') return 'alert-circle';
    return 'help-circle';
  };

  const getConfirmColor = () => {
    if (type === 'error') return ['#EF4444', '#DC2626'];
    return ['#FF6B9D', '#FF8FB3'];
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
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

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity activeOpacity={0.8} onPress={onCancel} style={styles.cancelButtonWrapper}>
              <View style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>{cancelText}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.8} onPress={onConfirm} style={styles.confirmButtonWrapper}>
              <LinearGradient colors={getConfirmColor()} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>{confirmText}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
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
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelButtonWrapper: {
    flex: 1,
  },
  cancelButton: {
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#F5F0FF',
    borderRadius: 16,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8A7BA8',
  },
  confirmButtonWrapper: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  confirmButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default ConfirmationModal;

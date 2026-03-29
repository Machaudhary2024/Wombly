import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Modal, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { API_BASE_URL } from './apiConfig';
import FloatingChatButton from './components/FloatingChatButton';

const AccountInfoScreen = ({ navigation, route }) => {
  const userEmail = route.params?.userEmail;
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const emptyUserData = { name: '', age: '', height: '', weight: '', email: '', phone: '', pregnancyWeek: '' };
  const [userData, setUserData] = useState(emptyUserData);
  const [originalUserData, setOriginalUserData] = useState(emptyUserData);

  useEffect(() => {
    fetchUserData();
  }, []);

  const cancelEditing = useCallback(() => {
    setEditing(false);
    setUserData(originalUserData);
  }, [originalUserData]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (editing) {
          cancelEditing();
          return true;
        }
        return false;
      };
      const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => sub.remove();
    }, [editing, cancelEditing])
  );

  const fetchUserData = async () => {
    if (!userEmail) {
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/user?email=${encodeURIComponent(userEmail)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error(`Failed to fetch user data: ${response.status}`);
      const data = await response.json();
      if (data.success) {
        const loaded = {
          name: data.user.name || '',
          age: data.user.age !== null && data.user.age !== undefined ? data.user.age.toString() : '',
          height: data.user.height !== null && data.user.height !== undefined ? data.user.height.toString() : '',
          weight: data.user.weight !== null && data.user.weight !== undefined ? data.user.weight.toString() : '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          pregnancyWeek: data.user.pregnancyWeek !== null && data.user.pregnancyWeek !== undefined ? data.user.pregnancyWeek.toString() : '',
        };
        setUserData(loaded);
        setOriginalUserData(loaded);
      } else {
        throw new Error(data.message || 'Failed to load user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const validatePakistaniMobile = (phone) => {
    if (!phone) return { valid: false, message: 'Phone number is required' };
    const cleanedPhone = phone.replace(/\D/g, '');
    if (cleanedPhone.length < 10 || cleanedPhone.length > 11)
      return { valid: false, message: 'Phone number must be 10-11 digits' };
    return { valid: true };
  };

  const handleUpdate = async () => {
    if (!userData.name || !userData.age || !userData.email || !userData.phone) return;
    if (!/^[A-Za-z\s]+$/.test(userData.name.trim())) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email.trim())) return;
    const phoneCheck = validatePakistaniMobile(userData.phone);
    if (!phoneCheck.valid) return;
    const ageNum = parseInt(userData.age);
    const heightNum = userData.height ? parseFloat(userData.height) : undefined;
    const weightNum = userData.weight ? parseFloat(userData.weight) : undefined;
    const pregnancyWeekNum = userData.pregnancyWeek ? parseInt(userData.pregnancyWeek) : undefined;
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 100) return;
    if (userData.height && (isNaN(heightNum) || heightNum < 50 || heightNum > 250)) return;
    if (userData.weight && (isNaN(weightNum) || weightNum < 20 || weightNum > 200)) return;
    if (pregnancyWeekNum && (pregnancyWeekNum < 1 || pregnancyWeekNum > 38)) return;
    setShowConfirmModal(true);
  };

  const confirmUpdate = async () => {
    setIsUpdating(true);
    const ageNum = parseInt(userData.age);
    const heightNum = userData.height ? parseFloat(userData.height) : undefined;
    const weightNum = userData.weight ? parseFloat(userData.weight) : undefined;
    const pregnancyWeekNum = userData.pregnancyWeek ? parseInt(userData.pregnancyWeek) : undefined;
    try {
      const response = await fetch(`${API_BASE_URL}/api/update-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          name: userData.name,
          age: ageNum,
          ...(heightNum !== undefined && { height: heightNum }),
          ...(weightNum !== undefined && { weight: weightNum }),
          phone: userData.phone,
          ...(pregnancyWeekNum !== undefined && { pregnancyWeek: pregnancyWeekNum }),
        }),
      });
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) return;
      const data = await response.json();
      if (data.success) {
        setShowConfirmModal(false);
        setEditing(false);
        fetchUserData();
      } else {
        setShowConfirmModal(false);
      }
    } catch (error) {
      console.error('Update error:', error);
      setShowConfirmModal(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const getInitials = (name) => {
    if (!name || !name.trim()) return '?';
    return name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <LinearGradient colors={['#f0cfe3', '#de81fa']} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#f0cfe3', '#de81fa']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity
          onPress={() => editing ? cancelEditing() : navigation.goBack()}
          style={styles.headerIconBtn}
        >
          <MaterialCommunityIcons name="arrow-left" size={22} color="#961e46" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            {editing ? 'Edit Profile' : 'My Profile'}
          </Text>
          {editing && (
            <Text style={styles.headerSubtitle}>Tap a field to update</Text>
          )}
        </View>

        <TouchableOpacity
          onPress={() => editing ? cancelEditing() : setEditing(true)}
          style={[styles.headerIconBtn, editing && styles.headerIconBtnActive]}
        >
          <MaterialCommunityIcons
            name={editing ? 'close' : 'pencil-outline'}
            size={22}
            color={editing ? '#961e46' : '#961e46'}
          />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar & Name */}
        <View style={styles.profileSection}>
          <View style={styles.avatarRing}>
            <LinearGradient
              colors={['#FFE5F1', '#F3E5F5']}
              style={styles.avatarBg}
            >
              {userData.name && userData.name.trim() ? (
                <Text style={styles.avatarInitials}>{getInitials(userData.name)}</Text>
              ) : (
                <MaterialCommunityIcons name="account" size={48} color="#FF6B9D" />
              )}
            </LinearGradient>
          </View>
          <Text style={styles.profileName}>
            {userData.name && userData.name.trim() ? userData.name : 'Your Name'}
          </Text>
          <Text style={styles.profileEmail}>{userData.email || userEmail || ''}</Text>
        </View>

        {/* Stats strip — view mode only */}
        {!editing && (
          <View style={styles.statsStrip}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userData.age || '—'}</Text>
              <Text style={styles.statLabel}>Age</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userData.height || '—'}</Text>
              <Text style={styles.statLabel}>Height cm</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userData.weight || '—'}</Text>
              <Text style={styles.statLabel}>Weight kg</Text>
            </View>
          </View>
        )}

        {/* Change Password — view mode only */}
        {!editing && (
          <TouchableOpacity
            style={styles.changePasswordButton}
            onPress={() => navigation.navigate('ChangePassword', { userEmail })}
            activeOpacity={0.8}
          >
            <View style={styles.changePasswordLeft}>
              <View style={[styles.rowIconBadge, { backgroundColor: '#FFF0F5' }]}>
                <MaterialCommunityIcons name="lock-reset" size={18} color="#FF6B9D" />
              </View>
              <Text style={styles.changePasswordText}>Change Password</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#FF6B9D" />
          </TouchableOpacity>
        )}

        {/* Info Card — Personal */}
        <View style={styles.infoCard}>
          <Text style={styles.cardSectionLabel}>Personal Info</Text>

          <InfoRow
            icon="account-outline"
            iconBg="#FFE5F1"
            iconColor="#FF6B9D"
            label="Name"
            editing={editing}
            value={userData.name}
            displayValue={userData.name && userData.name.trim() ? userData.name : 'Not set'}
            onChangeText={(text) => setUserData({ ...userData, name: text })}
            placeholder="Enter your name"
          />
          <InfoRow
            icon="email-outline"
            iconBg="#F3E5F5"
            iconColor="#9C27B0"
            label="Email"
            value={userData.email}
            displayValue={userData.email && userData.email.trim() ? userData.email : 'Not set'}
            locked
          />
          <InfoRow
            icon="phone-outline"
            iconBg="#E0F2F1"
            iconColor="#009688"
            label="Phone"
            editing={editing}
            value={userData.phone}
            displayValue={userData.phone && userData.phone.trim() ? userData.phone : 'Not set'}
            onChangeText={(text) => setUserData({ ...userData, phone: text })}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            last
          />
        </View>

        {/* Info Card — Health */}
        <View style={[styles.infoCard, { marginTop: 14 }]}>
          <Text style={styles.cardSectionLabel}>Health & Pregnancy</Text>

          {editing && (
            <InfoRow
              icon="calendar-outline"
              iconBg="#E3F2FD"
              iconColor="#2196F3"
              label="Age"
              editing={editing}
              value={userData.age}
              displayValue={userData.age && userData.age.trim() ? `${userData.age} yrs` : 'Not set'}
              onChangeText={(text) => setUserData({ ...userData, age: text })}
              placeholder="Enter your age"
              keyboardType="numeric"
            />
          )}
          {editing && (
            <InfoRow
              icon="human-male-height"
              iconBg="#E8F5E9"
              iconColor="#4CAF50"
              label="Height (cm)"
              editing={editing}
              value={userData.height}
              displayValue={userData.height && userData.height.trim() ? `${userData.height} cm` : 'Not set'}
              onChangeText={(text) => setUserData({ ...userData, height: text })}
              placeholder="Enter height in cm"
              keyboardType="numeric"
            />
          )}
          {editing && (
            <InfoRow
              icon="scale-bathroom"
              iconBg="#FFF3E0"
              iconColor="#FF9800"
              label="Weight (kg)"
              editing={editing}
              value={userData.weight}
              displayValue={userData.weight && userData.weight.trim() ? `${userData.weight} kg` : 'Not set'}
              onChangeText={(text) => setUserData({ ...userData, weight: text })}
              placeholder="Enter weight in kg"
              keyboardType="numeric"
            />
          )}
          <InfoRow
            icon="calendar-heart"
            iconBg="#FCE4EC"
            iconColor="#E91E63"
            label="Pregnancy Week"
            editing={editing}
            value={userData.pregnancyWeek}
            displayValue={userData.pregnancyWeek && userData.pregnancyWeek.trim() ? `Week ${userData.pregnancyWeek}` : 'Not set'}
            onChangeText={(text) => setUserData({ ...userData, pregnancyWeek: text })}
            placeholder="Week (1–38)"
            keyboardType="numeric"
            last
          />
        </View>

        {/* Save / Cancel */}
        {editing && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleUpdate} activeOpacity={0.85}>
              <LinearGradient
                colors={['#FF6B9D', '#E91E63']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveButtonGradient}
              >
                <MaterialCommunityIcons name="check" size={20} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={cancelEditing} activeOpacity={0.7}>
              <Text style={styles.cancelButtonText}>Discard</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        transparent
        visible={showConfirmModal}
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <LinearGradient colors={['#FFE5F1', '#F3E5F5']} style={styles.modalIconBg}>
              <MaterialCommunityIcons name="check-circle-outline" size={36} color="#FF6B9D" />
            </LinearGradient>
            <Text style={styles.modalTitle}>Save Changes?</Text>
            <Text style={styles.modalMessage}>
              Your profile information will be updated.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonNo]}
                onPress={() => setShowConfirmModal(false)}
                disabled={isUpdating}
              >
                <Text style={styles.modalButtonNoText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonYes]}
                onPress={confirmUpdate}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalButtonYesText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <FloatingChatButton navigation={navigation} userEmail={route.params?.userEmail} />
    </View>
  );
};

/* ─── Reusable row component ─── */
const InfoRow = ({ icon, iconBg, iconColor, label, editing, value, displayValue, onChangeText, placeholder, keyboardType, locked, last }) => (
  <View style={[styles.infoRow, last && styles.infoRowLast]}>
    <View style={styles.infoLabelContainer}>
      <View style={[styles.rowIconBadge, { backgroundColor: iconBg }]}>
        <MaterialCommunityIcons name={icon} size={16} color={iconColor} />
      </View>
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
    {editing && !locked ? (
      <TextInput
        style={styles.infoInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#C0C0C0"
        keyboardType={keyboardType || 'default'}
      />
    ) : (
      <View style={styles.infoValueContainer}>
        <Text style={[styles.infoValue, locked && styles.infoValueLocked]}>{displayValue}</Text>
        {locked && <MaterialCommunityIcons name="lock-outline" size={13} color="#C0C0C0" style={{ marginLeft: 4 }} />}
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 14,
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '500',
  },

  /* Header */
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIconBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.65)',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#961e46',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#c45a7a',
    marginTop: 2,
  },

  /* Scroll */
  scrollView: { flex: 1 },
  scrollContent: {
    padding: 18,
    paddingBottom: 100,
  },

  /* Profile section */
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarRing: {
    width: 116,
    height: 116,
    borderRadius: 58,
    borderWidth: 3,
    borderColor: '#FF6B9D',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarBg: {
    width: 104,
    height: 104,
    borderRadius: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FF6B9D',
    letterSpacing: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 13,
    color: '#888',
  },

  /* Stats strip */
  statsStrip: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 14,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3436',
  },
  statLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 3,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 4,
  },

  /* Change password row */
  changePasswordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  changePasswordLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changePasswordText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3436',
    marginLeft: 12,
  },

  /* Info card */
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  cardSectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9C27B0',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    paddingTop: 14,
    paddingBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F4F8',
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 130,
  },
  rowIconBadge: {
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
  },
  infoValueContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  infoValue: {
    fontSize: 14,
    color: '#636E72',
    textAlign: 'right',
  },
  infoValueLocked: {
    color: '#BDBDBD',
  },
  infoInput: {
    flex: 1,
    fontSize: 14,
    color: '#2D3436',
    textAlign: 'right',
    backgroundColor: '#F8F0FF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginLeft: 8,
  },

  /* Save / Cancel */
  buttonContainer: {
    marginTop: 20,
    gap: 10,
  },
  saveButton: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cancelButton: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#9E9E9E',
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    width: '82%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 12,
  },
  modalIconBg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 6,
  },
  modalMessage: {
    fontSize: 14,
    color: '#636E72',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonNo: {
    backgroundColor: '#F5F5F5',
  },
  modalButtonYes: {
    backgroundColor: '#FF6B9D',
  },
  modalButtonNoText: {
    color: '#636E72',
    fontWeight: '600',
    fontSize: 15,
  },
  modalButtonYesText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});

export default AccountInfoScreen;

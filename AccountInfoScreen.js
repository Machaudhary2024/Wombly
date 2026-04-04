import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Modal, Animated, Platform, Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { API_BASE_URL } from './apiConfig';

const { width } = Dimensions.get('window');

// App-consistent palette
const PINK = '#FF6B9D';
const PURPLE = '#6C5CE7';
const DEEP_ROSE = '#961e46';
const HEADER_GRAD = ['#f0cfe3', '#de81fa'];
const BG_GRAD = ['#F5EEFF', '#E8D5FF'];
const AVATAR_GRAD = ['#de81fa', '#FF6B9D'];

const FIELDS = [
  { key: 'name', label: 'Full Name', icon: 'account-outline', required: true, keyboard: 'default', placeholder: 'Enter your name' },
  { key: 'age', label: 'Age', icon: 'calendar-account-outline', required: true, keyboard: 'numeric', placeholder: 'Your age', suffix: 'years' },
  { key: 'height', label: 'Height', icon: 'human-male-height-variant', keyboard: 'numeric', placeholder: 'Height in cm', suffix: 'cm' },
  { key: 'weight', label: 'Weight', icon: 'scale-bathroom', keyboard: 'numeric', placeholder: 'Weight in kg', suffix: 'kg' },
  { key: 'email', label: 'Email', icon: 'email-outline', readOnly: true },
  { key: 'phone', label: 'Phone', icon: 'phone-outline', required: true, keyboard: 'phone-pad', placeholder: 'Phone number' },
  { key: 'pregnancyWeek', label: 'Pregnancy Week', icon: 'calendar-heart', keyboard: 'numeric', placeholder: 'Week (1-38)', suffix: '' },
];

const AccountInfoScreen = ({ navigation, route }) => {
  const userEmail = route.params?.userEmail;
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [userData, setUserData] = useState({
    name: '', age: '', height: '', weight: '',
    email: '', phone: '', pregnancyWeek: '',
  });

  // Animations
  const avatarScale = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(40)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (!loading) {
      Animated.parallel([
        Animated.spring(avatarScale, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true }),
        Animated.timing(cardSlide, { toValue: 0, duration: 500, delay: 150, useNativeDriver: true }),
        Animated.timing(cardOpacity, { toValue: 1, duration: 500, delay: 150, useNativeDriver: true }),
      ]).start();
    }
  }, [loading]);

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
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (data.success) {
        const u = data.user;
        setUserData({
          name: u.name || '',
          age: u.age != null ? u.age.toString() : '',
          height: u.height != null ? u.height.toString() : '',
          weight: u.weight != null ? u.weight.toString() : '',
          email: u.email || '',
          phone: u.phone || '',
          pregnancyWeek: u.pregnancyWeek != null ? u.pregnancyWeek.toString() : '',
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const validatePakistaniMobile = (phone) => {
    if (!phone) return { valid: false };
    const cleaned = phone.replace(/\D/g, '');
    return { valid: cleaned.length >= 10 && cleaned.length <= 11 };
  };

  const handleUpdate = async () => {
    if (!userData.name || !userData.age || !userData.email || !userData.phone) return;
    if (!/^[A-Za-z\s]+$/.test(userData.name.trim())) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email.trim())) return;
    if (!validatePakistaniMobile(userData.phone).valid) return;

    const ageNum = parseInt(userData.age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 100) return;

    const heightNum = userData.height ? parseFloat(userData.height) : undefined;
    if (userData.height && (isNaN(heightNum) || heightNum < 50 || heightNum > 250)) return;

    const weightNum = userData.weight ? parseFloat(userData.weight) : undefined;
    if (userData.weight && (isNaN(weightNum) || weightNum < 20 || weightNum > 200)) return;

    const weekNum = userData.pregnancyWeek ? parseInt(userData.pregnancyWeek) : undefined;
    if (weekNum && (weekNum < 1 || weekNum > 38)) return;

    setShowConfirmModal(true);
  };

  const confirmUpdate = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/update-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          name: userData.name,
          age: parseInt(userData.age),
          ...(userData.height && { height: parseFloat(userData.height) }),
          ...(userData.weight && { weight: parseFloat(userData.weight) }),
          phone: userData.phone,
          ...(userData.pregnancyWeek && { pregnancyWeek: parseInt(userData.pregnancyWeek) }),
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

  const getDisplayValue = (field) => {
    const val = userData[field.key];
    if (!val || !val.trim()) return 'Not set';
    if (field.key === 'pregnancyWeek') return `Week ${val}`;
    if (field.suffix) return `${val} ${field.suffix}`;
    return val;
  };

  const getInitials = () => {
    const name = userData.name?.trim();
    if (!name) return '?';
    const parts = name.split(' ').filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
  };

  if (loading) {
    return (
      <LinearGradient colors={BG_GRAD} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PURPLE} />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={BG_GRAD} style={styles.root}>
      {/* Header */}
      <LinearGradient colors={HEADER_GRAD} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
        <TouchableOpacity onPress={() => { if (editing) { setEditing(false); fetchUserData(); } else { navigation.goBack(); } }} style={styles.headerBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        {!editing ? (
          <TouchableOpacity onPress={() => setEditing(true)} style={styles.headerBtn}>
            <MaterialCommunityIcons name="pencil-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </LinearGradient>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <Animated.View style={[styles.avatarSection, { transform: [{ scale: avatarScale }] }]}>
          <LinearGradient colors={AVATAR_GRAD} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.avatarRing}>
            <View style={styles.avatarInner}>
              <Text style={styles.avatarInitials}>{getInitials()}</Text>
            </View>
          </LinearGradient>
          <Text style={styles.profileName}>{userData.name?.trim() || 'Your Name'}</Text>
          <Text style={styles.profileEmail}>{userData.email || 'email@example.com'}</Text>
          {editing && (
            <View style={styles.editingBadge}>
              <MaterialCommunityIcons name="pencil" size={12} color="#FFFFFF" />
              <Text style={styles.editingBadgeText}>Editing Mode</Text>
            </View>
          )}
        </Animated.View>

        {/* Quick Actions */}
        {!editing && (
          <Animated.View style={[styles.quickActions, { transform: [{ translateY: cardSlide }], opacity: cardOpacity }]}>
            <TouchableOpacity
              style={styles.quickActionBtn}
              onPress={() => navigation.navigate('ChangePassword', { userEmail })}
              activeOpacity={0.7}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#F0E8FF' }]}>
                <MaterialCommunityIcons name="lock-outline" size={22} color={PURPLE} />
              </View>
              <Text style={styles.quickActionLabel}>Change Password</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#C0B3D9" />
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Info Card */}
        <Animated.View style={[styles.infoCard, { transform: [{ translateY: cardSlide }], opacity: cardOpacity }]}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="card-account-details-outline" size={20} color={DEEP_ROSE} />
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>

          {FIELDS.map((field, index) => (
            <View key={field.key} style={[styles.fieldRow, index === FIELDS.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={styles.fieldLeft}>
                <View style={[styles.fieldIconWrap, { backgroundColor: field.required ? '#FFF0F5' : '#F0E8FF' }]}>
                  <MaterialCommunityIcons name={field.icon} size={18} color={field.required ? PINK : PURPLE} />
                </View>
                <View>
                  <Text style={styles.fieldLabel}>
                    {field.label}
                    {field.required && <Text style={styles.requiredStar}> *</Text>}
                  </Text>
                </View>
              </View>

              {editing && !field.readOnly ? (
                <TextInput
                  style={styles.fieldInput}
                  value={userData[field.key]}
                  onChangeText={(text) => setUserData({ ...userData, [field.key]: text })}
                  placeholder={field.placeholder}
                  placeholderTextColor="#C0B3D9"
                  keyboardType={field.keyboard || 'default'}
                />
              ) : (
                <Text style={[styles.fieldValue, (!userData[field.key] || !userData[field.key].trim()) && styles.fieldValueEmpty]}>
                  {getDisplayValue(field)}
                </Text>
              )}
            </View>
          ))}
        </Animated.View>

        {/* Save / Cancel buttons */}
        {editing && (
          <Animated.View style={[styles.actionButtons, { opacity: cardOpacity }]}>
            <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate} activeOpacity={0.8}>
              <LinearGradient colors={AVATAR_GRAD} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.saveBtnGrad}>
                <MaterialCommunityIcons name="check" size={20} color="#FFFFFF" />
                <Text style={styles.saveBtnText}>Save Changes</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => { setEditing(false); fetchUserData(); }}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelBtnText}>Discard</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal transparent visible={showConfirmModal} animationType="fade" onRequestClose={() => setShowConfirmModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalIconWrap}>
              <MaterialCommunityIcons name="check-circle-outline" size={44} color={PURPLE} />
            </View>
            <Text style={styles.modalTitle}>Save Changes?</Text>
            <Text style={styles.modalMessage}>
              Your profile information will be updated. You can always edit it later.
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  loadingContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },
  loadingText: { marginTop: 12, fontSize: 15, color: PURPLE, fontWeight: '500' },

  // Header
  header: {
    paddingTop: 50, paddingBottom: 16, paddingHorizontal: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    shadowColor: PURPLE, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 6,
  },
  headerBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },

  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 24 },

  // Avatar
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatarRing: {
    width: 108, height: 108, borderRadius: 54, padding: 4,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: PINK, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8,
  },
  avatarInner: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center',
  },
  avatarInitials: { fontSize: 36, fontWeight: '800', color: DEEP_ROSE },
  profileName: { fontSize: 22, fontWeight: '700', color: '#2D3436', marginTop: 14 },
  profileEmail: { fontSize: 13, color: '#8A7BA8', marginTop: 4 },
  editingBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    marginTop: 10, backgroundColor: PURPLE, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20,
  },
  editingBadgeText: { fontSize: 11, color: '#FFFFFF', fontWeight: '600' },

  // Quick Actions
  quickActions: { marginBottom: 16 },
  quickActionBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14,
    shadowColor: PURPLE, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  quickActionIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  quickActionLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: '#2D3436' },

  // Info Card
  infoCard: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, paddingTop: 16,
    shadowColor: PURPLE, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F5F0FF' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: DEEP_ROSE },

  // Fields
  fieldRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F5F0FF',
  },
  fieldLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  fieldIconWrap: {
    width: 34, height: 34, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  fieldLabel: { fontSize: 14, fontWeight: '600', color: '#2D3436' },
  requiredStar: { color: PINK, fontWeight: '700' },
  fieldValue: { fontSize: 14, color: '#636E72', fontWeight: '500', textAlign: 'right', maxWidth: '50%' },
  fieldValueEmpty: { color: '#C0B3D9', fontStyle: 'italic' },
  fieldInput: {
    flex: 0.55, fontSize: 14, color: '#2D3436', textAlign: 'right', fontWeight: '500',
    backgroundColor: '#F5F0FF', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8,
    borderWidth: 1.5, borderColor: '#EDE7F6',
  },

  // Action Buttons
  actionButtons: { marginTop: 20, gap: 12 },
  saveBtn: { borderRadius: 16, overflow: 'hidden', shadowColor: PINK, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  saveBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 8 },
  saveBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  cancelBtn: { paddingVertical: 14, borderRadius: 16, backgroundColor: '#F5F0FF', alignItems: 'center' },
  cancelBtnText: { fontSize: 15, fontWeight: '600', color: '#8A7BA8' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(45,0,80,0.45)', justifyContent: 'center', alignItems: 'center' },
  modalBox: {
    backgroundColor: '#FFFFFF', borderRadius: 24, padding: 28, width: '82%', alignItems: 'center',
    shadowColor: PURPLE, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 12,
  },
  modalIconWrap: { marginBottom: 4 },
  modalTitle: { fontSize: 19, fontWeight: '800', color: '#2D3436', marginTop: 8, marginBottom: 8 },
  modalMessage: { fontSize: 14, color: '#636E72', textAlign: 'center', lineHeight: 21, marginBottom: 24 },
  modalButtons: { flexDirection: 'row', gap: 12, width: '100%' },
  modalButton: { flex: 1, paddingVertical: 13, borderRadius: 14, alignItems: 'center' },
  modalButtonNo: { backgroundColor: '#F5F0FF' },
  modalButtonYes: { backgroundColor: PINK },
  modalButtonNoText: { color: '#2D3436', fontWeight: '600', fontSize: 15 },
  modalButtonYesText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
});

export default AccountInfoScreen;

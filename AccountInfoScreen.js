import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Modal } from 'react-native';
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
  const [userData, setUserData] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    email: '',
    phone: '',
    pregnancyWeek: '',
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    if (!userEmail) {
      console.error('userEmail is not provided');
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching user data for email:', userEmail);
      const response = await fetch(`${API_BASE_URL}/api/user?email=${encodeURIComponent(userEmail)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`Failed to fetch user data: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        setUserData({
          name: data.user.name || '',
          age: data.user.age !== null && data.user.age !== undefined ? data.user.age.toString() : '',
          height: data.user.height !== null && data.user.height !== undefined ? data.user.height.toString() : '',
          weight: data.user.weight !== null && data.user.weight !== undefined ? data.user.weight.toString() : '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          pregnancyWeek: data.user.pregnancyWeek !== null && data.user.pregnancyWeek !== undefined ? data.user.pregnancyWeek.toString() : '',
        });
        console.log('User data loaded successfully:', data.user);
      } else {
        throw new Error(data.message || 'Failed to load user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Validate Pakistani mobile number
  const validatePakistaniMobile = (phone) => {
    if (!phone) {
      return { valid: false, message: 'Phone number is required' };
    }
    // Pakistani phone numbers: 10-11 digits (can include +92, 0, etc.)
    const cleanedPhone = phone.replace(/\D/g, '');
    if (cleanedPhone.length < 10 || cleanedPhone.length > 11) {
      return { valid: false, message: 'Phone number must be 10-11 digits' };
    }
    return { valid: true };
  };

  const handleUpdate = async () => {
    if (!userData.name || !userData.age || !userData.email || !userData.phone) {
      return;
    }

    // Name should not contain numbers or special characters
    if (!/^[A-Za-z\s]+$/.test(userData.name.trim())) {
      return;
    }

    // Basic email format check
    const emailTrimmed = userData.email ? userData.email.trim() : '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      return;
    }

    // Pakistani mobile number validation
    const phoneCheck = validatePakistaniMobile(userData.phone);
    if (!phoneCheck.valid) {
      return;
    }

    const ageNum = parseInt(userData.age);
    const heightNum = userData.height ? parseFloat(userData.height) : undefined;
    const weightNum = userData.weight ? parseFloat(userData.weight) : undefined;
    const pregnancyWeekNum = userData.pregnancyWeek ? parseInt(userData.pregnancyWeek) : undefined;

    if (isNaN(ageNum) || ageNum < 1 || ageNum > 100) {
      return;
    }

    if (userData.height && (isNaN(heightNum) || heightNum < 50 || heightNum > 250)) {
      return;
    }

    if (userData.weight && (isNaN(weightNum) || weightNum < 20 || weightNum > 200)) {
      return;
    }

    if (pregnancyWeekNum && (pregnancyWeekNum < 1 || pregnancyWeekNum > 38)) {
      return;
    }

    // All validations passed, show confirmation modal
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
        headers: {
          'Content-Type': 'application/json',
        },
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
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        return;
      }

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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B9D" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

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
        <Text style={styles.headerTitle}>Manage Profile</Text>
        <TouchableOpacity
          onPress={() => setEditing(!editing)}
          style={styles.editButton}
        >
          <MaterialCommunityIcons
            name={editing ? 'close' : 'pencil'}
            size={20}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <View style={styles.profileIconContainer}>
            <LinearGradient
              colors={['#FFE5F1', '#F3E5F5']}
              style={styles.profileIconBg}
            >
              <MaterialCommunityIcons name="account" size={50} color="#FF6B9D" />
            </LinearGradient>
          </View>
          <Text style={styles.profileTitle}>Your Profile</Text>
          <Text style={styles.profileSubtitle}>
            {editing ? 'Edit your information below' : 'View your account information'}
          </Text>
        </View>

        {!editing && (
          <TouchableOpacity
            style={styles.changePasswordButton}
            onPress={() => navigation.navigate('ChangePassword', { userEmail })}
          >
            <MaterialCommunityIcons name="lock-reset" size={20} color="#FFFFFF" />
            <Text style={styles.changePasswordButtonText}>Change Password</Text>
          </TouchableOpacity>
        )}

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <MaterialCommunityIcons name="account" size={20} color="#9C27B0" />
              <Text style={styles.infoLabel}>Name *</Text>
            </View>
            {editing ? (
              <TextInput
                style={styles.infoInput}
                value={userData.name}
                onChangeText={(text) => setUserData({ ...userData, name: text })}
                placeholder="Enter your name"
              />
            ) : (
              <Text style={styles.infoValue}>{userData.name && userData.name.trim() ? userData.name : 'Not set'}</Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <MaterialCommunityIcons name="calendar" size={20} color="#9C27B0" />
              <Text style={styles.infoLabel}>Age *</Text>
            </View>
            {editing ? (
              <TextInput
                style={styles.infoInput}
                value={userData.age}
                onChangeText={(text) => setUserData({ ...userData, age: text })}
                placeholder="Enter your age"
                keyboardType="numeric"
              />
            ) : (
              <Text style={styles.infoValue}>{userData.age && userData.age.trim() ? userData.age : 'Not set'}</Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <MaterialCommunityIcons name="human-male-height" size={20} color="#9C27B0" />
              <Text style={styles.infoLabel}>Height (cm)</Text>
            </View>
            {editing ? (
              <TextInput
                style={styles.infoInput}
                value={userData.height}
                onChangeText={(text) => setUserData({ ...userData, height: text })}
                placeholder="Enter height in cm"
                keyboardType="numeric"
              />
            ) : (
              <Text style={styles.infoValue}>{userData.height && userData.height.trim() ? `${userData.height} cm` : 'Not set'}</Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <MaterialCommunityIcons name="scale-bathroom" size={20} color="#9C27B0" />
              <Text style={styles.infoLabel}>Weight (kg)</Text>
            </View>
            {editing ? (
              <TextInput
                style={styles.infoInput}
                value={userData.weight}
                onChangeText={(text) => setUserData({ ...userData, weight: text })}
                placeholder="Enter weight in kg"
                keyboardType="numeric"
              />
            ) : (
              <Text style={styles.infoValue}>{userData.weight && userData.weight.trim() ? `${userData.weight} kg` : 'Not set'}</Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <MaterialCommunityIcons name="email" size={20} color="#9C27B0" />
              <Text style={styles.infoLabel}>Email</Text>
            </View>
            <Text style={styles.infoValue}>{userData.email && userData.email.trim() ? userData.email : 'Not set'}</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <MaterialCommunityIcons name="phone" size={20} color="#9C27B0" />
              <Text style={styles.infoLabel}>Phone *</Text>
            </View>
            {editing ? (
              <TextInput
                style={styles.infoInput}
                value={userData.phone}
                onChangeText={(text) => setUserData({ ...userData, phone: text })}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.infoValue}>{userData.phone && userData.phone.trim() ? userData.phone : 'Not set'}</Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <MaterialCommunityIcons name="calendar-heart" size={20} color="#9C27B0" />
              <Text style={styles.infoLabel}>Pregnancy Week</Text>
            </View>
            {editing ? (
              <TextInput
                style={styles.infoInput}
                value={userData.pregnancyWeek}
                onChangeText={(text) => setUserData({ ...userData, pregnancyWeek: text })}
                placeholder="Enter week (1-38)"
                keyboardType="numeric"
              />
            ) : (
              <Text style={styles.infoValue}>
                {userData.pregnancyWeek && userData.pregnancyWeek.trim() ? `Week ${userData.pregnancyWeek}` : 'Not set'}
              </Text>
            )}
          </View>
        </View>

        {editing && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleUpdate}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setEditing(false);
                fetchUserData();
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        transparent={true}
        visible={showConfirmModal}
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <MaterialCommunityIcons name="check-circle" size={50} color="#FF6B9D" />
            <Text style={styles.modalTitle}>Confirm Changes</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to save these changes to your profile?
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
                  <Text style={styles.modalButtonYesText}>Yes, Save</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#636E72',
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
  editButton: {
    padding: 5,
    width: 34,
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  profileCard: {
    alignItems: 'center',
    marginBottom: 25,
    paddingTop: 20,
  },
  profileIconContainer: {
    marginBottom: 15,
  },
  profileIconBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 8,
  },
  profileSubtitle: {
    fontSize: 16,
    color: '#636E72',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginLeft: 10,
  },
  infoValue: {
    fontSize: 16,
    color: '#636E72',
    flex: 1,
    textAlign: 'right',
  },
  infoInput: {
    flex: 1,
    fontSize: 16,
    color: '#2D3436',
    textAlign: 'right',
    borderBottomWidth: 1,
    borderBottomColor: '#FFB8D1',
    paddingVertical: 5,
  },
  cancelButton: {
    marginTop: 20,
    paddingVertical: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#636E72',
  },
  // Save/Cancel Button Container
  buttonContainer: {
    marginTop: 20,
    gap: 12,
  },
  saveButton: {
    paddingVertical: 15,
    backgroundColor: '#FF6B9D',
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  changePasswordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B9D',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 15,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  changePasswordButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  // Confirmation Modal Styles
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

export default AccountInfoScreen;

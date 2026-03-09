"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { API_BASE_URL } from "./apiConfig"
import { validateField, validatePasswordMatch } from "./utils/validationSchema"

const ChangePasswordScreen = ({ navigation, route }) => {
  const userEmail = route.params?.userEmail || ""

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalType, setModalType] = useState("") // "success" | "error"
  const [modalMessage, setModalMessage] = useState("")

  const validateForm = () => {
    const newErrors = {}

    if (!currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required"
    }

    const passwordError = validateField("password", newPassword)
    if (passwordError) newErrors.newPassword = passwordError

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your new password"
    } else {
      const confirmError = validatePasswordMatch(newPassword, confirmPassword)
      if (confirmError) newErrors.confirmPassword = confirmError
    }

    // Ensure new password is different from current password
    if (currentPassword === newPassword) {
      newErrors.newPassword = "New password must be different from current password"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChangePassword = async () => {
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail.toLowerCase().trim(),
          currentPassword: currentPassword,
          newPassword: newPassword,
        }),
      })

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error("Non-JSON response:", text)
        console.error("Response status:", response.status)
        console.error("Content-Type:", contentType)
        setModalType("error")
        setModalMessage(`Server error (${response.status}). Please make sure the /api/change-password endpoint exists on your backend and returns JSON.`)
        setModalVisible(true)
        return
      }

      const data = await response.json()

      if (data.success) {
        setShowSuccessModal(true)
      } else {
        // If current password is incorrect, show inline error
        if (response.status === 401 || response.status === 403) {
          setErrors((prev) => ({ ...prev, currentPassword: "Current password is incorrect" }))
        } else {
          setModalType("error")
          setModalMessage(data.message || "Failed to change password. Please try again.")
          setModalVisible(true)
        }
      }
    } catch (error) {
      console.error("Change password error:", error)
      setModalType("error")
      setModalMessage("Network error. Please check your connection and try again.")
      setModalVisible(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} disabled={loading}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FF6B9D" />
          </TouchableOpacity>
          <MaterialCommunityIcons name="lock-reset" size={60} color="#FF6B9D" />
          <Text style={styles.title}>Change Password</Text>
          <Text style={styles.subtitle}>Update your account password securely</Text>
        </View>

        <View style={styles.formSection}>
          {/* Current Password Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Current Password</Text>
            <View style={[styles.inputBox, errors.currentPassword && styles.inputBoxError]}>
              <MaterialCommunityIcons name="lock-outline" size={20} color="#FF6B9D" />
              <TextInput
                style={styles.input}
                placeholder="Enter your current password"
                placeholderTextColor="#BDBDBD"
                value={currentPassword}
                onChangeText={(text) => {
                  setCurrentPassword(text)
                  if (errors.currentPassword) setErrors({ ...errors, currentPassword: "" })
                }}
                secureTextEntry={!showCurrentPassword}
                editable={!loading}
              />
              <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                <MaterialCommunityIcons
                  name={showCurrentPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#FF6B9D"
                />
              </TouchableOpacity>
            </View>
            {errors.currentPassword && (
              <View style={styles.errorRow}>
                <MaterialCommunityIcons name="alert-circle" size={14} color="#F44336" />
                <Text style={styles.errorText}>{errors.currentPassword}</Text>
              </View>
            )}
          </View>

          {/* New Password Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>New Password</Text>
            <View style={[styles.inputBox, errors.newPassword && styles.inputBoxError]}>
              <MaterialCommunityIcons name="lock-outline" size={20} color="#FF6B9D" />
              <TextInput
                style={styles.input}
                placeholder="Enter new password"
                placeholderTextColor="#BDBDBD"
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text)
                  if (errors.newPassword) setErrors({ ...errors, newPassword: "" })
                }}
                secureTextEntry={!showNewPassword}
                editable={!loading}
              />
              <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                <MaterialCommunityIcons
                  name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#FF6B9D"
                />
              </TouchableOpacity>
            </View>
            {errors.newPassword && (
              <View style={styles.errorRow}>
                <MaterialCommunityIcons name="alert-circle" size={14} color="#F44336" />
                <Text style={styles.errorText}>{errors.newPassword}</Text>
              </View>
            )}
          </View>

          {/* Confirm Password Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm New Password</Text>
            <View style={[styles.inputBox, errors.confirmPassword && styles.inputBoxError]}>
              <MaterialCommunityIcons name="lock-check-outline" size={20} color="#FF6B9D" />
              <TextInput
                style={styles.input}
                placeholder="Confirm new password"
                placeholderTextColor="#BDBDBD"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text)
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" })
                }}
                secureTextEntry={!showConfirmPassword}
                editable={!loading}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <MaterialCommunityIcons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#FF6B9D"
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <View style={styles.errorRow}>
                <MaterialCommunityIcons name="alert-circle" size={14} color="#F44336" />
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[styles.okButton, loading && styles.okButtonDisabled]}
            onPress={handleChangePassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.okButtonText}>Change Password</Text>
            )}
          </TouchableOpacity>

          <View style={styles.bottomInfo}>
            <MaterialCommunityIcons name="information-outline" size={16} color="#636E72" />
            <Text style={styles.infoText}>
              Password must contain at least 6 characters, including letters, numbers, and special characters.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Password Change Success Modal */}
      <Modal
        transparent={true}
        visible={showSuccessModal}
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <MaterialCommunityIcons name="check-circle-outline" size={50} color="#4CAF50" />
            <Text style={styles.modalTitle}>Password Changed</Text>
            <Text style={styles.modalMessage}>
              Your password has been changed successfully.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonOk]}
                onPress={() => {
                  setShowSuccessModal(false)
                  navigation.goBack()
                }}
              >
                <Text style={styles.modalButtonOkText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Error Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={50}
              color="#FF6B6B"
            />
            <Text style={styles.modalTitle}>Error</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonOk]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonOkText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FF6B9D",
    marginTop: 15,
  },
  subtitle: {
    fontSize: 14,
    color: "#636E72",
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  formSection: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D3436",
    marginBottom: 8,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFB8D1",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "#FFF5FA",
  },
  inputBoxError: {
    borderColor: "#F44336",
    backgroundColor: "#FFEBEE",
  },
  input: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 14,
    color: "#2D3436",
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  errorText: {
    fontSize: 12,
    color: "#F44336",
    marginLeft: 6,
  },
  okButton: {
    backgroundColor: "#FF6B9D",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#FF6B9D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  okButtonDisabled: {
    backgroundColor: "#FFCDD2",
  },
  okButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 20,
    paddingHorizontal: 10,
  },
  infoText: {
    fontSize: 12,
    color: "#636E72",
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 30,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2D3436",
    marginTop: 12,
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: "#636E72",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  modalButton: {
    flex: 1,
    minWidth: 100,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: "center",
  },
  modalButtonOk: {
    backgroundColor: "#FF6B9D",
  },
  modalButtonOkText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
})

export default ChangePasswordScreen

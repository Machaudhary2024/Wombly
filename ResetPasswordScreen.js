"use client"

import { useState, useEffect } from "react"
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
import { API_BASE_URL } from "./apiConfig"
import { validateField, validatePasswordMatch } from "./utils/validationSchema"

const ResetPasswordScreen = ({ navigation, route }) => {
  const emailFromRoute = route.params?.email || ""

  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [canResend, setCanResend] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalType, setModalType] = useState("") // "success" | "error"
  const [modalMessage, setModalMessage] = useState("")

  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`
  }

  const validateForm = () => {
    const newErrors = {}

    const otpError = validateField("otp", otp)
    if (otpError) newErrors.otp = otpError

    const passwordError = validateField("password", newPassword)
    if (passwordError) newErrors.newPassword = passwordError

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your new password"
    } else {
      const confirmError = validatePasswordMatch(newPassword, confirmPassword)
      if (confirmError) newErrors.confirmPassword = confirmError
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleResetPassword = async () => {
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      console.log("Sending reset password request for:", emailFromRoute)
      const response = await fetch(`${API_BASE_URL}/api/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailFromRoute.toLowerCase().trim(),
          otp: otp.trim(),
          newPassword: newPassword,
        }),
      })

      console.log("Response status:", response.status)

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error("Non-JSON response:", text)
        setModalType("error")
        setModalMessage("Server returned invalid response. Please make sure the backend server is running.")
        setModalVisible(true)
        return
      }

      const data = await response.json()
      console.log("Response data:", JSON.stringify(data))

      if (data.success) {
        setShowSuccessModal(true)
      } else {
        // If OTP is incorrect, show inline error under OTP field
        if (response.status === 400 && data.message) {
          setErrors((prev) => ({ ...prev, otp: data.message }))
        } else {
          setModalType("error")
          setModalMessage(data.message || "Failed to reset password. Please try again.")
          setModalVisible(true)
        }
      }
    } catch (error) {
      console.error("Reset password error:", error)
      setModalType("error")
      setModalMessage("Network error. Please check your connection and make sure the server is running.")
      setModalVisible(true)
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (!canResend) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailFromRoute.toLowerCase().trim(),
        }),
      })

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        setModalType("error")
        setModalMessage("Server returned invalid response.")
        setModalVisible(true)
        return
      }

      const data = await response.json()

      if (data.success) {
        setModalType("success")
        setModalMessage("A new verification code has been sent to your email!")
        setModalVisible(true)
        setTimeLeft(300) // Reset timer
        setCanResend(false)
        setOtp("")
        setErrors({})
      } else {
        setModalType("error")
        setModalMessage(data.message || "Failed to resend code.")
        setModalVisible(true)
      }
    } catch (error) {
      console.error("Resend OTP error:", error)
      setModalType("error")
      setModalMessage("Network error. Please try again.")
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
          <MaterialCommunityIcons name="shield-key-outline" size={60} color="#FF6B9D" />
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.emailText}>{emailFromRoute}</Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.instruction}>
            Enter the 6-digit code sent to your email along with your new password.
          </Text>

          {/* OTP Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Verification Code</Text>
            <View style={[styles.otpInputBox, errors.otp && styles.inputBoxError]}>
              <MaterialCommunityIcons name="numeric" size={20} color="#FF6B9D" />
              <TextInput
                style={styles.otpInput}
                placeholder="000000"
                placeholderTextColor="#BDBDBD"
                value={otp}
                onChangeText={(text) => {
                  const cleaned = text.replace(/[^0-9]/g, "").slice(0, 6)
                  setOtp(cleaned)
                  if (errors.otp) setErrors({ ...errors, otp: "" })
                }}
                keyboardType="numeric"
                maxLength={6}
                editable={!loading}
                textAlign="center"
              />
            </View>
            {errors.otp && (
              <View style={styles.errorRow}>
                <MaterialCommunityIcons name="alert-circle" size={14} color="#F44336" />
                <Text style={styles.errorText}>{errors.otp}</Text>
              </View>
            )}
          </View>

          {/* Timer Display */}
          <View style={styles.timerContainer}>
            {!canResend ? (
              <>
                <MaterialCommunityIcons name="clock-outline" size={18} color="#FF6B9D" />
                <Text style={styles.timerText}>Code expires in {formatTime(timeLeft)}</Text>
              </>
            ) : (
              <>
                <MaterialCommunityIcons name="alert-circle-outline" size={18} color="#F57C00" />
                <Text style={styles.timerExpiredText}>Code expired. Please request a new one.</Text>
              </>
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
                secureTextEntry={!showPassword}
                editable={!loading}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialCommunityIcons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
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
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.okButtonText}>Reset Password</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={[styles.resendButton, (!canResend || loading) && styles.resendButtonDisabled]}
            onPress={handleResendOTP}
            disabled={!canResend || loading}
          >
            <MaterialCommunityIcons
              name="email-multiple-outline"
              size={18}
              color={canResend && !loading ? "#FF6B9D" : "#BDBDBD"}
            />
            <Text style={[styles.resendButtonText, (!canResend || loading) && styles.resendButtonTextDisabled]}>
              Resend Code
            </Text>
          </TouchableOpacity>

          <View style={styles.bottomInfo}>
            <MaterialCommunityIcons name="information-outline" size={16} color="#636E72" />
            <Text style={styles.infoText}>Check your spam/junk folder if you don't see the code in your inbox.</Text>
          </View>
        </View>
      </ScrollView>

      {/* Password Reset Success Modal */}
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
              Your password has been changed successfully. You can now login with your new password.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonOk]}
                onPress={() => {
                  setShowSuccessModal(false)
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "Login" }],
                  })
                }}
              >
                <Text style={styles.modalButtonOkText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* General Purpose Modal (errors, resend success, etc.) */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <MaterialCommunityIcons
              name={modalType === "success" ? "email-check-outline" : "alert-circle-outline"}
              size={50}
              color={modalType === "success" ? "#4CAF50" : "#FF6B6B"}
            />
            <Text style={styles.modalTitle}>
              {modalType === "success" ? "Success" : "Error"}
            </Text>
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
    marginBottom: 30,
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
  emailText: {
    fontSize: 14,
    color: "#636E72",
    marginTop: 8,
  },
  formSection: {
    marginBottom: 20,
  },
  instruction: {
    fontSize: 14,
    color: "#636E72",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 20,
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
  otpInputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFB8D1",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 14,
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
  otpInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 24,
    fontWeight: "600",
    color: "#2D3436",
    letterSpacing: 4,
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
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF5FA",
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  timerText: {
    fontSize: 14,
    color: "#FF6B9D",
    fontWeight: "600",
    marginLeft: 8,
  },
  timerExpiredText: {
    fontSize: 14,
    color: "#F57C00",
    fontWeight: "600",
    marginLeft: 8,
  },
  okButton: {
    backgroundColor: "#FF6B9D",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
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
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 20,
  },
  resendButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FFB8D1",
  },
  resendButtonDisabled: {
    borderColor: "#F0F0F0",
  },
  resendButtonText: {
    fontSize: 15,
    color: "#FF6B9D",
    fontWeight: "600",
    marginLeft: 8,
  },
  resendButtonTextDisabled: {
    color: "#BDBDBD",
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
  // Password Reset Success Modal
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

export default ResetPasswordScreen

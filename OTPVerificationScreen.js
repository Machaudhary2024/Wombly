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
import { LinearGradient } from "expo-linear-gradient"
import { API_BASE_URL } from "./apiConfig"
import { validateField } from "./utils/validationSchema"
import StatusModal from "./components/StatusModal"

const OTPVerificationScreen = ({ navigation, route }) => {
  const emailFromRoute = route.params?.email || ""

  const [otp, setOtp] = useState("")
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [canResend, setCanResend] = useState(false)
  const [statusModalVisible, setStatusModalVisible] = useState(false)
  const [statusType, setStatusType] = useState("success")
  const [statusTitle, setStatusTitle] = useState("")
  const [statusMessage, setStatusMessage] = useState("")
  const [pendingNavigation, setPendingNavigation] = useState(null)

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

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleVerifyOTP = async () => {
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailFromRoute.toLowerCase().trim(),
          otp: otp.trim(),
        }),
      })

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        setStatusType("error")
        setStatusTitle("Error")
        setStatusMessage("Server returned invalid response.")
        setStatusModalVisible(true)
        setLoading(false)
        return
      }

      const data = await response.json()

      if (data.success) {
        setStatusType("success")
        setStatusTitle("Success")
        setStatusMessage("Email verified successfully! You can now login.")
        setPendingNavigation(() => () => navigation.navigate("Login"))
        setStatusModalVisible(true)
      } else {
        setStatusType("error")
        setStatusTitle("Verification Failed")
        setStatusMessage(data.message)
        setStatusModalVisible(true)
      }
    } catch (error) {
      console.error("OTP verification error:", error)
      setStatusType("error")
      setStatusTitle("Error")
      setStatusMessage("Network error. Please try again.")
      setStatusModalVisible(true)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusModalClose = () => {
    setStatusModalVisible(false)
    if (pendingNavigation) {
      setTimeout(() => {
        pendingNavigation()
        setPendingNavigation(null)
      }, 300)
    }
  }

  const handleResendOTP = async () => {
    if (!canResend) {
      Alert.alert("Wait", "Please wait before requesting a new OTP.")
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/resend-otp`, {
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
        setStatusType("error")
        setStatusTitle("Error")
        setStatusMessage("Server returned invalid response.")
        setStatusModalVisible(true)
        setLoading(false)
        return
      }

      const data = await response.json()

      if (data.success) {
        setStatusType("success")
        setStatusTitle("Success")
        setStatusMessage("OTP resent to your email!")
        setStatusModalVisible(true)
        setTimeLeft(300) // Reset timer
        setCanResend(false)
        setOtp("")
      } else {
        setStatusType("error")
        setStatusTitle("Resend Failed")
        setStatusMessage(data.message)
        setStatusModalVisible(true)
      }
    } catch (error) {
      console.error("Resend OTP error:", error)
      setStatusType("error")
      setStatusTitle("Error")
      setStatusMessage("Network error. Please try again.")
      setStatusModalVisible(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <LinearGradient
      colors={['#E8D5FF', '#D4B3FF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} disabled={loading}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FF6B9D" />
          </TouchableOpacity>
          <MaterialCommunityIcons name="email-check-outline" size={60} color="#FF6B9D" />
          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.emailText}>{emailFromRoute}</Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.instruction}>
            We've sent a 6-digit OTP to your email. Please enter it below to verify your account.
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Enter OTP</Text>
            <View style={[styles.inputBox, errors.otp && styles.inputBoxError]}>
              <MaterialCommunityIcons name="lock-outline" size={20} color="#FF6B9D" />
              <TextInput
                style={styles.input}
                placeholder="000000"
                placeholderTextColor="#BDBDBD"
                value={otp}
                onChangeText={(text) => {
                  // Only allow digits
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
                <Text style={styles.timerText}>OTP expires in {formatTime(timeLeft)}</Text>
              </>
            ) : (
              <>
                <MaterialCommunityIcons name="alert-circle-outline" size={18} color="#F57C00" />
                <Text style={styles.timerExpiredText}>OTP expired. Please request a new one.</Text>
              </>
            )}
          </View>

          <TouchableOpacity
            style={[styles.okButton, loading && styles.okButtonDisabled]}
            onPress={handleVerifyOTP}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.okButtonText}>Verify OTP</Text>}
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
              Resend OTP
            </Text>
          </TouchableOpacity>

          <View style={styles.bottomInfo}>
            <MaterialCommunityIcons name="information-outline" size={16} color="#636E72" />
            <Text style={styles.infoText}>Check your spam/junk folder if you don't see the OTP in your inbox.</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>

    <StatusModal
      visible={statusModalVisible}
      type={statusType}
      title={statusTitle}
      message={statusMessage}
      onClose={handleStatusModalClose}
    />
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
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
    color: "#961e46",
    marginTop: 15,
  },
  emailText: {
    fontSize: 14,
    color: "#636E72",
    marginTop: 8,
  },
  formSection: {
    marginBottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  instruction: {
    fontSize: 14,
    color: "#636E72",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D3436",
    marginBottom: 10,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#D4B3FF",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    backgroundColor: "#F8F0FF",
  },
  inputBoxError: {
    borderColor: "#F44336",
    backgroundColor: "#FFEBEE",
  },
  input: {
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
    marginTop: 8,
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
    backgroundColor: "#F8F0FF",
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#D4B3FF",
  },
  timerText: {
    fontSize: 14,
    color: "#eb4a7a",
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
    backgroundColor: "#eb4a7a",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#eb4a7a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  okButtonDisabled: {
    backgroundColor: "#D4B3FF",
    shadowOpacity: 0.2,
  },
  okButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 20,
  },
  resendButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#D4B3FF",
  },
  resendButtonDisabled: {
    borderColor: "#E0E0E0",
  },
  resendButtonText: {
    fontSize: 15,
    color: "#eb4a7a",
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
})

export default OTPVerificationScreen

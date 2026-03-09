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
import { API_BASE_URL } from "./apiConfig"
import { validateField } from "./utils/validationSchema"

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalType, setModalType] = useState("") // "success" | "error"
  const [modalMessage, setModalMessage] = useState("")

  const validateForm = () => {
    const newErrors = {}

    const emailError = validateField("email", email)
    if (emailError) newErrors.email = emailError

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSendOTP = async () => {
    if (!validateForm()) {
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
          email: email.toLowerCase().trim(),
        }),
      })

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        setModalType("error")
        setModalMessage("Server returned invalid response. Please make sure the backend server is running.")
        setModalVisible(true)
        return
      }

      const data = await response.json()

      if (data.success) {
        setModalType("success")
        setModalMessage("A verification code has been sent to your email.")
        setModalVisible(true)
      } else {
        // If email not found in DB, show inline error
        if (response.status === 404 || response.status === 403) {
          setErrors({ email: "The email is incorrect" })
        } else {
          setModalType("error")
          setModalMessage(data.message || "Something went wrong. Please try again.")
          setModalVisible(true)
        }
      }
    } catch (error) {
      console.error("Forgot password error:", error)
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
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>Enter your registered email to receive a verification code</Text>
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
            <View style={[styles.inputBox, errors.email && styles.inputBoxError]}>
              <MaterialCommunityIcons name="email-outline" size={20} color="#FF6B9D" />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#BDBDBD"
                value={email}
                onChangeText={(text) => {
                  setEmail(text)
                  if (errors.email) setErrors({ ...errors, email: "" })
                }}
                keyboardType="email-address"
                editable={!loading}
              />
            </View>
            {errors.email && (
              <View style={styles.errorRow}>
                <MaterialCommunityIcons name="alert-circle" size={14} color="#F44336" />
                <Text style={styles.errorText}>{errors.email}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[styles.okButton, loading && styles.okButtonDisabled]}
            onPress={handleSendOTP}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.okButtonText}>Send Verification Code</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.backToLoginPrompt}>
            <Text style={styles.backToLoginText}>Remember your password? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")} disabled={loading}>
              <Text style={styles.backToLoginLink}>Login</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomInfo}>
            <MaterialCommunityIcons name="information-outline" size={16} color="#636E72" />
            <Text style={styles.infoText}>
              We'll send a 6-digit verification code to your email. Use it to reset your password.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Custom Pop-up Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <MaterialCommunityIcons
              name={modalType === "success" ? "email-check-outline" : "alert-circle-outline"}
              size={50}
              color={modalType === "success" ? "#4CAF50" : "#FF6B6B"}
            />
            <Text style={styles.modalTitle}>
              {modalType === "success" ? "OTP Sent" : "Error"}
            </Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonOk]}
                onPress={() => {
                  setModalVisible(false)
                  if (modalType === "success") {
                    navigation.navigate("ResetPassword", {
                      email: email.toLowerCase().trim(),
                    })
                  }
                }}
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
    marginBottom: 25,
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
    marginVertical: 25,
  },
  backToLoginPrompt: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  backToLoginText: {
    fontSize: 14,
    color: "#636E72",
  },
  backToLoginLink: {
    fontSize: 14,
    color: "#FF6B9D",
    fontWeight: "600",
  },
  bottomInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 25,
    paddingHorizontal: 10,
  },
  infoText: {
    fontSize: 12,
    color: "#636E72",
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  // Custom Pop-up Modal
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

export default ForgotPasswordScreen

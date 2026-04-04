"use client"

import { useState, useRef, useCallback } from "react"
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
import { useFocusEffect } from "@react-navigation/native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { API_BASE_URL } from "./apiConfig"
import { validateField } from "./utils/validationSchema"
import { useUser } from "./context/UserContext"

const LoginScreen = ({ navigation }) => {
  const { setUserInfo } = useUser()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorTitle, setErrorTitle] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [errorType, setErrorType] = useState("")
  const passwordInputRef = useRef(null)

  useFocusEffect(
    useCallback(() => {
      setEmail("")
      setPassword("")
      setErrors({})
    }, [])
  )

  const validateForm = () => {
    const newErrors = {}

    const emailError = validateField("email", email)
    if (emailError) newErrors.email = emailError

    const passwordError = validateField("password", password)
    // if (passwordError) newErrors.password = passwordError // Don't show generic password error to avoid giving hints about valid passwords
    // if (passwordError) newErrors.password = "The password is incorrect" // Show a generic error message instead of the specific validation error
    // the generic msg is now a custom pop-up added to the program 
    // P.S. Kashaf <3

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async () => {
    if (!validateForm()) {
      return
    }

    setLoading(true)
    console.log('Login attempt with email:', email)
    console.log('API Base URL:', API_BASE_URL)

    try {
      console.log('Fetching from:', `${API_BASE_URL}/api/login`)
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password: password,
        }),
      })

      console.log('Response status:', response.status)
      const contentType = response.headers.get("content-type")
      console.log('Content-Type:', contentType)
      
      const data = await response.json()
      console.log('Response data:', data)

      if (data.success) {
        setErrorTitle("Success")
        setErrorMessage("Login successful!")
        setErrorType("success")
        setShowErrorModal(true)
        setUserInfo(data.user.email, data.user.name)
        setTimeout(() => {
          navigation.navigate("Home", {
            userEmail: data.user.email,
            userName: data.user.name,
            token: data.token,
            pregnancyWeek: data.user.pregnancyWeek,
          })
        }, 500)
      } else {
        if (data.isVerified === false) {
          setErrorTitle("Verification Required")
          setErrorMessage(data.message)
          setErrorType("verification")
          setShowErrorModal(true)
        } else {
          setErrorTitle("Login Failed")
          setErrorMessage(data.message)
          setErrorType("error")
          setShowErrorModal(true)
        }
      }
    } catch (error) {
      console.error("Login error:", error)
      console.error("Error details:", error.message)
      setErrorTitle("Connection Error")
      setErrorMessage(`Cannot connect to server. ${error.message}`)
      setErrorType("error")
      setShowErrorModal(true)
    } finally {
      setLoading(false)
    }
  }

  const closeErrorModal = () => {
    setShowErrorModal(false)
  }

  const handleVerificationNavigation = () => {
    setShowErrorModal(false)
    navigation.navigate("SignUp")
  }

  return (
    <LinearGradient
      colors={['#E8D5FF', '#D4B3FF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        enabled={Platform.OS === "ios"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            Platform.OS === "android" && styles.scrollContentAndroid,
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
        >
        <View style={styles.headerSection}>
          <MaterialCommunityIcons name="heart-pulse" size={60} color="#FF6B9D" />
          <Text style={styles.title}>Wombly</Text>
          <Text style={styles.subtitle}>Your Pregnancy Care Companion</Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Login to Your Account</Text>

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
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
              />
            </View>
            {errors.email && (
              <View style={styles.errorRow}>
                <MaterialCommunityIcons name="alert-circle" size={14} color="#F44336" />
                <Text style={styles.errorText}>{errors.email}</Text>
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputBox, errors.password && styles.inputBoxError]}>
              <MaterialCommunityIcons name="lock-outline" size={20} color="#FF6B9D" />
              <TextInput
                ref={passwordInputRef}
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#BDBDBD"
                value={password}
                onChangeText={(text) => {
                  setPassword(text)
                  if (errors.password) setErrors({ ...errors, password: "" })
                }}
                secureTextEntry={!showPassword}
                editable={!loading}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialCommunityIcons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#FF6B9D"
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <View style={styles.errorRow}>
                <MaterialCommunityIcons name="alert-circle" size={14} color="#F44336" />
                <Text style={styles.errorText}>{errors.password}</Text>
              </View>
            )}
          </View>

          {/* Forgot Password Link */}
          <TouchableOpacity
            style={styles.forgotPasswordButton}
            onPress={() => navigation.navigate("ForgotPassword")}
            disabled={loading}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.okButton, loading && styles.okButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.okButtonText}>OK</Text>}
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.signupPrompt}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")} disabled={loading}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>

    {/* Error/Success Modal */}
    <Modal
      transparent={true}
      visible={showErrorModal}
      animationType="fade"
      onRequestClose={closeErrorModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <MaterialCommunityIcons
            name={errorType === "success" ? "check-circle" : errorType === "verification" ? "alert-circle" : "alert-circle"}
            size={40}
            color={errorType === "success" ? "#00B894" : "#FF6B9D"}
          />
          <Text style={styles.modalTitle}>{errorTitle}</Text>
          <Text style={styles.modalMessage}>{errorMessage}</Text>
          <View style={styles.modalButtons}>
            {errorType === "verification" ? (
              <>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonNo]}
                  onPress={closeErrorModal}
                >
                  <Text style={styles.modalButtonNoText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonYes]}
                  onPress={handleVerificationNavigation}
                >
                  <Text style={styles.modalButtonYesText}>Go to Sign Up</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonYes]}
                onPress={closeErrorModal}
              >
                <Text style={styles.modalButtonYesText}>OK</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
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
  scrollContentAndroid: {
    justifyContent: "flex-start",
    paddingTop: 60,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#961e46",
    marginTop: 15,
  },
  subtitle: {
    fontSize: 14,
    color: "#636E72",
    marginTop: 5,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#961e46",
    marginBottom: 25,
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
    borderWidth: 2,
    borderColor: "#D4B3FF",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "#F8F0FF",
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
    backgroundColor: "#eb4a7a",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 25,
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
    marginVertical: 25,
  },
  signupPrompt: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    fontSize: 14,
    color: "#636E72",
  },
  signupLink: {
    fontSize: 14,
    color: "#eb4a7a",
    fontWeight: "600",
  },
  // Error Modal Styles
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
  modalButtonNo: {
    backgroundColor: "#F0F0F0",
  },
  modalButtonYes: {
    backgroundColor: "#eb4a7a",
  },
  modalButtonNoText: {
    color: "#2D3436",
    fontWeight: "600",
    fontSize: 15,
  },
  modalButtonYesText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
    textAlign: "center",
  },
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
    marginTop: -5,
  },
  forgotPasswordText: {
    fontSize: 13,
    color: "#FF6B9D",
    fontWeight: "600",
  },
})

export default LoginScreen

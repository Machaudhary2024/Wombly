"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { API_BASE_URL } from "./apiConfig"
import { validateField, validatePasswordMatch } from "./utils/validationSchema"

const SignUpScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    height: "",
    weight: "",
    pregnancyWeek: "",
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasNumber: false,
    hasAlphabet: false,
    hasSpecialChar: false,
  })
  
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [modalMessage, setModalMessage] = useState('')
  const [modalType, setModalType] = useState('error')
  const [pendingNavigation, setPendingNavigation] = useState(null)
  
  const showNotificationModal = (title, message, type = 'error', callback = null) => {
    setModalTitle(title)
    setModalMessage(message)
    setModalType(type)
    setPendingNavigation(callback)
    setShowModal(true)
  }
  
  const closeModal = () => {
    setShowModal(false)
    if (pendingNavigation) {
      setTimeout(() => {
        pendingNavigation()
        setPendingNavigation(null)
      }, 300)
    }
  }

  // Check password strength in real-time
  const checkPasswordStrength = (password) => {
    setPasswordStrength({
      hasMinLength: password.length >= 6,
      hasNumber: /\d/.test(password),
      hasAlphabet: /[a-zA-Z]/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    })
  }

  const validateForm = () => {
    const newErrors = {}

    const requiredFields = ["name", "age", "email", "phone", "password", "confirmPassword"]

    requiredFields.forEach((field) => {
      const error = validateField(field, formData[field])
      if (error) newErrors[field] = error
    })

    if (formData.height) {
      const heightError = validateField("height", formData.height)
      if (heightError) newErrors.height = heightError
    }

    if (formData.weight) {
      const weightError = validateField("weight", formData.weight)
      if (weightError) newErrors.weight = weightError
    }

    if (formData.pregnancyWeek) {
      const weekError = validateField("pregnancyWeek", formData.pregnancyWeek)
      if (weekError) newErrors.pregnancyWeek = weekError
    }

    const passwordMatchError = validatePasswordMatch(formData.password, formData.confirmPassword)
    if (passwordMatchError) newErrors.confirmPassword = passwordMatchError

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignUp = async () => {
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          age: Number.parseInt(formData.age),
          email: formData.email.toLowerCase().trim(),
          phone: formData.phone.trim(),
          password: formData.password,
          height: formData.height ? Number.parseFloat(formData.height) : undefined,
          weight: formData.weight ? Number.parseFloat(formData.weight) : undefined,
          pregnancyWeek: formData.pregnancyWeek ? Number.parseInt(formData.pregnancyWeek) : undefined,
        }),
      })

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        showNotificationModal("Error", "Server returned invalid response.", "error")
        setLoading(false)
        return
      }

      const data = await response.json()

      if (data.success) {
        showNotificationModal("Success", "Account created! Please verify your email.", "success", () => {
          navigation.navigate("OTPVerification", {
            email: formData.email.toLowerCase().trim(),
          })
        })
      } else {
        showNotificationModal("Sign Up Failed", data.message, "error")
      }
    } catch (error) {
      console.error("Sign up error", error)
      showNotificationModal("Error", "Network error. Please try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
    // Check password strength in real-time
    if (field === "password") {
      checkPasswordStrength(value)
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
          <MaterialCommunityIcons name="heart-plus" size={60} color="#FF6B9D" />
          <Text style={styles.title}>Create Account</Text>
        </View>

        <View style={styles.formSection}>
          {/* Name Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <View style={[styles.inputBox, errors.name && styles.inputBoxError]}>
              <MaterialCommunityIcons name="account-outline" size={20} color="#FF6B9D" />
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#BDBDBD"
                value={formData.name}
                onChangeText={(value) => handleInputChange("name", value)}
                editable={!loading}
              />
            </View>
            {errors.name && (
              <View style={styles.errorRow}>
                <MaterialCommunityIcons name="alert-circle" size={14} color="#F44336" />
                <Text style={styles.errorText}>{errors.name}</Text>
              </View>
            )}
          </View>

          {/* Age Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Age</Text>
            <View style={[styles.inputBox, errors.age && styles.inputBoxError]}>
              <MaterialCommunityIcons name="calendar-outline" size={20} color="#FF6B9D" />
              <TextInput
                style={styles.input}
                placeholder="Enter your age"
                placeholderTextColor="#BDBDBD"
                value={formData.age}
                onChangeText={(value) => handleInputChange("age", value)}
                keyboardType="numeric"
                editable={!loading}
              />
            </View>
            {errors.age && (
              <View style={styles.errorRow}>
                <MaterialCommunityIcons name="alert-circle" size={14} color="#F44336" />
                <Text style={styles.errorText}>{errors.age}</Text>
              </View>
            )}
          </View>

          {/* Email Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
            <View style={[styles.inputBox, errors.email && styles.inputBoxError]}>
              <MaterialCommunityIcons name="email-outline" size={20} color="#FF6B9D" />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#BDBDBD"
                value={formData.email}
                onChangeText={(value) => handleInputChange("email", value)}
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

          {/* Phone Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={[styles.inputBox, errors.phone && styles.inputBoxError]}>
              <MaterialCommunityIcons name="phone-outline" size={20} color="#FF6B9D" />
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                placeholderTextColor="#BDBDBD"
                value={formData.phone}
                onChangeText={(value) => handleInputChange("phone", value)}
                keyboardType="phone-pad"
                editable={!loading}
              />
            </View>
            {errors.phone && (
              <View style={styles.errorRow}>
                <MaterialCommunityIcons name="alert-circle" size={14} color="#F44336" />
                <Text style={styles.errorText}>{errors.phone}</Text>
              </View>
            )}
          </View>

          {/* Password Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputBox, errors.password && styles.inputBoxError]}>
              <MaterialCommunityIcons name="lock-outline" size={20} color="#FF6B9D" />
              <TextInput
                style={styles.input}
                placeholder="Create a password"
                placeholderTextColor="#BDBDBD"
                value={formData.password}
                onChangeText={(value) => handleInputChange("password", value)}
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
            {errors.password && (
              <View style={styles.errorRow}>
                <MaterialCommunityIcons name="alert-circle" size={14} color="#F44336" />
                <Text style={styles.errorText}>{errors.password}</Text>
              </View>
            )}
            
            {/* Password Strength Indicator */}
            {formData.password.length > 0 && (
              <View style={styles.passwordStrengthContainer}>
                <Text style={styles.passwordStrengthTitle}>Password Requirements:</Text>
                
                <View style={styles.strengthRequirement}>
                  <MaterialCommunityIcons
                    name={passwordStrength.hasMinLength ? "check-circle" : "circle-outline"}
                    size={18}
                    color={passwordStrength.hasMinLength ? "#4CAF50" : "#BDBDBD"}
                  />
                  <Text style={[styles.strengthText, { color: passwordStrength.hasMinLength ? "#4CAF50" : "#757575" }]}>
                    At least 6 characters
                  </Text>
                </View>

                <View style={styles.strengthRequirement}>
                  <MaterialCommunityIcons
                    name={passwordStrength.hasAlphabet ? "check-circle" : "circle-outline"}
                    size={18}
                    color={passwordStrength.hasAlphabet ? "#4CAF50" : "#BDBDBD"}
                  />
                  <Text style={[styles.strengthText, { color: passwordStrength.hasAlphabet ? "#4CAF50" : "#757575" }]}>
                    Contains letters (A-Z, a-z)
                  </Text>
                </View>

                <View style={styles.strengthRequirement}>
                  <MaterialCommunityIcons
                    name={passwordStrength.hasNumber ? "check-circle" : "circle-outline"}
                    size={18}
                    color={passwordStrength.hasNumber ? "#4CAF50" : "#BDBDBD"}
                  />
                  <Text style={[styles.strengthText, { color: passwordStrength.hasNumber ? "#4CAF50" : "#757575" }]}>
                    Contains number (0-9)
                  </Text>
                </View>

                <View style={styles.strengthRequirement}>
                  <MaterialCommunityIcons
                    name={passwordStrength.hasSpecialChar ? "check-circle" : "circle-outline"}
                    size={18}
                    color={passwordStrength.hasSpecialChar ? "#4CAF50" : "#BDBDBD"}
                  />
                  <Text style={[styles.strengthText, { color: passwordStrength.hasSpecialChar ? "#4CAF50" : "#757575" }]}>
                    Contains special character (!@#$%^&*)
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Confirm Password Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={[styles.inputBox, errors.confirmPassword && styles.inputBoxError]}>
              <MaterialCommunityIcons name="lock-outline" size={20} color="#FF6B9D" />
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor="#BDBDBD"
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange("confirmPassword", value)}
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

          {/* Optional Fields Section */}
          <View style={styles.optionalSection}>
            <Text style={styles.optionalTitle}>Optional Information</Text>

            {/* Height Field */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Height (cm)</Text>
              <View style={[styles.inputBox, errors.height && styles.inputBoxError]}>
                <MaterialCommunityIcons name="human-male-height" size={20} color="#FF6B9D" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your height"
                  placeholderTextColor="#BDBDBD"
                  value={formData.height}
                  onChangeText={(value) => handleInputChange("height", value)}
                  keyboardType="decimal-pad"
                  editable={!loading}
                />
              </View>
              {errors.height && (
                <View style={styles.errorRow}>
                  <MaterialCommunityIcons name="alert-circle" size={14} color="#F44336" />
                  <Text style={styles.errorText}>{errors.height}</Text>
                </View>
              )}
            </View>

            {/* Weight Field */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Weight (kg)</Text>
              <View style={[styles.inputBox, errors.weight && styles.inputBoxError]}>
                <MaterialCommunityIcons name="scale-bathroom" size={20} color="#FF6B9D" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your weight"
                  placeholderTextColor="#BDBDBD"
                  value={formData.weight}
                  onChangeText={(value) => handleInputChange("weight", value)}
                  keyboardType="decimal-pad"
                  editable={!loading}
                />
              </View>
              {errors.weight && (
                <View style={styles.errorRow}>
                  <MaterialCommunityIcons name="alert-circle" size={14} color="#F44336" />
                  <Text style={styles.errorText}>{errors.weight}</Text>
                </View>
              )}
            </View>

            {/* Pregnancy Week Field */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Current Pregnancy Week</Text>
              <View style={[styles.inputBox, errors.pregnancyWeek && styles.inputBoxError]}>
                <MaterialCommunityIcons name="calendar-check" size={20} color="#FF6B9D" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter pregnancy week (1-38)"
                  placeholderTextColor="#BDBDBD"
                  value={formData.pregnancyWeek}
                  onChangeText={(value) => handleInputChange("pregnancyWeek", value)}
                  keyboardType="numeric"
                  editable={!loading}
                />
              </View>
              {errors.pregnancyWeek && (
                <View style={styles.errorRow}>
                  <MaterialCommunityIcons name="alert-circle" size={14} color="#F44336" />
                  <Text style={styles.errorText}>{errors.pregnancyWeek}</Text>
                </View>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.okButton, loading && styles.okButtonDisabled]}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.okButtonText}>OK</Text>}
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.loginPrompt}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")} disabled={loading}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>

      {/* Success/Error Modal */}
      <Modal
        transparent={true}
        visible={showModal}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <MaterialCommunityIcons
              name={modalType === "success" ? "check-circle" : "alert-circle"}
              size={50}
              color={modalType === "success" ? "#00B894" : "#FF6B9D"}
            />
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonYes]}
              onPress={closeModal}
            >
              <Text style={styles.modalButtonYesText}>OK</Text>
            </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#961e46",
    marginTop: 15,
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
  inputContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2D3436",
    marginBottom: 7,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#D4B3FF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    backgroundColor: "#F8F0FF",
  },
  inputBoxError: {
    borderColor: "#F44336",
    backgroundColor: "#FFEBEE",
  },
  input: {
    flex: 1,
    marginHorizontal: 8,
    fontSize: 13,
    color: "#2D3436",
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  errorText: {
    fontSize: 11,
    color: "#F44336",
    marginLeft: 5,
  },
  optionalSection: {
    backgroundColor: "#F8F0FF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 18,
    borderWidth: 2,
    borderColor: "#D4B3FF",
  },
  optionalTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#961e46",
    marginBottom: 12,
  },
  passwordStrengthContainer: {
    marginTop: 12,
    backgroundColor: "#F0F8FF",
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#6C5CE7",
  },
  passwordStrengthTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6C5CE7",
    marginBottom: 10,
  },
  strengthRequirement: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  strengthText: {
    fontSize: 12,
    marginLeft: 8,
    fontWeight: "500",
  },
  okButton: {
    backgroundColor: "#eb4a7a",
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
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
    fontSize: 15,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 20,
  },
  loginPrompt: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: 13,
    color: "#636E72",
  },
  loginLink: {
    fontSize: 13,
    color: "#eb4a7a",
    fontWeight: "600",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
  modalButton: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: "center",
  },
  modalButtonYes: {
    backgroundColor: "#eb4a7a",
  },
  modalButtonYesText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
    textAlign: "center",
  },
})

export default SignUpScreen

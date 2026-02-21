"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
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
        Alert.alert("Error", "Server returned invalid response.")
        setLoading(false)
        return
      }

      const data = await response.json()

      if (data.success) {
        Alert.alert("Success", "Account created! Please verify your email.")
        navigation.navigate("OTPVerification", {
          email: formData.email.toLowerCase().trim(),
        })
      } else {
        Alert.alert("Sign Up Failed", data.message)
      }
    } catch (error) {
      console.error("Sign up error:", error)
      Alert.alert("Error", "Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
    color: "#FF6B9D",
    marginTop: 15,
  },
  formSection: {
    marginBottom: 20,
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
    borderWidth: 1,
    borderColor: "#FFB8D1",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    backgroundColor: "#FFF5FA",
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
    backgroundColor: "#FFF5FA",
    borderRadius: 10,
    padding: 15,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#FFE5F1",
  },
  optionalTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#9C27B0",
    marginBottom: 12,
  },
  okButton: {
    backgroundColor: "#FF6B9D",
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
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
    fontSize: 15,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
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
    color: "#FF6B9D",
    fontWeight: "600",
  },
})

export default SignUpScreen

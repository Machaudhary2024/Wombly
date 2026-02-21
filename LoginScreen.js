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
import { validateField } from "./utils/validationSchema"

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    const emailError = validateField("email", email)
    if (emailError) newErrors.email = emailError

    const passwordError = validateField("password", password)
    if (passwordError) newErrors.password = passwordError

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async () => {
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
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

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        Alert.alert("Error", "Server returned invalid response.")
        setLoading(false)
        return
      }

      const data = await response.json()

      if (data.success) {
        Alert.alert("Success", "Login successful!")
        navigation.navigate("Home", {
          userEmail: data.user.email,
          userName: data.user.name,
          token: data.token,
          pregnancyWeek: data.user.pregnancyWeek,
        })
      } else {
        if (data.isVerified === false) {
          Alert.alert("Verification Required", data.message, [
            {
              text: "Go to Sign Up",
              onPress: () => navigation.navigate("SignUp"),
            },
            { text: "Cancel", style: "cancel" },
          ])
        } else {
          Alert.alert("Login Failed", data.message)
        }
      }
    } catch (error) {
      console.error("Login error:", error)
      Alert.alert("Error", "Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF6B9D",
    marginTop: 15,
  },
  subtitle: {
    fontSize: 14,
    color: "#636E72",
    marginTop: 5,
  },
  formSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2D3436",
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
    marginTop: 25,
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
    color: "#FF6B9D",
    fontWeight: "600",
  },
})

export default LoginScreen

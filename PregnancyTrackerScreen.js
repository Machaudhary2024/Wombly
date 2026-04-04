"use client"

// ... existing imports and existing code ...

import { useState, useEffect } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { API_BASE_URL } from "./apiConfig"
import StatusModal from "./components/StatusModal"

const PregnancyTrackerScreen = ({ navigation, route }) => {
  const userEmail = route.params?.userEmail
  const pregnancyWeekParam = route.params?.pregnancyWeek
  const [pregnancyWeek, setPregnancyWeek] = useState(pregnancyWeekParam ? Number.parseInt(pregnancyWeekParam) : null)
  const [modalVisible, setModalVisible] = useState(false)
  const [weekInput, setWeekInput] = useState(pregnancyWeek ? pregnancyWeek.toString() : "")
  const [weekError, setWeekError] = useState("")
  const [statusModalVisible, setStatusModalVisible] = useState(false)
  const [statusType, setStatusType] = useState("success")
  const [statusTitle, setStatusTitle] = useState("")
  const [statusMessage, setStatusMessage] = useState("")

  // Fetch pregnancy week from server when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      if (userEmail) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/user?email=${encodeURIComponent(userEmail)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          })
          if (response.ok) {
            const data = await response.json()
            if (data.success && data.user.pregnancyWeek) {
              const week = Number.parseInt(data.user.pregnancyWeek)
              setPregnancyWeek(week)
              setWeekInput(week.toString())
            }
          }
        } catch (error) {
          console.error('Error fetching pregnancy week:', error)
        }
      }
    })
    return unsubscribe
  }, [navigation, userEmail])

  const calculateCurrentStage = (week) => {
    if (!week || isNaN(week)) {
      return null
    }

    const weekNum = Number.parseInt(week)

    if (weekNum >= 1 && weekNum <= 7) return "week0-7"
    if (weekNum >= 8 && weekNum <= 12) return "week8-12"
    if (weekNum >= 13 && weekNum <= 18) return "week13-18"
    if (weekNum >= 19 && weekNum <= 22) return "week19-22"
    if (weekNum >= 23 && weekNum <= 27) return "week23-27"
    if (weekNum >= 28 && weekNum <= 33) return "week28-33"
    if (weekNum >= 34 && weekNum <= 38) return "week34-38"

    return null
  }

  const calculateWeeksRemaining = (week) => {
    if (!week || isNaN(week)) return null
    const weekNum = Number.parseInt(week)
    const remaining = 38 - weekNum
    return remaining >= 0 ? remaining : 0
  }

  const currentStage = calculateCurrentStage(pregnancyWeek)
  const weeksRemaining = calculateWeeksRemaining(pregnancyWeek)

  const stages = [
    {
      id: "preconception",
      title: "Preconception",
      description: "Preparing for pregnancy",
      icon: "heart-outline",
      iconColor: "#FF6B9D",
      iconBg: "#FFE5F1",
    },
    {
      id: "week0-7",
      title: "Week 0-7",
      description: "Early pregnancy development",
      icon: "calendar",
      iconColor: "#4CAF50",
      iconBg: "#E8F5E9",
    },
    {
      id: "week8-12",
      title: "Week 8-12",
      description: "First trimester milestones",
      icon: "calendar",
      iconColor: "#2196F3",
      iconBg: "#E3F2FD",
    },
    {
      id: "week13-18",
      title: "Week 13-18",
      description: "Second trimester begins",
      icon: "calendar",
      iconColor: "#FFC107",
      iconBg: "#FFF9E6",
    },
    {
      id: "week19-22",
      title: "Week 19-22",
      description: "Mid-pregnancy development",
      icon: "calendar",
      iconColor: "#FF9800",
      iconBg: "#FFF3E0",
    },
    {
      id: "week23-27",
      title: "Week 23-27",
      description: "Late second trimester",
      icon: "calendar",
      iconColor: "#9C27B0",
      iconBg: "#F3E5F5",
    },
    {
      id: "week28-33",
      title: "Week 28-33",
      description: "Third trimester begins",
      icon: "calendar",
      iconColor: "#009688",
      iconBg: "#E0F2F1",
    },
    {
      id: "week34-38",
      title: "Week 34-38",
      description: "Preparing for birth",
      icon: "calendar",
      iconColor: "#03A9F4",
      iconBg: "#E1F5FE",
    },
    {
      id: "birth",
      title: "Birth",
      description: "Labor and delivery guidance",
      icon: "gift-outline",
      iconColor: "#F44336",
      iconBg: "#FFEBEE",
    },
  ]

  const handleUpdateWeek = async () => {
    const weekNum = Number.parseInt(weekInput)

    if (!weekInput || isNaN(weekNum) || weekNum < 1 || weekNum > 38) {
      setWeekError("Please enter a week between 1 and 38")
      return
    }

    setWeekError("")

    try {
      const response = await fetch(`${API_BASE_URL}/api/update-pregnancy-week`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: route.params?.userEmail,
          pregnancyWeek: weekNum,
        }),
      })

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        setStatusType("error")
        setStatusTitle("Error")
        setStatusMessage("Server returned invalid response.")
        setStatusModalVisible(true)
        return
      }

      const data = await response.json()

      if (data.success) {
        setPregnancyWeek(weekNum)
        navigation.setParams({ pregnancyWeek: weekNum })
        setModalVisible(false)
        setStatusType("success")
        setStatusTitle("Success")
        setStatusMessage("Pregnancy week updated successfully!")
        setStatusModalVisible(true)
      } else {
        setWeekError(data.message || "Failed to update week")
      }
    } catch (error) {
      console.error("Update week error:", error)
      setWeekError("Network error. Please try again.")
    }
  }

  const handleStagePress = (stage) => {
    const stageRoutes = {
      preconception: "Preconception",
      "week0-7": "Week0To7",
      "week8-12": "Week8To12",
      "week13-18": "Week13To18",
      "week19-22": "Week19To22",
      "week23-27": "Week23To27",
      "week28-33": "Week28To33",
      "week34-38": "Week34To38",
      birth: "Birth",
    }

    if (stageRoutes[stage.id]) {
      navigation.navigate(stageRoutes[stage.id])
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#f0cfe3", "#de81fa"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#961e46" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pregnancy Tracker</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {!pregnancyWeek && (
          <View style={styles.infoCard}>
            <MaterialCommunityIcons name="information" size={24} color="#F57C00" />
            <Text style={styles.infoText}>
              No pregnancy week set. Please update your profile to track your pregnancy progress.
            </Text>
          </View>
        )}

        {pregnancyWeek && (
          <LinearGradient
            colors={["#f0cfe3", "#de81fa"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.countdownCard}
          >
            <View style={styles.countdownContent}>
              <View style={styles.countdownItem}>
                <Text style={styles.countdownLabel}>Current Week</Text>
                <Text style={styles.countdownValue}>{pregnancyWeek}</Text>
              </View>
              <View style={styles.countdownDivider} />
              <View style={styles.countdownItem}>
                <Text style={styles.countdownLabel}>Weeks Remaining</Text>
                <Text style={styles.countdownValue}>{weeksRemaining}</Text>
              </View>
            </View>
            <Text style={styles.countdownSubtext}>
              {weeksRemaining > 0
                ? `${weeksRemaining} week${weeksRemaining !== 1 ? "s" : ""} until your due date`
                : "You've reached week 38! Your baby is ready to arrive."}
            </Text>
          </LinearGradient>
        )}

        {stages.map((stage) => {
          const isCurrentStage = currentStage === stage.id
          return (
            <TouchableOpacity
              key={stage.id}
              style={[styles.stageCard, isCurrentStage && styles.currentStageCard]}
              activeOpacity={0.7}
              onPress={() => handleStagePress(stage)}
            >
              <View style={styles.cardContent}>
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: stage.iconBg },
                    isCurrentStage && styles.currentIconCircle,
                  ]}
                >
                  <MaterialCommunityIcons name={stage.icon} size={28} color={stage.iconColor} />
                </View>
                <View style={styles.textContainer}>
                  <Text style={[styles.stageTitle, isCurrentStage && styles.currentStageTitle]}>{stage.title}</Text>
                  <Text style={styles.stageDescription}>{stage.description}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#636E72" />
              </View>
            </TouchableOpacity>
          )
        })}
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Pregnancy Week</Text>
            <Text style={styles.modalSubtitle}>Enter your current pregnancy week (1-38)</Text>

            <TextInput
              style={[styles.modalInput, weekError && styles.modalInputError]}
              placeholder="Enter week (1-38)"
              placeholderTextColor="#999"
              value={weekInput}
              onChangeText={(text) => {
                setWeekInput(text)
                if (weekError) setWeekError("")
              }}
              keyboardType="numeric"
              maxLength={2}
            />

            {weekError && (
              <View style={styles.errorContainer}>
                <MaterialCommunityIcons name="alert-circle" size={16} color="#F44336" />
                <Text style={styles.errorText}>{weekError}</Text>
              </View>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false)
                  setWeekInput(pregnancyWeek ? pregnancyWeek.toString() : "")
                  setWeekError("")
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.updateButtonModal]} onPress={handleUpdateWeek}>
                <Text style={styles.updateButtonText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <StatusModal
        visible={statusModalVisible}
        type={statusType}
        title={statusTitle}
        message={statusMessage}
        onClose={() => setStatusModalVisible(false)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    flex: 1,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 90,
  },
  infoCard: {
    backgroundColor: "#FFF3CD",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FFC107",
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    fontSize: 14,
    color: "#856404",
    marginLeft: 10,
    flex: 1,
  },
  countdownCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  countdownContent: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 12,
  },
  countdownItem: {
    alignItems: "center",
    flex: 1,
  },
  countdownLabel: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
    marginBottom: 8,
  },
  countdownValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  countdownDivider: {
    width: 1,
    height: 50,
    backgroundColor: "#FFFFFF",
    opacity: 0.3,
    marginHorizontal: 20,
  },
  countdownSubtext: {
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "center",
    opacity: 0.9,
    marginTop: 8,
  },
  stageCard: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    marginBottom: 12,
    padding: 15,
  },
  currentStageCard: {
    backgroundColor: "#FFE5F1",
    borderWidth: 3,
    borderColor: "#FF6B9D",
    shadowColor: "#FF6B9D",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  currentIconCircle: {
    borderWidth: 2,
    borderColor: "#FF6B9D",
  },
  textContainer: {
    flex: 1,
  },
  stageTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2D3436",
    marginBottom: 4,
  },
  currentStageTitle: {
    color: "#FF6B9D",
  },
  stageDescription: {
    fontSize: 14,
    color: "#636E72",
    lineHeight: 20,
  },
  updateButton: {
    padding: 5,
    width: 34,
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 25,
    width: "85%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FF6B9D",
    marginBottom: 8,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#636E72",
    marginBottom: 20,
    textAlign: "center",
  },
  modalInput: {
    height: 50,
    borderWidth: 1,
    borderColor: "#FFB8D1",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#2D3436",
    marginBottom: 10,
  },
  modalInputError: {
    borderColor: "#F44336",
    backgroundColor: "#FFEBEE",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  errorText: {
    fontSize: 12,
    color: "#F44336",
    marginLeft: 8,
    flex: 1,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F5F5F5",
  },
  cancelButtonText: {
    color: "#636E72",
    fontSize: 16,
    fontWeight: "600",
  },
  updateButtonModal: {
    backgroundColor: "#FF6B9D",
  },
  updateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default PregnancyTrackerScreen

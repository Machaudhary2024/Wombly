"use client"

import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Alert } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

const PostpartumRecoveryScreen = ({ navigation }) => {
  const [milestoneProgress, setMilestoneProgress] = useState({})
  const [completionPercentage, setCompletionPercentage] = useState(0)
  const [progressAnimation] = useState(new Animated.Value(0))

  const RECOVERY_MILESTONES = [
    { id: 1, title: "First week recovery started", category: "Week 1" },
    { id: 2, title: "Second week recovery started", category: "Week 2" },
    { id: 3, title: "Six week checkup scheduled", category: "Week 6" },
    { id: 4, title: "Started gentle exercise", category: "Exercise" },
    { id: 5, title: "Mental health improving", category: "Mental Health" },
    { id: 6, title: "Six month milestone reached", category: "Six Months" },
    { id: 7, title: "One year recovery complete", category: "One Year" },
  ]

  useEffect(() => {
    loadProgress()
  }, [])

  useEffect(() => {
    const completed = Object.values(milestoneProgress).filter((v) => v).length
    const percentage = Math.round((completed / RECOVERY_MILESTONES.length) * 100)
    setCompletionPercentage(percentage)

    Animated.timing(progressAnimation, {
      toValue: percentage,
      duration: 500,
      useNativeDriver: false,
    }).start()
  }, [milestoneProgress])

  const loadProgress = async () => {
    try {
      const savedProgress = await AsyncStorage.getItem("postpartumProgress")
      if (savedProgress) {
        setMilestoneProgress(JSON.parse(savedProgress))
      }
    } catch (error) {
      console.error("Error loading progress:", error)
    }
  }

  const toggleMilestone = async (id) => {
    const newProgress = {
      ...milestoneProgress,
      [id]: !milestoneProgress[id],
    }
    setMilestoneProgress(newProgress)

    try {
      await AsyncStorage.setItem("postpartumProgress", JSON.stringify(newProgress))
    } catch (error) {
      console.error("Error saving progress:", error)
    }
  }

  const resetProgress = () => {
    Alert.alert("Reset Progress", "Are you sure you want to reset all milestone progress?", [
      { text: "Cancel", onPress: () => {}, style: "cancel" },
      {
        text: "Reset",
        onPress: async () => {
          setMilestoneProgress({})
          try {
            await AsyncStorage.removeItem("postpartumProgress")
          } catch (error) {
            console.error("Error resetting progress:", error)
          }
        },
        style: "destructive",
      },
    ])
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#f0cfe3", "#de81fa"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#961e46" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Get Postpartum Guidance</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Your Recovery Progress</Text>
            <Text style={styles.progressPercentage}>{completionPercentage}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressAnimation.interpolate({
                    inputRange: [0, 100],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
          </View>
          <View style={styles.milestonesContainer}>
            {RECOVERY_MILESTONES.map((milestone) => (
              <TouchableOpacity
                key={milestone.id}
                style={[styles.milestoneItem, milestoneProgress[milestone.id] && styles.milestoneItemCompleted]}
                onPress={() => toggleMilestone(milestone.id)}
              >
                <View style={styles.milestoneCheckbox}>
                  {milestoneProgress[milestone.id] && <MaterialCommunityIcons name="check" size={20} color="#FF6B9D" />}
                </View>
                <View style={styles.milestoneContent}>
                  <Text style={styles.milestoneCategory}>{milestone.category}</Text>
                  <Text style={styles.milestoneTitle}>{milestone.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          {completionPercentage > 0 && (
            <TouchableOpacity style={styles.resetButton} onPress={resetProgress}>
              <Text style={styles.resetButtonText}>Reset Progress</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.heroSection}>
          <View style={styles.iconContainer}>
            <LinearGradient colors={["#FFE5F1", "#F3E5F5"]} style={styles.heroIconBg}>
              <MaterialCommunityIcons name="heart-pulse" size={50} color="#FF6B9D" />
            </LinearGradient>
          </View>
          <Text style={styles.heroTitle}>Your Recovery Journey</Text>
          <Text style={styles.heroSubtitle}>Understanding your body's healing process after birth</Text>
        </View>

        <View style={styles.warningCard}>
          <MaterialCommunityIcons name="alert-circle" size={32} color="#F44336" />
          <View style={styles.warningContent}>
            <Text style={styles.warningTitle}>When to Seek Medical Attention</Text>
            <Text style={styles.warningText}>
              Call 1122 or seek emergency care if you experience: chest pain, rapid heart rate, loss of consciousness,
              seizures, confusion, heavy bleeding (soaking through pads hourly), or thoughts of harming yourself or your
              baby.
            </Text>
          </View>
        </View>

        <TimelineSection week="Week 1" icon="calendar-week" colors={["#FFE5F1", "#F3E5F5"]} iconColor="#FF6B9D">
          <PhysicalStatusCard
            title="Vaginal Delivery"
            items={[
              "Perineal soreness is typical",
              "Bright red bleeding that will turn brown",
              "Little contractions as uterus contracts",
              "May have perineal lacerations (tearing)",
            ]}
          />
          <PhysicalStatusCard
            title="C-Section"
            items={[
              "Movement will be difficult",
              "Incision pain is common",
              "Trouble getting in/out of bed",
              "Bladder catheter will be removed",
              "Important to move to avoid blood clots",
            ]}
          />
          <MentalHealthCard text="Day 3 is often emotionally challenging. The birth buzz wears off, hormones are shifting, and sleep deprivation sets in. This can cause weepiness and feeling like nothing is going right." />
          <RecoveryTipsCard
            tips={[
              { icon: "ice-cream", text: "Use ice packs or frozen pads with witch hazel on perineum" },
              { icon: "spray-bottle", text: "Use warm water spray bottle during/after peeing" },
              { icon: "pill", text: "Take acetaminophen or ibuprofen regularly" },
              { icon: "water", text: "Take stool softener and drink lots of water" },
              { icon: "thermometer", text: "Monitor for infection - take temperature regularly" },
            ]}
          />
        </TimelineSection>

        <TimelineSection week="Week 2" icon="calendar-week-begin" colors={["#F3E5F5", "#E1BEE7"]} iconColor="#9C27B0">
          <PhysicalStatusCard
            title="Vaginal Delivery"
            items={[
              "Bleeding should be lighter and brownish",
              "Perineum should be less sore",
              "Uterus continues contracting",
              "May still experience some discomfort",
            ]}
          />
          <PhysicalStatusCard
            title="C-Section"
            items={[
              "Incision should be healing",
              "Movement getting easier",
              "Still need to be careful with lifting",
              "Continue monitoring incision for infection",
            ]}
          />
          <MentalHealthCard text="You may still feel emotional. Sleep deprivation continues. Be patient with yourself and accept help from others." />
          <RecoveryTipsCard
            tips={[
              { icon: "walk", text: "Light walking is beneficial" },
              { icon: "hand-heart", text: "Accept help from family and friends" },
              { icon: "sleep", text: "Rest when baby sleeps" },
              { icon: "food", text: "Eat nutritious meals" },
            ]}
          />
        </TimelineSection>

        <TimelineSection week="Week 6" icon="calendar-check" colors={["#FFE5F1", "#FFB8D1"]} iconColor="#FF6B9D">
          <PhysicalStatusCard
            title="Vaginal Delivery"
            items={[
              "Bleeding should have stopped or be very light",
              "Perineum should be mostly healed",
              "May have your 6-week checkup",
              "Can discuss returning to exercise",
            ]}
          />
          <PhysicalStatusCard
            title="C-Section"
            items={[
              "Incision should be well-healed",
              "Can discuss returning to exercise",
              "May have your 6-week checkup",
              "Scar may still be sensitive",
            ]}
          />
          <MentalHealthCard text="If you're experiencing persistent sadness, anxiety, or feelings of hopelessness, this could be postpartum depression (PPD). Talk to your doctor." />
          <RecoveryTipsCard
            tips={[
              { icon: "dumbbell", text: "Can start gentle exercise with doctor's approval" },
              { icon: "heart-pulse", text: "Pelvic floor exercises are important" },
              { icon: "account-heart", text: "Discuss contraception with your doctor" },
              { icon: "bed", text: "Sex may still be painful - communicate with partner" },
            ]}
          />
        </TimelineSection>

        <TimelineSection week="Six Months" icon="calendar-month" colors={["#E1BEE7", "#CE93D8"]} iconColor="#9C27B0">
          <PhysicalStatusCard
            title="Vaginal Delivery"
            items={[
              "Hair loss may stop or lessen",
              "May have full bladder control again",
              "Milk may be drying up (if weaning)",
              "Period may return (depends on breastfeeding)",
            ]}
          />
          <PhysicalStatusCard
            title="C-Section"
            items={[
              "Milk may be drying up (if weaning)",
              "Period may return",
              "Hair loss may stop or lessen",
              "Scar continues to fade",
            ]}
          />
          <MentalHealthCard text="If you're getting into the swing of parenthood and baby is sleeping more, your mental state might be more positive. Continue discussing any PPD concerns with your doctor." />
          <RecoveryTipsCard
            tips={[
              { icon: "dumbbell", text: "Exercise is important for mental and physical health" },
              { icon: "dumbbell", text: "Can do abdominal strengthening exercises" },
              { icon: "account-heart", text: "Continue pelvic floor exercises" },
              { icon: "pill", text: "Discuss contraception if not planning another pregnancy" },
            ]}
          />
        </TimelineSection>

        <TimelineSection week="One Year" icon="calendar-star" colors={["#FFB8D1", "#FF6B9D"]} iconColor="#FF6B9D">
          <PhysicalStatusCard
            title="Vaginal Delivery"
            items={[
              "May feel back to yourself",
              "Body may still feel slightly different",
              "Weight may be distributed differently",
              "Breasts may appear different (if still nursing)",
            ]}
          />
          <PhysicalStatusCard
            title="C-Section"
            items={[
              "Scar will have faded but may still be numb",
              "If planning another baby, discuss timing with doctor",
              "May need another C-section if babies are 18 months or less apart",
              "VBAC (vaginal birth after cesarean) may be possible",
            ]}
          />
          <MentalHealthCard text="Your mental state will likely depend on how comfortably you're adapting to parenthood and how much sleep you're getting. Continue napping when possible." />
          <RecoveryTipsCard
            tips={[
              { icon: "doctor", text: "Discuss ongoing complications (painful sex, prolapse, incontinence)" },
              { icon: "food", text: "Maintain nutritious diet" },
              { icon: "dumbbell", text: "Continue exercising for energy and mental health" },
              { icon: "sleep", text: "Nap on weekends when baby naps" },
            ]}
          />
        </TimelineSection>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  )
}

const TimelineSection = ({ week, icon, colors, iconColor, children }) => (
  <View style={styles.timelineSection}>
    <View style={styles.timelineHeader}>
      <LinearGradient colors={colors} style={styles.timelineIconBg}>
        <MaterialCommunityIcons name={icon} size={32} color={iconColor} />
      </LinearGradient>
      <Text style={styles.timelineTitle}>{week}</Text>
    </View>
    {children}
  </View>
)

const PhysicalStatusCard = ({ title, items }) => (
  <View style={styles.physicalCard}>
    <View style={styles.physicalCardHeader}>
      <MaterialCommunityIcons name="human-female" size={24} color="#9C27B0" />
      <Text style={styles.physicalCardTitle}>{title}</Text>
    </View>
    {items.map((item, index) => (
      <View key={index} style={styles.physicalItem}>
        <MaterialCommunityIcons name="circle-small" size={16} color="#FF6B9D" />
        <Text style={styles.physicalItemText}>{item}</Text>
      </View>
    ))}
  </View>
)

const MentalHealthCard = ({ text }) => (
  <View style={styles.mentalCard}>
    <View style={styles.mentalCardHeader}>
      <MaterialCommunityIcons name="brain" size={24} color="#6C5CE7" />
      <Text style={styles.mentalCardTitle}>Mental Health</Text>
    </View>
    <Text style={styles.mentalCardText}>{text}</Text>
  </View>
)

const RecoveryTipsCard = ({ tips }) => (
  <View style={styles.tipsCard}>
    <View style={styles.tipsCardHeader}>
      <MaterialCommunityIcons name="lightbulb-on" size={24} color="#FF9800" />
      <Text style={styles.tipsCardTitle}>Recovery Tips</Text>
    </View>
    {tips.map((tip, index) => (
      <View key={index} style={styles.tipItem}>
        <MaterialCommunityIcons name={tip.icon} size={20} color="#9C27B0" />
        <Text style={styles.tipItemText}>{tip.text}</Text>
      </View>
    ))}
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
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
  headerSpacer: {
    width: 34,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  progressContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2D3436",
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6B9D",
  },
  progressBarBg: {
    height: 10,
    backgroundColor: "#F0F0F0",
    borderRadius: 5,
    marginBottom: 20,
    overflow: "hidden",
  },
  progressBar: {
    height: 10,
    backgroundColor: "#FF6B9D",
    borderRadius: 5,
  },
  milestonesContainer: {
    marginBottom: 15,
  },
  milestoneItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  milestoneItemCompleted: {
    backgroundColor: "#FFE5F1",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  milestoneCheckbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#FFB8D1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    backgroundColor: "#FFFFFF",
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneCategory: {
    fontSize: 12,
    color: "#9C27B0",
    fontWeight: "600",
    marginBottom: 2,
  },
  milestoneTitle: {
    fontSize: 14,
    color: "#2D3436",
    fontWeight: "500",
  },
  resetButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    alignItems: "center",
  },
  resetButtonText: {
    color: "#636E72",
    fontSize: 14,
    fontWeight: "600",
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 25,
    paddingTop: 20,
  },
  iconContainer: {
    marginBottom: 15,
  },
  heroIconBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2D3436",
    marginBottom: 8,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#636E72",
    textAlign: "center",
  },
  warningCard: {
    flexDirection: "row",
    backgroundColor: "#FFEBEE",
    borderRadius: 12,
    padding: 16,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderLeftColor: "#F44336",
  },
  warningContent: {
    flex: 1,
    marginLeft: 12,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F44336",
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: "#2D3436",
    lineHeight: 20,
  },
  timelineSection: {
    marginBottom: 30,
  },
  timelineHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  timelineIconBg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  timelineTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2D3436",
  },
  physicalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#9C27B0",
  },
  physicalCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  physicalCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#9C27B0",
    marginLeft: 8,
  },
  physicalItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  physicalItemText: {
    fontSize: 14,
    color: "#2D3436",
    lineHeight: 20,
    marginLeft: 8,
    flex: 1,
  },
  mentalCard: {
    backgroundColor: "#F3E5F5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#6C5CE7",
  },
  mentalCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  mentalCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6C5CE7",
    marginLeft: 8,
  },
  mentalCardText: {
    fontSize: 14,
    color: "#2D3436",
    lineHeight: 20,
  },
  tipsCard: {
    backgroundColor: "#FFF3E0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#FF9800",
  },
  tipsCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  tipsCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF9800",
    marginLeft: 8,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  tipItemText: {
    fontSize: 14,
    color: "#2D3436",
    lineHeight: 20,
    marginLeft: 10,
    flex: 1,
  },
  bottomSpacer: {
    height: 20,
  },
})

export default PostpartumRecoveryScreen

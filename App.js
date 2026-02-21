import { StatusBar } from "expo-status-bar"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import LoginScreen from "./LoginScreen"
import SignUpScreen from "./SignUpScreen"
import HomeScreen from "./HomeScreen"
import PregnancyCareScreen from "./PregnancyCareScreen"
import PregnancyTrackerScreen from "./PregnancyTrackerScreen"
import PreconceptionScreen from "./PreconceptionScreen"
import Week0To7Screen from "./Week0To7Screen"
import Week8To12Screen from "./Week8To12Screen"
import Week13To18Screen from "./Week13To18Screen"
import Week19To22Screen from "./Week19To22Screen"
import Week23To27Screen from "./Week23To27Screen"
import Week28To33Screen from "./Week28To33Screen"
import Week34To38Screen from "./Week34To38Screen"
import BirthScreen from "./BirthScreen"
import SetRemindersScreen from "./SetRemindersScreen"
import PostpartumRecoveryScreen from "./PostpartumRecoveryScreen"
import AccountInfoScreen from "./AccountInfoScreen"
import OTPVerificationScreen from "./OTPVerificationScreen"
import ToddlerCareScreen from "./ToddlerCareScreen"
import ToddlerMealsScreen from "./ToddlerMealsScreen"
import TrimesterDetailsScreen from "./TrimesterDetailsScreen"
import EntertainmentModule from "./EntertainmentModule"
import FirstAidGuidanceScreen from "./FirstAidGuidanceScreen"
import HygieneGuidanceScreen from "./HygieneGuidanceScreen"
import AIChatScreen from "./AIChatScreen"
import ActivityTrackingScreen from "./ActivityTrackingScreen"
import NutritionGuideScreen from "./NutritionGuideScreen"
import DosDontsScreen from "./DosDontsScreen"

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PregnancyCare" component={PregnancyCareScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ToddlerCare" component={ToddlerCareScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ToddlerMeals" component={ToddlerMealsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="TrimesterDetails" component={TrimesterDetailsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EntertainmentModule" component={EntertainmentModule} options={{ headerShown: false }} />
        <Stack.Screen name="FirstAidGuidance" component={FirstAidGuidanceScreen} options={{ headerShown: false }} />
        <Stack.Screen name="HygieneGuidance" component={HygieneGuidanceScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AIChat" component={AIChatScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ActivityTracking" component={ActivityTrackingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="NutritionGuide" component={NutritionGuideScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DosDonts" component={DosDontsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="TrackPregnancy" component={PregnancyTrackerScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Preconception" component={PreconceptionScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Week0To7" component={Week0To7Screen} options={{ headerShown: false }} />
        <Stack.Screen name="Week8To12" component={Week8To12Screen} options={{ headerShown: false }} />
        <Stack.Screen name="Week13To18" component={Week13To18Screen} options={{ headerShown: false }} />
        <Stack.Screen name="Week19To22" component={Week19To22Screen} options={{ headerShown: false }} />
        <Stack.Screen name="Week23To27" component={Week23To27Screen} options={{ headerShown: false }} />
        <Stack.Screen name="Week28To33" component={Week28To33Screen} options={{ headerShown: false }} />
        <Stack.Screen name="Week34To38" component={Week34To38Screen} options={{ headerShown: false }} />
        <Stack.Screen name="Birth" component={BirthScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SetReminders" component={SetRemindersScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PostpartumRecovery" component={PostpartumRecoveryScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AccountInfo" component={AccountInfoScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

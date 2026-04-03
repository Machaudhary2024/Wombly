import { StatusBar } from "expo-status-bar"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import LoginScreen from "./LoginScreen"
import SignUpScreen from "./SignUpScreen"
import ForgotPasswordScreen from "./ForgotPasswordScreen"
import ResetPasswordScreen from "./ResetPasswordScreen"
import ChangePasswordScreen from "./ChangePasswordScreen"
import HomeScreen from "./HomeScreen"
import PregnancyCareScreen from "./PregnancyCareScreen"
import PregnancyTrackerScreen from "./PregnancyTrackerScreen"
import Week0To7Screen from "./Week0To7Screen"
import Week8To12Screen from "./Week8To12Screen"
import Week13To18Screen from "./Week13To18Screen"
import Week19To22Screen from "./Week19To22Screen"
import Week23To27Screen from "./Week23To27Screen"
import Week28To33Screen from "./Week28To33Screen"
import Week34To38Screen from "./Week34To38Screen"
import SetRemindersScreen from "./SetRemindersScreen"
import PostpartumRecoveryScreen from "./PostpartumRecoveryScreen"
import AccountInfoScreen from "./AccountInfoScreen"
import OTPVerificationScreen from "./OTPVerificationScreen"
import ToddlerCareScreen from "./ToddlerCareScreen"
import ToddlerMealsScreen from "./ToddlerMealsScreen"
import TrimesterDetailsScreen from "./TrimesterDetailsScreen"
import EntertainmentModule from "./EntertainmentModule"
import CartoonDetailScreen from "./CartoonDetailScreen"
import LullabyDetailScreen from "./LullabyDetailScreen"
import FirstAidGuidanceScreen from "./FirstAidGuidanceScreen"
import FirstAidDetailScreen from "./FirstAidDetailScreen"
import HygieneGuidanceScreen from "./HygieneGuidanceScreen"
import HygieneDetailScreen from "./HygieneDetailScreen"
import AIChatScreen from "./AIChatScreen"
import ActivityTrackingScreen from "./ActivityTrackingScreen"
import NutritionGuideScreen from "./NutritionGuideScreen"
import CravingsScreen from "./CravingsScreen"
import CulturalRemediesScreen from "./CulturalRemediesScreen"
import FoodSafetyScreen from "./FoodSafetyScreen"
import TrimesterNutritionScreen from "./TrimesterNutritionScreen"
import MythsScreen from "./MythsScreen"
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
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PregnancyCare" component={PregnancyCareScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ToddlerCare" component={ToddlerCareScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ToddlerMeals" component={ToddlerMealsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="TrimesterDetails" component={TrimesterDetailsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EntertainmentModule" component={EntertainmentModule} options={{ headerShown: false }} />
        <Stack.Screen name="CartoonDetail" component={CartoonDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LullabyDetail" component={LullabyDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="FirstAidGuidance" component={FirstAidGuidanceScreen} options={{ headerShown: false }} />
        <Stack.Screen name="FirstAidDetailScreen" component={FirstAidDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="HygieneGuidance" component={HygieneGuidanceScreen} options={{ headerShown: false }} />
        <Stack.Screen name="HygieneDetail" component={HygieneDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AIChat" component={AIChatScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ActivityTracking" component={ActivityTrackingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="NutritionGuide" component={NutritionGuideScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Cravings" component={CravingsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CulturalRemedies" component={CulturalRemediesScreen} options={{ headerShown: false }} />
        <Stack.Screen name="FoodSafety" component={FoodSafetyScreen} options={{ headerShown: false }} />
        <Stack.Screen name="TrimesterNutrition" component={TrimesterNutritionScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Myths" component={MythsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DosDonts" component={DosDontsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="TrackPregnancy" component={PregnancyTrackerScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Week0To7" component={Week0To7Screen} options={{ headerShown: false }} />
        <Stack.Screen name="Week8To12" component={Week8To12Screen} options={{ headerShown: false }} />
        <Stack.Screen name="Week13To18" component={Week13To18Screen} options={{ headerShown: false }} />
        <Stack.Screen name="Week19To22" component={Week19To22Screen} options={{ headerShown: false }} />
        <Stack.Screen name="Week23To27" component={Week23To27Screen} options={{ headerShown: false }} />
        <Stack.Screen name="Week28To33" component={Week28To33Screen} options={{ headerShown: false }} />
        <Stack.Screen name="Week34To38" component={Week34To38Screen} options={{ headerShown: false }} />
        <Stack.Screen name="SetReminders" component={SetRemindersScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PostpartumRecovery" component={PostpartumRecoveryScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AccountInfo" component={AccountInfoScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

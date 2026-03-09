# Color Palette Update Summary - Wombly App

## 🎨 New Color Palette (HomeScreen-Based)

All screens should now use this consistent color scheme:

### Primary Gradient
- **Background Gradient**: `['#E8D5FF', '#D4B3FF']` (Soft Purple/Lavender)
- **Secondary Gradient**: `['#f0cfe3', '#de81fa']` (Pink to Purple - for headers)

### Key Colors
| Color Name | Hex Code | Usage |
|-----------|----------|-------|
| Header Text | #961e46 | Dark burgundy for headers, titles |
| Accent Pink | #eb4a7a | Buttons, icons, highlights |
| Bright Pink | #FF6B9D | Secondary buttons, icon backgrounds |
| Dark Text | #2D3436 | Main text content |
| Gray Text | #636E72 | Secondary text, descriptions |
| Light Purple | #D4B3FF | Borders, backgrounds |
| Light Purple BG | #F8F0FF | Input field backgrounds |
| Super Light BG | #F5F0FF | Container backgrounds |
| White | #FFFFFF | Cards, panels |
| Error Red | #F44336 | Error messages |

## ✅ Screens Updated

### Authentication Screens (4/4)
- ✅ LoginScreen.js - Updated with purple gradient, white card background
- ✅ SignUpScreen.js - Updated with purple gradient, white card background
- ✅ OTPVerificationScreen.js - Updated with purple gradient, white card background
- ✅ HomeScreen.js - Already had perfect color scheme

### Menu/Hub Screens (2/3)
- ✅ PregnancyCareScreen.js - Updated header gradient and container
- ✅ Week0To7Screen.js - Updated header gradient and container
- ⏳ PregnancyTrackerScreen.js - Needs update

### Remaining Week Screens (7)
- ⏳ Week8To12Screen.js
- ⏳ Week13To18Screen.js
- ⏳ Week19To22Screen.js
- ⏳ Week23To27Screen.js
- ⏳ Week28To33Screen.js
- ⏳ Week34To38Screen.js

All Week screens use the format:
```javascript
// Find this:
colors={['#FF6B9D', '#9C27B0']}  // OLD COLORS

// Replace with:
colors={['#f0cfe3', '#de81fa']}  // NEW COLORS

// Find this color:
color="#FFFFFF"  // OLD header text

// Replace with:
color="#961e46"  // NEW header text

// Find this:
backgroundColor: '#FFFFFF'  // OLD container

// Replace with:
backgroundColor: '#F5F0FF'  // NEW container
```

### Health & Guidance Screens (Need Update)
- ⏳ HygieneGuidanceScreen.js
- ⏳ FirstAidGuidanceScreen.js
- ⏳ NutritionGuideScreen.js
- ⏳ DosDontsScreen.js

### Other Major Screens (Need Update)
- ⏳ PostpartumRecoveryScreen.js
- ⏳ ToddlerCareScreen.js
- ⏳ ToddlerMealsScreen.js
- ⏳ PreconceptionScreen.js
- ⏳ BirthScreen.js
- ⏳ TrimesterDetailsScreen.js
- ⏳ AccountInfoScreen.js
- ⏳ ActivityTrackingScreen.js
- ⏳ SetRemindersScreen.js
- ⏳ AIChatScreen.js
- ⏳ EntertainmentModule.js

## 🎯 What Was Changed

### For Auth Screens (Login, SignUp, OTP)
1. **Added** LinearGradient import
2. **Wrapped** container with purple gradient background
3. **Updated** button colors to pink (`#eb4a7a`)
4. **Updated** form section background to white with elevation
5. **Updated** input borders from pink to light purple (`#D4B3FF`)
6. **Updated** input backgrounds to light purple (`#F8F0FF`)
7. **Updated** header/title colors to dark burgundy (`#961e46`)
8. **Updated** all link/accent colors to match pink palette

### For Screen Hubs (PregnancyCareScreen, Week screens)
1. **Updated** header gradient from blue to pink-purple
2. **Updated** header text color to dark burgundy
3. **Updated** container background to light purple
4. **Updated** subBanner gradient to match header

## 📱 Remaining Work

### Quick Update Template for Week Screens:
```javascript
// Line ~16: Replace gradient
- colors={['#FF6B9D', '#9C27B0']}
+ colors={['#f0cfe3', '#de81fa']}

// Line ~18: Replace header back button color
- color="#FFFFFF"
+ color="#961e46"

// Line ~195: Update container style
- backgroundColor: '#FFFFFF',
+ backgroundColor: '#F5F0FF',

// Line ~198: Update header title color
- color: '#FFFFFF',
+ color: '#961e46',
```

### For Health Guidance Screens:
1. Update header gradients and text colors if using headers
2. Update button colors to pink (`#eb4a7a`)
3. Update container backgrounds to light purple
4. Check for input fields and update borders to light purple

### For Other Screens:
1. Follow the same pattern as above
2. Replace blue/teal gradients with purple/pink
3. Update white text in headers to dark burgundy
4. Update button colors to pink

## 🚀 How to Complete Remaining Updates

### Option 1: Auto-Complete (Provide List)
All remaining screen names are documented above. Follow the patterns shown.

### Option 2: Let Me Continue
I can systematically update the remaining screens using the templates shown.

### Color Replacement Patterns:
1. `#FF6B9D` or `#9C27B0` → Use `['#f0cfe3', '#de81fa']` gradient
2. `#FFFFFF` (header text) → `#961e46`
3. `#1E5DAB` or similar blues → `#f0cfe3` or `#de81fa`
4. Container `backgroundColor: '#FFFFFF'` → `#F5F0FF`
5. Button colors → `#eb4a7a` for primary, `#D4B3FF` for disabled

## 📊 Design System Standards

### Typography
- **Headers**: Size 20-28px, Weight 700-800, Color #961e46
- **Titles**: Size 16-20px, Weight 700, Color #2D3436
- **Body**: Size 14px, Weight 500, Color #636E72
- **Labels**: Size 14px, Weight 600, Color #2D3436

### Components
- **Buttons**: Background #eb4a7a, Radius 12px, Elevation 5
- **Input Fields**: Border 2px #D4B3FF, Radius 12px, Background #F8F0FF
- **Cards**: Background #FFFFFF, Radius 16-20px, Elevation 4-6
- **Containers**: Background #F5F0FF

### Spacing
- **Large margins**: 20-30px
- **Medium margins**: 15-20px
- **Small margins**: 8-12px
- **Padding**: 15-20px in cards

## Notes
- All screens use the same purple/pink gradient system
- Maintains consistency with HomeScreen aesthetic
- Soft, welcoming, and professional color scheme perfect for pregnancy care app
- shadows and elevations create depth across all screens

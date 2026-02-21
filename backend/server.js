const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const User = require("./models/User")
const otpService = require("./services/otpService")
const youtubeService = require("./services/youtubeService")
const entertainmentService = require("./services/entertainmentService")

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/wombly")
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Helper function to calculate current pregnancy week
const calculateCurrentWeek = (user) => {
  if (!user.pregnancyWeek || !user.pregnancyWeekEnteredDate) {
    return null
  }

  const enteredDate = new Date(user.pregnancyWeekEnteredDate)
  const currentDate = new Date()

  const diffTime = currentDate - enteredDate
  const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7))
  const currentWeek = user.pregnancyWeek + diffWeeks

  return currentWeek > 38 ? 38 : currentWeek
}

app.post("/api/login", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        success: false,
        message: "Database connection not available",
      })
    }

    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      })
    }

    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      })
    }

    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      })
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Account not verified. Please verify your email first.",
        isVerified: false,
      })
    }

    let currentWeek = calculateCurrentWeek(user)

    if (!currentWeek && user.pregnancyWeek) {
      currentWeek = user.pregnancyWeek
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, "your-secret-key", { expiresIn: "24h" })

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        pregnancyWeek: currentWeek || null,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

app.post("/api/signup", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        success: false,
        message: "Database connection not available",
      })
    }

    const { name, age, height, weight, email, phone, pregnancyWeek, password } = req.body

    if (!name || !age || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, age, email, phone, and password are required",
      })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      })
    }

    const ageNum = Number.parseInt(age)
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 100) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid age",
      })
    }

    let heightNum = undefined
    if (height !== undefined && height !== null && height !== "") {
      heightNum = Number.parseFloat(height)
      if (isNaN(heightNum) || heightNum < 50 || heightNum > 250) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid height (in cm, between 50-250)",
        })
      }
    }

    let weightNum = undefined
    if (weight !== undefined && weight !== null && weight !== "") {
      weightNum = Number.parseFloat(weight)
      if (isNaN(weightNum) || weightNum < 20 || weightNum > 200) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid weight (in kg, between 20-200)",
        })
      }
    }

    if (pregnancyWeek !== undefined && pregnancyWeek !== null && pregnancyWeek !== "") {
      const weekNum = Number.parseInt(pregnancyWeek)
      if (isNaN(weekNum) || weekNum < 1 || weekNum > 38) {
        return res.status(400).json({
          success: false,
          message: "Pregnancy week must be between 1 and 38",
        })
      }
    }

    const emailLower = email.toLowerCase().trim()
    const existingUser = await User.findOne({ email: emailLower })

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      })
    }

    const newUser = new User({
      name: name.trim(),
      age: ageNum,
      height: heightNum,
      weight: weightNum,
      email: emailLower,
      phone: phone.trim(),
      pregnancyWeek: pregnancyWeek ? Number.parseInt(pregnancyWeek) : undefined,
      pregnancyWeekEnteredDate: pregnancyWeek ? new Date() : undefined,
      password: password,
      isVerified: false,
    })

    await newUser.save()

    const otp = otpService.generateOTP()
    otpService.storeOTP(emailLower, otp)
    await otpService.sendOTP(emailLower, otp)

    res.status(201).json({
      success: true,
      message: "Account created successfully. Please verify your email.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
      requiresOTPVerification: true,
    })
  } catch (error) {
    console.error("Signup error:", error)

    if (error.code === 11000 || error.name === "MongoServerError") {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      })
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

app.post("/api/verify-otp", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        success: false,
        message: "Database connection not available",
      })
    }

    const { email, otp } = req.body

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      })
    }

    // Verify OTP
    const verification = otpService.verifyOTP(email.toLowerCase(), otp)

    if (!verification.valid) {
      return res.status(400).json({
        success: false,
        message: verification.message,
      })
    }

    // Update user to verified
    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    user.isVerified = true
    user.otp = null
    user.otpExpiry = null
    user.otpAttempts = 0
    await user.save()

    // Generate login token
    const token = jwt.sign({ userId: user._id, email: user.email }, "your-secret-key", { expiresIn: "24h" })

    res.json({
      success: true,
      message: "Email verified successfully. You can now login.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("OTP verification error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
})

app.post("/api/resend-otp", async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      })
    }

    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      })
    }

    // Generate and send new OTP
    const newOTP = await otpService.resendOTP(email.toLowerCase())

    res.json({
      success: true,
      message: "OTP resent successfully",
    })
  } catch (error) {
    console.error("Resend OTP error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
})

// Update pregnancy week API endpoint
app.post("/api/update-pregnancy-week", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        success: false,
        message: "Database connection not available",
      })
    }

    const { email, pregnancyWeek } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      })
    }

    if (!pregnancyWeek || isNaN(pregnancyWeek)) {
      return res.status(400).json({
        success: false,
        message: "Valid pregnancy week is required",
      })
    }

    const weekNum = Number.parseInt(pregnancyWeek)
    if (weekNum < 1 || weekNum > 38) {
      return res.status(400).json({
        success: false,
        message: "Pregnancy week must be between 1 and 38",
      })
    }

    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    user.pregnancyWeek = weekNum
    user.pregnancyWeekEnteredDate = new Date()
    await user.save()

    res.json({
      success: true,
      message: "Pregnancy week updated successfully",
      user: {
        id: user._id,
        pregnancyWeek: user.pregnancyWeek,
      },
    })
  } catch (error) {
    console.error("Update pregnancy week error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

// Get user info API endpoint
app.get("/api/user", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        success: false,
        message: "Database connection not available",
      })
    }

    const { email } = req.query

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      })
    }

    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        age: user.age,
        height: user.height,
        weight: user.weight,
        email: user.email,
        phone: user.phone,
        pregnancyWeek: user.pregnancyWeek,
      },
    })
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

// Update user info API endpoint
app.post("/api/update-user", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        success: false,
        message: "Database connection not available",
      })
    }

    const { email, name, age, height, weight, phone, pregnancyWeek } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      })
    }

    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    if (name) user.name = name
    if (age !== undefined) user.age = age
    if (height !== undefined) user.height = height
    if (weight !== undefined) user.weight = weight
    if (phone) user.phone = phone
    if (pregnancyWeek !== undefined) {
      user.pregnancyWeek = pregnancyWeek
      user.pregnancyWeekEnteredDate = new Date()
    }

    await user.save()

    res.json({
      success: true,
      message: "User information updated successfully",
      user: {
        id: user._id,
        name: user.name,
        age: user.age,
        height: user.height,
        weight: user.weight,
        email: user.email,
        phone: user.phone,
        pregnancyWeek: user.pregnancyWeek,
      },
    })
  } catch (error) {
    console.error("Update user error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

// ========== YOUTUBE API ENDPOINTS ==========

// Get available video categories
app.get("/api/video-categories", (req, res) => {
  try {
    const categories = youtubeService.getAvailableCategories();
    res.json({
      success: true,
      message: "Available video categories",
      data: categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get video categories",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Search YouTube videos by keyword
app.get("/api/search-videos", async (req, res) => {
  try {
    const { query, maxResults = 10 } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const videos = await youtubeService.searchVideos(query, parseInt(maxResults));

    res.json({
      success: true,
      message: "Videos found successfully",
      data: videos,
      count: videos.length,
    });
  } catch (error) {
    console.error("Search videos error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search videos",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Get videos by category (pregnancy, toddler, hygiene, etc.)
app.get("/api/videos-by-category/:category", async (req, res) => {
  try {
    const { category } = req.params;

    const videos = await youtubeService.getVideosByCategory(category);

    res.json({
      success: true,
      message: `Videos for "${category}" category`,
      category: category,
      data: videos,
      count: videos.length,
    });
  } catch (error) {
    console.error("Get videos by category error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch videos",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Get videos by category and subcategory
app.get("/api/videos/:category/:subcategory", async (req, res) => {
  try {
    const { category, subcategory } = req.params;

    const videos = await youtubeService.getVideosBySubcategory(category, subcategory);

    res.json({
      success: true,
      message: `Videos for "${category}" - "${subcategory}"`,
      category: category,
      subcategory: subcategory,
      data: videos,
      count: videos.length,
    });
  } catch (error) {
    console.error("Get videos by subcategory error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch videos",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Get videos from a specific YouTube channel
app.get("/api/channel-videos/:channelId", async (req, res) => {
  try {
    const { channelId } = req.params;
    const { maxResults = 5 } = req.query;

    if (!channelId) {
      return res.status(400).json({
        success: false,
        message: "Channel ID is required",
      });
    }

    const videos = await youtubeService.getChannelVideos(channelId, parseInt(maxResults));

    res.json({
      success: true,
      message: `Videos from channel ${channelId}`,
      channelId: channelId,
      data: videos,
      count: videos.length,
    });
  } catch (error) {
    console.error("Get channel videos error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch channel videos",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Get videos from a YouTube playlist
app.get("/api/playlist-videos/:playlistId", async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { maxResults = 10 } = req.query;

    if (!playlistId) {
      return res.status(400).json({
        success: false,
        message: "Playlist ID is required",
      });
    }

    const videos = await youtubeService.getPlaylistVideos(playlistId, parseInt(maxResults));

    res.json({
      success: true,
      message: `Videos from playlist ${playlistId}`,
      playlistId: playlistId,
      data: videos,
      count: videos.length,
    });
  } catch (error) {
    console.error("Get playlist videos error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch playlist videos",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// ========== ENTERTAINMENT API ENDPOINTS ==========

// Get lullabies
app.get("/api/entertainment/lullabies", async (req, res) => {
  try {
    const maxResults = parseInt(req.query.maxResults) || 10;
    const lullabies = await entertainmentService.getLullabies(maxResults);

    res.json({
      success: true,
      message: "Lullabies fetched successfully",
      type: "lullabies",
      data: lullabies,
      count: lullabies.length,
    });
  } catch (error) {
    console.error("Get lullabies error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch lullabies",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Get all cartoon channels info
app.get("/api/entertainment/cartoons/channels", async (req, res) => {
  try {
    const cartoons = entertainmentService.getAllCartoons();

    res.json({
      success: true,
      message: "Cartoon channels fetched successfully",
      type: "cartoons",
      data: cartoons,
      count: cartoons.length,
    });
  } catch (error) {
    console.error("Get cartoon channels error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cartoon channels",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Get videos from a specific cartoon channel
app.get("/api/entertainment/cartoons/:cartoonKey", async (req, res) => {
  try {
    const { cartoonKey } = req.params;
    const maxResults = parseInt(req.query.maxResults) || 5;

    // Create a modified version of the function that accepts maxResults
    const cartoonChannels = entertainmentService.getCartoonChannels();
    const cartoon = cartoonChannels[cartoonKey.toLowerCase()];

    if (!cartoon) {
      return res.status(404).json({
        success: false,
        message: `Cartoon "${cartoonKey}" not found`,
        availableCartoons: Object.keys(cartoonChannels),
      });
    }

    const youtubeService = require("./services/youtubeService");
    const videos = await youtubeService.getChannelVideos(cartoon.channelId, maxResults);

    res.json({
      success: true,
      message: `Videos from ${cartoon.name} channel`,
      channel: cartoon,
      data: videos,
      count: videos.length,
    });
  } catch (error) {
    console.error("Get cartoon videos error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cartoon videos",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Dynamic cartoon search endpoint
app.get("/api/entertainment/cartoons/search/:query", async (req, res) => {
  try {
    const { query } = req.params;
    const maxResults = parseInt(req.query.maxResults) || 10;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const cartoonVideos = await entertainmentService.searchCartoons(query, maxResults);

    res.json({
      success: true,
      message: `Cartoon videos for "${query}"`,
      searchQuery: query,
      data: cartoonVideos,
      count: cartoonVideos.length,
    });
  } catch (error) {
    console.error("Search cartoons error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search for cartoon videos",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Get popular cartoons with dynamic YouTube video fetching
app.get("/api/entertainment/cartoons/popular/all", async (req, res) => {
  try {
    const maxResults = parseInt(req.query.maxResults) || 8;

    const popularCartoons = await entertainmentService.getPopularCartoons(maxResults);

    res.json({
      success: true,
      message: "Popular cartoons fetched successfully",
      data: popularCartoons,
      cartoonCount: Object.keys(popularCartoons).length,
    });
  } catch (error) {
    console.error("Get popular cartoons error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch popular cartoons",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Nutrition Do's and Don'ts data
const nutritionData = [
  {
    id: 1,
    type: "Do",
    title: "Eat Leafy Greens",
    category: "Veggies",
    benefits: "Rich in folic acid and iron, essential for fetal development and preventing anemia",
    risks: "None if properly washed"
  },
  {
    id: 2,
    type: "Do",
    title: "Include Protein Sources",
    category: "Meat",
    benefits: "Supports fetal growth and development. Include lean meats, fish, eggs, and legumes",
    risks: "None with proper cooking"
  },
  {
    id: 3,
    type: "Don't",
    title: "Raw or Undercooked Meat",
    category: "Meat",
    benefits: "Avoiding this prevents listeria and toxoplasmosis infections",
    risks: "Risk of bacterial infections causing miscarriage or birth defects"
  },
  {
    id: 4,
    type: "Do",
    title: "Consume Dairy Products",
    category: "Dairy",
    benefits: "Calcium for fetal bone development and maternal bone health",
    risks: "None if pasteurized"
  },
  {
    id: 5,
    type: "Don't",
    title: "Unpasteurized Dairy",
    category: "Dairy",
    benefits: "Avoiding prevents listeria infection",
    risks: "Can cause serious infections in pregnancy"
  },
  {
    id: 6,
    type: "Do",
    title: "Eat Fresh Fruits",
    category: "Fruit",
    benefits: "Vitamins, minerals, and fiber. Wash well before consumption",
    risks: "None if properly washed"
  },
  {
    id: 7,
    type: "Don't",
    title: "High Mercury Fish",
    category: "Meat",
    benefits: "Avoiding prevents neurological damage to the fetus",
    risks: "Mercury accumulates in the developing brain"
  },
  {
    id: 8,
    type: "Do",
    title: "Whole Grains",
    category: "Grains",
    benefits: "Fiber and B vitamins for energy and digestion",
    risks: "None"
  },
  {
    id: 9,
    type: "Don't",
    title: "Excess Caffeine",
    category: "Drinks",
    benefits: "Limiting caffeine reduces miscarriage risk",
    risks: "High caffeine increases miscarriage risk (limit to 200mg/day)"
  },
  {
    id: 10,
    type: "Don't",
    title: "Alcohol",
    category: "Drinks",
    benefits: "Complete avoidance prevents fetal alcohol syndrome",
    risks: "Causes birth defects and developmental issues"
  },
  {
    id: 11,
    type: "Do",
    title: "Prenatal Vitamins",
    category: "Grains",
    benefits: "Ensures adequate folic acid, iron, and calcium intake",
    risks: "None when taken as prescribed"
  },
  {
    id: 12,
    type: "Don't",
    title: "Raw Eggs",
    category: "Dairy",
    benefits: "Avoids salmonella infection risk",
    risks: "Risk of salmonella causing severe food poisoning"
  },
  {
    id: 13,
    type: "Do",
    title: "Stay Hydrated",
    category: "Drinks",
    benefits: "Prevents complications like gestational diabetes and preterm labor",
    risks: "None"
  },
  {
    id: 14,
    type: "Don't",
    title: "Processed Foods with High Sodium",
    category: "Meals",
    benefits: "Reduces high blood pressure risk in pregnancy",
    risks: "Can lead to gestational hypertension"
  },
  {
    id: 15,
    type: "Do",
    title: "Omega-3 Rich Foods",
    category: "Meat",
    benefits: "Supports fetal brain and eye development",
    risks: "None (use low-mercury fish like salmon)"
  },
  {
    id: 16,
    type: "Don't",
    title: "Unwashed Vegetables",
    category: "Veggies",
    benefits: "Prevents toxoplasmosis and E. coli infection",
    risks: "Parasitic and bacterial infections"
  },
  {
    id: 17,
    type: "Do",
    title: "Iron-Rich Foods",
    category: "Meat",
    benefits: "Prevents anemia which is common in pregnancy",
    risks: "None with balanced diet"
  },
  {
    id: 18,
    type: "Don't",
    title: "Soft Cheeses",
    category: "Dairy",
    benefits: "Avoids listeria infection",
    risks: "Soft cheeses can harbor listeria bacteria"
  },
  {
    id: 19,
    type: "Do",
    title: "Balanced Meals",
    category: "Meals",
    benefits: "Ensures all nutrients are covered for mother and baby",
    risks: "None"
  },
  {
    id: 20,
    type: "Don't",
    title: "Street Food",
    category: "Meals",
    benefits: "Avoids foodborne illnesses",
    risks: "Unknown hygiene standards increase infection risk"
  }
];

// Nutrition Do's and Don'ts endpoint
app.get("/api/nutrition/dos-donts", (req, res) => {
  try {
    const { category, search } = req.query;
    
    let filteredData = [...nutritionData];
    
    // Filter by category
    if (category && category !== "All") {
      filteredData = filteredData.filter(
        item => item.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Filter by search query
    if (search && search.trim()) {
      const searchLower = search.toLowerCase().trim();
      filteredData = filteredData.filter(item =>
        item.title.toLowerCase().includes(searchLower) ||
        item.benefits.toLowerCase().includes(searchLower) ||
        item.risks.toLowerCase().includes(searchLower)
      );
    }
    
    res.json({
      success: true,
      message: "Nutrition data fetched successfully",
      data: filteredData,
      count: filteredData.length
    });
  } catch (error) {
    console.error("Nutrition data error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch nutrition data",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Wombly Backend Server is running" })
})

// Test signup endpoint exists
app.get("/api/test-signup", (req, res) => {
  res.json({ message: "Signup endpoint is available at POST /api/signup" })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

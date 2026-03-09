const nodemailer = require("nodemailer")
const otpStore = new Map() // In-memory store for OTPs (use Redis in production)

const OTP_EXPIRY_TIME = 5 * 60 * 1000 // 5 minutes
const MAX_ATTEMPTS = 3

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Send OTP via email
const sendOTP = async (email, otp) => {
  try {
    // Also log it for development reference
    console.log(`\n${"=".repeat(50)}`)
    console.log(`OTP for ${email}: ${otp}`)
    console.log(`Valid for 5 minutes`)
    console.log(`${"=".repeat(50)}\n`)

    // Send email via Nodemailer
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Wombly - Email Verification OTP",
      html: `
        <h2>Welcome to Wombly!</h2>
        <p>Your One-Time Password (OTP) for email verification is:</p>
        <h1 style="color: #FF69B4; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
        <p>This OTP will expire in 5 minutes.</p>
        <p>If you did not request this verification, please ignore this email.</p>
        <hr>
        <p style="color: #666; font-size: 12px;">Wombly - Your Pregnancy Care Companion</p>
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log(`Email sent successfully to ${email}`)
    return true
  } catch (error) {
    console.error("Error sending OTP:", error)
    return false
  }
}

// Store OTP with expiry
const storeOTP = (email, otp) => {
  otpStore.set(email, {
    otp,
    expiry: Date.now() + OTP_EXPIRY_TIME,
    attempts: 0,
  })
}

// Verify OTP
const verifyOTP = (email, providedOTP) => {
  const otpData = otpStore.get(email)

  if (!otpData) {
    return { valid: false, message: "OTP not found. Please request a new one." }
  }

  // Check if OTP expired
  if (Date.now() > otpData.expiry) {
    otpStore.delete(email)
    return { valid: false, message: "OTP expired. Please request a new one." }
  }

  // Check attempts
  if (otpData.attempts >= MAX_ATTEMPTS) {
    otpStore.delete(email)
    return { valid: false, message: "Maximum attempts exceeded. Please request a new OTP." }
  }

  // Check if OTP matches
  if (otpData.otp !== providedOTP) {
    otpData.attempts += 1
    return { valid: false, message: `Incorrect OTP. ${MAX_ATTEMPTS - otpData.attempts} attempts remaining.` }
  }

  // OTP is valid, delete it
  otpStore.delete(email)
  return { valid: true, message: "OTP verified successfully" }
}

// Resend OTP
const resendOTP = async (email) => {
  const newOTP = generateOTP()
  await sendOTP(email, newOTP)
  storeOTP(email, newOTP)
  return newOTP
}

module.exports = {
  generateOTP,
  sendOTP,
  storeOTP,
  verifyOTP,
  resendOTP,
}

# Change Password Endpoint Implementation

Add this endpoint to your `server.js` backend file:

```javascript
// Change Password Endpoint
app.post("/api/change-password", async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    // Validate input
    if (!email || !currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, current password, and new password are required",
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Validate new password requirements
    const hasLetter = /[a-zA-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword);

    if (newPassword.length < 6 || !hasLetter || !hasNumber || !hasSpecialChar) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters with letters, numbers, and special characters",
      });
    }

    // Ensure new password is different from current
    const isSameAsOld = await bcrypt.compare(newPassword, user.password);
    if (isSameAsOld) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    user.password = hashedPassword;
    await user.save();

    return res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
});
```

## Requirements:

Make sure your `server.js` has:
- `bcrypt` imported for password hashing: `const bcrypt = require("bcrypt");`
- `User` model imported: `const User = require("./models/User");`
- `express` set up properly with JSON middleware

## Testing:

Use this cURL command to test:

```bash
curl -X POST http://localhost:5000/api/change-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "currentPassword": "Test@123",
    "newPassword": "NewPass@456"
  }'
```

## Expected Responses:

**Success (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Wrong Current Password (401):**
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

**Invalid New Password (400):**
```json
{
  "success": false,
  "message": "Password must be at least 6 characters with letters, numbers, and special characters"
}
```

**User Not Found (404):**
```json
{
  "success": false,
  "message": "User not found"
}
```

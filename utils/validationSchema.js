// Validation schema for form fields across the application

/**
 * Validates a single form field
 * @param {string} fieldName - The name of the field to validate
 * @param {any} value - The value to validate
 * @returns {string} - Error message if invalid, empty string if valid
 */
export const validateField = (fieldName, value) => {
  // Ensure value is a string for string operations
  const strValue = String(value || "").trim();

  switch (fieldName) {
    case "name":
      if (!strValue) return "Name is required";
      if (strValue.length < 2) return "Name must be at least 2 characters";
      if (!/^[a-zA-Z\s]+$/.test(strValue)) return "Name can only contain letters and spaces";
      return "";

    case "email":
      if (!strValue) return "Email is required";
      // RFC compliant email regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(strValue)) return "Please enter a valid email address";
      return "";

    case "phone":
      if (!strValue) return "Phone number is required";
      // Pakistani phone numbers: 10-11 digits
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!phoneRegex.test(strValue.replace(/\D/g, ""))) {
        return "Phone number must be 10-11 digits";
      }
      return "";

    case "password":
      if (!strValue) return "Password is required";
      if (strValue.length < 6) return "Password must be at least 6 characters";
      // Must contain at least one letter, one number, and one special character
      const hasLetter = /[a-zA-Z]/.test(strValue);
      const hasNumber = /[0-9]/.test(strValue);
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(strValue);

      if (!hasLetter) return "Password must include at least one letter";
      if (!hasNumber) return "Password must include at least one number";
      if (!hasSpecialChar) return "Password must include at least one special character";
      return "";

    case "age":
      if (!strValue) return "Age is required";
      const age = parseInt(strValue, 10);
      if (isNaN(age)) return "Age must be a number";
      if (age < 1 || age > 100) return "Age must be between 1 and 100";
      return "";

    case "height":
      if (!strValue) return "";  // Height is optional
      const height = parseFloat(strValue);
      if (isNaN(height)) return "Height must be a number";
      if (height < 50 || height > 250) return "Height must be between 50 and 250 cm";
      return "";

    case "weight":
      if (!strValue) return "";  // Weight is optional
      const weight = parseFloat(strValue);
      if (isNaN(weight)) return "Weight must be a number";
      if (weight < 20 || weight > 200) return "Weight must be between 20 and 200 kg";
      return "";

    case "pregnancyWeek":
      if (!strValue) return "";  // Pregnancy week is optional
      const week = parseInt(strValue, 10);
      if (isNaN(week)) return "Pregnancy week must be a number";
      if (week < 1 || week > 38) return "Pregnancy week must be between 1 and 38";
      return "";

    case "otp":
      if (!strValue) return "OTP is required";
      if (!/^[0-9]{6}$/.test(strValue)) return "OTP must be exactly 6 digits";
      return "";

    case "confirmPassword":
      // This should be validated using validatePasswordMatch function
      if (!strValue) return "Please confirm your password";
      return "";

    default:
      return "";
  }
};

/**
 * Validates that two passwords match
 * @param {string} password - The password
 * @param {string} confirmPassword - The confirmation password
 * @returns {string} - Error message if they don't match, empty string if they do
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return "Passwords do not match";
  }
  return "";
};

/**
 * Validates all fields in a form object
 * @param {Object} formData - The form data object
 * @param {Array<string>} requiredFields - Array of field names to validate
 * @returns {Object} - Object with field names as keys and error messages as values
 */
export const validateForm = (formData, requiredFields = []) => {
  const errors = {};

  requiredFields.forEach((field) => {
    const error = validateField(field, formData[field]);
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
};

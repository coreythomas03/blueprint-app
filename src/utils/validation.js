/**
 * Input Validation Utilities
 * 
 * This module provides comprehensive input validation and sanitization functions
 * to protect against injection attacks, XSS, and other security vulnerabilities.
 * 
 * Security Implementation:
 * - Schema-based validation ensures data conforms to expected types and formats
 * - Length limits prevent buffer overflow and DoS attacks
 * - Character restrictions prevent injection attacks
 * - Type checking ensures data integrity
 * - All user inputs are validated before processing or storage
 * 
 * OWASP Best Practices Applied:
 * - Input validation on client side (complemented by server-side validation)
 * - Whitelist approach for allowed characters
 * - Strict length enforcement
 * - Email format validation using standard RFC 5322 pattern
 */

/**
 * Validates username according to Blueprint app requirements
 * @param {string} username - Username to validate
 * @returns {Object} - {isValid: boolean, error: string|null}
 * 
 * Requirements:
 * - Only letters (a-z, A-Z) and underscores allowed
 * - Maximum length of 20 characters
 * - Minimum length of 3 characters
 */
export const validateUsername = (username) => {
  // Type check
  if (typeof username !== 'string') {
    return { isValid: false, error: 'Username must be a string' };
  }

  // Length validation
  if (username.length < 3) {
    return { isValid: false, error: 'Username must be at least 3 characters' };
  }

  if (username.length > 20) {
    return { isValid: false, error: 'Username must not exceed 20 characters' };
  }

  // Character restriction - only letters and underscores
  const usernameRegex = /^[a-zA-Z_]+$/;
  if (!usernameRegex.test(username)) {
    return { isValid: false, error: 'Username can only contain letters and underscores' };
  }

  return { isValid: true, error: null };
};

/**
 * Validates password according to Blueprint app requirements
 * @param {string} password - Password to validate
 * @returns {Object} - {isValid: boolean, error: string|null}
 * 
 * Requirements:
 * - Between 8 and 20 characters
 * - Must contain letters, numbers, or special characters
 */
export const validatePassword = (password) => {
  // Type check
  if (typeof password !== 'string') {
    return { isValid: false, error: 'Password must be a string' };
  }

  // Length validation
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters' };
  }

  if (password.length > 20) {
    return { isValid: false, error: 'Password must not exceed 20 characters' };
  }

  // Character validation - letters, numbers, and special characters allowed
  const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/;
  if (!passwordRegex.test(password)) {
    return { isValid: false, error: 'Password contains invalid characters' };
  }

  return { isValid: true, error: null };
};

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {Object} - {isValid: boolean, error: string|null}
 * 
 * Uses standard email validation pattern based on RFC 5322
 */
export const validateEmail = (email) => {
  // Type check
  if (typeof email !== 'string') {
    return { isValid: false, error: 'Email must be a string' };
  }

  // Email format validation using RFC 5322 standard pattern
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  // Length validation for safety
  if (email.length > 254) {
    return { isValid: false, error: 'Email address is too long' };
  }

  return { isValid: true, error: null };
};

/**
 * Validates name fields (first name, last name)
 * @param {string} name - Name to validate
 * @param {string} fieldName - Field name for error messages (e.g., "First name")
 * @returns {Object} - {isValid: boolean, error: string|null}
 * 
 * Requirements:
 * - Only letters allowed
 * - Maximum length of 20 characters
 * - Minimum length of 2 characters
 */
export const validateName = (name, fieldName = 'Name') => {
  // Type check
  if (typeof name !== 'string') {
    return { isValid: false, error: `${fieldName} must be a string` };
  }

  // Trim whitespace
  const trimmedName = name.trim();

  // Length validation
  if (trimmedName.length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters` };
  }

  if (trimmedName.length > 20) {
    return { isValid: false, error: `${fieldName} must not exceed 20 characters` };
  }

  // Character restriction - only letters (including accented characters)
  const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
  if (!nameRegex.test(trimmedName)) {
    return { isValid: false, error: `${fieldName} can only contain letters` };
  }

  return { isValid: true, error: null };
};

/**
 * Sanitizes string input by removing potentially dangerous characters
 * @param {string} input - String to sanitize
 * @returns {string} - Sanitized string
 * 
 * This function helps prevent XSS attacks by removing HTML/script tags
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') {
    return '';
  }

  // Remove HTML tags and script content
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
};

/**
 * Validates all registration form fields at once
 * @param {Object} formData - Object containing all form fields
 * @returns {Object} - {isValid: boolean, errors: Object}
 */
export const validateRegistrationForm = (formData) => {
  const errors = {};

  // Validate first name
  const firstNameValidation = validateName(formData.firstName, 'First name');
  if (!firstNameValidation.isValid) {
    errors.firstName = firstNameValidation.error;
  }

  // Validate last name
  const lastNameValidation = validateName(formData.lastName, 'Last name');
  if (!lastNameValidation.isValid) {
    errors.lastName = lastNameValidation.error;
  }

  // Validate username
  const usernameValidation = validateUsername(formData.username);
  if (!usernameValidation.isValid) {
    errors.username = usernameValidation.error;
  }

  // Validate email
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  }

  // Validate password
  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error;
  }

  // Validate password confirmation
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

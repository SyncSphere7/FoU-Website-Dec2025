const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { validateRegistration, checkValidation } = require('../utils/validators');
const { encrypt } = require('../utils/encryption');
const { verifyRecaptcha } = require('../utils/recaptcha');

// Registration page
router.get('/', (req, res) => {
  res.render('registration', {
    title: 'Register - Friends of Uganda',
    page: 'registration',
    recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY || ''
  });
});

// Handle registration form submission
router.post('/', validateRegistration, checkValidation, async (req, res) => {
  try {
    const { full_name, email, phone, country, city, gender, age_group, interest, message } = req.body;

    // Verify reCAPTCHA (if configured)
    if (process.env.RECAPTCHA_SECRET_KEY) {
      const recaptchaResponse = req.body['g-recaptcha-response'];
      if (!recaptchaResponse) {
        return res.status(400).json({
          success: false,
          message: 'Please complete the CAPTCHA verification'
        });
      }

      try {
        // Verify with Google reCAPTCHA API
        const remoteip = req.ip || req.connection.remoteAddress;
        const data = await verifyRecaptcha(process.env.RECAPTCHA_SECRET_KEY, recaptchaResponse, remoteip);

        if (!data.success) {
          return res.status(400).json({
            success: false,
            message: 'CAPTCHA verification failed. Please try again.'
          });
        }
      } catch (error) {
        console.error('reCAPTCHA verification error:', error);
        return res.status(500).json({
          success: false,
          message: 'CAPTCHA verification error. Please try again.'
        });
      }
    }

    // Check if email already exists
    const [existingUsers] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'This email is already registered'
      });
    }

    // Encrypt sensitive data
    const encryptedPhone = phone ? encrypt(phone) : null;

    // Insert user into database
    const [result] = await db.query(`
      INSERT INTO users (full_name, email, phone, country, city, gender, age_group, interest, message)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [full_name, email, encryptedPhone, country, city, gender, age_group, interest, message]);

    res.json({
      success: true,
      message: 'Thank you for registering! We will contact you soon.',
      userId: result.insertId
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during registration. Please try again later.'
    });
  }
});

module.exports = router;


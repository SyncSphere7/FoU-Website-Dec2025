const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { validateContact, checkValidation } = require('../utils/validators');
const { verifyRecaptcha } = require('../utils/recaptcha');

// Contact page
router.get('/', (req, res) => {
  res.render('contact', {
    title: 'Contact Us - Friends of Uganda',
    page: 'contact',
    recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY || ''
  });
});

// Handle contact form submission
router.post('/', validateContact, checkValidation, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

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

    // Send email if email configuration is available
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: `Contact Form: ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `
      };

      await transporter.sendMail(mailOptions);
    }

    res.json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you soon.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while sending your message. Please try again later.'
    });
  }
});

module.exports = router;


const https = require('https');
const querystring = require('querystring');

/**
 * Verify reCAPTCHA response
 * @param {string} secretKey - reCAPTCHA secret key
 * @param {string} response - reCAPTCHA response token from client
 * @param {string} remoteip - Optional user's IP address
 * @returns {Promise<Object>} Verification result
 */
function verifyRecaptcha(secretKey, response, remoteip = null) {
  return new Promise((resolve, reject) => {
    const postData = querystring.stringify({
      secret: secretKey,
      response: response,
      remoteip: remoteip
    });

    const options = {
      hostname: 'www.google.com',
      port: 443,
      path: '/recaptcha/api/siteverify',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (error) {
          reject(new Error('Failed to parse reCAPTCHA response'));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

module.exports = {
  verifyRecaptcha
};


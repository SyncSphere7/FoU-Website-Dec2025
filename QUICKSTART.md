# Quick Start Guide - Friends of Uganda Website

## 5-Minute Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Create .env File
Create a `.env` file in the root directory with the following content:

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=friends_of_uganda_db
DB_PORT=3306

# Server
PORT=3000
NODE_ENV=development

# Security (generate random strings)
SESSION_SECRET=your_random_session_secret_here
ENCRYPTION_KEY=your_32_character_encryption_key

# Optional: reCAPTCHA (get from https://www.google.com/recaptcha/admin)
RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=

# Optional: Email (for contact form)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@friendsofuganda.org
```

**Quick way to generate secrets:**
```bash
# Session Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Encryption Key (32 characters)
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

### Step 3: Initialize Database
```bash
npm run init-db
```

This will:
- Create the database
- Create all tables
- Create default admin user (username: `admin`, password: `admin123`)
- Insert sample data

### Step 4: Start Server
```bash
npm run dev
```

### Step 5: Access the Website
- **Website:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin/login
  - Username: `admin`
  - Password: `admin123`

## Next Steps

1. **Change Admin Password** - Login and change the default password immediately
2. **Configure reCAPTCHA** - Get keys from Google reCAPTCHA and add to `.env`
3. **Customize Content** - Update page content in `views/` directory
4. **Add Your Information** - Update contact info, team members, etc.
5. **Configure Email** - Set up email for contact form notifications

## Troubleshooting

### Database Connection Error
- Make sure MySQL is running
- Check database credentials in `.env`
- Ensure the database user has proper permissions

### Port Already in Use
- Change `PORT` in `.env` file
- Or stop the process using port 3000

### reCAPTCHA Not Working
- Leave `RECAPTCHA_SITE_KEY` and `RECAPTCHA_SECRET_KEY` empty in `.env` to disable
- Or get keys from https://www.google.com/recaptcha/admin

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name friends-of-uganda
   ```
3. Configure SSL/HTTPS
4. Set up regular database backups

For more details, see `SETUP.md`.


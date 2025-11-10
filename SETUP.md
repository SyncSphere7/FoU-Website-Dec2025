# Friends of Uganda - Setup Guide

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher) or MariaDB
- npm or yarn

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

1. Make sure MySQL is installed and running
2. Create a MySQL database (or use an existing one)
3. Update the `.env` file with your database credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=friends_of_uganda_db
DB_PORT=3306
```

4. Initialize the database:

```bash
npm run init-db
```

This will:
- Create the database if it doesn't exist
- Create all required tables (users, admin_users, impact_projects)
- Create a default admin user (username: `admin`, password: `admin123`)
- Insert sample data

**IMPORTANT: Change the default admin password immediately after first login!**

### 3. Environment Configuration

Copy `.env.example` to `.env` and update with your configuration:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

- **Database**: Update DB_* variables with your MySQL credentials
- **Session Secret**: Generate a random string for SESSION_SECRET
- **Encryption Key**: Generate a 32-character string for ENCRYPTION_KEY
- **reCAPTCHA** (optional): Get keys from [Google reCAPTCHA](https://www.google.com/recaptcha/admin)
- **Email** (optional): Configure for contact form email notifications

### 4. Generate Secrets

Generate secure secrets for your `.env` file:

**Session Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Encryption Key (32 characters):**
```bash
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

### 5. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in `.env`).

## Default Admin Account

After running `npm run init-db`, you can login with:

- **Username:** `admin`
- **Password:** `admin123`

**IMPORTANT: CHANGE THIS PASSWORD IMMEDIATELY IN PRODUCTION!**

## Configuration Options

### reCAPTCHA Setup (Optional but Recommended)

1. Go to [Google reCAPTCHA](https://www.google.com/recaptcha/admin)
2. Register a new site (reCAPTCHA v2)
3. Add your domain
4. Copy the Site Key and Secret Key to your `.env` file:
   - `RECAPTCHA_SITE_KEY=your_site_key`
   - `RECAPTCHA_SECRET_KEY=your_secret_key`

### Email Configuration (Optional)

For contact form email notifications:

1. Use Gmail: Enable "App Passwords" in your Google Account settings
2. Update `.env`:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   EMAIL_FROM=noreply@friendsofuganda.org
   ```

### SSL/HTTPS Setup (Production)

For production, configure SSL:

1. Obtain SSL certificates (Let's Encrypt recommended)
2. Update `.env`:
   ```env
   SSL_KEY_PATH=/path/to/private.key
   SSL_CERT_PATH=/path/to/certificate.crt
   ```
3. Update `server.js` to use HTTPS (see Node.js HTTPS documentation)

## Security Checklist

- [ ] Change default admin password
- [ ] Set strong SESSION_SECRET
- [ ] Set strong ENCRYPTION_KEY
- [ ] Configure reCAPTCHA
- [ ] Set up SSL/HTTPS in production
- [ ] Configure proper database user permissions
- [ ] Set NODE_ENV=production in production
- [ ] Review and update privacy policy content
- [ ] Configure firewall rules
- [ ] Set up regular database backups

## Troubleshooting

### Database Connection Error

- Verify MySQL is running
- Check database credentials in `.env`
- Ensure database exists
- Check MySQL user permissions

### Port Already in Use

- Change PORT in `.env`
- Or stop the process using the port:
  ```bash
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  
  # Linux/Mac
  lsof -ti:3000 | xargs kill
  ```

### reCAPTCHA Not Working

- Verify Site Key and Secret Key are correct
- Check domain is registered in reCAPTCHA console
- Ensure reCAPTCHA script is loaded in browser

### Email Not Sending

- Verify email credentials
- Check SMTP server settings
- For Gmail, ensure "Less secure app access" or "App Passwords" is enabled
- Check firewall/network restrictions

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name friends-of-uganda
   ```
3. Set up reverse proxy (Nginx recommended)
4. Configure SSL/HTTPS
5. Set up regular backups
6. Monitor logs and errors
7. Update dependencies regularly

## Support

For issues or questions, please contact: info@friendsofuganda.org


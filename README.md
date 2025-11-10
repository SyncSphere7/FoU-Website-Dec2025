# Friends of Uganda - Nonprofit Website

A comprehensive web-based platform for Friends of Uganda NGO to showcase their mission, impact, and engage the community.

## Features

- **Landing Page** - Hero banner, mission statement, impact stats, testimonials
- **Mission & Vision Page** - Core beliefs, values, SDG alignment
- **About Page** - Founding story, objectives, legal information
- **Our Team Page** - Leadership, advisory board, volunteers
- **Community Page** - Events, news, blog, photo gallery
- **Our Impact Page** - Statistics, project locations, case studies
- **Registration Page** - User registration with CAPTCHA
- **Contact Page** - Contact form, office address, social media
- **Admin Dashboard** - User management, project management, statistics

## Technology Stack

- **Backend**: Node.js + Express
- **Database**: MySQL
- **Template Engine**: EJS
- **Styling**: Custom CSS + Bootstrap 5
- **Security**: bcrypt, helmet, rate limiting, AES encryption
- **Authentication**: Session-based with role-based access control (RBAC)

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   # Create .env file (see .env.example for template)
   # Update with your database credentials and other settings
   ```

3. **Initialize the database:**
   ```bash
   npm run init-db
   ```
   This creates the database, tables, and a default admin user (username: `admin`, password: `admin123`)

4. **Start the server:**
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Visit the website:**
   - Frontend: `http://localhost:3000`
   - Admin Login: `http://localhost:3000/admin/login`

## Project Structure

```
friends-of-uganda/
├── config/           # Configuration files
│   └── database.js   # Database connection
├── middleware/       # Express middleware
│   ├── auth.js       # Authentication middleware
│   └── rateLimiter.js # Rate limiting
├── routes/          # Route handlers
│   ├── index.js     # Main pages (home, mission, about, etc.)
│   ├── registration.js # Registration form
│   ├── contact.js   # Contact form
│   └── admin.js     # Admin routes
├── scripts/         # Utility scripts
│   └── init-database.js # Database initialization
├── utils/           # Utility functions
│   ├── encryption.js # Data encryption
│   ├── recaptcha.js  # reCAPTCHA verification
│   └── validators.js # Form validation
├── views/           # EJS templates
│   ├── partials/    # Reusable partials
│   └── admin/       # Admin templates
├── public/          # Static files
│   ├── css/         # Stylesheets
│   └── js/          # JavaScript files
├── server.js        # Main server file
└── package.json     # Dependencies
```

## Database Schema

### Tables

1. **users** - Registered users/volunteers
2. **admin_users** - Admin users with role-based access
3. **impact_projects** - Project information and statistics

See `scripts/init-database.js` for complete schema.

## Security Features

- Password hashing with bcrypt
- AES-256 encryption for sensitive data
- Session-based authentication
- Role-based access control (RBAC)
- reCAPTCHA protection for forms
- Rate limiting (API, forms, login)
- Helmet.js for security headers
- Input validation and sanitization
- SQL injection prevention (parameterized queries)
- XSS protection
- HTTPS/SSL support (configure in production)

## Environment Variables

Required environment variables (see `.env.example`):

- `DB_HOST` - Database host
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `SESSION_SECRET` - Session secret key
- `ENCRYPTION_KEY` - Encryption key (32 characters)
- `RECAPTCHA_SITE_KEY` - reCAPTCHA site key (optional)
- `RECAPTCHA_SECRET_KEY` - reCAPTCHA secret key (optional)
- `EMAIL_USER` - Email for contact form (optional)
- `EMAIL_PASSWORD` - Email password (optional)

## Default Admin Account

After running `npm run init-db`:

- **Username:** `admin`
- **Password:** `admin123`

**IMPORTANT: Change this password immediately in production!**

## Documentation

- **Quick Start Guide**: See `QUICKSTART.md` for 5-minute setup
- **Setup Guide**: See `SETUP.md` for detailed installation and configuration instructions
- **API Documentation**: See route files in `routes/` directory

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT

## Support

For issues or questions, please contact: info@friendsofuganda.org

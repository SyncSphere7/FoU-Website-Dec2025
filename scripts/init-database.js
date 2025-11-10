const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function initDatabase() {
  let connection;
  
  try {
    // Connect to MySQL server (without specifying database)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306,
    });

    console.log('Connected to MySQL server');

    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'friends_of_uganda_db';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`Database '${dbName}' created or already exists`);

    // Use the database
    await connection.query(`USE \`${dbName}\``);

    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        phone VARCHAR(20),
        country VARCHAR(50),
        city VARCHAR(50),
        gender VARCHAR(20),
        age_group VARCHAR(20),
        interest VARCHAR(50) NOT NULL,
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_interest (interest)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('Users table created');

    // Create admin_users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'Editor',
        email VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL,
        INDEX idx_username (username),
        INDEX idx_role (role)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('Admin users table created');

    // Create impact_projects table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS impact_projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        location VARCHAR(100) NOT NULL,
        beneficiaries INT DEFAULT 0,
        start_date DATE,
        end_date DATE,
        status ENUM('Active', 'Completed') DEFAULT 'Active',
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_location (location)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('Impact projects table created');

    // Create default admin user (password: admin123 - CHANGE THIS IN PRODUCTION!)
    const defaultPassword = await bcrypt.hash('admin123', 10);
    const [existingAdmin] = await connection.query(
      'SELECT id FROM admin_users WHERE username = ?',
      ['admin']
    );

    if (existingAdmin.length === 0) {
      await connection.query(`
        INSERT INTO admin_users (username, password_hash, role, email)
        VALUES (?, ?, ?, ?)
      `, ['admin', defaultPassword, 'Admin', 'admin@friendsofuganda.org']);
      console.log('Default admin user created (username: admin, password: admin123)');
      console.log('WARNING: Change the default admin password in production!');
    } else {
      console.log('Default admin user already exists');
    }

    // Insert sample impact projects
    const [existingProjects] = await connection.query('SELECT id FROM impact_projects LIMIT 1');
    if (existingProjects.length === 0) {
      await connection.query(`
        INSERT INTO impact_projects (title, description, location, beneficiaries, start_date, end_date, status)
        VALUES
        ('Education Support Program', 'Providing educational materials and support to rural schools in Uganda', 'Kampala', 500, '2023-01-15', NULL, 'Active'),
        ('Clean Water Initiative', 'Installing clean water wells in remote villages', 'Gulu', 1000, '2022-06-01', '2023-12-31', 'Completed'),
        ('Women Empowerment Project', 'Skills training and microfinance support for women', 'Jinja', 300, '2023-03-01', NULL, 'Active')
      `);
      console.log('Sample impact projects inserted');
    }

    console.log('\nDatabase initialization completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Update .env file with your configuration');
    console.log('2. Change the default admin password');
    console.log('3. Run: npm start');

  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initDatabase();


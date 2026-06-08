const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tuition_erp',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Create database and tables automatically
async function initializeDatabase() {
  // First connect without database to create it
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  });

  const dbName = process.env.DB_NAME || 'tuition_erp';

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
  await connection.query(`USE \`${dbName}\``);

  // Create admins table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create students table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      roll_number VARCHAR(20) UNIQUE NOT NULL,
      name VARCHAR(100) NOT NULL,
      gender ENUM('Boy', 'Girl') NOT NULL,
      class_batch VARCHAR(50) NOT NULL,
      parent_name VARCHAR(100) NOT NULL,
      parent_mobile VARCHAR(15) NOT NULL,
      address TEXT,
      admission_date DATE NOT NULL,
      status ENUM('Active', 'Inactive') DEFAULT 'Active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // Create attendance table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS attendance (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT NOT NULL,
      date DATE NOT NULL,
      status ENUM('Present', 'Absent', 'Late') NOT NULL,
      marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
      UNIQUE KEY unique_attendance (student_id, date)
    )
  `);

  // Create subjects table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS subjects (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      class_batch VARCHAR(50),
      exam_date DATE,
      max_marks INT DEFAULT 100,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Migrate existing subjects table if needed
  try { await connection.query('ALTER TABLE subjects ADD COLUMN exam_date DATE'); } catch (e) {}
  try { await connection.query('ALTER TABLE subjects ADD COLUMN max_marks INT DEFAULT 100'); } catch (e) {}
  try { await connection.query('ALTER TABLE subjects ADD COLUMN description TEXT'); } catch (e) {}

  // Create fees table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS fees (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT NOT NULL,
      month VARCHAR(20) NOT NULL,
      year INT NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      paid_amount DECIMAL(10,2) DEFAULT 0,
      due_date DATE NOT NULL,
      paid_date DATE,
      status ENUM('Paid', 'Pending', 'Overdue') DEFAULT 'Pending',
      payment_mode VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    )
  `);

  // Drop obsolete tables
  try {
    await connection.query('DROP TABLE IF EXISTS test_marks');
    await connection.query('DROP TABLE IF EXISTS tests');
  } catch (e) {}

  // Create subject_marks table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS subject_marks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      subject_id INT NOT NULL,
      student_id INT NOT NULL,
      marks_obtained DECIMAL(5,2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
      UNIQUE KEY unique_subject_student (subject_id, student_id)
    )
  `);

  // Create notifications table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT,
      type ENUM('SMS', 'WhatsApp') NOT NULL,
      category ENUM('Absent', 'Fee Reminder', 'Marks', 'General') NOT NULL,
      message TEXT NOT NULL,
      recipient_number VARCHAR(15) NOT NULL,
      status ENUM('Sent', 'Failed', 'Pending') DEFAULT 'Pending',
      sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL
    )
  `);

  // Create default admin if not exists
  const bcrypt = require('bcryptjs');
  const [admins] = await connection.query('SELECT * FROM admins WHERE email = ?', [process.env.ADMIN_EMAIL]);
  if (admins.length === 0) {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'nixtion@123', 10);
    await connection.query(
      'INSERT INTO admins (name, email, password) VALUES (?, ?, ?)',
      [process.env.ADMIN_NAME || 'Nixtion Admin', process.env.ADMIN_EMAIL || 'nixtion@gmail.com', hashedPassword]
    );
    console.log('✅ Default admin account created');
  }

  await connection.end();
  console.log('✅ Database initialized successfully');
}

module.exports = { pool, initializeDatabase };

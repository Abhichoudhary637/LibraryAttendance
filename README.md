# 📚 Library Management System (Electron + MySQL)

A desktop-based Library Management System built using Electron.js and MySQL. This system allows Admin and Watchman users to manage students, employees, and visitor check-ins/check-outs with daily statistics and image upload support.

---

## 🚀 Features

- 🔐 Role-based user login (Admin or Watchman)
- 🎓 Add and view student records
- 🧑‍💼 Add and view employee records
- 🧾 Track visitor check-in/check-out
- 📊 View daily visitor statistics
- 🖼 Upload and store user photos (Base64 → BLOB)
- 💾 Offline support using local MySQL server

---

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Electron.js (`main.js`)
- **Database**: MySQL
- **Libraries**:
  - `mysql2`
  - `moment`
  - `electron` (IPC communication)

---

## 📦 Installation & Setup

### ✅ Prerequisites

- [Node.js](https://nodejs.org/) (v14+)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/)
- Git (optional)

---

### 🔧 Steps to Run

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Abhichoudhary637/LibraryAttendance.git
   cd library-management-electron

2. **Install Node.js dependencies:**
   ```bash
   npm install

3. **Create the MySQL Database:**
   ```sql
   CREATE DATABASE library;
   USE library;

4. **Create the MySQL Database:**
    ```sql
    CREATE TABLE app_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userid VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    name VARCHAR(100),
    usertype INT, -- 1 = Admin, 0 = Watchman
    status INT
    );

    CREATE TABLE app_login_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userid VARCHAR(50),
    logindatetime DATETIME,
    createdon DATETIME,
    name VARCHAR(100)
    );

    CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50),
    name VARCHAR(100),
    course VARCHAR(50),
    branch VARCHAR(50),
    session VARCHAR(50),
    regdate DATE,
    regexpdate DATE,
    father VARCHAR(100),
    mother VARCHAR(100),
    emailid VARCHAR(100),
    mobileno VARCHAR(20),
    address TEXT,
    imagepath LONGBLOB
    );

    CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(50),
    name VARCHAR(100),
    department VARCHAR(50),
    designation VARCHAR(50),
    regdate DATE,
    regexpdate DATE,
    emailid VARCHAR(100),
    mobileno VARCHAR(20),
    address TEXT,
    imagepath LONGBLOB
    );

    CREATE TABLE visitor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    membership_id INT,
    usertype VARCHAR(50),
    visit_date DATE
    );

    CREATE TABLE visitor_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    visitor_id INT,
    entry_time TIME,
    exit_time TIME
    );

5. **Configure MySQL Connection in Code In main.js**
    ```js
    connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'YOUR_MYSQL_PASSWORD',
    database: 'library',
    port: 3306
    });

6. **Start the Application**
   ```bash
   npm start





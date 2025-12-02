# Setup Guide: MySQL Localhost with phpMyAdmin

## Prerequisites
- XAMPP, WAMP, or MAMP installed (includes MySQL + phpMyAdmin)
- Node.js installed

## Step 1: Start MySQL Server
### On XAMPP (Windows/Mac/Linux):
1. Open XAMPP Control Panel
2. Click "Start" button for Apache and MySQL
3. Open browser: `http://localhost/phpmyadmin`

### On WAMP (Windows):
1. Click WAMP icon in taskbar
2. Ensure all services show GREEN
3. Open browser: `http://localhost/phpmyadmin`

## Step 2: Create Database
1. Go to `http://localhost/phpmyadmin`
2. Click "New" or "Create database"
3. Database name: `fried_chicken_4s`
4. Charset: `utf8mb4_unicode_ci`
5. Click "Create"

## Step 3: Import Database Schema
1. In phpMyAdmin, select `fried_chicken_4s` database
2. Click "Import" tab
3. Choose file: `scripts/01_init_database_mysql.sql`
4. Click "Go"

## Step 4: Configure Environment Variables
1. Create `.env.local` file in project root:
\`\`\`
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=fried_chicken_4s
\`\`\`

2. For XAMPP with password protection (if set):
\`\`\`
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=fried_chicken_4s
\`\`\`

## Step 5: Install Dependencies
\`\`\`bash
npm install mysql2/promise
\`\`\`

## Step 6: Run Development Server
\`\`\`bash
npm run dev
\`\`\`

Visit: `http://localhost:3000`

## Step 7: Seed Initial Data
1. Visit: `http://localhost:3000/api/products/seed`
2. You'll see: `{"success":true,"message":"Seeded 6 products"}`

## Troubleshooting

### "connect ECONNREFUSED"
- MySQL server is not running
- Start MySQL in XAMPP/WAMP Control Panel

### "Access denied for user 'root'@'localhost'"
- Check DB_PASSWORD in .env.local
- Default XAMPP password is empty
- Reset MySQL password in phpMyAdmin

### "Unknown database"
- Database not created yet
- Follow Step 2 to create database

### "Table doesn't exist"
- Schema not imported
- Follow Step 3 to import SQL file

## Managing Database in phpMyAdmin

### View Data:
1. Go to `http://localhost/phpmyadmin`
2. Select `fried_chicken_4s` database
3. Click table name (products, orders, etc.)
4. Click "Browse" tab

### Add Test Data:
1. Click "Insert" tab
2. Fill in values
3. Click "Go"

### Execute Custom SQL:
1. Click "SQL" tab
2. Paste SQL query
3. Click "Go"

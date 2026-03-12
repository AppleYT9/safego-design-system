-- SafeGo Database Schema — MySQL 8+
-- Run: mysql -u root -p < schema.sql

CREATE DATABASE IF NOT EXISTS safego_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE safego_db;

-- ==================== USERS ====================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    role ENUM('passenger', 'driver', 'admin') NOT NULL DEFAULT 'passenger',
    preferred_mode ENUM('normal', 'pink', 'pwd', 'elderly') DEFAULT 'normal',
    profile_photo VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_phone (phone)
) ENGINE=InnoDB;

-- ==================== DRIVERS ====================
CREATE TABLE IF NOT EXISTS drivers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    license_number VARCHAR(100) NOT NULL UNIQUE,
    status ENUM('pending', 'approved', 'rejected', 'suspended') NOT NULL DEFAULT 'pending',
    is_online BOOLEAN DEFAULT FALSE,
    current_latitude DOUBLE,
    current_longitude DOUBLE,
    average_rating DOUBLE DEFAULT 0.0,
    total_rides INT DEFAULT 0,
    today_rides INT DEFAULT 0,
    today_earnings DOUBLE DEFAULT 0.0,
    acceptance_rate DOUBLE DEFAULT 100.0,
    certified_modes JSON DEFAULT ('["normal"]'),
    approved_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ==================== VEHICLES ====================
CREATE TABLE IF NOT EXISTS vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    driver_id INT NOT NULL UNIQUE,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    color VARCHAR(50) NOT NULL,
    plate_number VARCHAR(50) NOT NULL UNIQUE,
    is_wheelchair_accessible BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ==================== DRIVER DOCUMENTS ====================
CREATE TABLE IF NOT EXISTS driver_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    driver_id INT NOT NULL,
    document_type ENUM('national_id', 'drivers_license', 'vehicle_registration', 'nbi_clearance') NOT NULL,
    file_url VARCHAR(500),
    status ENUM('upload_required', 'pending', 'verified', 'rejected') NOT NULL DEFAULT 'upload_required',
    reviewed_by INT,
    reviewed_at DATETIME,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ==================== RIDES ====================
CREATE TABLE IF NOT EXISTS rides (
    id INT AUTO_INCREMENT PRIMARY KEY,
    passenger_id INT NOT NULL,
    driver_id INT,
    mode ENUM('normal', 'pink', 'pwd', 'elderly') NOT NULL DEFAULT 'normal',
    status ENUM('pending', 'searching', 'matched', 'driver_arriving', 'in_progress', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    pickup_address VARCHAR(500),
    pickup_latitude DOUBLE NOT NULL,
    pickup_longitude DOUBLE NOT NULL,
    destination_address VARCHAR(500),
    destination_latitude DOUBLE NOT NULL,
    destination_longitude DOUBLE NOT NULL,
    distance_km DOUBLE,
    duration_minutes DOUBLE,
    fare_amount DOUBLE,
    safety_score INT,
    route_polyline TEXT,
    scheduled_at DATETIME,
    started_at DATETIME,
    completed_at DATETIME,
    cancelled_at DATETIME,
    cancel_reason VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (passenger_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE SET NULL,
    INDEX idx_rides_status (status),
    INDEX idx_rides_passenger (passenger_id),
    INDEX idx_rides_driver (driver_id)
) ENGINE=InnoDB;

-- ==================== RIDE LOCATION HISTORY ====================
CREATE TABLE IF NOT EXISTS ride_location_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ride_id INT NOT NULL,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE,
    INDEX idx_ride_location_ride (ride_id)
) ENGINE=InnoDB;

-- ==================== RATINGS ====================
CREATE TABLE IF NOT EXISTS ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ride_id INT NOT NULL UNIQUE,
    rater_id INT NOT NULL,
    driver_id INT NOT NULL,
    score INT NOT NULL CHECK (score >= 1 AND score <= 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE,
    FOREIGN KEY (rater_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ==================== EMERGENCY CONTACTS ====================
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    relationship VARCHAR(100),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_ec_user (user_id)
) ENGINE=InnoDB;

-- ==================== SOS ALERTS ====================
CREATE TABLE IF NOT EXISTS sos_alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    ride_id INT,
    latitude DOUBLE,
    longitude DOUBLE,
    location_address VARCHAR(500),
    severity ENUM('critical', 'moderate', 'low') NOT NULL DEFAULT 'critical',
    status ENUM('active', 'resolved', 'false_alarm') NOT NULL DEFAULT 'active',
    notes TEXT,
    resolved_by INT,
    resolved_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE SET NULL,
    FOREIGN KEY (resolved_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_sos_status (status)
) ENGINE=InnoDB;

-- ==================== NOTIFICATIONS ====================
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    data JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notif_user (user_id)
) ENGINE=InnoDB;

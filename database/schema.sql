-- ============================================
-- BALUGU YO — DATABASE SCHEMA
-- ============================================



-- 1. USERS TABLE
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    pin_hash VARCHAR(255) NOT NULL,
    role ENUM('farmer', 'extension_officer', 'admin') DEFAULT 'farmer',
    district VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. FARMS TABLE
CREATE TABLE farms (
    farm_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    farm_name VARCHAR(100) NOT NULL,
    location VARCHAR(150),
    district VARCHAR(100),
    size_acres DECIMAL(5,2),
    soil_type ENUM('clay', 'loam', 'sandy') DEFAULT 'loam',
    gps_lat DECIMAL(10,8),
    gps_lng DECIMAL(11,8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 3. PLANTINGS TABLE
CREATE TABLE plantings (
    planting_id INT AUTO_INCREMENT PRIMARY KEY,
    farm_id INT NOT NULL,
    yam_variety VARCHAR(100) DEFAULT 'Local Balugu',
    planting_date DATE NOT NULL,
    number_of_mounds INT,
    notes TEXT,
    status ENUM('growing', 'harvest_soon', 'harvested') DEFAULT 'growing',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(farm_id) ON DELETE CASCADE
);

-- 4. PREDICTIONS TABLE
CREATE TABLE predictions (
    prediction_id INT AUTO_INCREMENT PRIMARY KEY,
    planting_id INT NOT NULL,
    predicted_harvest_date DATE NOT NULL,
    confidence_percent INT DEFAULT 80,
    days_remaining INT,
    prediction_basis TEXT,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (planting_id) REFERENCES plantings(planting_id) ON DELETE CASCADE
);

-- 5. WEATHER DATA TABLE
CREATE TABLE weather_data (
    weather_id INT AUTO_INCREMENT PRIMARY KEY,
    district VARCHAR(100) NOT NULL,
    recorded_date DATE NOT NULL,
    rainfall_mm DECIMAL(6,2),
    temp_max DECIMAL(5,2),
    temp_min DECIMAL(5,2),
    humidity_percent INT,
    condition_text VARCHAR(100),
    fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. HARVEST RECORDS TABLE
CREATE TABLE harvest_records (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    planting_id INT NOT NULL,
    actual_harvest_date DATE NOT NULL,
    yield_kg DECIMAL(8,2),
    quality ENUM('poor', 'fair', 'good', 'excellent') DEFAULT 'good',
    farmer_feedback TEXT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (planting_id) REFERENCES plantings(planting_id) ON DELETE CASCADE
);

-- 7. NOTIFICATIONS TABLE
CREATE TABLE notifications (
    notif_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('harvest', 'weather', 'system', 'warning') DEFAULT 'system',
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
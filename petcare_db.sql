-- ============================================
-- PetCare+ Database Creation Script
-- Complete SQL Database Setup
-- ============================================

-- Drop existing database if it exists
DROP DATABASE IF EXISTS petcare_db;

-- Create the database
CREATE DATABASE petcare_db;
USE petcare_db;

-- ============================================
-- 1. USERS TABLE (Pet Owners)
-- ============================================
CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone VARCHAR(15),
    address VARCHAR(255),
    city VARCHAR(50),
    state VARCHAR(50),
    postal_code VARCHAR(10),
    country VARCHAR(50),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_phone (phone)
);

-- ============================================
-- 2. ADMINS TABLE (System Administrators)
-- ============================================
CREATE TABLE Admins (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- ============================================
-- 3. PETS TABLE
-- ============================================
CREATE TABLE Pets (
    pet_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    pet_name VARCHAR(100) NOT NULL,
    species VARCHAR(50) NOT NULL,
    breed VARCHAR(100),
    age INT,
    weight DECIMAL(5,2),
    color VARCHAR(50),
    microchip_id VARCHAR(50) UNIQUE,
    date_of_birth DATE,
    gender VARCHAR(10),
    status VARCHAR(20) DEFAULT 'Active',
    notes TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_microchip (microchip_id),
    INDEX idx_species (species)
);

-- ============================================
-- 4. VACCINATIONS TABLE
-- ============================================
CREATE TABLE Vaccinations (
    vaccination_id INT PRIMARY KEY AUTO_INCREMENT,
    pet_id INT NOT NULL,
    vaccine_name VARCHAR(100) NOT NULL,
    vaccination_date DATE NOT NULL,
    next_due_date DATE,
    veterinarian VARCHAR(100),
    clinic_name VARCHAR(100),
    batch_number VARCHAR(50),
    expiration_date DATE,
    notes TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pet_id) REFERENCES Pets(pet_id) ON DELETE CASCADE,
    INDEX idx_pet_id (pet_id),
    INDEX idx_vaccination_date (vaccination_date),
    INDEX idx_next_due_date (next_due_date)
);

-- ============================================
-- 5. APPOINTMENTS TABLE
-- ============================================
CREATE TABLE Appointments (
    appointment_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    pet_id INT NOT NULL,
    appointment_date DATETIME NOT NULL,
    appointment_type VARCHAR(50),
    veterinarian VARCHAR(100),
    clinic_name VARCHAR(100),
    phone_number VARCHAR(15),
    status VARCHAR(20) DEFAULT 'Scheduled',
    notes TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (pet_id) REFERENCES Pets(pet_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_pet_id (pet_id),
    INDEX idx_appointment_date (appointment_date),
    INDEX idx_status (status)
);

-- ============================================
-- 6. MEDICAL RECORDS TABLE
-- ============================================
CREATE TABLE Medical_Records (
    record_id INT PRIMARY KEY AUTO_INCREMENT,
    pet_id INT NOT NULL,
    record_date DATE NOT NULL,
    record_type VARCHAR(50),
    description TEXT,
    veterinarian VARCHAR(100),
    clinic_name VARCHAR(100),
    diagnosis TEXT,
    treatment TEXT,
    prescription TEXT,
    cost DECIMAL(10,2),
    notes TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pet_id) REFERENCES Pets(pet_id) ON DELETE CASCADE,
    INDEX idx_pet_id (pet_id),
    INDEX idx_record_date (record_date),
    INDEX idx_record_type (record_type)
);

-- ============================================
-- 7. AUDIT LOG TABLE (Admin Activity Tracking)
-- ============================================
CREATE TABLE Audit_Log (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT,
    action VARCHAR(100),
    entity_type VARCHAR(50),
    entity_id INT,
    old_value TEXT,
    new_value TEXT,
    ip_address VARCHAR(50),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES Admins(admin_id) ON DELETE SET NULL,
    INDEX idx_admin_id (admin_id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_action (action)
);

-- ============================================
-- 8. INSERT SAMPLE DATA
-- ============================================

-- Sample Users
INSERT INTO Users (email, password, first_name, last_name, phone, address, city, state, postal_code, country) 
VALUES 
('user@example.com', 'user123', 'John', 'Doe', '555-1234', '123 Main St', 'New York', 'NY', '10001', 'USA'),
('anik@example.com', 'password123', 'Anik', 'Rahman', '555-5678', '456 Oak Ave', 'Los Angeles', 'CA', '90001', 'USA'),
('saira@example.com', 'secure456', 'Saira', 'Khan', '555-9012', '789 Pine Rd', 'Chicago', 'IL', '60601', 'USA');

-- Sample Admins
INSERT INTO Admins (username, password, email, full_name, role) 
VALUES 
('admin', 'admin123', 'admin@petcare.com', 'Administrator', 'admin'),
('superadmin', 'super123', 'superadmin@petcare.com', 'Super Admin', 'superadmin');

-- Sample Pets
INSERT INTO Pets (user_id, pet_name, species, breed, age, weight, color, date_of_birth, gender, status) 
VALUES 
(1, 'Charlie', 'Dog', 'Labrador', 5, 30.50, 'Golden', '2019-03-15', 'Male', 'Active'),
(1, 'Mittens', 'Cat', 'Maine Coon', 3, 8.40, 'Orange', '2021-06-20', 'Female', 'Active'),
(1, 'Hop', 'Rabbit', 'Holland Lop', 2, 1.20, 'White', '2022-09-10', 'Male', 'Active'),
(2, 'Buddy', 'Dog', 'Golden Retriever', 6, 32.00, 'Golden', '2018-05-22', 'Male', 'Active'),
(2, 'Luna', 'Cat', 'Persian', 4, 5.50, 'White', '2020-11-08', 'Female', 'Active'),
(3, 'Max', 'Dog', 'German Shepherd', 7, 35.80, 'Brown', '2017-01-14', 'Male', 'Active');

-- Sample Vaccinations
INSERT INTO Vaccinations (pet_id, vaccine_name, vaccination_date, next_due_date, veterinarian, clinic_name) 
VALUES 
(1, 'Rabies', '2023-01-15', '2025-01-15', 'Dr. Smith', 'Happy Paws Clinic'),
(1, 'DHPP', '2023-02-10', '2024-02-10', 'Dr. Smith', 'Happy Paws Clinic'),
(2, 'Rabies', '2023-03-20', '2025-03-20', 'Dr. Johnson', 'Pet Health Center'),
(3, 'Rabbit Vaccine', '2023-04-05', '2024-04-05', 'Dr. Brown', 'Animal Care Clinic'),
(4, 'Rabies', '2023-05-12', '2025-05-12', 'Dr. Lee', 'Veterinary Plus'),
(5, 'Rabies', '2023-06-18', '2025-06-18', 'Dr. Chen', 'Pet Care Specialists');

-- Sample Appointments
INSERT INTO Appointments (user_id, pet_id, appointment_date, appointment_type, veterinarian, clinic_name, status) 
VALUES 
(1, 1, '2026-02-10 10:00:00', 'Checkup', 'Dr. Smith', 'Happy Paws Clinic', 'Scheduled'),
(1, 2, '2026-02-12 14:00:00', 'Vaccination', 'Dr. Johnson', 'Pet Health Center', 'Scheduled'),
(2, 4, '2026-02-08 09:30:00', 'Checkup', 'Dr. Lee', 'Veterinary Plus', 'Scheduled'),
(2, 5, '2026-02-15 15:00:00', 'Dental Cleaning', 'Dr. Chen', 'Pet Care Specialists', 'Scheduled'),
(3, 6, '2026-02-18 11:00:00', 'Checkup', 'Dr. Brown', 'Animal Care Clinic', 'Scheduled');

-- Sample Medical Records
INSERT INTO Medical_Records (pet_id, record_date, record_type, description, veterinarian, diagnosis, treatment, cost) 
VALUES 
(1, '2025-12-20', 'Checkup', 'Annual health examination', 'Dr. Smith', 'Healthy', 'No treatment needed', 50.00),
(1, '2025-11-15', 'Lab Work', 'Blood test', 'Dr. Smith', 'All values normal', 'No treatment', 75.00),
(2, '2025-12-10', 'Checkup', 'Annual health examination', 'Dr. Johnson', 'Healthy', 'No treatment needed', 45.00),
(4, '2025-12-05', 'Checkup', 'Annual health examination', 'Dr. Lee', 'Healthy with minor ear infection', 'Ear drops prescribed', 60.00);

-- ============================================
-- 9. CREATE VIEWS FOR EASY REPORTING
-- ============================================

-- View: User Pets Summary
CREATE VIEW User_Pets_Summary AS
SELECT 
    u.user_id,
    u.first_name,
    u.last_name,
    u.email,
    COUNT(p.pet_id) as total_pets,
    GROUP_CONCAT(p.pet_name) as pet_names
FROM Users u
LEFT JOIN Pets p ON u.user_id = p.user_id
GROUP BY u.user_id, u.first_name, u.last_name, u.email;

-- View: Upcoming Appointments
CREATE VIEW Upcoming_Appointments AS
SELECT 
    a.appointment_id,
    u.first_name,
    u.last_name,
    p.pet_name,
    a.appointment_date,
    a.appointment_type,
    a.veterinarian,
    a.clinic_name
FROM Appointments a
JOIN Users u ON a.user_id = u.user_id
JOIN Pets p ON a.pet_id = p.pet_id
WHERE a.appointment_date >= NOW()
ORDER BY a.appointment_date;

-- View: Vaccinations Due Soon
CREATE VIEW Vaccinations_Due_Soon AS
SELECT 
    p.pet_id,
    p.pet_name,
    u.first_name,
    u.last_name,
    u.email,
    v.vaccine_name,
    v.next_due_date,
    DATEDIFF(v.next_due_date, CURDATE()) as days_until_due
FROM Vaccinations v
JOIN Pets p ON v.pet_id = p.pet_id
JOIN Users u ON p.user_id = u.user_id
WHERE v.next_due_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
ORDER BY v.next_due_date;

-- ============================================
-- 10. SHOW TABLES AND RECORD COUNT
-- ============================================

SELECT 'Database Setup Complete!' as Status;
SHOW TABLES;

-- Display record counts
SELECT 
    'Users' as TableName, COUNT(*) as RecordCount FROM Users
UNION ALL
SELECT 'Admins', COUNT(*) FROM Admins
UNION ALL
SELECT 'Pets', COUNT(*) FROM Pets
UNION ALL
SELECT 'Vaccinations', COUNT(*) FROM Vaccinations
UNION ALL
SELECT 'Appointments', COUNT(*) FROM Appointments
UNION ALL
SELECT 'Medical_Records', COUNT(*) FROM Medical_Records;

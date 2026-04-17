-- seed.sql
-- Pet Care Management System - Seed Data
-- Admin password 'admin123' is hashed by the setup script

-- Insert admin user (password placeholder - replaced by setup script)
INSERT OR IGNORE INTO users (id, email, password, name, role, phone, address, createdAt, updatedAt)
VALUES ('admin_001', 'admin@petcare.com', '$2b$10$pXC3SpbfCkFLgj4her9pWeZwX.Mv10rFenYeJ9Fhph.x.r8u4KXKq', 'System Administrator', 'admin', '+1-555-0100', 'PetCare Headquarters', datetime('now'), datetime('now'));

-- Removed sample veterinarians as per new requirements.
-- Doctors will now be added dynamically via the Admin Dashboard.

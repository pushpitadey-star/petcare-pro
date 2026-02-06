const pool = require('../config/database');

// Get Pet's Vaccinations
exports.getPetVaccinations = async (req, res) => {
    try {
        const { pet_id } = req.params;
        const user_id = req.user.user_id;

        const connection = await pool.getConnection();
        
        // Verify pet belongs to user
        const [pets] = await connection.execute(
            'SELECT pet_id FROM Pets WHERE pet_id = ? AND user_id = ?',
            [pet_id, user_id]
        );

        if (pets.length === 0) {
            connection.release();
            return res.status(404).json({ 
                success: false, 
                message: 'Pet not found' 
            });
        }

        const [vaccinations] = await connection.execute(
            'SELECT * FROM Vaccinations WHERE pet_id = ? ORDER BY vaccination_date DESC',
            [pet_id]
        );
        connection.release();

        res.json({
            success: true,
            total: vaccinations.length,
            vaccinations: vaccinations
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Add Vaccination
exports.addVaccination = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const { pet_id, vaccine_name, vaccination_date, next_due_date, veterinarian, clinic_name } = req.body;

        if (!pet_id || !vaccine_name || !vaccination_date) {
            return res.status(400).json({ 
                success: false, 
                message: 'Pet ID, vaccine name, and vaccination date are required' 
            });
        }

        const connection = await pool.getConnection();
        
        // Verify pet belongs to user
        const [pets] = await connection.execute(
            'SELECT pet_id FROM Pets WHERE pet_id = ? AND user_id = ?',
            [pet_id, user_id]
        );

        if (pets.length === 0) {
            connection.release();
            return res.status(404).json({ 
                success: false, 
                message: 'Pet not found' 
            });
        }

        const [result] = await connection.execute(
            'INSERT INTO Vaccinations (pet_id, vaccine_name, vaccination_date, next_due_date, veterinarian, clinic_name) VALUES (?, ?, ?, ?, ?, ?)',
            [pet_id, vaccine_name, vaccination_date, next_due_date || null, veterinarian || null, clinic_name || null]
        );
        connection.release();

        res.status(201).json({
            success: true,
            message: 'Vaccination record added successfully',
            vaccination_id: result.insertId
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Update Vaccination
exports.updateVaccination = async (req, res) => {
    try {
        const { vaccination_id } = req.params;
        const user_id = req.user.user_id;
        const { vaccine_name, vaccination_date, next_due_date, veterinarian, clinic_name } = req.body;

        const connection = await pool.getConnection();
        await connection.execute(
            'UPDATE Vaccinations SET vaccine_name = ?, vaccination_date = ?, next_due_date = ?, veterinarian = ?, clinic_name = ? WHERE vaccination_id = ? AND pet_id IN (SELECT pet_id FROM Pets WHERE user_id = ?)',
            [vaccine_name, vaccination_date, next_due_date, veterinarian, clinic_name, vaccination_id, user_id]
        );
        connection.release();

        res.json({
            success: true,
            message: 'Vaccination updated successfully'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get All Vaccinations (Admin Only)
exports.getAllVaccinations = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [vaccinations] = await connection.execute(
            `SELECT v.*, p.pet_name, u.first_name, u.last_name FROM Vaccinations v
             JOIN Pets p ON v.pet_id = p.pet_id
             JOIN Users u ON p.user_id = u.user_id
             ORDER BY v.vaccination_date DESC`
        );
        connection.release();

        res.json({
            success: true,
            total: vaccinations.length,
            vaccinations: vaccinations
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

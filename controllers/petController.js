const pool = require('../config/database');

// Get User's Pets
exports.getUserPets = async (req, res) => {
    try {
        const user_id = req.user.user_id;

        const connection = await pool.getConnection();
        const [pets] = await connection.execute(
            'SELECT * FROM Pets WHERE user_id = ? ORDER BY created_date DESC',
            [user_id]
        );
        connection.release();

        res.json({
            success: true,
            total: pets.length,
            pets: pets
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Add New Pet
exports.addPet = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const { pet_name, species, breed, age, weight, color, date_of_birth, gender } = req.body;

        if (!pet_name || !species) {
            return res.status(400).json({ 
                success: false, 
                message: 'Pet name and species are required' 
            });
        }

        const connection = await pool.getConnection();
        const [result] = await connection.execute(
            'INSERT INTO Pets (user_id, pet_name, species, breed, age, weight, color, date_of_birth, gender) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [user_id, pet_name, species, breed || null, age || null, weight || null, color || null, date_of_birth || null, gender || null]
        );
        connection.release();

        res.status(201).json({
            success: true,
            message: 'Pet added successfully',
            pet_id: result.insertId
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get Pet Details
exports.getPetDetails = async (req, res) => {
    try {
        const { pet_id } = req.params;
        const user_id = req.user.user_id;

        const connection = await pool.getConnection();
        const [pets] = await connection.execute(
            'SELECT * FROM Pets WHERE pet_id = ? AND user_id = ?',
            [pet_id, user_id]
        );
        connection.release();

        if (pets.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Pet not found' 
            });
        }

        res.json({
            success: true,
            pet: pets[0]
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Update Pet
exports.updatePet = async (req, res) => {
    try {
        const { pet_id } = req.params;
        const user_id = req.user.user_id;
        const { pet_name, species, breed, age, weight, color, notes } = req.body;

        const connection = await pool.getConnection();
        await connection.execute(
            'UPDATE Pets SET pet_name = ?, species = ?, breed = ?, age = ?, weight = ?, color = ?, notes = ? WHERE pet_id = ? AND user_id = ?',
            [pet_name, species, breed, age, weight, color, notes, pet_id, user_id]
        );
        connection.release();

        res.json({
            success: true,
            message: 'Pet updated successfully'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Delete Pet
exports.deletePet = async (req, res) => {
    try {
        const { pet_id } = req.params;
        const user_id = req.user.user_id;

        const connection = await pool.getConnection();
        await connection.execute(
            'DELETE FROM Pets WHERE pet_id = ? AND user_id = ?',
            [pet_id, user_id]
        );
        connection.release();

        res.json({
            success: true,
            message: 'Pet deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get All Pets (Admin Only)
exports.getAllPets = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [pets] = await connection.execute(
            `SELECT p.pet_id, p.pet_name, p.species, p.breed, u.first_name, u.last_name, u.email, p.created_date
             FROM Pets p
             JOIN Users u ON p.user_id = u.user_id
             ORDER BY p.created_date DESC`
        );
        connection.release();

        res.json({
            success: true,
            total: pets.length,
            pets: pets
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

const pool = require('../config/database');

// Get User Profile
exports.getUserProfile = async (req, res) => {
    try {
        const user_id = req.user.user_id;

        const connection = await pool.getConnection();
        const [users] = await connection.execute(
            'SELECT user_id, email, first_name, last_name, phone, address, city, state, postal_code, country FROM Users WHERE user_id = ?',
            [user_id]
        );
        connection.release();

        if (users.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        res.json({
            success: true,
            user: users[0]
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Update User Profile
exports.updateUserProfile = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const { first_name, last_name, phone, address, city, state, postal_code, country } = req.body;

        const connection = await pool.getConnection();
        await connection.execute(
            'UPDATE Users SET first_name = ?, last_name = ?, phone = ?, address = ?, city = ?, state = ?, postal_code = ?, country = ? WHERE user_id = ?',
            [first_name, last_name, phone, address, city, state, postal_code, country, user_id]
        );
        connection.release();

        res.json({
            success: true,
            message: 'Profile updated successfully'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get All Users (Admin Only)
exports.getAllUsers = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [users] = await connection.execute(
            'SELECT user_id, email, first_name, last_name, phone, city, created_date FROM Users'
        );
        connection.release();

        res.json({
            success: true,
            total: users.length,
            users: users
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

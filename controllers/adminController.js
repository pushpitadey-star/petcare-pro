const pool = require('../config/database');

// Get Dashboard Stats (Admin Only)
exports.getDashboardStats = async (req, res) => {
    try {
        const connection = await pool.getConnection();

        const [totalPets] = await connection.execute('SELECT COUNT(*) as count FROM Pets');
        const [totalUsers] = await connection.execute('SELECT COUNT(*) as count FROM Users');
        const [pendingAppointments] = await connection.execute(
            "SELECT COUNT(*) as count FROM Appointments WHERE status = 'Scheduled' AND appointment_date >= NOW()"
        );
        const [recentPets] = await connection.execute(
            `SELECT p.pet_id, p.pet_name, p.species, u.first_name, u.last_name FROM Pets p
             JOIN Users u ON p.user_id = u.user_id
             ORDER BY p.created_date DESC LIMIT 10`
        );

        connection.release();

        res.json({
            success: true,
            stats: {
                total_pets: totalPets[0].count,
                total_users: totalUsers[0].count,
                pending_checkups: pendingAppointments[0].count
            },
            recent_pets: recentPets
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get Dashboard Overview (Admin Only)
exports.getDashboardOverview = async (req, res) => {
    try {
        const connection = await pool.getConnection();

        const [userStats] = await connection.execute(
            'SELECT COUNT(*) as total, DATE(created_date) as date FROM Users GROUP BY DATE(created_date) ORDER BY date DESC LIMIT 7'
        );

        const [petStats] = await connection.execute(
            'SELECT species, COUNT(*) as count FROM Pets GROUP BY species'
        );

        const [appointmentStats] = await connection.execute(
            "SELECT status, COUNT(*) as count FROM Appointments GROUP BY status"
        );

        connection.release();

        res.json({
            success: true,
            user_stats: userStats,
            pet_stats: petStats,
            appointment_stats: appointmentStats
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get All Data (Admin Only)
exports.getAllData = async (req, res) => {
    try {
        const connection = await pool.getConnection();

        const [users] = await connection.execute('SELECT user_id, email, first_name, last_name, phone, created_date FROM Users');
        const [pets] = await connection.execute('SELECT pet_id, user_id, pet_name, species, breed FROM Pets');
        const [appointments] = await connection.execute('SELECT appointment_id, user_id, pet_id, appointment_date, status FROM Appointments');

        connection.release();

        res.json({
            success: true,
            summary: {
                total_users: users.length,
                total_pets: pets.length,
                total_appointments: appointments.length
            },
            data: {
                users,
                pets,
                appointments
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

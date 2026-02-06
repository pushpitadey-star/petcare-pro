const pool = require('../config/database');

// Get User's Appointments
exports.getUserAppointments = async (req, res) => {
    try {
        const user_id = req.user.user_id;

        const connection = await pool.getConnection();
        const [appointments] = await connection.execute(
            `SELECT a.*, p.pet_name FROM Appointments a
             JOIN Pets p ON a.pet_id = p.pet_id
             WHERE a.user_id = ?
             ORDER BY a.appointment_date DESC`,
            [user_id]
        );
        connection.release();

        res.json({
            success: true,
            total: appointments.length,
            appointments: appointments
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Book Appointment
exports.bookAppointment = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const { pet_id, appointment_date, appointment_type, veterinarian, clinic_name, phone_number, notes } = req.body;

        if (!pet_id || !appointment_date) {
            return res.status(400).json({ 
                success: false, 
                message: 'Pet ID and appointment date are required' 
            });
        }

        const connection = await pool.getConnection();
        const [result] = await connection.execute(
            'INSERT INTO Appointments (user_id, pet_id, appointment_date, appointment_type, veterinarian, clinic_name, phone_number, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [user_id, pet_id, appointment_date, appointment_type || null, veterinarian || null, clinic_name || null, phone_number || null, notes || null, 'Scheduled']
        );
        connection.release();

        res.status(201).json({
            success: true,
            message: 'Appointment booked successfully',
            appointment_id: result.insertId
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Update Appointment
exports.updateAppointment = async (req, res) => {
    try {
        const { appointment_id } = req.params;
        const user_id = req.user.user_id;
        const { appointment_date, appointment_type, veterinarian, clinic_name, status, notes } = req.body;

        const connection = await pool.getConnection();
        await connection.execute(
            'UPDATE Appointments SET appointment_date = ?, appointment_type = ?, veterinarian = ?, clinic_name = ?, status = ?, notes = ? WHERE appointment_id = ? AND user_id = ?',
            [appointment_date, appointment_type, veterinarian, clinic_name, status, notes, appointment_id, user_id]
        );
        connection.release();

        res.json({
            success: true,
            message: 'Appointment updated successfully'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Cancel Appointment
exports.cancelAppointment = async (req, res) => {
    try {
        const { appointment_id } = req.params;
        const user_id = req.user.user_id;

        const connection = await pool.getConnection();
        await connection.execute(
            'UPDATE Appointments SET status = ? WHERE appointment_id = ? AND user_id = ?',
            ['Cancelled', appointment_id, user_id]
        );
        connection.release();

        res.json({
            success: true,
            message: 'Appointment cancelled'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get All Appointments (Admin Only)
exports.getAllAppointments = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [appointments] = await connection.execute(
            `SELECT a.*, p.pet_name, u.first_name, u.last_name FROM Appointments a
             JOIN Pets p ON a.pet_id = p.pet_id
             JOIN Users u ON a.user_id = u.user_id
             ORDER BY a.appointment_date DESC`
        );
        connection.release();

        res.json({
            success: true,
            total: appointments.length,
            appointments: appointments
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

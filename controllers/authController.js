const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

// Check Username Availability
exports.checkUsernameAvailability = async (req, res) => {
    try {
        const username = req.params.username.trim();
        if (!username || username.length < 3) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username must be at least 3 characters' 
            });
        }

        const connection = await pool.getConnection();
        // Get list of similar usernames (for suggestions)
        const [existingUsers] = await connection.execute(
            'SELECT email FROM Users WHERE email LIKE ? LIMIT 10',
            [`${username}%`]
        );
        connection.release();

        const isAvailable = existingUsers.length === 0;
        const suggestions = existingUsers.map(u => ({
            email: u.email,
            available: false
        }));

        res.json({
            success: true,
            available: isAvailable,
            suggestions: suggestions
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// User Login
exports.userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and password are required' 
            });
        }

        const connection = await pool.getConnection();
        const [users] = await connection.execute(
            'SELECT * FROM Users WHERE email = ?',
            [email]
        );
        connection.release();

        if (users.length === 0) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        const user = users[0];
        let isPasswordValid = false;

        // First try bcrypt compare (expected hashed passwords)
        try {
            isPasswordValid = await bcrypt.compare(password, user.password);
        } catch (e) {
            isPasswordValid = false;
        }

        // Fallback: if stored password is plaintext (seed data), accept it and migrate to hashed
        if (!isPasswordValid && user.password === password) {
            // hash and update stored password
            try {
                const hashed = await bcrypt.hash(password, 10);
                const conn2 = await pool.getConnection();
                await conn2.execute('UPDATE Users SET password = ? WHERE user_id = ?', [hashed, user.user_id]);
                conn2.release();
                isPasswordValid = true;
            } catch (err) {
                // ignore migration error and continue (will be handled below)
                console.error('Password migration failed:', err.message);
            }
        }

        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        const token = jwt.sign(
            { user_id: user.user_id, email: user.email, role: 'user' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                user_id: user.user_id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Admin Login
exports.adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username and password are required' 
            });
        }

        const connection = await pool.getConnection();
        const [admins] = await connection.execute(
            'SELECT * FROM Admins WHERE username = ?',
            [username]
        );
        connection.release();

        if (admins.length === 0) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid username or password' 
            });
        }

        const admin = admins[0];
        let isPasswordValid = false;
        try {
            isPasswordValid = await bcrypt.compare(password, admin.password);
        } catch (e) {
            isPasswordValid = false;
        }

        if (!isPasswordValid && admin.password === password) {
            try {
                const hashed = await bcrypt.hash(password, 10);
                const conn2 = await pool.getConnection();
                await conn2.execute('UPDATE Admins SET password = ? WHERE admin_id = ?', [hashed, admin.admin_id]);
                conn2.release();
                isPasswordValid = true;
            } catch (err) {
                console.error('Admin password migration failed:', err.message);
            }
        }

        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid username or password' 
            });
        }

        const token = jwt.sign(
            { admin_id: admin.admin_id, username: admin.username, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Admin login successful',
            token,
            admin: {
                admin_id: admin.admin_id,
                username: admin.username,
                full_name: admin.full_name,
                email: admin.email
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// User Registration
exports.userRegister = async (req, res) => {
    try {
        const { email, password, first_name, last_name, phone } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and password are required' 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const connection = await pool.getConnection();
        const [result] = await connection.execute(
            'INSERT INTO Users (email, password, first_name, last_name, phone) VALUES (?, ?, ?, ?, ?)',
            [email, hashedPassword, first_name || '', last_name || '', phone || '']
        );
        connection.release();

        const token = jwt.sign(
            { user_id: result.insertId, email: email, role: 'user' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                user_id: result.insertId,
                email: email
            }
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ 
                success: false, 
                message: 'Email already exists' 
            });
        }
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

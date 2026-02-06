const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/auth');

// Protected routes
router.get('/', authMiddleware, appointmentController.getUserAppointments);
router.post('/', authMiddleware, appointmentController.bookAppointment);
router.put('/:appointment_id', authMiddleware, appointmentController.updateAppointment);
router.delete('/:appointment_id', authMiddleware, appointmentController.cancelAppointment);

// Admin routes
router.get('/all', authMiddleware, appointmentController.getAllAppointments);

module.exports = router;

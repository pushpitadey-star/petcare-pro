const express = require('express');
const router = express.Router();
const vaccinationController = require('../controllers/vaccinationController');
const authMiddleware = require('../middleware/auth');

// Protected routes
router.get('/pet/:pet_id', authMiddleware, vaccinationController.getPetVaccinations);
router.post('/', authMiddleware, vaccinationController.addVaccination);
router.put('/:vaccination_id', authMiddleware, vaccinationController.updateVaccination);

// Admin routes
router.get('/all', authMiddleware, vaccinationController.getAllVaccinations);

module.exports = router;

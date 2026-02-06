const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const authMiddleware = require('../middleware/auth');

// Protected routes
router.get('/', authMiddleware, petController.getUserPets);
router.post('/', authMiddleware, petController.addPet);
router.get('/:pet_id', authMiddleware, petController.getPetDetails);
router.put('/:pet_id', authMiddleware, petController.updatePet);
router.delete('/:pet_id', authMiddleware, petController.deletePet);

// Admin routes
router.get('/all', authMiddleware, petController.getAllPets);

module.exports = router;

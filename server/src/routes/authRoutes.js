const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { signupValidator, loginValidator } = require('../validators/authValidator');
const { validate } = require('../middleware/validate');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/signup', signupValidator, validate, authController.signup);
router.post('/login', loginValidator, validate, authController.login);

// Protected routes
router.get('/me', protect, authController.getMe);
router.get('/users', protect, authController.getUsers);

module.exports = router;
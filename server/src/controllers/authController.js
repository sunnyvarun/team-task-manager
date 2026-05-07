const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const env = require('../config/env');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, env.JWT.SECRET, {
        expiresIn: env.JWT.EXPIRE
    });
};

// Create and send token response
const createSendToken = (user, statusCode, res) => {
    const token = generateToken(user.id);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

// @desc    Signup new user
// @route   POST /api/auth/signup
// @access  Public
const signup = catchAsync(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const [existingUser] = await pool.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
    );

    if (existingUser.length > 0) {
        return next(new AppError('User already exists with this email', 400));
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const [result] = await pool.execute(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, role || 'member']
    );

    // Get created user
    const [users] = await pool.execute(
        'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
        [result.insertId]
    );

    createSendToken(users[0], 201, res);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // Check if user exists
    const [users] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );

    if (users.length === 0) {
        return next(new AppError('Invalid email or password', 401));
    }

    const user = users[0];

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return next(new AppError('Invalid email or password', 401));
    }

    createSendToken(user, 200, res);
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = catchAsync(async (req, res, next) => {
    const [users] = await pool.execute(
        'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
        [req.user.id]
    );

    res.status(200).json({
        status: 'success',
        data: {
            user: users[0]
        }
    });
});

// @desc    Get all users (for member selection)
// @route   GET /api/auth/users
// @access  Private
const getUsers = catchAsync(async (req, res, next) => {
    const [users] = await pool.execute(
        'SELECT id, name, email, role FROM users'
    );

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    });
});

module.exports = { signup, login, getMe, getUsers };
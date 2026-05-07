const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const env = require('../config/env');

const protect = catchAsync(async (req, res, next) => {
    let token;

    // 1) Check if token exists
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    // 2) Verify token
    const decoded = jwt.verify(token, env.JWT.SECRET);

    // 3) Check if user still exists
    const [rows] = await pool.execute(
        'SELECT id, name, email, role FROM users WHERE id = ?',
        [decoded.id]
    );

    if (rows.length === 0) {
        return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // 4) Set user to request object
    req.user = rows[0];
    next();
});

module.exports = { protect };
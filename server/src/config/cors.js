const cors = require('cors');
const env = require('./env');

const corsConfig = cors({
    origin: env.CORS.ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400 // 24 hours
});

module.exports = corsConfig;
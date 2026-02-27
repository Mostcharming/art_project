require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const db = require('./models');

const viewersRoutes = require('./routes/viewers');
const publishersRoutes = require('./routes/publishers');

const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : [];

let limiter;
if (process.env.NODE_ENV === 'production') {
    limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 500,
        message: 'Too many requests from this IP, please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
        skip: (req) => {
            return req.path === '/api/health';
        }
    });
    app.use(limiter);
}

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (ALLOWED_ORIGINS.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(morgan('combined'));
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'API is running' });
});

app.get('/api/', (req, res) => {
    res.json({ status: 'OK', message: 'You have hit the Carsl API home route' });
});

app.use('/api/viewers', viewersRoutes);
app.use('/api/publishers', publishersRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.use(errorHandler);

db.sequelize.authenticate()
    .then(() => {
        console.log('Database connection established successfully.');
        return db.sequelize.sync();
    })
    .then(() => {
        console.log('Database synchronized.');
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Accessible at http://0.0.0.0:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
        process.exit(1);
    });

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models');

// Import routes
const viewersRoutes = require('./routes/viewers');
const publishersRoutes = require('./routes/publishers');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'API is running' });
});

// API Routes
app.use('/api/viewers', viewersRoutes);
app.use('/api/publishers', publishersRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Initialize database and start server
db.sequelize.authenticate()
    .then(() => {
        console.log('Database connection established successfully.');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
        process.exit(1);
    });

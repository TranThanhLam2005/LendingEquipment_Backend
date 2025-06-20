require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const visitorRoutes = require('./routes/visitorRoutes');
const authRoutes = require('./routes/authRoutes');


// Middleware
app.use(cors({
    origin: 'http://192.168.1.8:5173', // or your frontend URL
    credentials: true,
}));
app.use(cookieParser()); // Parse cookies
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Default route for testing
app.get('/', (req, res) => {
    res.send('Welcome to the Lending Record Web API');
});

// Routes
app.use('/visitor', visitorRoutes);
app.use('/auth', authRoutes);

// Export the app   
module.exports = app;
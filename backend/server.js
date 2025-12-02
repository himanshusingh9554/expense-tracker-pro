const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./src/config/db');

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Body parser for JSON data
app.use(express.urlencoded({ extended: false })); // Body parser for URL encoded data

// Logger (only in dev mode)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount Routes
app.use('/api/users', require('./src/routes/authRoutes'));
app.use('/api/expenses', require('./src/routes/expenseRoutes'));
app.use('/api/content', require('./src/routes/contentRoutes'));

// Base Route (Health check)
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Expense Tracker API is running' });
});

// Error Handling (Fallthrough for undefined routes)
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route Not Found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/footwear_store' }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}));

// Global variables for views
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/admin', require('./routes/admin'));
app.use('/products', require('./routes/products'));
app.use('/orders', require('./routes/orders'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

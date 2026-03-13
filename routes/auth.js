const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Register Page
router.get('/register', (req, res) => {
    if (req.session.user) return res.redirect('/');
    res.render('auth/register', { query: req.query });
});

// Login Page
router.get('/login', (req, res) => {
    if (req.session.user) return res.redirect('/');
    res.render('auth/login', { query: req.query });
});

// Register Action
router.post('/register', async (req, res) => {
    const { name, email, password, contact, address, role } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).send('User already exists');

        // Create new user with role (defaults to 'user' if not provided)
        user = new User({ name, email, password, contact, address, role: role || 'user' });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        // Redirect to login page after registration
        res.redirect('/auth/login?registered=true');
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).send('Server Error: ' + error.message);
    }
});

// Login Action
router.post('/login', async (req, res) => {
    const { email, password, role } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).send('Invalid Credentials');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send('Invalid Credentials');

        // Validate if the selected role matches the DB role
        if (role && user.role !== role) {
            return res.status(400).send(`Access Denied: You are not registered as an ${role}`);
        }

        req.session.user = { id: user._id, name: user.name, role: user.role };

        // Redirect based on role
        if (user.role === 'admin') {
            res.redirect('/admin');
        } else {
            res.redirect('/');
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).send('Server Error: ' + error.message);
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/auth/login');
});

module.exports = router;

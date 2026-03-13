const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory'); // Added Subcategory import

router.get('/', async (req, res) => {
    // Redirect to login if not authenticated
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }

    try {
        const { category } = req.query;
        const categories = await Category.find();
        let filter = {};

        if (category) {
            // Handle multiple category IDs (comma separated)
            if (category.includes(',')) {
                filter.category = { $in: category.split(',') };
            } else {
                filter.category = category;
            }
        }

        const products = await Product.find(filter).populate('category subcategory');
        res.render('index', { products, categories, selectedCategory: category || null });
    } catch (error) {
        console.error('Error in index route:', error);
        res.status(500).send('Server Error: ' + error.message);
    }
});

router.get('/cart', (req, res) => {
    res.render('cart');
});

router.get('/profile', (req, res) => {
    if (!req.session.user) return res.redirect('/');
    res.render('profile');
});

router.get('/about', (req, res) => {
    res.render('about');
});

router.get('/contact', (req, res) => {
    res.render('contact');
});

router.get('/collections', async (req, res) => {
    try {
        const categories = await Category.find();
        res.render('collections', { categories });
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;

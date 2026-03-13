const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');

router.get('/', async (req, res) => {
    // Redirect to login if not authenticated
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }

    try {
        const { category } = req.query;
        const categories = await Category.find();
        let filter = {};
        if (category) filter.category = category;

        const products = await Product.find(filter).populate('category subcategory');
        res.render('index', { products, categories, selectedCategory: category || null });
    } catch (error) {
        res.status(500).send('Server Error');
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

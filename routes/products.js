const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/search', async (req, res) => {
    const query = req.query.q;
    try {
        const products = await Product.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { brand: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        }).populate('category subcategory');
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Search failed' });
    }
});

router.get('/filter', async (req, res) => {
    const { category, subcategory, minPrice, maxPrice } = req.query;
    let filter = {};
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    try {
        const products = await Product.find(filter).populate('category subcategory');
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Filter failed' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category subcategory');
        if (!product) return res.redirect('/');
        res.render('product_details', { product });
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;

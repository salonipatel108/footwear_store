const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/admin');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');
const multer = require('multer');
const path = require('path');

// Multer Config
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

const Order = require('../models/Order');

router.use(isAdmin);

// Dashboard Overview
router.get('/', async (req, res) => {
    try {
        const productCount = await Product.countDocuments();
        const categoryCount = await Category.countDocuments();
        const orders = await Order.find().populate('user');
        const recentProducts = await Product.find().populate('category').sort({ createdAt: -1 }).limit(5);

        const totalSales = orders.reduce((acc, order) => acc + order.totalAmount, 0);
        const orderCount = orders.length;

        res.render('admin/dashboard', {
            productCount,
            categoryCount,
            recentProducts,
            totalSales,
            orderCount,
            orders
        });
    } catch (error) {
        console.error('Admin Error:', error);
        res.status(500).send('Server Error: ' + error.message);
    }
});

// Products List
router.get('/products', async (req, res) => {
    const products = await Product.find().populate('category subcategory').sort({ createdAt: -1 });
    res.render('admin/products', { products });
});

// Add Product Page
router.get('/product/add', async (req, res) => {
    const categories = await Category.find();
    const subcategories = await Subcategory.find();
    res.render('admin/product_add', { categories, subcategories });
});

// Edit Product Page
router.get('/product/edit/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    const categories = await Category.find();
    const subcategories = await Subcategory.find();
    res.render('admin/product_edit', { product, categories, subcategories });
});

// Categories & Subcategories Management Page
router.get('/categories', async (req, res) => {
    const categories = await Category.find();
    const subcategories = await Subcategory.find().populate('category');
    res.render('admin/categories', { categories, subcategories });
});

// Category Action
router.post('/category', async (req, res) => {
    await Category.create({ name: req.body.name });
    res.redirect('/admin/categories');
});

// Subcategory Action
router.post('/subcategory', async (req, res) => {
    await Subcategory.create({ name: req.body.name, category: req.body.category });
    res.redirect('/admin/categories');
});

// Product Action - Add
router.post('/product', upload.single('image'), async (req, res) => {
    try {
        const { title, description, price, stock, category, brand } = req.body;
        const subcategory = req.body.subcategory || null;
        const image = req.file ? req.file.filename : '';
        await Product.create({ title, description, price, stock, category, subcategory, image, brand });
        res.redirect('/admin/products');
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).send('Internal Server Error: ' + error.message);
    }
});

// Product Action - Edit
router.post('/product/edit/:id', upload.single('image'), async (req, res) => {
    try {
        const { title, description, price, stock, category, brand } = req.body;
        const subcategory = req.body.subcategory || null;
        const updateData = { title, description, price, stock, category, subcategory, brand };
        if (req.file) updateData.image = req.file.filename;
        await Product.findByIdAndUpdate(req.params.id, updateData);
        res.redirect('/admin/products');
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).send('Internal Server Error: ' + error.message);
    }
});

// Product Action - Delete
router.get('/product/delete/:id', async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/admin/products');
});

module.exports = router;

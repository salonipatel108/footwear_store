const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
    if (req.session.user) return next();
    res.status(401).json({ error: 'Login required' });
};

router.get('/checkout', (req, res) => {
    if (!req.session.user) return res.redirect('/#loginModal');
    res.render('checkout');
});

router.post('/place', isAuthenticated, async (req, res) => {
    try {
        const { items, totalAmount, address, paymentMethod } = req.body;

        const newOrder = new Order({
            user: req.session.user.id,
            items: items.map(i => ({
                product: i.id,
                title: i.title,
                price: i.price,
                image: i.image,
                quantity: 1
            })),
            totalAmount,
            shippingAddress: address,
            paymentMethod,
            status: 'Pending'
        });

        await newOrder.save();
        res.status(201).json({ message: 'Order created', orderId: newOrder._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to place order' });
    }
});

router.get('/success', (req, res) => {
    res.render('order_success', { orderId: req.query.id });
});

router.get('/history', async (req, res) => {
    if (!req.session.user) return res.redirect('/');
    try {
        const orders = await Order.find({ user: req.session.user.id }).populate('items.product');
        res.render('order_history', { orders });
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;

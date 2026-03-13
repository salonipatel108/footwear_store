require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/footwear_store');

        // Clear existing data
        await Category.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        // Create Admin
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin'
        });

        // Create Categories
        const cat1 = await Category.create({ name: 'Sneakers' });
        const cat2 = await Category.create({ name: 'Formal' });
        const cat3 = await Category.create({ name: 'Casual' });

        // Create Products with real internal images
        await Product.create([
            { title: 'Nike White Sneakers', brand: 'Nike', price: 120, stock: 50, category: cat1._id, image: 'white_sneaker.png', description: 'Premium white athletic sneakers for daily performance.' },
            { title: 'Elegant Oxford Black', brand: 'Bata', price: 150, stock: 30, category: cat2._id, image: 'black_formal.png', description: 'Sharp black formal shoes for corporate elegance.' },
            { title: 'Casual Suede Loafers', brand: 'Sparx', price: 60, stock: 100, category: cat3._id, image: 'brown_loafer.png', description: 'Comfortable brown suede loafers for a relaxed look.' },
            { title: 'Speed Run Blue', brand: 'Adidas', price: 140, stock: 80, category: cat1._id, image: 'blue_running.png', description: 'High-speed blue running shoes with breathable mesh.' }
        ]);

        console.log('Premium Seeding completed with real images!');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedData();

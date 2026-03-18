const mongoose = require('mongoose');
const User = require('./models/User');

const updateRole = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/footwear_store');
        const res = await User.updateMany({}, { role: 'admin' });
        console.log(`Updated ${res.modifiedCount} users to admin role.`);
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

updateRole();

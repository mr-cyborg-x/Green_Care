const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

async function ensureAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const email = 'admin123@gmail.com';
        const password = 'admin123';
        const username = 'AdminUser';

        let user = await User.findOne({ email });

        if (user) {
            console.log('User already exists. Updating password...');
            user.password = await bcrypt.hash(password, 10);
            await user.save();
            console.log('Password updated to "admin123"');
        } else {
            console.log('User not found. Creating new user...');
            const hashedPassword = await bcrypt.hash(password, 10);
            user = new User({
                username,
                email,
                password: hashedPassword,
                mobile: '1234567890',
                avatar: `https://placehold.co/200x200/22C55E/FFFFFF?text=A`
            });
            await user.save();
            console.log('User created successfully');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

ensureAdmin();

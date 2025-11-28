require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function testWrite() {
    try {
        console.log('Connecting...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        console.log('Attempting to create user...');
        const user = new User({
            username: 'WriteTest',
            email: 'writetest@example.com',
            password: 'password123',
            avatar: 'http://example.com/avatar.png'
        });

        await user.save();
        console.log('User saved successfully.');

        await User.deleteOne({ email: 'writetest@example.com' });
        console.log('Cleanup successful.');
        process.exit(0);
    } catch (error) {
        console.error('Write failed:', error);
        process.exit(1);
    }
}

testWrite();

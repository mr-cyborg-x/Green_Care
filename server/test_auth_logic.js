require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

async function testAuthLogic() {
    try {
        console.log('Connecting...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        const reqBody = {
            email: 'atlasuser@example.com',
            password: 'password123',
            username: 'AtlasUser'
        };

        console.log('Simulating login logic...');
        const { email, mobile, password, username } = reqBody;

        console.log('Finding user...');
        let user = await User.findOne({
            $or: [
                { email: email || '' },
                { mobile: mobile || '' }
            ]
        });
        console.log('User found:', user ? 'Yes' : 'No');

        if (!user) {
            console.log('Creating new user...');
            const finalUsername = username || (email
                ? email.split('@')[0] + Math.floor(Math.random() * 1000)
                : 'User' + Math.floor(Math.random() * 10000));

            console.log('Hashing password...');
            const hashedPassword = await bcrypt.hash(password || 'password123', 10);

            console.log('Instantiating User model...');
            user = new User({
                username: finalUsername,
                email: email || '',
                mobile: mobile || '',
                password: hashedPassword,
                avatar: `https://placehold.co/200x200/22C55E/FFFFFF?text=${finalUsername.charAt(0).toUpperCase()}`
            });

            console.log('Saving user...');
            await user.save();
            console.log('User saved.');
        } else {
            console.log('Verifying password...');
            const isValidPassword = await bcrypt.compare(password, user.password);
            console.log('Password valid:', isValidPassword);
        }

        console.log('Generating token...');
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        console.log('Token generated:', token);

        console.log('Success!');
        process.exit(0);
    } catch (error) {
        console.error('Auth logic failed:', error);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}

testAuthLogic();

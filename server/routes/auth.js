const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Register / Login (combined endpoint)
router.post('/login', async (req, res) => {
    try {
        const { email, mobile, password, username, type } = req.body;

        // Default to 'login' if not specified for backward compatibility
        const authType = type || 'login';

        // Find user by email or mobile
        let user = await User.findOne({
            $or: [
                { email: email || '' },
                { mobile: mobile || '' }
            ]
        });

        if (authType === 'signup') {
            // SIGNUP LOGIC
            if (user) {
                return res.status(400).json({ error: 'User already exists' });
            }

            if (!email && !mobile) {
                return res.status(400).json({ error: 'Email or mobile number required' });
            }

            // Generate username from email or use default
            const finalUsername = username || (email
                ? email.split('@')[0] + Math.floor(Math.random() * 1000)
                : 'User' + Math.floor(Math.random() * 10000));

            // Hash password
            const hashedPassword = await bcrypt.hash(password || 'password123', 10);

            user = new User({
                username: finalUsername,
                email: email || '',
                mobile: mobile || '',
                password: hashedPassword,
                avatar: `https://placehold.co/200x200/22C55E/FFFFFF?text=${finalUsername.charAt(0).toUpperCase()}`
            });

            await user.save();

        } else {
            // LOGIN LOGIC
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Verify password
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                mobile: user.mobile,
                avatar: user.avatar
            }
        });
    } catch (error) {
        console.error('Auth error:', error);
        res.status(500).json({ error: 'Server error during authentication' });
    }
});

// Get current user
router.get('/me', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

// Update current user
router.put('/me', authMiddleware, async (req, res) => {
    try {
        const { bio, avatar, mobile } = req.body;
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (bio !== undefined) user.bio = bio;
        if (avatar !== undefined) user.avatar = avatar;
        if (mobile !== undefined) user.mobile = mobile;

        await user.save();
        res.json({
            id: user._id,
            username: user.username,
            email: user.email,
            mobile: user.mobile,
            avatar: user.avatar,
            bio: user.bio
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

module.exports = router;

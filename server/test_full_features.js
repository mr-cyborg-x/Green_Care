const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const Reminder = require('./models/Reminder');
require('dotenv').config();

async function testFullFeatures() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/greencare');
        console.log('Connected to MongoDB');

        // 1. Setup User
        const username = 'testuser_' + Date.now();
        let user = new User({
            username,
            email: `${username}@example.com`,
            password: 'password123'
        });
        await user.save();
        console.log(`[AUTH] Created user: ${user.username}`);

        // 2. Test Reminders (CRUD)
        console.log('\n--- Testing Reminders ---');
        // Create
        const reminder = new Reminder({
            user: user._id,
            task: 'Test Water Fern',
            frequency: 'Weekly',
            time: '10:00 AM'
        });
        await reminder.save();
        console.log('[REMINDER] Created reminder');

        // Update
        reminder.task = 'Water Fern (Updated)';
        await reminder.save();
        const updatedReminder = await Reminder.findById(reminder._id);
        if (updatedReminder.task === 'Water Fern (Updated)') {
            console.log('[REMINDER] PASS: Updated reminder');
        } else {
            console.error('[REMINDER] FAIL: Update failed');
        }

        // Delete
        await Reminder.findByIdAndDelete(reminder._id);
        const deletedReminder = await Reminder.findById(reminder._id);
        if (!deletedReminder) {
            console.log('[REMINDER] PASS: Deleted reminder');
        } else {
            console.error('[REMINDER] FAIL: Delete failed');
        }

        // 3. Test Posts (Interactions)
        console.log('\n--- Testing Posts ---');
        // Create
        const post = new Post({
            user: user._id,
            username: user.username,
            caption: 'My first plant!',
            image: 'https://placehold.co/600x600'
        });
        await post.save();
        console.log('[POST] Created post');

        // Like
        post.likedBy.push(user._id);
        post.likes += 1;
        await post.save();
        const likedPost = await Post.findById(post._id);
        if (likedPost.likes === 1 && likedPost.likedBy.includes(user._id)) {
            console.log('[POST] PASS: Liked post');
        } else {
            console.error('[POST] FAIL: Like failed');
        }

        // Comment
        post.comments.push({
            user: user._id,
            username: user.username,
            text: 'Nice plant!'
        });
        post.commentCount += 1;
        await post.save();
        const commentedPost = await Post.findById(post._id);
        if (commentedPost.commentCount === 1 && commentedPost.comments[0].text === 'Nice plant!') {
            console.log('[POST] PASS: Commented on post');
        } else {
            console.error('[POST] FAIL: Comment failed');
        }

        // 4. Test Profile Editing
        console.log('\n--- Testing Profile ---');
        user.bio = 'I love plants!';
        user.mobile = '1234567890';
        await user.save();

        const updatedUser = await User.findById(user._id);
        if (updatedUser.bio === 'I love plants!' && updatedUser.mobile === '1234567890') {
            console.log('[PROFILE] PASS: Updated profile');
        } else {
            console.error('[PROFILE] FAIL: Profile update failed');
        }

        // Cleanup
        await User.deleteOne({ _id: user._id });
        await Post.deleteMany({ user: user._id });
        console.log('\n[CLEANUP] Deleted test data');

    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        await mongoose.disconnect();
    }
}

testFullFeatures();

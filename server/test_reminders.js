const mongoose = require('mongoose');
const Reminder = require('./models/Reminder');
const User = require('./models/User');
require('dotenv').config();

async function testReminders() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/greencare');
        console.log('Connected to MongoDB');

        // Create a dummy user if not exists
        let user = await User.findOne({ username: 'testuser' });
        if (!user) {
            user = new User({ username: 'testuser', password: 'password123' });
            await user.save();
            console.log('Created test user');
        }

        // Create a reminder
        const reminder = new Reminder({
            user: user._id,
            task: 'Test Water Plants',
            frequency: 'Daily',
            time: '09:00 AM'
        });
        await reminder.save();
        console.log('Created reminder:', reminder._id);

        // Verify initial state
        if (reminder.completed === false) {
            console.log('PASS: Initial completed state is false');
        } else {
            console.error('FAIL: Initial completed state is not false');
        }

        // Mark as completed
        reminder.completed = true;
        reminder.completedAt = new Date();
        await reminder.save();
        console.log('Marked reminder as completed');

        // Verify updated state
        const updatedReminder = await Reminder.findById(reminder._id);
        if (updatedReminder.completed === true && updatedReminder.completedAt) {
            console.log('PASS: Reminder marked as completed');
        } else {
            console.error('FAIL: Reminder not marked as completed');
        }

        // Cleanup
        await Reminder.deleteMany({ user: user._id });
        await User.deleteOne({ _id: user._id });
        console.log('Cleanup complete');

    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        await mongoose.disconnect();
    }
}

testReminders();

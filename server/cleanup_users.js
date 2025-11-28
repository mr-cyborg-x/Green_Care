const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const Reminder = require('./models/Reminder');
require('dotenv').config();

async function cleanupUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const adminEmail = 'admin123@gmail.com';

        // Find admin user
        const admin = await User.findOne({ email: adminEmail });

        if (!admin) {
            console.log('Admin user not found! Aborting to prevent total data loss.');
            process.exit(1);
        }

        console.log(`Admin user found: ${admin.username} (${admin._id})`);

        // Delete all users except admin
        const result = await User.deleteMany({ email: { $ne: adminEmail } });
        console.log(`Deleted ${result.deletedCount} other users.`);

        // Optional: Delete posts/reminders from non-admin users?
        // For now, let's just clean up the users as requested.
        // If we wanted to clean everything:
        // await Post.deleteMany({ user: { $ne: admin._id } });
        // await Reminder.deleteMany({ user: { $ne: admin._id } });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

cleanupUsers();

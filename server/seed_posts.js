const mongoose = require('mongoose');
const Post = require('./models/Post');
const User = require('./models/User');
require('dotenv').config();

const samplePosts = [
    {
        caption: "My monstera is finally growing a new leaf! 🌿 #plantmom #monstera",
        image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=2664&auto=format&fit=crop",
        likes: 12,
        commentCount: 2
    },
    {
        caption: "Succulent collection looking strong today 🌵",
        image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?q=80&w=2449&auto=format&fit=crop",
        likes: 45,
        commentCount: 5
    },
    {
        caption: "Help! What's wrong with my peace lily? The leaves are turning yellow. 😟",
        image: "https://images.unsplash.com/photo-1593696954577-ab3d39317b97?q=80&w=2666&auto=format&fit=crop",
        likes: 3,
        commentCount: 8
    },
    {
        caption: "Just repotted this beauty. Fingers crossed it settles in well! 🤞",
        image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=2672&auto=format&fit=crop",
        likes: 28,
        commentCount: 1
    },
    {
        caption: "Morning vibes with my green friends ☕️🪴",
        image: "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?q=80&w=2574&auto=format&fit=crop",
        likes: 89,
        commentCount: 12
    }
];

async function seedPosts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const adminEmail = 'admin123@gmail.com';
        const admin = await User.findOne({ email: adminEmail });

        if (!admin) {
            console.error('Admin user not found. Please run ensure_admin.js first.');
            process.exit(1);
        }

        console.log(`Seeding posts for user: ${admin.username}`);

        // Clear existing posts if needed (optional, maybe just append?)
        // await Post.deleteMany({}); 

        for (const postData of samplePosts) {
            const post = new Post({
                user: admin._id,
                username: admin.username,
                avatar: admin.avatar,
                image: postData.image,
                caption: postData.caption,
                likes: postData.likes,
                commentCount: postData.commentCount,
                comments: [], // Initialize empty comments
                likedBy: [],
                savedBy: []
            });
            await post.save();
            console.log(`Created post: ${post.caption.substring(0, 30)}...`);
        }

        console.log('Seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding posts:', error);
        process.exit(1);
    }
}

seedPosts();

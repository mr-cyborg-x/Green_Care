const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const authMiddleware = require('../middleware/auth');

// Get all posts (public)
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .limit(50);

        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

// Create new post (protected)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { image, caption } = req.body;

        const post = new Post({
            user: req.userId,
            username: req.username,
            avatar: `https://placehold.co/100x100/22C55E/FFFFFF?text=${req.username.charAt(0).toUpperCase()}`,
            image: image || 'https://placehold.co/600x600/22C55E/FFFFFF?text=New+Post',
            caption: caption || '',
            likes: 0,
            comments: [],
            commentCount: 0
        });

        await post.save();
        res.status(201).json(post);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Failed to create post' });
    }
});

// Like/Unlike post (protected)
router.post('/:id/like', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const likedIndex = post.likedBy.findIndex(id => id.toString() === req.userId);

        if (likedIndex > -1) {
            // Unlike
            post.likedBy.splice(likedIndex, 1);
            post.likes = Math.max(0, post.likes - 1);
        } else {
            // Like
            post.likedBy.push(req.userId);
            post.likes += 1;
        }

        await post.save();
        res.json(post);
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({ error: 'Failed to like post' });
    }
});

// Save/Unsave post (protected)
router.post('/:id/save', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const savedIndex = post.savedBy.findIndex(id => id.toString() === req.userId);

        if (savedIndex > -1) {
            // Unsave
            post.savedBy.splice(savedIndex, 1);
        } else {
            // Save
            // Prevent duplicates just in case
            if (!post.savedBy.some(id => id.toString() === req.userId)) {
                post.savedBy.push(req.userId);
            }
        }

        await post.save();
        res.json(post);
    } catch (error) {
        console.error('Error saving post:', error);
        res.status(500).json({ error: 'Failed to save post' });
    }
});

// Get saved posts (protected)
router.get('/saved', authMiddleware, async (req, res) => {
    try {
        const posts = await Post.find({ savedBy: req.userId })
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        console.error('Error fetching saved posts:', error);
        res.status(500).json({ error: 'Failed to fetch saved posts' });
    }
});

// Add comment (protected)
router.post('/:id/comment', authMiddleware, async (req, res) => {
    try {
        const { text } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const newComment = {
            user: req.userId,
            username: req.username,
            avatar: `https://placehold.co/100x100/22C55E/FFFFFF?text=${req.username.charAt(0).toUpperCase()}`,
            text
        };

        post.comments.push(newComment);
        post.commentCount = post.comments.length;

        await post.save();
        res.json(post);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Failed to add comment' });
    }
});

// Get user's posts
router.get('/user/:username', async (req, res) => {
    try {
        const posts = await Post.find({ username: req.params.username })
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        console.error('Error fetching user posts:', error);
        res.status(500).json({ error: 'Failed to fetch user posts' });
    }
});

// Search posts
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.json([]);

        const posts = await Post.find({
            $or: [
                { caption: { $regex: q, $options: 'i' } },
                { username: { $regex: q, $options: 'i' } }
            ]
        }).sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        console.error('Error searching posts:', error);
        res.status(500).json({ error: 'Failed to search posts' });
    }
});

module.exports = router;

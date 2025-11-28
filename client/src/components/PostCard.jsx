import { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function PostCard({ post, currentUserId, onLike, onSave, onComment }) {
    const isLiked = post.likedBy?.includes(currentUserId);
    const isSaved = post.savedBy?.includes(currentUserId);
    const [showShareToast, setShowShareToast] = useState(false);

    const handleLike = (e) => {
        if (!isLiked) {
            // Trigger confetti from the click position
            const rect = e.target.getBoundingClientRect();
            const x = (rect.left + rect.width / 2) / window.innerWidth;
            const y = (rect.top + rect.height / 2) / window.innerHeight;

            confetti({
                particleCount: 30,
                spread: 60,
                origin: { x, y },
                colors: ['#ef4444', '#f87171', '#fecaca'],
                disableForReducedMotion: true,
                zIndex: 1000,
            });
        }
        onLike(post._id);
    };

    const handleShare = () => {
        // Simulate copying link
        navigator.clipboard.writeText(`${window.location.origin}/post/${post._id}`);
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 2000);
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 relative">
            {/* Share Toast */}
            <AnimatePresence>
                {showShareToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 z-20 backdrop-blur-sm"
                    >
                        <Check size={16} className="text-green-400" />
                        Link copied!
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Post Header */}
            <div className="flex items-center p-3">
                <img
                    src={post.avatar}
                    alt={post.username}
                    className="w-9 h-9 rounded-full object-cover border border-gray-200"
                />
                <span className="ml-3 font-semibold text-sm text-gray-800">
                    {post.username}
                </span>
            </div>

            {/* Post Image */}
            <div className="relative group">
                <img
                    src={post.image}
                    alt="Plant"
                    className="w-full h-auto aspect-square object-cover"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/600x600/F0F0F0/A0A0A0?text=Image+Error';
                    }}
                />
                {/* Double click to like overlay could go here */}
            </div>

            {/* Action Bar */}
            <div className="flex justify-between items-center p-3">
                <div className="flex space-x-4">
                    <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={handleLike}
                        className="focus:outline-none"
                    >
                        <Heart
                            size={28}
                            fill={isLiked ? "currentColor" : "none"}
                            className={`transition-colors duration-300 ${isLiked
                                ? 'text-red-500'
                                : 'text-gray-700 hover:text-red-500'
                                }`}
                        />
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onComment(post)}
                        className="focus:outline-none"
                    >
                        <MessageCircle
                            size={28}
                            className="text-gray-700 hover:text-gray-900 transition-colors"
                        />
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleShare}
                        className="focus:outline-none"
                    >
                        <Send size={28} className="text-gray-700 hover:text-gray-900 transition-colors" />
                    </motion.button>
                </div>

                <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={() => onSave(post._id)}
                    className="focus:outline-none"
                >
                    <Bookmark
                        size={28}
                        className={`transition-colors duration-300 ${isSaved
                            ? 'text-green-500 fill-green-500'
                            : 'text-gray-700 hover:text-green-500'
                            }`}
                    />
                </motion.button>
            </div>

            {/* Likes and Caption */}
            <div className="px-3 pb-3">
                <div className="text-sm font-semibold text-gray-800 mb-1">
                    {post.likes || 0} likes
                </div>
                {post.caption && (
                    <div className="text-sm">
                        <span className="font-semibold text-gray-800 mr-2">{post.username}</span>
                        <span className="text-gray-700 leading-snug">{post.caption}</span>
                    </div>
                )}
                <button
                    onClick={() => onComment(post)}
                    className="text-sm text-gray-500 mt-2 hover:text-gray-700 font-medium"
                >
                    View all {post.commentCount || 0} comments
                </button>
            </div>
        </div>
    );
}

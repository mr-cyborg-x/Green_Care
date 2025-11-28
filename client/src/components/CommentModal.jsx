import { useState } from 'react';
import { X, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CommentModal({ post, onClose, onAddComment }) {
    const [comment, setComment] = useState('');
    const { user } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        onAddComment(post._id, comment);
        setComment('');
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4 sm:p-0"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-md rounded-t-xl sm:rounded-xl shadow-2xl max-h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">Comments</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {post.comments && post.comments.length > 0 ? (
                        post.comments.map((c, index) => (
                            <div key={index} className="flex gap-3">
                                <img
                                    src={c.avatar || 'https://placehold.co/100x100/22C55E/FFFFFF?text=U'}
                                    alt={c.username}
                                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                />
                                <div className="bg-gray-50 p-3 rounded-2xl rounded-tl-none">
                                    <p className="text-xs font-bold text-gray-700 mb-1">
                                        {c.username}
                                    </p>
                                    <p className="text-sm text-gray-800">{c.text}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            <p>No comments yet. Be the first!</p>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <form
                    onSubmit={handleSubmit}
                    className="p-4 border-t border-gray-100 flex gap-2 items-center"
                >
                    <img
                        src={user?.avatar || 'https://placehold.co/100x100/22C55E/FFFFFF?text=U'}
                        alt="My Avatar"
                        className="w-8 h-8 rounded-full object-cover"
                    />
                    <input
                        type="text"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                        type="submit"
                        disabled={!comment.trim()}
                        className="text-green-500 disabled:text-gray-300 font-semibold p-2 hover:bg-green-50 rounded-full transition-colors"
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
}

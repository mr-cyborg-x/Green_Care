import { useState, useEffect } from 'react';
import { ImagePlus, Plus, Search, Bell } from 'lucide-react';
import { postsAPI } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import NewPostModal from '../components/NewPostModal';
import CommentModal from '../components/CommentModal';

export default function Feed() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [activePostForComments, setActivePostForComments] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await postsAPI.getAll();
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!searchQuery.trim()) {
                await fetchPosts();
            } else {
                const response = await postsAPI.search(searchQuery);
                setPosts(response.data);
            }
        } catch (error) {
            console.error('Error searching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (postId) => {
        try {
            const response = await postsAPI.like(postId);
            setPosts(posts.map(post =>
                post._id === postId ? response.data : post
            ));
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleSave = async (postId) => {
        try {
            const response = await postsAPI.save(postId);
            setPosts(posts.map(post =>
                post._id === postId ? response.data : post
            ));
        } catch (error) {
            console.error('Error saving post:', error);
        }
    };

    const handleAddPost = async (caption, imageUrl) => {
        try {
            const response = await postsAPI.create({ caption, image: imageUrl });
            setPosts([response.data, ...posts]);
            setShowModal(false);
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    const handleAddComment = async (postId, text) => {
        try {
            const response = await postsAPI.addComment(postId, text);
            setPosts(posts.map(post =>
                post._id === postId ? response.data : post
            ));
            setActivePostForComments(response.data);
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    if (loading && !posts.length) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-t-green-500 border-gray-200 rounded-full animate-spin mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading feed...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-30">
                <h1 className="text-2xl font-bold text-green-600">🌿 GreenCare</h1>
                <div className="flex items-center gap-3">
                    <button className="text-gray-600 hover:text-green-600 transition-colors relative">
                        <Bell size={26} />
                        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <button
                        onClick={() => setShowModal(true)}
                        className="text-green-500 hover:text-green-600"
                    >
                        <ImagePlus size={26} />
                    </button>
                </div>
            </header>

            {/* Search Bar */}
            <div className="fixed top-16 left-0 right-0 bg-white z-20 px-4 py-2 border-b border-gray-100">
                <form onSubmit={handleSearch} className="relative max-w-md mx-auto">
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </form>
            </div>

            {/* Feed Content */}
            <main className="pt-28 pb-4">
                <div className="max-w-md mx-auto space-y-4 p-4">
                    {posts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 mb-4">No posts found.</p>
                            <button
                                onClick={() => setShowModal(true)}
                                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold"
                            >
                                Create Post
                            </button>
                        </div>
                    ) : (
                        posts.map((post) => (
                            <PostCard
                                key={post._id}
                                post={post}
                                currentUserId={user?.id}
                                onLike={handleLike}
                                onSave={handleSave}
                                onComment={(post) => setActivePostForComments(post)}
                            />
                        ))
                    )}
                </div>
            </main>

            {/* Floating Action Button */}
            <button
                onClick={() => setShowModal(true)}
                className="fixed bottom-20 right-4 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all z-20"
            >
                <Plus size={28} strokeWidth={3} />
            </button>

            {/* Modal */}
            {showModal && (
                <NewPostModal
                    onClose={() => setShowModal(false)}
                    onAddPost={handleAddPost}
                />
            )}

            {/* Comment Modal */}
            {activePostForComments && (
                <CommentModal
                    post={activePostForComments}
                    onClose={() => setActivePostForComments(null)}
                    onAddComment={handleAddComment}
                />
            )}
        </div>
    );
}

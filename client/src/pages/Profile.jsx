import { useState, useEffect } from 'react';
import { Settings, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { postsAPI, remindersAPI, authAPI } from '../api/axios';
import PostCard from '../components/PostCard';
import ReminderCard from '../components/ReminderCard';
import EditProfileModal from '../components/EditProfileModal';

export default function Profile() {
    const [activeTab, setActiveTab] = useState('posts');
    const [userPosts, setUserPosts] = useState([]);
    const [savedPosts, setSavedPosts] = useState([]);
    const [userReminders, setUserReminders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserData();
    }, [user]);

    const fetchUserData = async () => {
        try {
            if (user) {
                const [postsRes, savedRes, remindersRes] = await Promise.all([
                    postsAPI.getUserPosts(user.username),
                    postsAPI.getSaved(),
                    remindersAPI.getAll(),
                ]);
                setUserPosts(postsRes.data);
                setSavedPosts(savedRes.data);
                setUserReminders(remindersRes.data);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleUpdateProfile = async (data) => {
        try {
            await authAPI.updateProfile(data);
            window.location.reload();
            setShowEditProfile(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handleSavePost = async (postId) => {
        try {
            const response = await postsAPI.save(postId);
            const updatedPost = response.data;
            const isSaved = updatedPost.savedBy.includes(user.id);

            // Update userPosts
            setUserPosts(prev => prev.map(p =>
                p._id === postId ? updatedPost : p
            ));

            // Update savedPosts
            if (isSaved) {
                // Add to saved list if not already there
                setSavedPosts(prev => {
                    if (prev.some(p => p._id === postId)) return prev;
                    return [updatedPost, ...prev];
                });
            } else {
                // Remove from saved list
                setSavedPosts(prev => prev.filter(p => p._id !== postId));
            }
        } catch (error) {
            console.error('Error updating saved post:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-t-green-500 border-gray-200 rounded-full animate-spin mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-30">
                <h1 className="text-xl font-semibold text-gray-800">👤 Profile</h1>
                <button onClick={handleLogout} className="text-red-500 hover:text-red-600">
                    <LogOut size={24} />
                </button>
            </header>

            <main className="pt-16 pb-4">
                <div className="max-w-md mx-auto p-4">
                    {/* User Info */}
                    <div className="flex flex-col items-center space-y-2 mb-6">
                        <img
                            src={user?.avatar || 'https://placehold.co/200x200/22C55E/FFFFFF?text=U'}
                            alt="User Avatar"
                            className="w-24 h-24 rounded-full object-cover border-4 border-green-500"
                        />
                        <h2 className="text-2xl font-semibold text-gray-800">
                            {user?.username || 'User'}
                        </h2>
                        <p className="text-gray-600">{user?.email}</p>
                        {user?.bio && <p className="text-gray-500 text-sm text-center px-4">{user.bio}</p>}
                    </div>

                    {/* Settings / Other Links */}
                    <div className="bg-white rounded-xl shadow-md mb-6">
                        <button
                            onClick={() => setShowEditProfile(true)}
                            className="flex justify-between items-center w-full p-4 hover:bg-gray-50 rounded-t-xl"
                        >
                            <div className="flex items-center">
                                <Settings size={22} className="text-gray-600" />
                                <span className="ml-3 text-gray-800 font-medium">Edit Profile</span>
                            </div>
                            <ChevronRight size={20} className="text-gray-400" />
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex justify-between items-center w-full p-4 text-red-500 hover:bg-red-50 rounded-b-xl"
                        >
                            <div className="flex items-center">
                                <LogOut size={22} />
                                <span className="ml-3 font-medium">Logout</span>
                            </div>
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-300 mb-4">
                        <button
                            onClick={() => setActiveTab('posts')}
                            className={`flex-1 pb-3 text-center font-semibold ${activeTab === 'posts'
                                ? 'border-b-2 border-green-500 text-green-500'
                                : 'text-gray-500'
                                }`}
                        >
                            My Posts
                        </button>
                        <button
                            onClick={() => setActiveTab('reminders')}
                            className={`flex-1 pb-3 text-center font-semibold ${activeTab === 'reminders'
                                ? 'border-b-2 border-green-500 text-green-500'
                                : 'text-gray-500'
                                }`}
                        >
                            My Reminders
                        </button>
                        <button
                            onClick={() => setActiveTab('saved')}
                            className={`flex-1 pb-3 text-center font-semibold ${activeTab === 'saved'
                                ? 'border-b-2 border-green-500 text-green-500'
                                : 'text-gray-500'
                                }`}
                        >
                            Saved
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div>
                        {activeTab === 'posts' && (
                            <div className="space-y-4">
                                {userPosts.length === 0 ? (
                                    <p className="text-center text-gray-500 mt-4">No posts yet.</p>
                                ) : (
                                    userPosts.map((post) => (
                                        <PostCard
                                            key={post._id}
                                            post={post}
                                            currentUserId={user?.id}
                                            onLike={() => { }}
                                            onSave={handleSavePost}
                                            onComment={() => { }}
                                        />
                                    ))
                                )}
                            </div>
                        )}
                        {activeTab === 'reminders' && (
                            <div className="space-y-3">
                                {userReminders.length === 0 ? (
                                    <p className="text-center text-gray-500 mt-4">
                                        No reminders set.
                                    </p>
                                ) : (
                                    userReminders.map((reminder) => (
                                        <ReminderCard
                                            key={reminder._id}
                                            reminder={reminder}
                                            onEdit={() => { }}
                                            onDelete={() => { }}
                                        />
                                    ))
                                )}
                            </div>
                        )}
                        {activeTab === 'saved' && (
                            <div className="space-y-4">
                                {savedPosts.length === 0 ? (
                                    <p className="text-center text-gray-500 mt-4">No saved posts yet.</p>
                                ) : (
                                    savedPosts.map((post) => (
                                        <PostCard
                                            key={post._id}
                                            post={post}
                                            currentUserId={user?.id}
                                            onLike={() => { }}
                                            onSave={handleSavePost}
                                            onComment={() => { }}
                                        />
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Edit Profile Modal */}
            {showEditProfile && (
                <EditProfileModal
                    onClose={() => setShowEditProfile(false)}
                    onSave={handleUpdateProfile}
                />
            )}
        </div>
    );
}

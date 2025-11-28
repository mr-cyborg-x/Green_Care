import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function EditProfileModal({ onClose, onSave }) {
    const { user } = useAuth();
    const [bio, setBio] = useState(user?.bio || '');
    const [mobile, setMobile] = useState(user?.mobile || '');
    const [avatar, setAvatar] = useState(user?.avatar || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ bio, mobile, avatar });
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative p-6">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    >
                        <X size={24} />
                    </button>

                    <h2 className="text-xl font-semibold text-gray-800 mb-6">
                        Edit Profile
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Avatar URL
                            </label>
                            <input
                                type="text"
                                value={avatar}
                                onChange={(e) => setAvatar(e.target.value)}
                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="https://example.com/avatar.jpg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bio
                            </label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                rows="3"
                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Tell us about your plant journey..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mobile Number
                            </label>
                            <input
                                type="tel"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="+1234567890"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg font-semibold transition-colors mt-4 flex items-center justify-center gap-2"
                        >
                            <Save size={20} />
                            Save Changes
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

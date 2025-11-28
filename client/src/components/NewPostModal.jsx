import { useState } from 'react';
import { Camera, X } from 'lucide-react';

export default function NewPostModal({ onClose, onAddPost }) {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
                setImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddPost(caption, image || 'https://placehold.co/600x600/22C55E/FFFFFF?text=New+Post');
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

                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Create New Post
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!imagePreview ? (
                            <label className="cursor-pointer">
                                <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-gray-300 rounded-xl text-center text-gray-500 hover:border-green-500 hover:text-green-500">
                                    <Camera size={36} />
                                    <span className="font-semibold mt-2">Upload Photo</span>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </label>
                        ) : (
                            <div className="relative">
                                <img
                                    src={imagePreview}
                                    alt="Upload preview"
                                    className="w-full h-auto rounded-lg object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImage(null);
                                        setImagePreview(null);
                                    }}
                                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="caption"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Caption
                            </label>
                            <textarea
                                id="caption"
                                rows="3"
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                placeholder="Write a caption..."
                                className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg font-semibold transition-colors"
                        >
                            Post
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

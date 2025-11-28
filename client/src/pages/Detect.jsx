import { useState } from 'react';
import { Camera, X } from 'lucide-react';
import { postsAPI, detectAPI } from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Detect() {
    const [image, setImage] = useState(null);
    const [fileName, setFileName] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                setImage(e.target.result);
                setFileName(file.name);
                setLoading(true);
                setResult(null);

                try {
                    const response = await detectAPI.detect(e.target.result);
                    setResult(response.data);
                } catch (error) {
                    console.error('Error detecting disease:', error);
                } finally {
                    setLoading(false);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const [saving, setSaving] = useState(false);
    const { user } = useAuth(); // Need user context if not already imported, checking imports...

    const handleRecheck = () => {
        setImage(null);
        setFileName('');
        setResult(null);
        setLoading(false);
    };

    const handleSaveToPlants = async () => {
        if (!result || !image) return;
        setSaving(true);
        try {
            // Create a caption from the result
            const caption = `Identified: ${result.name} (Confidence: ${result.confidence}%). Remedy: ${result.remedies.home}`;
            const response = await postsAPI.create({ caption, image });

            // Automatically save (bookmark) the new post so it appears in "Saved"
            await postsAPI.save(response.data._id);

            alert('Saved to your plants and bookmarked!');
        } catch (error) {
            console.error('Error saving to plants:', error);
            alert('Failed to save.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-center px-4 z-30">
                <span className="text-2xl mr-2">🧠</span>
                <h1 className="text-xl font-semibold text-gray-800">Disease Detector</h1>
            </header>

            <main className="pt-16 pb-4">
                <div className="max-w-md mx-auto p-4">
                    {!image && !loading && (
                        <label className="cursor-pointer">
                            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-xl text-center text-gray-500 hover:border-green-500 hover:text-green-500 transition-colors bg-white">
                                <Camera size={48} className="mb-4" />
                                <span className="font-semibold">Upload a photo of your leaf</span>
                                <span className="text-sm mt-2">Click here to select a file</span>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </label>
                    )}

                    {image && (
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            <img
                                src={image}
                                alt="Uploaded plant"
                                className="w-full h-auto rounded-lg mb-4"
                            />
                            <p className="text-sm text-gray-500 truncate mb-4">{fileName}</p>

                            {loading && (
                                <div className="flex flex-col items-center justify-center py-8">
                                    <div className="w-12 h-12 border-4 border-t-green-500 border-gray-200 rounded-full animate-spin"></div>
                                    <p className="text-gray-600 mt-4">Analyzing your plant...</p>
                                </div>
                            )}

                            {result && !loading && (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {result.name}
                                    </h2>
                                    <span
                                        className={`inline-block px-3 py-1 my-2 rounded-full text-sm font-semibold ${result.confidence > 90
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                            }`}
                                    >
                                        Confidence: {result.confidence}%
                                    </span>

                                    <div className="mt-4">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                            Suggested Remedies
                                        </h3>
                                        <div className="border rounded-lg p-4 mb-3">
                                            <h4 className="font-semibold text-green-700">
                                                Home Remedy
                                            </h4>
                                            <p className="text-gray-600">{result.remedies.home}</p>
                                        </div>
                                        <div className="border rounded-lg p-4 flex items-start">
                                            {result.chemicalImage && (
                                                <img
                                                    src={result.chemicalImage}
                                                    alt="Chemical"
                                                    className="w-16 h-16 rounded-lg object-cover mr-4"
                                                />
                                            )}
                                            <div>
                                                <h4 className="font-semibold text-red-700">
                                                    Chemical Cure
                                                </h4>
                                                <p className="text-gray-600">
                                                    {result.remedies.chemical}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex space-x-3 mt-6">
                                        <button
                                            onClick={handleRecheck}
                                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 p-3 rounded-lg font-semibold transition-colors"
                                        >
                                            Recheck
                                        </button>
                                        <button
                                            onClick={handleSaveToPlants}
                                            disabled={saving}
                                            className="flex-1 bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
                                        >
                                            {saving ? 'Saving...' : 'Save to My Plants'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

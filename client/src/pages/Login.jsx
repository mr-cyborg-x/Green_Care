import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('admin123@gmail.com');
    const [password, setPassword] = useState('admin123');
    const [mobile, setMobile] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email.trim() && !mobile.trim()) {
            setError('Please enter email or mobile number');
            return;
        }

        if (!password.trim()) {
            setError('Please enter password');
            return;
        }

        if (!isLogin && !username.trim()) {
            setError('Please enter username for signup');
            return;
        }

        setLoading(true);
        const type = isLogin ? 'login' : 'signup';
        const result = await login({ email, mobile, password, username, type });
        setLoading(false);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4 relative overflow-hidden">
            {/* Background decoration */}
            <span
                className="absolute -top-20 -left-20 text-green-200/50 select-none"
                style={{ fontSize: '20rem', zIndex: 0 }}
            >
                🌿
            </span>
            <span
                className="absolute -bottom-20 -right-10 text-green-200/30 select-none"
                style={{ fontSize: '15rem', zIndex: 0, transform: 'rotate(15deg)' }}
            >
                🍃
            </span>

            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm z-10">
                <h1 className="text-4xl font-bold text-green-600 mb-2 text-center">
                    🌿 GreenCare
                </h1>
                <p className="text-gray-600 text-center mb-8">Your plant companion</p>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <div className="flex justify-center mb-6 bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => { setIsLogin(true); setError(''); }}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${isLogin ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => { setIsLogin(false); setError(''); }}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${!isLogin ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Sign Up
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="PlantLover123"
                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                            />
                        </div>
                    )}

                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                        />
                    </div>

                    {!isLogin && (
                        <div>
                            <label
                                htmlFor="mobile"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Mobile Number (Optional)
                            </label>
                            <input
                                type="tel"
                                id="mobile"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                placeholder="(123) 456-7890"
                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white p-3 rounded-lg font-semibold text-lg transition-all shadow-md hover:shadow-lg mt-6"
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
                    </button>
                </form>

                <p className="text-sm text-gray-500 text-center mt-6">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => { setIsLogin(!isLogin); setError(''); }}
                        className="text-green-600 font-semibold hover:underline"
                    >
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
}

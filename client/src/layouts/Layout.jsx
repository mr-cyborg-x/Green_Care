import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Droplets, ScanLine, User } from 'lucide-react';

export default function Layout() {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <main className="flex-1 pb-16">
                <Outlet />
            </main>

            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-50">
                <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-primary' : 'text-gray-500'}`}>
                    <Home size={24} />
                    <span className="text-xs">Feed</span>
                </Link>
                <Link to="/daily-care" className={`flex flex-col items-center gap-1 ${isActive('/daily-care') ? 'text-primary' : 'text-gray-500'}`}>
                    <Droplets size={24} />
                    <span className="text-xs">Daily Care</span>
                </Link>
                <Link to="/detect" className={`flex flex-col items-center gap-1 ${isActive('/detect') ? 'text-primary' : 'text-gray-500'}`}>
                    <ScanLine size={24} />
                    <span className="text-xs">Detect</span>
                </Link>
                <Link to="/profile" className={`flex flex-col items-center gap-1 ${isActive('/profile') ? 'text-primary' : 'text-gray-500'}`}>
                    <User size={24} />
                    <span className="text-xs">Profile</span>
                </Link>
            </nav>
        </div>
    );
}

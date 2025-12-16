import { Link, useLocation } from 'react-router-dom';
import { Calendar, Trophy, GitBranch, Target, Settings, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const { currentUser, isAdmin, logout } = useAuth();

  const navItems = [
    { path: '/', label: 'Schedule', icon: Calendar },
    { path: '/results', label: 'Live Results', icon: Trophy },
    { path: '/standings', label: 'Standings', icon: GitBranch },
    { path: '/knockout', label: 'Knockout', icon: Target },
    { path: '/admin', label: 'Admin', icon: Settings },
  ];

  // Filter navigation items - only show Admin link for authenticated admins
  const visibleNavItems = navItems.filter(item =>
    item.path !== '/admin' || isAdmin
  );

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white shadow-2xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Logo Placeholder */}
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                <img
                  src="/pkkm-logo.png"
                  alt="Pkkm Logo"
                  className="w-14 h-14 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-14 h-14 hidden items-center justify-center text-purple-600 font-bold text-xl">
                  Pkkm
                </div>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Pkkm Youth Sports Carnival 2.0
                </h1>
                <p className="text-sm md:text-base text-purple-100 mt-1">
                  Persatuan Kebajikan Kongu Malaysia
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {currentUser && isAdmin ? (
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:flex items-center space-x-2 bg-white bg-opacity-20 px-3 py-2 rounded-lg">
                    <User size={16} className="text-white" />
                    <span className="text-sm text-white font-medium">{currentUser.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded-lg transition-all"
                    title="Logout"
                  >
                    <LogOut size={16} className="text-white" />
                    <span className="hidden sm:inline text-sm text-white font-medium">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <div className="live-badge">
                    <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                    LIVE
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="bg-black bg-opacity-20 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="flex space-x-1 overflow-x-auto">
              {visibleNavItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-all duration-300 border-b-4 ${
                    isActive(path)
                      ? 'bg-white bg-opacity-20 border-white text-white'
                      : 'border-transparent text-purple-100 hover:bg-white hover:bg-opacity-10 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            &copy; 2025 Persatuan Kebajikan Kongu Malaysia (Pkkm). All rights reserved.
          </p>
          <div className="mt-3">
            <p className="text-xs text-gray-400">Built by</p>
            <a
              href="https://yukti-ai.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hover:from-purple-300 hover:to-pink-300 transition-all"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Yukti AI Solutions
            </a>
            <p className="text-xs text-gray-400 mt-1">
              <a
                href="mailto:contact@yukti-ai.com"
                className="text-purple-400 hover:text-purple-300 underline"
              >
                contact@yukti-ai.com
              </a>
            </p>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Live Event Management System
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

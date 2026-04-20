import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Bell, User, LogOut, ChevronDown, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { logout } from '../../services/authService';

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropOpen, setDropOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const initials = user?.displayName
    ? user.displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? 'T';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/dashboard" className="navbar-logo">
          <div className="logo-icon">
            <BookOpen size={18} />
          </div>
          <span>DailyJournal</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="nav-links">
          <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>Dashboard</Link>
          <Link to="/create-entry" className={`nav-link ${isActive('/create-entry') ? 'active' : ''}`}>New Entry</Link>
        </div>

        {/* Right Side */}
        <div className="navbar-right">
          {/* User dropdown */}
          <div className="user-dropdown" ref={dropRef}>
            <button className="user-avatar-btn" onClick={() => setDropOpen(p => !p)}>
              {user?.photoURL ? (
                <img src={user.photoURL} alt="avatar" className="avatar-img" />
              ) : (
                <div className="avatar-initials">{initials}</div>
              )}
              <ChevronDown size={14} className={`chevron ${dropOpen ? 'open' : ''}`} />
            </button>

            {dropOpen && (
              <div className="dropdown-menu animate-slide-up">
                <div className="dropdown-header">
                  <p className="dropdown-name">{user?.displayName || 'Student'}</p>
                  <p className="dropdown-email">{user?.email}</p>
                </div>
                <div className="dropdown-divider" />
                <Link to="/profile" className="dropdown-item" onClick={() => setDropOpen(false)}>
                  <User size={15} /> Profile
                </Link>
                <button className="dropdown-item danger" onClick={handleLogout}>
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="mobile-menu-btn" onClick={() => setMobileOpen(p => !p)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="mobile-nav animate-slide-down">
          <Link to="/dashboard" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Dashboard</Link>
          <Link to="/create-entry" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>New Entry</Link>
          <Link to="/profile" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Profile</Link>
          <button type="button" className="mobile-nav-link danger" onClick={handleLogout}>Sign Out</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

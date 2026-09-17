import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { clearSession, getSessionUser } from '../api';

export default function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfirm, setShowConfirm] = useState(false);
  const [user, setUser] = useState(getSessionUser());

  // Public pages — no header shown
  const publicPages = ['/', '/login', '/register'];
  const isPublic = publicPages.includes(location.pathname);

  // Re-check session on every route change
  useEffect(() => {
    setUser(getSessionUser());
  }, [location.pathname]);

  // Redirect to login if not authenticated on protected pages
  useEffect(() => {
    if (!isPublic && !user) {
      navigate('/login');
    }
  }, [isPublic, user, navigate]);

  if (isPublic) return null;

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  return (
    <>
      <header className="app-header">
        <Link to="/onboarding" className="app-header-brand">
          Skill<span>Bridge</span>
        </Link>

        <div className="app-header-right">
          {user && (
            <span className="app-header-user">
              👤 {user.name || user.email}
            </span>
          )}
          <button
            className="app-logout-btn"
            onClick={() => setShowConfirm(true)}
          >
            Logout
          </button>
        </div>
      </header>

      {showConfirm && (
        <div className="logout-overlay" onClick={() => setShowConfirm(false)}>
          <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Logout?</h2>
            <p>Are you sure you want to logout?</p>
            <div className="logout-actions">
              <button
                className="logout-cancel"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="logout-confirm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

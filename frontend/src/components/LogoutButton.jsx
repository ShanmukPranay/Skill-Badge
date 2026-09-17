import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearSession } from '../api';

export default function LogoutButton() {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  return (
    <>
      <button
        className="logout-btn"
        onClick={() => setShowConfirm(true)}
        title="Logout"
      >
        Logout
      </button>

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

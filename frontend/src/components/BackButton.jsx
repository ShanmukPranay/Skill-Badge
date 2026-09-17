import { useNavigate } from 'react-router-dom';

export default function BackButton({ to, label = '← Back' }) {
  const nav = useNavigate();

  const handleClick = () => {
    if (to) {
      nav(to);
    } else {
      nav(-1);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{
        minWidth: 140,
        padding: '16px 32px',
        fontSize: 16,
        fontWeight: 600,
        borderRadius: 10,
        background: '#fff',
        color: '#4f46e5',
        border: '1.5px solid #4f46e5',
        cursor: 'pointer',
        transition: 'all 0.15s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#eef2ff';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#fff';
      }}
    >
      {label}
    </button>
  );
}

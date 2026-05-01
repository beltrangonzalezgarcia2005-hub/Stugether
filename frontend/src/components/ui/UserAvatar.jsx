import { Link } from 'react-router-dom';

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function UserAvatar({ src, name, size = 40, userId, style: extraStyle }) {
  const avatar = (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: src ? 'transparent' : 'linear-gradient(135deg, #60A5FA, #2563EB)',
        fontSize: size * 0.38,
        fontWeight: 600,
        color: '#fff',
        userSelect: 'none',
        ...extraStyle,
      }}
    >
      {src ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );

  if (userId) {
    return (
      <Link
        to={`/perfil/${userId}`}
        style={{ display: 'inline-flex', textDecoration: 'none', flexShrink: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {avatar}
      </Link>
    );
  }

  return avatar;
}

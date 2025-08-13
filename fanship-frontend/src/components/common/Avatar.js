import React, { useState } from 'react';

/**
 * Reusable circular Avatar component.
 * Props:
 *  - url?: string (image source)
 *  - nickname?: string (used for alt text & initial fallback)
 *  - size?: number (pixels, default 52)
 *  - className?: string (extra class names)
 *  - style?: React.CSSProperties (extra inline styles)
 *  - clickable?: boolean (adds role=button, tabIndex=0, pointer cursor)
 *  - onClick?: () => void (click handler if clickable)
 *  - border?: boolean (show border, default true)
 */
export default function Avatar({
  url,
  nickname = '',
  size = 52,
  className = '',
  style = {},
  clickable = false,
  onClick,
  border = true,
}) {
  const [imgError, setImgError] = useState(false);
  const initial = (nickname || '?').trim().charAt(0).toUpperCase();
  const baseStyle = {
    width: size,
    height: size,
    borderRadius: '50%',
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: border ? '1px solid #e2e2e2' : 'none',
    cursor: clickable ? 'pointer' : 'default',
    ...style,
  };

  const handleKeyDown = (e) => {
    if (!clickable) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick && onClick();
    }
  };

  return (
    <div
      className={className}
      style={baseStyle}
      onClick={clickable ? onClick : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={handleKeyDown}
      aria-label={nickname ? `${nickname} 프로필` : '프로필 이미지'}
    >
      {url && !imgError ? (
        <img
          src={url}
          alt={nickname ? `${nickname} 프로필 이미지` : '프로필 이미지'}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={() => setImgError(true)}
          loading="lazy"
        />
      ) : (
        <span style={{ fontSize: size * 0.38, fontWeight: 600, color: '#777' }}>{initial}</span>
      )}
    </div>
  );
}

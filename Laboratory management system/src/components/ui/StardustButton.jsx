import React from 'react';

export const StardustButton = ({ 
  children = "Launching Soon", 
  onClick, 
  className = "",
  variant = "default",
  size = "default",
  disabled = false,
  ...props 
}) => {
  const sizeStyles = {
    sm: { fontSize: '18px', padding: '20px 32px' },
    default: { fontSize: '25px', padding: '32px 45px' },
    lg: { fontSize: '30px', padding: '40px 55px' },
  };

  const variantStyles = {
    default: {
      '--white': '#e6f3ff',
      '--bg': '#0a1929',
      '--text-color': 'rgba(129, 216, 255, 0.9)',
      '--glow-color': 'rgba(64, 180, 255, 0.15)',
      '--glow-hover': 'rgba(64, 180, 255, 0.6)',
    },
    primary: {
      '--white': '#e6f3ff',
      '--bg': '#3b82f6',
      '--text-color': 'rgba(255, 255, 255, 0.95)',
      '--glow-color': 'rgba(59, 130, 246, 0.3)',
      '--glow-hover': 'rgba(59, 130, 246, 0.7)',
    },
    success: {
      '--white': '#e6f3ff',
      '--bg': '#10b981',
      '--text-color': 'rgba(255, 255, 255, 0.95)',
      '--glow-color': 'rgba(16, 185, 129, 0.3)',
      '--glow-hover': 'rgba(16, 185, 129, 0.7)',
    },
    danger: {
      '--white': '#e6f3ff',
      '--bg': '#ef4444',
      '--text-color': 'rgba(255, 255, 255, 0.95)',
      '--glow-color': 'rgba(239, 68, 68, 0.3)',
      '--glow-hover': 'rgba(239, 68, 68, 0.7)',
    },
    secondary: {
      '--white': '#e6f3ff',
      '--bg': '#6b7280',
      '--text-color': 'rgba(255, 255, 255, 0.95)',
      '--glow-color': 'rgba(107, 114, 128, 0.3)',
      '--glow-hover': 'rgba(107, 114, 128, 0.7)',
    },
  };

  const currentSize = sizeStyles[size] || sizeStyles.default;
  const currentVariant = variantStyles[variant] || variantStyles.default;

  const buttonStyle = {
    ...currentVariant,
    '--radius': '100px',
    outline: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: 0,
    position: 'relative',
    borderRadius: 'var(--radius)',
    backgroundColor: 'var(--bg)',
    transition: 'all 0.2s ease',
    opacity: disabled ? 0.6 : 1,
    boxShadow: `
      inset 0 0.3rem 0.9rem rgba(255, 255, 255, 0.3),
      inset 0 -0.1rem 0.3rem rgba(0, 0, 0, 0.7),
      inset 0 -0.4rem 0.9rem rgba(255, 255, 255, 0.5),
      0 3rem 3rem rgba(0, 0, 0, 0.3),
      0 1rem 1rem -0.6rem rgba(0, 0, 0, 0.8)
    `,
  };

  const wrapStyle = {
    fontSize: currentSize.fontSize,
    fontWeight: 500,
    color: 'var(--text-color)',
    padding: currentSize.padding,
    borderRadius: 'inherit',
    position: 'relative',
    overflow: 'hidden',
  };

  const pStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: 0,
    transition: 'all 0.2s ease',
    transform: 'translateY(2%)',
    maskImage: 'linear-gradient(to bottom, var(--text-color) 40%, transparent)',
  };

  const beforeAfterStyles = `
    .stardust-button .wrap::before,
    .stardust-button .wrap::after {
      content: "";
      position: absolute;
      transition: all 0.3s ease;
    }
    
    .stardust-button .wrap::before {
      left: -15%;
      right: -15%;
      bottom: 25%;
      top: -100%;
      border-radius: 50%;
      background-color: var(--glow-color);
    }
    
    .stardust-button .wrap::after {
      left: 6%;
      right: 6%;
      top: 12%;
      bottom: 40%;
      border-radius: 22px 22px 0 0;
      box-shadow: inset 0 10px 8px -10px var(--text-color);
      background: linear-gradient(
        180deg,
        var(--glow-color) 0%,
        rgba(0, 0, 0, 0) 50%,
        rgba(0, 0, 0, 0) 100%
      );
    }
    
    
    .stardust-button:not(:disabled):hover {
      box-shadow:
        inset 0 0.3rem 0.5rem var(--text-color),
        inset 0 -0.1rem 0.3rem rgba(0, 0, 0, 0.7),
        inset 0 -0.4rem 0.9rem var(--glow-hover),
        0 3rem 3rem rgba(0, 0, 0, 0.3),
        0 1rem 1rem -0.6rem rgba(0, 0, 0, 0.8);
    }
    
    .stardust-button:not(:disabled):hover .wrap::before {
      transform: translateY(-5%);
    }
    
    .stardust-button:not(:disabled):hover .wrap::after {
      opacity: 0.4;
      transform: translateY(5%);
    }
    
    .stardust-button:not(:disabled):hover .wrap p {
      transform: translateY(-4%);
    }
    
    .stardust-button:not(:disabled):active {
      transform: translateY(4px);
      box-shadow:
        inset 0 0.3rem 0.5rem var(--text-color),
        inset 0 -0.1rem 0.3rem rgba(0, 0, 0, 0.8),
        inset 0 -0.4rem 0.9rem var(--glow-hover),
        0 3rem 3rem rgba(0, 0, 0, 0.3),
        0 1rem 1rem -0.6rem rgba(0, 0, 0, 0.8);
    }
    
    .stardust-button:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  `;

  return (
    <>
      <style>{beforeAfterStyles}</style>
      <button
        className={`stardust-button ${className}`}
        style={buttonStyle}
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        {...props}
      >
        <div className="wrap" style={wrapStyle}>
          <p style={pStyle}>
            {children}
          </p>
        </div>
      </button>
    </>
  );
};

export default StardustButton;


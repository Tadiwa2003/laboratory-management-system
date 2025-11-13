import React from 'react';
import { StardustButton } from './StardustButton';

export const StardustIconButton = ({ 
  children, 
  onClick, 
  className = "",
  variant = "default",
  disabled = false,
  ...props 
}) => {
  return (
    <StardustButton
      variant={variant}
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={`!p-2 !px-3 ${className}`}
      {...props}
    >
      {children}
    </StardustButton>
  );
};

export default StardustIconButton;


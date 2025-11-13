import React, { useState, useRef, useEffect } from 'react';
import { Check } from 'lucide-react';

const TimePeriodDropdown = ({ 
  options = [], 
  value, 
  onChange, 
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-between min-w-[160px]"
        aria-label="Select time period"
      >
        <span className="text-sm font-medium">{selectedOption?.label || 'Select'}</span>
        <svg
          className={`w-4 h-4 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors duration-150 ${
                  isSelected
                    ? 'bg-red-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {isSelected && (
                  <Check className="w-4 h-4 flex-shrink-0" />
                )}
                <span className="flex-1 text-left">{option.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TimePeriodDropdown;


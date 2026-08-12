import React from 'react';

const paths = {
  high: (
    <path
      d="M4 14 L8 8 L11 11 L16 4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="square"
    />
  ),
  medium: (
    <>
      <line x1="4" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="1.25" />
      <line x1="4" y1="8" x2="12" y2="8" stroke="currentColor" strokeWidth="1.25" />
    </>
  ),
  reach: (
    <>
      <circle cx="10" cy="10" r="2" fill="currentColor" />
      <circle cx="4" cy="6" r="1.5" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="16" cy="6" r="1.5" fill="none" stroke="currentColor" strokeWidth="1" />
      <line x1="6" y1="7" x2="8.5" y2="9" stroke="currentColor" strokeWidth="1" />
      <line x1="14" y1="7" x2="11.5" y2="9" stroke="currentColor" strokeWidth="1" />
    </>
  ),
  paths: (
    <>
      <circle cx="4" cy="10" r="1.5" fill="currentColor" />
      <circle cx="10" cy="6" r="1.5" fill="currentColor" />
      <circle cx="16" cy="10" r="1.5" fill="currentColor" />
      <polyline points="5.5,9 8.5,7 14.5,9" fill="none" stroke="currentColor" strokeWidth="1" />
    </>
  ),
};

export const StatMark = ({ variant, className = '' }) => (
  <svg
    viewBox="0 0 20 16"
    width="20"
    height="16"
    className={`text-neutral-600 ${className}`}
    aria-hidden
  >
    {paths[variant]}
  </svg>
);

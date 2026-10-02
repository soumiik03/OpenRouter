import React from "react";

interface SetuLogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export function SetuLogo({
  size = 20,
  className = "",
  ...props
}: SetuLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 text-white ${className}`}
      aria-label="Setu Logo"
      {...props}
    >
      <path d="M3 3H16V7H7V14H3V3Z" />
      <rect x="10" y="10" width="4" height="4" />
      <path d="M21 21H8V17H17V10H21V21Z" />
    </svg>
  );
}

export default SetuLogo;
